#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up C++ AI IDE...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js v16 or higher.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm version: ${npmVersion.trim()}`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm.');
  process.exit(1);
}

// Check if g++ is installed
try {
  const gppVersion = execSync('g++ --version', { encoding: 'utf8' });
  console.log(`✅ g++ compiler found`);
} catch (error) {
  console.warn('⚠️  g++ compiler not found. Please install g++ to compile C++ code.');
  console.log('   Windows: Install MinGW-w64 or use WSL');
  console.log('   macOS: brew install gcc or xcode-select --install');
  console.log('   Linux: sudo apt install build-essential');
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Create .env file for backend
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating backend environment file...');
  fs.writeFileSync(envPath, 'PORT=3001\nNODE_ENV=development\n');
  console.log('✅ Environment file created');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\nTo start the application:');
console.log('1. Start the backend: cd backend && npm run dev');
console.log('2. Start the frontend: npm run dev');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\nHappy coding! 🚀'); 