import axios from 'axios';

const BASE_URL = 'http://localhost:6005';

// Test data
const testUser = {
  name: "Test User for Chatbot"
};

const testChatbotMessage = {
  message: "Hello, this is a test message from the chatbot API",
  userId: "test-user-123",
  timestamp: new Date().toISOString()
};

async function testChatbotAPI() {
  console.log('🧪 Testing Chatbot API...\n');

  try {
    // Step 1: Create a test user to get an access token
    console.log('1. Creating test user...');
    const createUserResponse = await axios.post(`${BASE_URL}/users`, testUser, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const userData = createUserResponse.data;
    const accessToken = userData.accessToken;
    
    console.log('✅ User created successfully');
    console.log(`   User ID: ${userData.data.userId}`);
    console.log(`   Access Token: ${accessToken.substring(0, 20)}...\n`);

    // Step 2: Test chatbot endpoint with authentication
    console.log('2. Testing chatbot endpoint...');
    const chatbotResponse = await axios.post(`${BASE_URL}/chatbot`, testChatbotMessage, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const chatbotData = chatbotResponse.data;
    console.log('✅ Chatbot request successful');
    console.log('   Response:', JSON.stringify(chatbotData, null, 2));

    // Step 3: Test chatbot endpoint without authentication (should fail)
    console.log('\n3. Testing chatbot endpoint without authentication...');
    try {
      await axios.post(`${BASE_URL}/chatbot`, testChatbotMessage, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('❌ Unexpected response for unauthorized request');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Authentication required (as expected)');
        console.log('   Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error for unauthorized request:', error.message);
      }
    }

    // Step 4: Test chatbot endpoint with empty body (should fail)
    console.log('\n4. Testing chatbot endpoint with empty body...');
    try {
      await axios.post(`${BASE_URL}/chatbot`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log('❌ Unexpected response for empty body');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Empty body validation working (as expected)');
        console.log('   Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error for empty body:', error.message);
      }
    }

    console.log('\n🎉 All chatbot API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testChatbotAPI(); 