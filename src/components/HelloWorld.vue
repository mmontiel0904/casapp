<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <div class="welcome">
    <h1>{{ msg }}</h1>
    <p>CasApp - Your Vue GraphQL Application</p>
  </div>
</template>

<style scoped>
.welcome {
  text-align: center;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  color: #7f8c8d;
  font-size: 1.1rem;
}
</style>
