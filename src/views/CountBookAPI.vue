<template>
  <div class="container mt-4">
    <h2>📚 Book Counter System - Alibaba Cloud Function Compute</h2>
    <p class="text-muted">Count books in JSON data using Alibaba Cloud Function Compute Service</p>
    
    <!-- 选择数据源 -->
    <div class="mb-4">
      <div class="btn-group" role="group">
        <button 
          type="button" 
          class="btn btn-outline-primary"
          :class="{ active: dataSource === 'local' }"
          @click="setDataSource('local')"
        >
          Local JSON Data
        </button>
        <button 
          type="button" 
          class="btn btn-outline-success"
          :class="{ active: dataSource === 'cloud' }"
          @click="setDataSource('cloud')"
        >
          Alibaba Cloud Function
        </button>
      </div>
    </div>

    <!-- 云函数URL配置 -->
    <div v-if="dataSource === 'cloud'" class="mb-4">
      <div class="card border-success">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">✅ Alibaba Cloud Function Configuration</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="cloudFunctionUrl" class="form-label">Cloud Function URL:</label>
            <div class="input-group">
              <input 
                type="url" 
                class="form-control" 
                id="cloudFunctionUrl"
                v-model="cloudFunctionUrl"
                readonly
              >
              <button class="btn btn-outline-secondary" type="button" @click="testApiConnection">
                Test Connection
              </button>
            </div>
            <div class="form-text text-success">
              ✅ Configured Alibaba Cloud Function API: {{ cloudFunctionUrl }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-4">
      <button 
        class="btn btn-primary me-2" 
        @click="fetchBookCount"
        :disabled="loading || (dataSource === 'cloud' && !cloudFunctionUrl)"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ loading ? 'Counting...' : 'Start Book Count' }}
      </button>
      
      <button 
        class="btn btn-secondary" 
        @click="clearResults"
        :disabled="loading"
      >
        Clear Results
      </button>
    </div>
    
    <div v-if="error" class="alert alert-danger" role="alert">
      <strong>Error:</strong> {{ error }}
    </div>
    
    <!-- 结果展示 -->
    <div v-if="apiResponse" class="row">
      <!-- 统计卡片 -->
      <div class="col-md-4 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title text-primary">Total Authors</h5>
            <h2 class="card-text">{{ apiResponse.data.authorsCount }}</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title text-success">Total Books</h5>
            <h2 class="card-text">{{ apiResponse.data.totalBooks }}</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title text-info">Data Source</h5>
            <p class="card-text">
              <span v-if="dataSource === 'cloud'" class="badge bg-success fs-6">
                ☁️ {{ apiResponse.cloudProvider || 'Alibaba Cloud Function' }}
              </span>
              <span v-else class="badge bg-primary fs-6">
                📁 Local File
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>


    <div v-if="apiResponse" class="api-response mt-4">
      <div class="card">
        <div class="card-header">
          <h5>Detailed Statistics Results</h5>
        </div>
        <div class="card-body">
          <pre class="bg-light p-3 rounded">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)
const dataSource = ref('cloud') // 'local' 或 'cloud'
const cloudFunctionUrl = ref('https://count-books-fyicadwjpo.cn-hongkong.fcapp.run')

const authorsCount = ref(0)
const totalBooks = ref(0)

// Set data source
const setDataSource = (source) => {
  dataSource.value = source
  clearResults()
}

// Clear results
const clearResults = () => {
  apiResponse.value = null
  error.value = null
  authors.value = []
}

// Local data statistics
const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

// Get local JSON data
const getLocalData = async () => {
  try {
    const response = await fetch('/src/assets/json/authors.json')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    authors.value = data
    
    calculateStats()
    
    return {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map(author => ({
          name: author.name,
          bookCount: author.famousWorks.length,
          books: author.famousWorks.map(work => work.title)
        })),
        message: "Local JSON data statistics completed"
      },
      timestamp: new Date().toISOString(),
      dataSource: "Local File"
    }
    
  } catch (err) {
    throw new Error(`Failed to load local data: ${err.message}`)
  }
}

// Test API connection
const testApiConnection = async () => {
  if (!cloudFunctionUrl.value) {
    error.value = 'Please enter cloud function URL'
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(cloudFunctionUrl.value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        alert(`✅ API connection successful!\nCloud Provider: ${data.cloudProvider}\nResponse Time: ${new Date().toLocaleTimeString()}`)
      }
    } else {
      throw new Error(`Connection failed: ${response.status}`)
    }
    
  } catch (err) {
    error.value = `API connection test failed: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Call cloud function
const getCloudData = async () => {
  if (!cloudFunctionUrl.value) {
    throw new Error('Please enter cloud function URL')
  }

  try {
    const response = await fetch(cloudFunctionUrl.value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new Error(`Cloud function call failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Cloud function returned error')
    }
    
    return data
    
  } catch (err) {
    throw new Error(`Cloud function call failed: ${err.message}`)
  }
}

// Unified data fetching method
const fetchBookCount = async () => {
  loading.value = true
  error.value = null
  apiResponse.value = null
  
  try {
    let result
    
    if (dataSource.value === 'local') {
      result = await getLocalData()
    } else {
      result = await getCloudData()
    }
    
    apiResponse.value = result
    
  } catch (err) {
    error.value = err.message
    console.error('Data fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Component mounted - load local data by default
onMounted(() => {
  // Don't auto-load, let user click manually
})

defineExpose({
  fetchBookCount,
  setDataSource,
  clearResults,
  testApiConnection
})
</script>

<style scoped>
.api-response {
  margin-top: 20px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.4;
}
</style> 