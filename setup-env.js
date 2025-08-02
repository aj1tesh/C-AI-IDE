#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔧 Setting up C++ AI IDE environment...\n')

const backendEnvPath = path.join(__dirname, 'backend', '.env')
const exampleEnvPath = path.join(__dirname, 'backend', 'env.example')

// Check if .env already exists
if (fs.existsSync(backendEnvPath)) {
  console.log('✅ .env file already exists in backend/ directory')
  console.log('📝 Please edit backend/.env and add your Gemini API key')
} else {
  // Copy example file
  if (fs.existsSync(exampleEnvPath)) {
    fs.copyFileSync(exampleEnvPath, backendEnvPath)
    console.log('✅ Created backend/.env from template')
    console.log('📝 Please edit backend/.env and add your Gemini API key')
  } else {
    console.log('❌ env.example file not found')
    console.log('📝 Please create backend/.env manually with your API key')
  }
}

console.log('\n🔑 To get your Gemini API key:')
console.log('   1. Go to https://makersuite.google.com/app/apikey')
console.log('   2. Create a new API key')
console.log('   3. Add it to backend/.env as: GEMINI_API_KEY=your_key_here')
console.log('\n🚀 Then run: npm run dev') 