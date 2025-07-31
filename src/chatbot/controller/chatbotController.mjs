import { forwardToPythonAPI } from "../service/chatbotService.mjs";

export const chatbotController = async (req, res) => {
  try {
    const requestBody = req.body;
    const authenticatedUser = req.user;

    // Validate that we have a request body
    if (!requestBody || Object.keys(requestBody).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
        error: "MISSING_REQUEST_BODY"
      });
    }

    // Forward the request to the Python API
    const result = await forwardToPythonAPI(requestBody);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Chatbot response received successfully",
        data: result.data
      });
    } else {
      return res.status(result.statusCode || 500).json({
        success: false,
        message: result.message || "Error communicating with chatbot service",
        error: result.error || "CHATBOT_SERVICE_ERROR"
      });
    }
  } catch (error) {
    console.error("Controller error in chatbot:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
}; 