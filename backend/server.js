const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/generate-room", async (req, res) => {
    try {
        const { image, style, budget } = req.body;

        if (!image) {
            return res.status(400).json({
                error: "Room image is required"
            });
        }

        const base64Data = image.split(",")[1];
        const mimeType =
            image.match(/data:(.*?);base64/)?.[1] || "image/jpeg";

        const prompt = `
Redesign this exact room as a professional interior designer.

Style: ${style || "Modern"}
Budget: ₹${budget || "Not specified"}

Keep the same room layout, walls, windows, doors and camera perspective.

Transform the room into a beautiful ${style} interior.
Make the changes realistic and achievable within the given budget.

Improve:
- furniture
- wall colors
- lighting
- storage
- decor
- overall organization

Do not change the architecture of the room.
Do not add unrealistic objects.
Create a realistic interior design visualization.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-image",
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }
            ],
            config: {
                responseModalities: ["IMAGE"]
            }
        });

        const parts = response.candidates?.[0]?.content?.parts || [];

        const imagePart = parts.find(
            (part) => part.inlineData
        );

        if (!imagePart) {
            throw new Error("No image was generated");
        }

        res.json({
            image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to generate redesigned room"
        });
    }
});

app.listen(5000, () => {
    console.log("Roomora backend running on http://localhost:5000");
});