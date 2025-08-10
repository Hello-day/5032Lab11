<template>
  <div>
    <LibraryRegistrationForm />
    <!-- <JSONLab /> -->
  </div>
</template>

<script>
import JSONLab from '@/components/JSONLab.vue'
import LibraryRegistrationForm from '@/components/LibraryRegistrationForm.vue'

export default {
  name: 'Home',
  components: {
    JSONLab,
    LibraryRegistrationForm
  }
}
</script>