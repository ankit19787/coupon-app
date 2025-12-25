#!/usr/bin/env node

/**
 * Script to set environment variables to Vercel
 * 
 * Usage:
 *   node scripts/set-vercel-env.js
 * 
 * This script reads environment variables from .env file and sets them to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to .env file
const envPath = path.join(__dirname, '..', '.env');

// Required environment variables
const requiredVars = [
  'POSTGRES_URL',
  'JWT_SECRET'
];

// Optional environment variables (with defaults)
const optionalVars = [
  { name: 'JWT_EXPIRES_IN', default: '7d' },
  { name: 'DB_SSL', default: 'false' },
  { name: 'NODE_ENV', default: 'production' },
  { name: 'FRONTEND_URL', default: '' }
];

// Read .env file
function readEnvFile() {
  if (!fs.existsSync(envPath)) {
    console.error(`❌ .env file not found at: ${envPath}`);
    console.error('Please create a .env file with your environment variables first.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });

  return envVars;
}

// Set environment variable in Vercel
function setVercelEnv(key, value, environment = 'production') {
  try {
    console.log(`📤 Setting ${key} for ${environment}...`);
    execSync(`vercel env add ${key} ${environment}`, {
      input: value,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8'
    });
    console.log(`✅ ${key} set successfully for ${environment}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to set ${key}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 Setting environment variables to Vercel\n');

  // Check if user is logged in to Vercel
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Not logged in to Vercel. Please run: vercel login');
    process.exit(1);
  }

  // Read .env file
  const envVars = readEnvFile();
  console.log(`📖 Read ${Object.keys(envVars).length} variables from .env file\n`);

  // Check required variables
  const missing = requiredVars.filter(v => !envVars[v]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Set required variables
  console.log('📝 Setting required environment variables:\n');
  requiredVars.forEach(varName => {
    if (envVars[varName]) {
      setVercelEnv(varName, envVars[varName]);
    }
  });

  // Set optional variables
  console.log('\n📝 Setting optional environment variables:\n');
  optionalVars.forEach(({ name, default: defaultValue }) => {
    const value = envVars[name] || defaultValue;
    if (value) {
      setVercelEnv(name, value);
    }
  });

  console.log('\n✅ Done! Environment variables have been set.');
  console.log('\n💡 Note: You may need to redeploy your project for changes to take effect.');
  console.log('   Run: vercel --prod');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { readEnvFile, setVercelEnv };

