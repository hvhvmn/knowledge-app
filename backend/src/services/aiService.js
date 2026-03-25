import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Pinecone with proper error handling
let pinecone = null;

const initPineconeClient = () => {
  if (pinecone) {
    return pinecone;
  }

  try {
    // Ensure dotenv is loaded
    if (!process.env.PINECONE_KEY) {
      // Try to load dotenv if not already loaded
      try {
        const dotenv = require('dotenv');
        dotenv.config();
      } catch (e) {
        // dotenv might already be loaded
      }
    }

    if (!process.env.PINECONE_KEY) {
      console.error("PINECONE_KEY environment variable is not set");
      return null;
    }

    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_KEY,
    });
    console.log("Pinecone client initialized successfully");
    return pinecone;
  } catch (error) {
    console.error("Failed to initialize Pinecone client:", error);
    pinecone = null;
    return null;
  }
};

// Don't initialize at module load time
// initPineconeClient();

export let generateTags = async (text) => {
    if (!text || !String(text).trim()) {
        return [];
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a tag generator. Given the following text, generate relevant tags that describe the content.

Text: "${text}"

Generate 3-5 relevant tags. Return ONLY a JSON array of tags (strings), nothing else.
Example: ["AI", "machine learning", "technology"]

Tags:`;

        const result = await model.generateContent(prompt);

        let responseText = "";

        if (result?.response) {
            // Some versions expose a .response object with text() function
            const response = result.response;
            if (typeof response.text === "function") {
                responseText = await response.text();
            } else if (typeof response.text === "string") {
                responseText = response.text;
            } else {
                responseText = JSON.stringify(response);
            }
        } else if (result?.output?.[0]?.content?.[0]?.text) {
            // Another common response shape from Google generative API
            responseText = result.output[0].content[0].text;
        } else if (typeof result?.text === "string") {
            responseText = result.text;
        } else {
            responseText = JSON.stringify(result);
        }

        if (typeof responseText !== "string") {
            responseText = String(responseText);
        }

        // log for debugging if tag generation is empty
        console.log("AI tag prompt:", prompt);
        console.log("AI raw response:", responseText);

        // Parse the JSON response
        try {
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                console.log("No JSON array found in response:", responseText);
                return [];
            }

            const tags = JSON.parse(jsonMatch[0]);

            if (Array.isArray(tags)) {
                return tags.map(tag => {
                    return String(tag)
                        .trim()
                        .replace(/[^a-zA-Z0-9\s-]/g, '')
                        .trim();
                }).filter(tag => tag.length > 0);
            }

            console.log("AI response was not an array:", tags);
            return [];
        } catch (parseError) {
            console.log("Error parsing JSON:", parseError, "raw AI text:", responseText);
            return [];
        }
    } catch (error) {
        console.error("Error generating tags with AI:", error);
        return []; // Return empty array if AI fails
    }
};



// ============================
// EMBEDDING SERVICE (Mistral AI)
// ============================

export const embeddingService = async (text) => {
  try {
    if (!text || !String(text).trim()) {
      return null;
    }

    console.log("Generating embedding for text:", text.substring(0, 50) + "...");

    // Use direct HTTP request to Mistral API
    const response = await fetch('https://api.mistral.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-embed',
        input: [text]
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.data && data.data[0] && data.data[0].embedding) {
      console.log("Embedding generated successfully, length:", data.data[0].embedding.length);
      return data.data[0].embedding;
    }

    console.log("Unexpected embedding response structure:", data);
    return null;

  } catch (error) {
    console.log("Embedding error:", error.message);
    return null;
  }
};




// ============================
// VECTOR DATABASE SERVICE (Pinecone)
// ============================

export const vectorStoreService = async (id, embedding, metadata = {}) => {
  try {
    if (!pinecone) {
      initPineconeClient();
    }

    if (!pinecone) {
      console.log("Pinecone client not initialized");
      return false;
    }

    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      console.log("Invalid embedding for vector store, embedding:", embedding);
      return false;
    }

    console.log("Attempting to store vector for id:", id, "embedding length:", embedding.length);
    
    // Use REST API directly since client library has issues
    const response = await fetch(`https://knowledge-app-psyo2cd.svc.aped-4627-b74a.pinecone.io/vectors/upsert`, {
      method: 'POST',
      headers: {
        'Api-Key': process.env.PINECONE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vectors: [
          {
            id: String(id),
            values: embedding,
            metadata: {
              ...metadata,
              createdAt: new Date().toISOString()
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinecone REST API error:", response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log("Vector stored successfully for item:", id, "result:", result);
    return true;

  } catch (error) {
    console.error("Vector store error:", error.message);
    console.error("Full error:", error);
    return false;
  }
};
export const vectorSearchService = async (queryEmbedding, limit = 10) => {
  try {
    if (!pinecone) {
      initPineconeClient();
    }

    if (!pinecone) {
      console.log("Pinecone client not initialized");
      return [];
    }

    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      console.log("Invalid query embedding for vector search");
      return [];
    }

    // Use REST API for search
    const response = await fetch(`https://knowledge-app-psyo2cd.svc.aped-4627-b74a.pinecone.io/query`, {
      method: 'POST',
      headers: {
        'Api-Key': process.env.PINECONE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true
      })
    });

    if (!response.ok) {
      console.error("Pinecone search API error:", response.status, await response.text());
      return [];
    }

    const result = await response.json();
    return result.matches || [];

  } catch (error) {
    console.log("Vector search error:", error);
    return [];
  }
};

export const getVectorById = async (itemId) => {
  try {
    if (!pinecone) {
      initPineconeClient();
    }

    if (!pinecone) {
      console.log("Pinecone client not initialized");
      return null;
    }

    const index = pinecone.index("knowledge-app");
    const data = await index.fetch([String(itemId)]);

    if (data && data.vectors && data.vectors[String(itemId)]) {
      return data.vectors[String(itemId)].values || null;
    }

    return null;
  } catch (error) {
    console.log("Vector fetch error:", error);
    return null;
  }
};

export const getRelatedItems = async (itemId, limit = 5) => {
  try {
    if (!pinecone) {
      initPineconeClient();
    }

    if (!pinecone) {
      console.log("Pinecone client not initialized");
      return [];
    }

    const index = pinecone.index("knowledge-app");
    const itemVector = await index.fetch([String(itemId)]);
    const itemData = itemVector?.vectors?.[String(itemId)];

    if (!itemData) {
      console.log("Item vector not found for related items");
      return [];
    }

    const queryResponse = await index.query({
      vector: itemData.values,
      topK: limit + 1,
      includeMetadata: true
    });

    return queryResponse.matches
      .filter(match => match.id !== String(itemId))
      .slice(0, limit) || [];

  } catch (error) {
    console.log("Related items error:", error);
    return [];
  }
};

// ============================
// COMBINED AI SERVICE
// ============================

export const generateAIData = async (text) => {
  try {
    const [tags, embedding] = await Promise.all([
      generateTags(text),
      embeddingService(text)
    ]);

    return {
      tags,
      embedding
    };

  } catch (error) {
    console.log("AI data generation error:", error);
    return {
      tags: [],
      embedding: null
    };
  }
};

export const processItemForAI = async (itemId, title, url, tags, notes) => {
  try {
    const contentForAI = `${title || ''} ${notes || ''} ${tags?.join(' ') || ''}`.trim();

    if (!contentForAI) {
      console.log("No content for AI processing");
      return { tags: [], embedding: null, vectorStored: false };
    }

    // Generate AI data
    const aiData = await generateAIData(contentForAI);
    
    console.log("AI data generated - tags:", aiData.tags.length, "embedding:", aiData.embedding ? `${aiData.embedding.length} dimensions` : "null");

    // Store in vector database if embedding exists
    let vectorStored = false;
    if (aiData.embedding) {
      console.log("Calling vectorStoreService with embedding length:", aiData.embedding.length);
      vectorStored = await vectorStoreService(itemId, aiData.embedding, {
        title,
        url,
        tags: aiData.tags,
        notes,
        content: contentForAI
      });
      console.log("Vector store result:", vectorStored);
    } else {
      console.log("No embedding generated, skipping vector storage");
    }

    return {
      tags: aiData.tags,
      embedding: aiData.embedding,
      vectorStored
    };

  } catch (error) {
    console.log("Item AI processing error:", error);
    return { tags: [], embedding: null, vectorStored: false };
  }
};