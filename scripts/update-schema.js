#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Build schema URL with fallback
const API_BASE = process.env.VITE_API_BASE_URL || 'https://freshapi-development.up.railway.app'
const SCHEMA_ENDPOINT = process.env.VITE_SCHEMA_SDL_ENDPOINT || '/schema.graphql'
const SCHEMA_URL = API_BASE + SCHEMA_ENDPOINT

const LOCAL_SCHEMA_PATH = './src/generated/schema.graphql'

async function fetchSchema() {
  try {
    console.log('🔄 Fetching latest schema from:', SCHEMA_URL)
    
    const response = await fetch(SCHEMA_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const newSchema = await response.text()
    
    // Check if schema has changed
    let hasChanged = true
    if (fs.existsSync(LOCAL_SCHEMA_PATH)) {
      const currentSchema = fs.readFileSync(LOCAL_SCHEMA_PATH, 'utf8')
      hasChanged = currentSchema !== newSchema
    }
    
    if (hasChanged) {
      console.log('✅ Schema changes detected, regenerating types...')
      
      // Regenerate types
      execSync('yarn generate-types', { stdio: 'inherit' })
      
      console.log('🎉 Schema and types updated successfully!')
    } else {
      console.log('✨ Schema is up to date, no changes needed.')
    }
    
  } catch (error) {
    console.error('❌ Failed to update schema:', error.message)
    process.exit(1)
  }
}

fetchSchema()