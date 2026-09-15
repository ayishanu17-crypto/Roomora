const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const { InferenceClient } = require("@huggingface/inference");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));


// ===============================
// AI Clients
// ===============================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// NOTE: InferenceClient(accessToken, options?) — the token must be a
// string. The provider is selected per-call with `provider: "fal-ai"`.
const hf = new InferenceClient(process.env.HF_TOKEN);


// ===============================
// Roomora AI Chat
// Gemini
// ===============================

app.post("/api/chat", async (req, res) => {
    try {
        const { message, style, budget, image } = req.body;

        const contents = [
            {
                text: `
You are Roomora, an AI interior designer.

Analyze the user's room photo and give personalized interior design advice.

Selected style: ${style || "Not specified"}
Budget: ₹${budget || "Not specified"}

User's question:
${message}

Rules:
- Look carefully at the room photo.
- Give advice based on what you can actually see.
- Consider the selected style and budget.
- Suggest specific changes to furniture, layout, colors, lighting and decor.
- Prioritize affordable and realistic changes.
- Do not invent things that are not visible in the image.
- Keep the answer concise and easy to read.
- Use bullet points when useful.
`
            }
        ];

        if (image) {
            const base64Data = image.split(",")[1];

            const mimeType =
                image.match(/data:(.*?);base64/)?.[1] || "image/jpeg";

            contents.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: contents
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("Chat error:", error.message || error);

        res.status(500).json({
            reply: "Sorry, something went wrong.",
            detail: String(error.message || error)
        });
    }
});


// ===============================
// Roomora AI Room Generation
// Hugging Face + FLUX
// ===============================

app.post("/api/generate-room", async (req, res) => {
    try {
        const { image, style, budget } = req.body;

        if (!image) {
            return res.status(400).json({
                error: "Room image is required"
            });
        }

        // Get image data from data URL
        const base64Data = image.split(",")[1];

        // Detect original image type
        const mimeType =
            image.match(/data:(.*?);base64/)?.[1] || "image/jpeg";

        // Convert base64 to Buffer
        const imageBuffer = Buffer.from(base64Data, "base64");

        // Convert Buffer to Blob
        const imageBlob = new Blob([imageBuffer], {
            type: mimeType
        });

        const prompt = `
Redesign this exact room as a professional interior designer.

Style: ${style || "Modern"}
Budget: ₹${budget || "Not specified"}

Keep the same:
- room layout
- walls
- windows
- doors
- camera perspective
- room proportions

Improve:
- furniture
- wall colors
- lighting
- storage
- decor
- organization

Make the design realistic and achievable within the budget.

Do not change the architecture.
Do not remove important existing room structures.
Do not create unrealistic objects.

Create a photorealistic interior design visualization.
`;

        console.log("Generating redesigned room...");

        // Hugging Face + FLUX image-to-image
        const result = await hf.imageToImage({
            inputs: imageBlob,
            model: "black-forest-labs/FLUX.2-dev",
            provider: "fal-ai",
            parameters: {
                prompt: prompt
            }
        });

        // Convert generated image to base64
        const arrayBuffer = await result.arrayBuffer();

        const generatedBase64 =
            Buffer.from(arrayBuffer).toString("base64");

        // Send image back to frontend
        res.json({
            image: `data:image/png;base64,${generatedBase64}`
        });

    } catch (error) {
        console.error("Room generation error:", error.message || error);

        res.status(500).json({
            error: "Failed to generate redesigned room",
            detail: String(error.message || error)
        });
    }
});


// ===============================
// Start Server
// ===============================

app.listen(5000, () => {
    console.log(
        "Roomora backend running on http://localhost:5000"
    );
});