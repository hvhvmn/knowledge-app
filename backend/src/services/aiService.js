import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export let generateTags = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a tag generator. Given the following text, generate relevant tags that describe the content.

Text: "${text}"

Generate 3-5 relevant tags. Return ONLY a JSON array of tags (strings), nothing else.
Example: ["AI", "machine learning", "technology"]

Tags:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Parse the JSON response
        try {
            // Extract JSON array from response
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                console.log("No JSON array found in response:", responseText);
                return [];
            }
            
            const tags = JSON.parse(jsonMatch[0]);
            
            // Ensure it's an array of strings
            if (Array.isArray(tags)) {
                return tags.map(tag => {
                    // Clean up tags: remove special characters, trim, capitalize
                    return String(tag)
                        .trim()
                        .replace(/[^a-zA-Z0-9\s-]/g, '')
                        .trim();
                }).filter(tag => tag.length > 0);
            }
            
            return [];
        } catch (parseError) {
            console.log("Error parsing JSON:", parseError);
            return [];
        }
    } catch (error) {
        console.error("Error generating tags with AI:", error);
        return []; // Return empty array if AI fails
    }
};

export let embeddingService = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
};
