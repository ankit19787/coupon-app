const https = require('https');
const http = require('http');

// Configuration
const API_URL = process.env.API_URL || 'https://backend1-27iyk854y-vinodpatelgroupteam.vercel.app';
const LOGIN_ENDPOINT = `${API_URL}/api/auth/login`;

// Test credentials
const testCredentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

// Function to make HTTP request
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const requestModule = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = requestModule.request(requestOptions, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsedBody
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test login endpoint
async function testLogin() {
  console.log('🧪 Testing Login Endpoint\n');
  console.log(`URL: ${LOGIN_ENDPOINT}`);
  console.log(`Credentials: ${testCredentials.email} / ${testCredentials.password}\n`);

  try {
    // Test 1: Valid credentials
    console.log('📤 Test 1: Sending login request with valid credentials...');
    const response = await makeRequest(LOGIN_ENDPOINT, {
      method: 'POST'
    }, testCredentials);

    console.log(`\n📥 Response Status: ${response.statusCode}`);
    console.log('Response Body:');
    console.log(JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 && response.body.success) {
      console.log('\n✅ SUCCESS: Login endpoint is working correctly!');
      console.log(`Token received: ${response.body.data?.token ? 'Yes (length: ' + response.body.data.token.length + ')' : 'No'}`);
      console.log(`User data: ${response.body.data?.user ? JSON.stringify(response.body.data.user, null, 2) : 'No user data'}`);
    } else {
      console.log('\n❌ FAILED: Login endpoint returned an error');
      if (response.body.message) {
        console.log(`Error message: ${response.body.message}`);
      }
    }

    // Test 2: Missing credentials
    console.log('\n\n📤 Test 2: Testing with missing email...');
    const response2 = await makeRequest(LOGIN_ENDPOINT, {
      method: 'POST'
    }, { password: 'admin123' });

    console.log(`\n📥 Response Status: ${response2.statusCode}`);
    console.log('Response Body:');
    console.log(JSON.stringify(response2.body, null, 2));

    // Test 3: Invalid credentials
    console.log('\n\n📤 Test 3: Testing with invalid credentials...');
    const response3 = await makeRequest(LOGIN_ENDPOINT, {
      method: 'POST'
    }, { email: 'admin@example.com', password: 'wrongpassword' });

    console.log(`\n📥 Response Status: ${response3.statusCode}`);
    console.log('Response Body:');
    console.log(JSON.stringify(response3.body, null, 2));

    // Test 4: Health check
    console.log('\n\n📤 Test 4: Testing health endpoint...');
    const healthResponse = await makeRequest(`${API_URL}/health`, {
      method: 'GET'
    });

    console.log(`\n📥 Response Status: ${healthResponse.statusCode}`);
    console.log('Response Body:');
    console.log(JSON.stringify(healthResponse.body, null, 2));

  } catch (error) {
    console.error('\n❌ ERROR: Failed to test login endpoint');
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testLogin();

