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
    limit: "20mb",
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

// Free/text project
const textAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_TEXT_API_KEY,
});

// Paid project
// Used for:
// 1. Room image understanding
// 2. Room image generation
const imageAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_IMAGE_API_KEY,
});

console.log("✅ Google text AI loaded successfully");
console.log("✅ Google paid AI loaded successfully");

// =====================================================
// HELPER - CLEAN BASE64 IMAGE
// =====================================================

function cleanImageData(image) {
  if (!image || typeof image !== "string") {
    return null;
  }

  let mimeType = "image/jpeg";
  let data = image;

  // Example:
  // data:image/jpeg;base64,/9j/4AAQ...

  if (image.startsWith("data:")) {
    const match = image.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
      return null;
    }

    mimeType = match[1];
    data = match[2];
  }

  if (!data) {
    return null;
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
// - Receives user question
// - Receives selected style
// - Receives budget
// - Receives uploaded room image
//
// Uses GEMINI_IMAGE_API_KEY because this request
// needs image understanding.
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
    // Prepare image
    // -------------------------------------------------

    let roomImage = null;

    if (image) {
      roomImage = cleanImageData(image);

      if (!roomImage) {
        console.log("❌ Invalid image data received");

        return res.status(400).json({
          error: "The uploaded room image is invalid.",
        });
      }

      console.log("✅ Room image successfully decoded");
      console.log(
        "Image MIME type:",
        roomImage.mimeType
      );
      console.log(
        "Image base64 length:",
        roomImage.data.length
      );
    } else {
      console.log(
        "⚠️ No room image was provided"
      );
    }

    // -------------------------------------------------
    // System instruction
    // -------------------------------------------------

    const systemInstruction = `
You are Roomora, an AI interior design assistant.

Your job is to help the user improve their actual room.

The user may provide a photo of their room.
When a room image is provided, inspect it carefully before
answering.

SELECTED INTERIOR STYLE:
${style}

USER BUDGET:
₹${budget}

IMPORTANT RULES:

1. Analyze the uploaded room image when it is provided.
2. Do not say you cannot see the room when an image
   was successfully provided.
3. Base your recommendations on visible details.
4. Mention visible furniture, layout, colors, lighting,
   windows, walls, flooring and empty spaces when relevant.
5. Respect the selected interior style.
6. Respect the user's budget.
7. Give realistic recommendations for a normal home.
8. Avoid unnecessary structural changes.
9. Do not invent objects that are clearly not visible.
10. Answer the user's exact question.
11. Keep the answer practical and easy to understand.
12. Keep the answer reasonably concise.
`;

    // -------------------------------------------------
    // Build Gemini content
    // -------------------------------------------------

    const contents = [];

    // Image first
    if (roomImage) {
      contents.push({
        inlineData: {
          mimeType: roomImage.mimeType,
          data: roomImage.data,
        },
      });
    }

    // User message
    contents.push({
      text: message,
    });

    console.log(
      "Sending image + question to Gemini 3.8 Flash..."
    );

    // -------------------------------------------------
    // GEMINI MULTIMODAL REQUEST
    // -------------------------------------------------

    const response =
      await imageAI.models.generateContent({
        model: "gemini-3.7-flash",

        contents,

        config: {
          systemInstruction,
        },
      });

    console.log(
      "✅ Gemini image-understanding request completed"
    );

    // -------------------------------------------------
    // Read response
    // -------------------------------------------------

    const reply =
      response.text?.trim();

    console.log("AI REPLY:");
    console.log(reply);

    if (!reply) {
      console.error(
        "❌ Gemini returned an empty response"
      );

      return res.status(500).json({
        error:
          "Gemini returned an empty response.",
      });
    }

    // -------------------------------------------------
    // Send reply to frontend
    // -------------------------------------------------

    return res.json({
      reply,
    });

  } catch (error) {
    console.error("\n========================================");
    console.error("❌ ROOMORA CHAT ERROR");
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
        "Roomora AI request failed",

      details:
        error.message,
    });
  }
});

// =====================================================
// GENERATE REDESIGNED ROOM
//
// Uses PAID / IMAGE API KEY
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
      console.log(
        "ROOMORA IMAGE GENERATION REQUEST"
      );
      console.log("========================================");

      console.log("Style:", style);
      console.log("Budget:", budget);
      console.log(
        "Image received:",
        !!image
      );

      // -------------------------------------------------
      // Validate image
      // -------------------------------------------------

      if (!image) {
        return res.status(400).json({
          error:
            "Room image is required",
        });
      }

      const roomImage =
        cleanImageData(image);

      if (!roomImage) {
        return res.status(400).json({
          error:
            "Invalid room image",
        });
      }

      console.log(
        "✅ Room image prepared"
      );

      // -------------------------------------------------
      // Prompt
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
- Make the final image photorealistic.
- Make it look like the same room after an
  interior makeover.
`;

      console.log(
        "Sending room to Gemini image model..."
      );

      // -------------------------------------------------
      // IMAGE GENERATION
      // -------------------------------------------------

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

      console.log(
        "✅ Image generation interaction completed"
      );

      // -------------------------------------------------
      // Find generated image
      // -------------------------------------------------

      let generatedImage = null;

      // Direct output_image
      if (
        interaction.output_image &&
        interaction.output_image.data
      ) {
        generatedImage =
          interaction.output_image;
      }

      // Fallback: inspect steps
      if (
        !generatedImage &&
        Array.isArray(interaction.steps)
      ) {
        for (const step of interaction.steps) {
          if (
            step.type !== "model_output"
          ) {
            continue;
          }

          if (
            !Array.isArray(step.content)
          ) {
            continue;
          }

          for (
            const contentBlock
            of step.content
          ) {
            if (
              contentBlock.type === "image" &&
              contentBlock.data
            ) {
              generatedImage =
                contentBlock;

              break;
            }
          }

          if (generatedImage) {
            break;
          }
        }
      }

      // -------------------------------------------------
      // Check image
      // -------------------------------------------------

      if (
        !generatedImage ||
        !generatedImage.data
      ) {
        console.error(
          "❌ No generated image was returned"
        );

        console.error(
          "Interaction response:",
          interaction
        );

        return res.status(500).json({
          error:
            "The image model did not return an image.",
        });
      }

      // -------------------------------------------------
      // Convert to data URL
      // -------------------------------------------------

      const outputMimeType =
        generatedImage.mime_type ||
        "image/png";

      const imageData =
        `data:${outputMimeType};base64,${generatedImage.data}`;

      console.log(
        "✅ Room image generated successfully"
      );

      return res.json({
        image: imageData,
      });

    } catch (error) {
      console.error("\n========================================");
      console.error(
        "❌ IMAGE GENERATION ERROR"
      );
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

app.listen(
  PORT,
  () => {
    console.log("\n========================================");
    console.log(
      `🚀 Roomora backend running on http://localhost:${PORT}`
    );
    console.log(
      "========================================\n"
    );
  }
);