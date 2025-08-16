<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="w-full max-w-md">
      <!-- App Branding -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl shadow-lg mb-4">
          <svg width="32" height="32" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <!-- Gradient definitions -->
            <defs>
              <linearGradient id="bgGradientLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="heartGradientLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
              </linearGradient>
            </defs>
            
            <!-- Background circle -->
            <circle cx="60" cy="60" r="52" fill="url(#bgGradientLogin)"/>
            
            <!-- Minimalist family representation using simple circles -->
            <!-- Parent figures (larger circles) -->
            <circle cx="44" cy="54" r="8" fill="white" opacity="0.95"/>
            <circle cx="76" cy="54" r="8" fill="white" opacity="0.95"/>
            
            <!-- Children figures (smaller circles) -->
            <circle cx="52" cy="71" r="5.5" fill="#FFE066" opacity="0.9"/>
            <circle cx="68" cy="71" r="5.5" fill="#66D9EF" opacity="0.9"/>
            
            <!-- Elegant heart with soft gradient -->
            <path d="M60 41 C56 37, 50 37, 50 43 C50 37, 44 37, 44 43 C44 49, 55 60, 60 64 C65 60, 76 49, 76 43 C76 37, 70 37, 70 43 C70 37, 64 37, 60 41 Z" 
                  fill="url(#heartGradientLogin)" 
                  opacity="0.8"/>
          </svg>
        </div>
        <h1 class="text-4xl font-serif font-bold text-base-content mb-2">
          CasApp
        </h1>
        <p class="text-base-content/60 text-sm">
          Family Care Management System
        </p>
      </div>

      <!-- Login Form Component -->
      <LoginForm />
      
      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-base-content/50 text-xs">
          © 2025 CasApp. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/forms/LoginForm.vue'
</script>