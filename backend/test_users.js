const axios = require('axios');

// Test user search endpoint
const testUserSearch = async () => {
  try {
    console.log('Testing user search endpoint...');
    
    // First, let's try to login to get a token
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test3@example.com',
      password: 'password123'
    });
    
    console.log('Login successful:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    // Now test the user search
    const response = await axios.get('http://localhost:5001/api/users?search=', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('User search successful:', response.data);
  } catch (error) {
    console.error('User search failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testUserSearch();