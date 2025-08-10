<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Sign In</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="signin">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email" 
                  placeholder="Email"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password" 
                  placeholder="Password"
                  required
                >
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Sign In to Firebase</button>
              </div>
            </form>
            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>
            <div v-if="success" class="alert alert-success mt-3">
              {{ success }}
            </div>
            <div v-if="currentUser" class="alert alert-info mt-3">
              <strong>Current User:</strong> {{ currentUser.email }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const error = ref("")
const success = ref("")
const currentUser = ref(null)

const router = useRouter()
const auth = getAuth()

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Firebase Login Successful!")
      success.value = "Login successful!"
      currentUser.value = auth.currentUser
      console.log(auth.currentUser)
      router.push("/")
    })
    .catch((error) => {
      console.log(error.code)
      error.value = "Login failed: " + error.code
    })
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>