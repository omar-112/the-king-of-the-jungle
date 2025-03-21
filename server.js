const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Together.AI API endpoint and API key
const TOGETHER_AI_API_URL = 'https://api.together.xyz/v1/chat/completions'; // Replace if different
const apiKey = process.env.TOGETHER_AI_API_KEY;

app.post("/chat", async (req, res) => {
  const TOGETHER_AI_API_URL = "https://api.together.xyz/v1/chat/completions";
  const { userMessage } = req.body;
  const apiKey = process.env.TOGETHER_AI_API_KEY; // Ensure API key is stored in environment variables

  try {
      // Validate request input
      if (!userMessage) {
          return res.status(400).json({ error: "User message is required" });
      }

      // Make request to Together.AI API
      const response = await axios.post(
          TOGETHER_AI_API_URL,
          {
              model: "meta-llama/Llama-Vision-Free",
              messages: [{ role: "user", content: userMessage }],
          },
          {
              headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
              },
          }
      );

      // Return API response to client
      res.json(response.data);
  } catch (error) {
      // Handle different error scenarios
      if (error.response) {
          console.error(
              `Together.AI API Error: Status ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`
          );
          res.status(error.response.status).json({
              error: `API Error: ${error.response.data?.error?.message || "Unknown error"}`,
          });
      } else if (error.request) {
          console.error("No response from Together.AI:", error.request);
          res.status(503).json({ error: "Service Unavailable: No response from Together.AI API." });
      } else {
          console.error("Request Error:", error.message);
          res.status(500).json({ error: `Internal Server Error: ${error.message}` });
      }
  }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
