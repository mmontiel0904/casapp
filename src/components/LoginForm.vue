<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          id="email"
          v-model="loginForm.email" 
          type="email" 
          required 
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          id="password"
          v-model="loginForm.password" 
          type="password" 
          required 
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    
    <div v-if="error" class="error">
      {{ error.message }}
    </div>
    
    <div v-if="loginResult" class="success">
      Login successful! Welcome {{ loginResult.login.user.firstName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLoginMutation } from '../generated/graphql'

const loginForm = reactive({
  email: '',
  password: ''
})

const { mutate: login, loading, error } = useLoginMutation()
const loginResult = ref<any>(null)

const handleLogin = async () => {
  try {
    const result = await login({
      email: loginForm.email,
      password: loginForm.password
    })
    loginResult.value = result?.data
  } catch (err) {
    console.error('Login failed:', err)
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.success {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}
</style>