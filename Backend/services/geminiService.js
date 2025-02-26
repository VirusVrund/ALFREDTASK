const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini with API key validation
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
}
const genAI = new GoogleGenerativeAI(apiKey);
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verify if the prompt is valid and appropriate.
 * @param {string} prompt - The user-provided prompt.
 * @returns {Promise<boolean>} - True if the prompt is valid, false otherwise.
 */
const verifyPrompt = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.2, // Lower temperature for strict moderation
                maxOutputTokens: 128,
            },
        });

        const moderationPrompt = {
            contents: [{
                parts: [{
                    text: `Evaluate the following text for appropriateness and relevance. Return "true" if the text is:
                    1. Not abusive, offensive, or harmful.
                    2. Relevant for generating educational flashcards.
                    3. Not random or nonsensical.
                    
                    Text: "${prompt}"
                    
                    Return ONLY "true" or "false" (no explanation, no additional text).`
                }]
            }]
        };

        const result = await model.generateContent(moderationPrompt);
        const response = result.response.text().trim().toLowerCase();

        return response === 'true';
    } catch (error) {
        console.error('Error during prompt verification:', error);
        return false; // Fail-safe: Assume invalid if verification fails
    }
};

/**
 * Generate a flashcard deck based on the prompt.
 * @param {string} prompt - The user-provided prompt.
 * @param {number} cardCount - Number of flashcards to generate.
 * @param {number} retryCount - Current retry attempt.
 * @returns {Promise<Object>} - The generated flashcard deck.
 */
const generateDeck = async (prompt, cardCount = 10, retryCount = 0) => {
    try {
        // Step 1: Verify the prompt
        const isPromptValid = await verifyPrompt(prompt);
        if (!isPromptValid) {
            throw new Error('Invalid prompt: The input is either inappropriate, abusive, or nonsensical.');
        }

        // Step 2: Generate flashcards
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.4, // Lower temperature for more consistent outputs
                maxOutputTokens: 2048,
            },
        });

        const systemPrompt = {
            contents: [{
                parts: [{
                    text: `You are a flashcard generator. Create exactly ${cardCount}(strictly) flashcards about "${prompt}".
                    
                    Output only pure JSON with this exact structure (no code blocks, no backticks):
                    {
                        "title": "A clear, short title",
                        "description": "Brief description",
                        "category": "ai-generated",
                        "theme": "primary",
                        "cardCount": ${cardCount},
                        "cards": [Array of exactly ${cardCount} question-answer pairs]
                    }

                    Each card must have:
                    - Simple, clear question
                    - Single paragraph answer
                    - No special formatting or characters
                    - No markdown or HTML
                    - No bullet points or numbering

                    Important: Return ONLY the JSON object, nothing else.`
                }]
            }]
        };

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        // Step 3: Clean and parse the response
        const cleanText = text
            .replace(/```[a-z]*\n?|\n```/g, '') // Remove code block markers
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control chars
            .replace(/\n+/g, ' ') // Replace newlines
            .trim();

        try {
            // Find the JSON object in the response
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Validate the structure
            if (!parsed.cards || !Array.isArray(parsed.cards)) {
                throw new Error('Invalid deck structure');
            }

            if (parsed.cards.length !== cardCount) {
                throw new Error(`Expected ${cardCount} cards, got ${parsed.cards.length}`);
            }

            // Clean up title and description
            parsed.title = parsed.title.replace(/[^\w\s.,?!-]/g, '').trim();
            parsed.description = `AI generated flashcards about ${parsed.title}`;

            return parsed;

        } catch (parseError) {
            console.error(`Parse Error (Attempt ${retryCount + 1}/${MAX_RETRIES}):`, parseError);

            if (retryCount < MAX_RETRIES) {
                await sleep(RETRY_DELAY);
                return generateDeck(prompt, cardCount, retryCount + 1);
            }

            throw new Error(`Failed to generate valid flashcards after ${MAX_RETRIES} attempts`);
        }
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            console.error(`Gemini Error (Attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);
            await sleep(RETRY_DELAY);
            return generateDeck(prompt, cardCount, retryCount + 1);
        }
        console.error('Final Gemini Error:', error);
        throw error;
    }
};

module.exports = { generateDeck };