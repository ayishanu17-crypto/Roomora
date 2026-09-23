const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

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

// =====================================================
// API KEY CHECK
// =====================================================

if (!process.env.GEMINI_TEXT_API_KEY) {
  console.error(
    "❌ GEMINI_TEXT_API_KEY is missing in backend/.env"
  );
  process.exit(1);
}

if (!process.env.GEMINI_IMAGE_API_KEY) {
  console.error(
    "❌ GEMINI_IMAGE_API_KEY is missing in backend/.env"
  );
  process.exit(1);
}

// =====================================================
// GOOGLE AI CLIENTS
// =====================================================

// Used for AI chat + room image understanding
const textAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_TEXT_API_KEY,
});

// Used for redesigned room image generation
const imageAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_IMAGE_API_KEY,
});

console.log("✅ Google text AI loaded successfully");
console.log("✅ Google image AI loaded successfully");

// =====================================================
// HELPER - CLEAN BASE64 IMAGE
// =====================================================

function cleanImageData(image) {
  if (!image) {
    return null;
  }

  let mimeType = "image/jpeg";
  let data = image;

  // Example:
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

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Roomora backend is running",
  });
});

// =====================================================
// AI CHAT
//
// IMPORTANT:
// This endpoint receives:
// - user message
// - selected style
// - budget
// - uploaded room image
//
// The image is sent to Gemini 3.8 Flash so that the
// AI can actually inspect the room.
// =====================================================

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      style = "Modern",
      budget = "Not specified",
      image,
    } = req.body;

    console.log("\n========================================");
    console.log("ROOMORA CHAT REQUEST");
    console.log("========================================");

    console.log("Message:", message);
    console.log("Style:", style);
    console.log("Budget:", budget);
    console.log("Image received:", !!image);

    // -------------------------------------------------
    // Validate message
    // -------------------------------------------------

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // -------------------------------------------------
    // System instructions
    // -------------------------------------------------

    const systemInstruction = `
You are Roomora, an AI interior design assistant.

The user has uploaded a photo of their room.

Your job is to analyze the uploaded room image and give
personalized interior design advice based on what you can
actually see.

ROOM STYLE:
${style}

USER BUDGET:
₹${budget}

IMPORTANT RULES:

1. Actually inspect the uploaded room image.
2. Do NOT say that you cannot see the room when an image
   has been provided.
3. Mention visible details from the room when relevant.
4. Recommend realistic improvements for the actual room.
5. Respect the selected interior style.
6. Respect the user's budget.
7. Suggest practical furniture, colors, lighting,
   decor and layout improvements.
8. Avoid unnecessary structural changes.
9. Do not invent furniture or objects that are clearly
   not present.
10. Keep the answer friendly and easy to understand.
11. Answer the user's question directly.
12. Keep the response reasonably concise.

Examples of useful observations:
- room layout
- wall colors
- visible furniture
- lighting
- windows
- floor
- empty spaces
- clutter
- storage
- decor
- color combinations
- furniture positioning
`;

    // -------------------------------------------------
    // Build multimodal input
    // -------------------------------------------------

    const input = [];

    // Add room image first when available
    if (image) {
      const roomImage = cleanImageData(image);

      if (roomImage) {
        input.push({
          type: "image",
          mime_type: roomImage.mimeType,
          data: roomImage.data,
        });

        console.log("✅ Room image attached to AI request");
      }
    } else {
      console.log("⚠️ No room image was provided");
    }

    // Add user's text question
    input.push({
      type: "text",
      text: message,
    });

    // -------------------------------------------------
    // Call Gemini
    // -------------------------------------------------

    console.log("Sending request to Gemini 3.8 Flash...");

    const interaction = await textAI.interactions.create({
      model: "gemini-3.8-flash",

      system_instruction: systemInstruction,

      input,

      store: false,
    });

    console.log("✅ Gemini interaction completed");

    // -------------------------------------------------
    // Get generated text
    // -------------------------------------------------

    const reply =
      interaction.output_text?.trim();

    console.log("AI REPLY:");
    console.log(reply);

    if (!reply) {
      console.error(
        "❌ Gemini returned an empty text response"
      );

      return res.status(500).json({
        error:
          "The AI returned an empty response.",
      });
    }

    // -------------------------------------------------
    // Send response to frontend
    // -------------------------------------------------

    return res.json({
      reply,
    });

  } catch (error) {
    console.error("\n========================================");
    console.error("❌ CHAT ERROR");
    console.error("========================================");

    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Full error:", error);

    console.error("========================================\n");

    const status =
      error.status >= 400 &&
      error.status < 600
        ? error.status
        : 500;

    return res.status(status).json({
      error: "Roomora AI request failed",
      details: error.message,
    });
  }
});

// =====================================================
// GENERATE REDESIGNED ROOM
//
// Uses your PAID / IMAGE API key
// =====================================================

app.post(
  "/api/generate-room",
  async (req, res) => {
    try {
      const {
        style = "Modern",
        budget = "Not specified",
        image,
      } = req.body;

      console.log("\n========================================");
      console.log("ROOMORA IMAGE GENERATION REQUEST");
      console.log("========================================");

      console.log("Style:", style);
      console.log("Budget:", budget);
      console.log("Image received:", !!image);

      // -------------------------------------------------
      // Validate image
      // -------------------------------------------------

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

      // -------------------------------------------------
      // Image generation prompt
      // -------------------------------------------------

      const prompt = `
Redesign the uploaded room as a professional interior
designer.

SELECTED INTERIOR STYLE:
${style}

USER BUDGET:
₹${budget}

REQUIREMENTS:

- Preserve the existing room architecture.
- Preserve walls.
- Preserve windows.
- Preserve doors.
- Preserve room proportions.
- Preserve the original camera perspective.
- Keep the room recognizable as the same room.
- Transform the interior into the requested style.
- Improve furniture selection.
- Improve furniture placement.
- Improve colors.
- Improve lighting.
- Improve materials.
- Improve decor.
- Keep the redesign realistic.
- Respect the user's budget.
- Avoid unnecessary structural changes.
- Do not completely replace the room structure.
- Create a professional photorealistic interior makeover.
`;

      console.log(
        `Generating ${style} room with Gemini image model...`
      );

      // -------------------------------------------------
      // Generate image
      // -------------------------------------------------

      const interaction =
        await imageAI.interactions.create({
          model: "gemini-3.1-flash-image",

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

      console.log(
        "✅ Image interaction completed"
      );

      // -------------------------------------------------
      // Find generated image
      //
      // The Interactions API can return image content
      // inside model output steps.
      // -------------------------------------------------

      let generatedImage = null;

      if (
        interaction.output_image &&
        interaction.output_image.data
      ) {
        generatedImage =
          interaction.output_image;
      }

      // Fallback: inspect interaction steps
      if (
        !generatedImage &&
        Array.isArray(interaction.steps)
      ) {
        for (const step of interaction.steps) {
          if (
            step.type === "model_output" &&
            Array.isArray(step.content)
          ) {
            for (const contentBlock of step.content) {
              if (
                contentBlock.type === "image" &&
                contentBlock.data
              ) {
                generatedImage =
                  contentBlock;
                break;
              }
            }
          }

          if (generatedImage) {
            break;
          }
        }
      }

      // -------------------------------------------------
      // Validate generated image
      // -------------------------------------------------

      if (
        !generatedImage ||
        !generatedImage.data
      ) {
        console.error(
          "❌ Image model did not return image data"
        );

        console.error(
          "Interaction:",
          interaction
        );

        return res.status(500).json({
          error:
            "The image model did not return an image",
        });
      }

      // -------------------------------------------------
      // Convert image to data URL
      // -------------------------------------------------

      const outputMimeType =
        generatedImage.mime_type ||
        "image/png";

      const imageData =
        `data:${outputMimeType};base64,${generatedImage.data}`;

      console.log(
        "✅ Room image generated successfully"
      );

      // -------------------------------------------------
      // Send image to frontend
      // -------------------------------------------------

      return res.json({
        image: imageData,
      });

    } catch (error) {
      console.error("\n========================================");
      console.error("❌ IMAGE GENERATION ERROR");
      console.error("========================================");

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Status:",
        error.status
      );

      console.error(
        "Code:",
        error.code
      );

      console.error(
        "Full error:",
        error
      );

      console.error("========================================\n");

      const status =
        error.status >= 400 &&
        error.status < 600
          ? error.status
          : 500;

      return res.status(status).json({
        error:
          "Failed to generate redesigned room",

        details:
          error.message,
      });
    }
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log("\n========================================");
  console.log(
    `🚀 Roomora backend running on http://localhost:${PORT}`
  );
  console.log("========================================");
});