const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 5000;

// -------------------------
// MIDDLEWARE
// -------------------------

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
        ],
    })
);

app.use(express.json({ limit: "12mb" }));

// -------------------------
// GEMINI
// -------------------------

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

console.log("Gemini API loaded successfully");

// -------------------------
// HELPERS
// -------------------------

function cleanImageData(image) {
    if (!image) {
        return null;
    }

    let mimeType = "image/jpeg";
    let data = image;

    if (image.startsWith("data:")) {
        const match = image.match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
        );

        if (match) {
            mimeType = match[1];
            data = match[2];
        }
    }

    return {
        mimeType,
        data,
    };
}

// -------------------------
// HEALTH CHECK
// -------------------------

app.get("/", (req, res) => {
    res.json({
        message: "Roomora backend is running",
    });
});

// -------------------------
// AI CHAT - TEXT ONLY
// -------------------------

app.post("/api/chat", async (req, res) => {
    try {
        const {
            message,
            style = "Modern",
            budget = "Not specified",
        } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required",
            });
        }

        console.log("Received text-only chat request");
        console.log("Message:", message);

        const prompt = `
You are Roomora, an AI interior design assistant.

Your job is to help users with practical and personalized
interior design advice.

Selected room style:
${style}

User budget:
₹${budget || "Not specified"}

User message:
${message}

Instructions:
- Give practical interior design advice.
- Respect the selected style.
- Respect the user's budget when relevant.
- Suggest realistic furniture, colors, lighting, decor and layout ideas.
- Keep recommendations suitable for a normal home.
- Be friendly and easy to understand.
- Do not make unsupported claims.
- Keep the response reasonably concise.
- Use simple formatting when helpful.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        console.log("Gemini text response received");

        const text =
            response.text ||
            "I couldn't generate a response right now.";

        res.json({
            reply: text,
        });
    } catch (error) {
        console.error("CHAT ERROR:");
        console.error(error);

        res.status(500).json({
            error: "Gemini text request failed",
            details: error.message,
        });
    }
});

// -------------------------
// GENERATE REDESIGNED ROOM
// -------------------------

app.post("/api/generate-room", async (req, res) => {
    try {
        const {
            style = "Modern",
            budget = "Not specified",
            image,
        } = req.body;

        if (!image) {
            return res.status(400).json({
                error: "Room image is required",
            });
        }

        const roomImage = cleanImageData(image);

        if (!roomImage) {
            return res.status(400).json({
                error: "Invalid image",
            });
        }

        const prompt = `
Redesign the uploaded room as a professional interior designer.

Selected style:
${style}

Budget:
₹${budget || "Not specified"}

Requirements:
- Preserve the room's basic architecture, walls, windows, doors and camera perspective.
- Keep the redesign realistic and achievable.
- Transform the room into the requested ${style} interior style.
- Improve furniture, colors, lighting, decor, materials and overall arrangement.
- Make the room look polished, warm and professionally designed.
- Respect the user's budget and avoid unnecessarily expensive-looking items.
- Do not turn the room into a completely different architectural space.
- Keep the result photorealistic.
- Make the final image look like a realistic before-and-after interior design concept.
`;

        const interaction = await ai.interactions.create({
            model: "gemini-3.1-flash-image",
            input: [
                {
                    type: "text",
                    text: prompt,
                },
                {
                    type: "image",
                    mime_type: roomImage.mimeType,
                    data: roomImage.data,
                },
            ],
            response_format: {
                type: "image",
            },
        });

        const generatedImage = interaction.output_image;

        if (!generatedImage) {
            return res.status(500).json({
                error: "The image model did not return an image",
            });
        }

        const mimeType =
            generatedImage.mime_type || "image/png";

        const imageData =
            `data:${mimeType};base64,${generatedImage.data}`;

        res.json({
            image: imageData,
        });
    } catch (error) {
        console.error("IMAGE GENERATION ERROR:");
        console.error(error);

        res.status(500).json({
            error: "Failed to generate redesigned room",
            details: error.message,
        });
    }
});

// -------------------------
// START SERVER
// -------------------------

app.listen(PORT, () => {
    console.log(
        `Roomora backend running on http://localhost:${PORT}`
    );
});