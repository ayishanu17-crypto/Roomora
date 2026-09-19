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

app.use(
    express.json({
        limit: "12mb",
    })
);

// -------------------------
// GOOGLE AI CLIENTS
// -------------------------

if (!process.env.GEMINI_TEXT_API_KEY) {
    console.error(
        "GEMINI_TEXT_API_KEY is missing in backend/.env"
    );

    process.exit(1);
}

if (!process.env.GEMINI_IMAGE_API_KEY) {
    console.error(
        "GEMINI_IMAGE_API_KEY is missing in backend/.env"
    );

    process.exit(1);
}

// Free/text API key
const textAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_TEXT_API_KEY,
});

// Paid/image API key
const imageAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_IMAGE_API_KEY,
});

console.log("Google text AI loaded successfully");
console.log("Google image AI loaded successfully");

// -------------------------
// HELPERS
// -------------------------

function cleanImageData(image) {
    if (!image) {
        return null;
    }

    let mimeType = "image/jpeg";
    let data = image;

    // Expected:
    // data:image/jpeg;base64,AAAA...

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
// AI CHAT - GEMMA 4
// Uses FREE/TEXT API KEY
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

        console.log("Received Roomora chat request");
        console.log("Message:", message);

        const systemInstruction = `
You are Roomora, an AI interior design assistant.

Your job is to help users with practical and personalized
interior design advice.

Selected interior style:
${style}

User budget:
₹${budget || "Not specified"}

Instructions:
- Give practical interior design advice.
- Respect the selected interior style.
- Respect the user's budget when relevant.
- Suggest realistic furniture, colors, lighting, decor and layout ideas.
- Keep recommendations suitable for a normal home.
- Prefer practical solutions over unrealistic renovations.
- Be friendly and easy to understand.
- Do not make unsupported claims.
- Keep the response reasonably concise.
- Use simple formatting when helpful.
`;

        const prompt = `
${systemInstruction}

USER MESSAGE:
${message}
`;

        const response =
            await textAI.models.generateContent({
                model: "gemma-4-26b-a4b-it",
                contents: prompt,
            });

        console.log("Gemma response received");

        const text =
            response.text ||
            "I couldn't generate a response right now.";

        res.json({
            reply: text,
        });
    } catch (error) {
        console.error("CHAT ERROR:");
        console.error(error);

        const status =
            error.status === 429
                ? 429
                : 500;

        res.status(status).json({
            error:
                error.status === 429
                    ? "The text AI is currently rate limited."
                    : "Gemma chat request failed",

            details: error.message,
        });
    }
});

// -------------------------
// GENERATE REDESIGNED ROOM
// Uses PAID/IMAGE API KEY
// -------------------------

app.post(
    "/api/generate-room",
    async (req, res) => {
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

            const roomImage =
                cleanImageData(image);

            if (!roomImage) {
                return res.status(400).json({
                    error: "Invalid room image",
                });
            }

            console.log(
                `Generating ${style} room...`
            );

            const prompt = `
Redesign the uploaded room as a professional interior designer.

Selected interior style:
${style}

User budget:
₹${budget || "Not specified"}

Requirements:

- Preserve the existing room architecture.
- Preserve walls, windows, doors and room proportions.
- Preserve the original camera perspective.
- Transform the room into the requested ${style} style.
- Improve furniture placement and furniture selection.
- Improve colors, lighting, materials and decor.
- Keep the redesign realistic for a normal home.
- Respect the user's budget.
- Avoid unnecessary structural changes.
- Keep the result photorealistic.
- Make the final image look like the same room after an interior makeover.
- Do not completely replace the room structure.
`;

            const interaction =
                await imageAI.interactions.create({
                    model:
                        "gemini-3.1-flash-image",

                    input: [
                        {
                            type: "text",
                            text: prompt,
                        },

                        {
                            type: "image",
                            mime_type:
                                roomImage.mimeType,
                            data:
                                roomImage.data,
                        },
                    ],

                    response_format: {
                        type: "image",
                    },
                });

            const generatedImage =
                interaction.output_image;

            if (
                !generatedImage ||
                !generatedImage.data
            ) {
                return res.status(500).json({
                    error:
                        "The image model did not return an image",
                });
            }

            const outputMimeType =
                generatedImage.mime_type ||
                "image/png";

            const imageData =
                `data:${outputMimeType};base64,${generatedImage.data}`;

            console.log(
                "Room image generated successfully"
            );

            res.json({
                image: imageData,
            });
        } catch (error) {
            console.error(
                "IMAGE GENERATION ERROR:"
            );

            console.error(error);

            const status =
                error.status === 429
                    ? 429
                    : 500;

            res.status(status).json({
                error:
                    error.status === 429
                        ? "The image generation service is rate limited. Check your paid project."
                        : "Failed to generate redesigned room",

                details:
                    error.message,
            });
        }
    }
);

// -------------------------
// START SERVER
// -------------------------

app.listen(
    PORT,
    () => {
        console.log(
            `Roomora backend running on http://localhost:${PORT}`
        );
    }
);