import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGeminiAPI() {
  try {
    console.log("🧪 Testing Gemini API connection...");

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment");
      return;
    }

    console.log("🔑 API Key loaded (length:", process.env.GEMINI_API_KEY.length + ")");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("🤖 Testing with gemini-2.5-flash model...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Say 'Hello, API test successful!' in exactly those words.");
    const response = await result.response;
    const text = response.text();

    console.log("✅ API test successful!");
    console.log("📝 Response:", text);

  } catch (error) {
    console.error("❌ API test failed:");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
  }
}

testGeminiAPI();