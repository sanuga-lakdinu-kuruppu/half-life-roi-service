import axios from 'axios';

const PYTHON_API_URL = 'https://l7k7ax74cs6uzevdfzjzcmzpoi0ekccz.lambda-url.us-east-1.on.aws/';

export const forwardToPythonAPI = async (requestBody) => {
  try {
    console.log('Forwarding request to Python API:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(PYTHON_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'half-life-roi-service/1.0.0'
      },
      timeout: 30000, // 30 second timeout
    });

    console.log('Python API response received:', JSON.stringify(response.data, null, 2));

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Error forwarding request to Python API:', error);
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        statusCode: 408,
        message: 'Request to Python API timed out',
        error: 'PYTHON_API_TIMEOUT'
      };
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        success: false,
        statusCode: 503,
        message: 'Python API service is unavailable',
        error: 'PYTHON_API_UNAVAILABLE'
      };
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Python API responded with error status:', error.response.status, error.response.statusText);
      return {
        success: false,
        statusCode: error.response.status,
        message: `Python API responded with status ${error.response.status}: ${error.response.statusText}`,
        error: 'PYTHON_API_ERROR'
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: 'Failed to communicate with Python API',
      error: 'PYTHON_API_COMMUNICATION_ERROR'
    };
  }
}; 