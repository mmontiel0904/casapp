<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import LoginForm from './components/LoginForm.vue'
</script>

<template>
  <div class="app">
    <HelloWorld msg="Welcome to CasApp" />
    <LoginForm />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem;
}
</style>
