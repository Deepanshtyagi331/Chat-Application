const axios = require('axios');

// Test registration endpoint
const testRegistration = async () => {
  try {
    console.log('Testing registration endpoint...');
    
    const response = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Test User 3',
      email: 'test3@example.com',
      password: 'password123'
    });
    
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:');
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

testRegistration();