const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use(express.json({ limit: "20mb" }));

// =====================================================
// API KEY CHECK
// =====================================================

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

// =====================================================
// GOOGLE AI CLIENTS
// =====================================================

const textAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_TEXT_API_KEY,
});

const imageAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_IMAGE_API_KEY,
});

console.log("Google text AI client loaded");
console.log("Google image AI client loaded");

// Retained for compatibility with your existing setup.
// The current chat and image-generation routes use imageAI.
void textAI;

// =====================================================
// HELPER: CLEAN BASE64 IMAGE
// =====================================================

function cleanImageData(image) {
  if (!image || typeof image !== "string") {
    return null;
  }

  let mimeType = "image/jpeg";
  let data = image;

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
// HELPER: ERROR STATUS
// =====================================================

function getErrorStatus(error) {
  const directStatus = Number(
    error?.status ??
    error?.code ??
    error?.error?.code
  );

  if (
    Number.isFinite(directStatus) &&
    directStatus >= 400 &&
    directStatus < 600
  ) {
    return directStatus;
  }

  // Some SDK errors store the HTTP status in a JSON message.
  const message = String(error?.message || "");
  const match = message.match(
    /"code"\s*:\s*(\d{3})/
  );

  if (match) {
    return Number(match[1]);
  }

  return 500;
}

function getErrorDetails(error) {
  return (
    error?.message ||
    "Unknown Gemini API error."
  );
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableStatus(status) {
  return [
    408,
    429,
    500,
    502,
    503,
    504,
  ].includes(status);
}

function isModelUnavailable(error, status) {
  const message = getErrorDetails(error).toLowerCase();

  return (
    status === 404 ||
    message.includes("model not found") ||
    message.includes("unknown model") ||
    message.includes("model is not found") ||
    message.includes("not supported for generatecontent")
  );
}

// =====================================================
// GEMINI CHAT WITH RETRIES AND FALLBACK MODELS
// =====================================================
//
// Try the original model first.
// Retry temporary failures.
// If necessary, try the fallback models.
//
// =====================================================

async function generateChatResponse(
  contents,
  systemInstruction
) {
  const chatModels = [
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-3.6-flash",
  ];

  let lastError = null;

  for (const model of chatModels) {
    console.log(
      `\nTrying Gemini chat model: ${model}`
    );

    for (
      let attempt = 1;
      attempt <= 2;
      attempt++
    ) {
      try {
        console.log(
          `Chat attempt ${attempt}/2 using ${model}`
        );

        const response =
          await imageAI.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
            },
          });

        const reply = response.text?.trim();

        if (!reply) {
          throw new Error(
            `${model} returned an empty response.`
          );
        }

        console.log(
          `Chat response succeeded using ${model}`
        );

        return {
          response,
          model,
        };
      } catch (error) {
        lastError = error;

        const status = getErrorStatus(error);

        const canTryNextModel =
          isRetryableStatus(status) ||
          isModelUnavailable(error, status);

        console.error(
          `${model}, attempt ${attempt}/2 failed.`,
          "HTTP status:",
          status
        );

        console.error(
          "Details:",
          getErrorDetails(error)
        );

        // Do not retry errors such as invalid keys or
        // permission problems.
        if (!canTryNextModel) {
          throw error;
        }

        // Retry the same model once for temporary errors.
        if (
          isRetryableStatus(status) &&
          attempt < 2
        ) {
          const delay =
            1500 *
            Math.pow(2, attempt - 1) +
            Math.floor(Math.random() * 500);

          console.log(
            `Retrying ${model} in ${(delay / 1000).toFixed(1)} seconds...`
          );

          await sleep(delay);

          continue;
        }

        // After the final attempt, try the next model.
        break;
      }
    }
  }

  throw (
    lastError ||
    new Error(
      "All configured Gemini chat models failed."
    )
  );
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Roomora backend is running",
    status: "ok",
  });
});

// =====================================================
// AI CHAT
// =====================================================

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      style = "Modern",
      budget = "Not specified",
      image,
    } = req.body || {};

    console.log("\n========================================");
    console.log("ROOMORA CHAT REQUEST");
    console.log("========================================");

    console.log("Message:", message);
    console.log("Style:", style);
    console.log("Budget:", budget);
    console.log("Image received:", !!image);

    // -------------------------------------------------
    // VALIDATE MESSAGE
    // -------------------------------------------------

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // =================================================
    // BUILT-IN QUESTIONS
    // These answers do not require a Gemini API request.
    // =================================================

    const normalizedMessage = message.trim();

    const builtInFAQs = [
      {
        match:
          /\bwho\s+(?:built|created|made|developed)\s+(?:you|roomora)\b|\bwho\s+(?:is\s+)?(?:your\s+creator|behind\s+(?:you|roomora))\b/i,

        reply:
          "I'm Roomora, an AI interior design assistant created by Ayisha. 🏡 I'm powered by Google Gemini and designed to help you transform your space with personalized interior design ideas, budget-friendly recommendations, and room redesigns.",
      },

      {
        match:
          /\bwhat\s+can\s+(?:you|roomora)\s+do\b|\bwhat\s+do\s+you\s+do\b|\bhow\s+can\s+you\s+help(?:\s+me)?\b|\bwhat\s+are\s+your\s+features\b|\bwhat\s+are\s+you\s+capable\s+of\b/i,

        reply:
          "I'm your personal AI interior designer! ✨ I can help analyze your room photo, suggest colors and furniture, improve lighting and layout, recommend products with shopping links, and help create a redesigned-room concept. Tell me your style and budget, and let's get started!",
      },

      {
        match:
          /\bhow\s+do\s+you\s+work\b|\bhow\s+does\s+(?:roomora|this)\s+work\b|\bhow\s+can\s+i\s+use\s+you\b|\bhow\s+do\s+i\s+use\s+roomora\b|\bhow\s+does\s+it\s+work\b/i,

        reply:
          "It's easy! 🪄 Upload a photo of your room, choose your interior style and budget, then ask what you'd like to improve. I'll use your photo and preferences to suggest practical changes, share relevant shopping links, and help you explore a redesigned version of your space.",
      },

      {
        match:
          /\bwhat\s+makes\s+(?:you|roomora)\s+different\b|\bwhy\s+(?:should\s+i\s+use|use)\s+(?:you|roomora)\b|\bhow\s+is\s+roomora\s+different\b|\bwhat\s+makes\s+roomora\s+special\b/i,

        reply:
          "Roomora focuses on your actual room, not just generic inspiration. 🤎 It combines photo-based suggestions, your chosen style, your budget, shopping links, and room redesign concepts in one place—helping you turn ideas into practical changes.",
      },
    ];

    const matchedFAQ = builtInFAQs.find(
      (faq) => faq.match.test(normalizedMessage)
    );

    if (matchedFAQ) {
      console.log(
        "Built-in FAQ matched; skipping Gemini request"
      );

      return res.json({
        reply: matchedFAQ.reply,
      });
    }

    // -------------------------------------------------
    // PREPARE IMAGE
    // -------------------------------------------------

    let roomImage = null;

    if (image) {
      roomImage = cleanImageData(image);

      if (!roomImage) {
        console.log("Invalid image data received");

        return res.status(400).json({
          error: "The uploaded room image is invalid.",
        });
      }

      console.log("Room image successfully decoded");
      console.log(
        "Image MIME type:",
        roomImage.mimeType
      );

      console.log(
        "Image base64 length:",
        roomImage.data.length
      );
    } else {
      console.log("No room image was provided");
    }

    // -------------------------------------------------
    // SYSTEM INSTRUCTION
    // -------------------------------------------------

    const systemInstruction = `
You are Roomora, an AI interior design assistant.

Help the user improve their actual room with practical,
realistic advice.

SELECTED INTERIOR STYLE: ${style}

USER BUDGET: ₹${budget}

ANSWER STYLE:

- Inspect the uploaded room photo carefully when one is provided.
- Base recommendations on visible details.
- Do not invent objects that are not visible.
- Respect the selected style and budget.
- Keep answers short and useful.
- Give a maximum of 5 numbered points.
- Each point should contain 1-2 short sentences.
- Avoid long introductions and repeated questions.
- Do not claim you analyzed a photo if no photo was provided.

SHOPPING LINKS:

When a recommended product is relevant, include the matching
URL directly in your reply.

Use only these shopping URLs:

Floor lamp:
https://www.amazon.in/s?k=arc+floor+lamp

Warm LED lights:
https://www.amazon.in/s?k=warm+white+led+lights

Blinds:
https://www.amazon.in/s?k=blackout+blinds

Curtains:
https://www.amazon.in/s?k=sheer+curtains

Rug:
https://www.amazon.in/s?k=textured+area+rug

Minimal desk:
https://www.amazon.in/s?k=minimalist+desk

Chair:
https://www.amazon.in/s?k=accent+chair

Indoor plant:
https://www.amazon.in/s?k=indoor+decorative+plants

Wall art:
https://www.amazon.in/s?k=wall+art+home+decor

Storage:
https://www.amazon.in/s?k=wooden+storage+cabinet

Sofa:
https://www.amazon.in/s?k=modern+sofa

Vase:
https://www.amazon.in/s?k=ceramic+vase+home+decor

LINK RULES:

- Add a link only when the product is relevant.
- Use no more than 4 shopping links per answer.
- Put the link immediately after its recommendation.
- Use this exact format:

Shop floor lamp:
https://www.amazon.in/s?k=arc+floor+lamp

- Never invent URLs, product prices, or stock availability.
- These are search links, not guaranteed exact product listings.
`;

    // -------------------------------------------------
    // BUILD GEMINI CONTENT
    // -------------------------------------------------

    const contents = [];

    if (roomImage) {
      contents.push({
        inlineData: {
          mimeType: roomImage.mimeType,
          data: roomImage.data,
        },
      });
    }

    contents.push({
      text: message,
    });

    console.log(
      "Sending image + question to Gemini chat with retry/fallback..."
    );

    // -------------------------------------------------
    // GEMINI CHAT WITH RETRIES AND FALLBACK MODELS
    // -------------------------------------------------

    const {
      response,
      model: successfulModel,
    } = await generateChatResponse(
      contents,
      systemInstruction
    );

    console.log(
      `Gemini chat completed using ${successfulModel}`
    );

    const reply = response.text?.trim();

    console.log("AI REPLY:");
    console.log(reply);

    if (!reply) {
      console.error(
        "Gemini returned an empty response"
      );

      return res.status(500).json({
        error: "Gemini returned an empty response.",
      });
    }

    return res.json({
      reply,
    });
  } catch (error) {
    const status = getErrorStatus(error);
    const details = getErrorDetails(error);

    console.error("\n========================================");
    console.error("ROOMORA CHAT ERROR");
    console.error("========================================");
    console.error("Message:", details);
    console.error("Status:", status);
    console.error("Full error:", error);
    console.error("========================================\n");

    let userMessage = "Roomora AI request failed.";

    if (status === 503) {
      userMessage =
        "Gemini is temporarily overloaded. Roomora tried the available fallback models, but they are not responding right now.";
    } else if (status === 429) {
      userMessage =
        "Gemini request quota or rate limit was reached. Check your API project's quota and billing.";
    } else if (
      status === 401 ||
      status === 403
    ) {
      userMessage =
        "Gemini could not authorize this request. Check the API key and project permissions in backend/.env.";
    }

    return res
      .status(
        status >= 400 && status < 600
          ? status
          : 500
      )
      .json({
        error: userMessage,
        details,
      });
  }
});

// =====================================================
// GENERATE REDESIGNED ROOM
// Uses your existing image-generation model.
// =====================================================

app.post("/api/generate-room", async (req, res) => {
  try {
    const {
      style = "Modern",
      budget = "Not specified",
      image,
    } = req.body || {};

    console.log("\n========================================");
    console.log("ROOMORA IMAGE GENERATION REQUEST");
    console.log("========================================");

    console.log("Style:", style);
    console.log("Budget:", budget);
    console.log("Image received:", !!image);

    // -------------------------------------------------
    // VALIDATE IMAGE
    // -------------------------------------------------

    if (!image) {
      return res.status(400).json({
        error: "Room image is required",
      });
    }

    const roomImage = cleanImageData(image);

    if (!roomImage) {
      return res.status(400).json({
        error: "Invalid room image",
      });
    }

    console.log("Room image prepared");

    // -------------------------------------------------
    // IMAGE GENERATION PROMPT
    // -------------------------------------------------

    const prompt = `
Redesign the uploaded room as a professional interior designer.

SELECTED INTERIOR STYLE: ${style}

USER BUDGET: ₹${budget}

REQUIREMENTS:

- Preserve the existing room architecture.
- Preserve walls, windows, doors, room proportions,
  and camera perspective.
- Keep the room recognizable as the same room.
- Transform the interior into the requested style.
- Improve furniture selection and placement.
- Improve colors, lighting, materials, and decor.
- Keep the redesign realistic.
- Respect the user's budget.
- Avoid unnecessary structural changes.
- Make the final image photorealistic.
- Make it look like the same room after an interior makeover.
`;

    console.log(
      "Sending room to Gemini image model..."
    );

    // -------------------------------------------------
    // IMAGE GENERATION
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
            mime_type: roomImage.mimeType,
            data: roomImage.data,
          },
        ],

        response_format: {
          type: "image",
        },
      });

    console.log(
      "Image generation interaction completed"
    );

    // -------------------------------------------------
    // FIND GENERATED IMAGE
    // -------------------------------------------------

    let generatedImage = null;

    if (interaction?.output_image?.data) {
      generatedImage = interaction.output_image;
    }

    // Fallback: inspect model output steps.
    if (
      !generatedImage &&
      Array.isArray(interaction?.steps)
    ) {
      for (const step of interaction.steps) {
        if (
          step?.type !== "model_output" ||
          !Array.isArray(step.content)
        ) {
          continue;
        }

        for (const contentBlock of step.content) {
          if (
            contentBlock?.type === "image" &&
            contentBlock.data
          ) {
            generatedImage = contentBlock;
            break;
          }
        }

        if (generatedImage) {
          break;
        }
      }
    }

    // -------------------------------------------------
    // CHECK GENERATED IMAGE
    // -------------------------------------------------

    if (!generatedImage?.data) {
      console.error(
        "No generated image was returned"
      );

      console.error(
        "Interaction response:",
        interaction
      );

      return res.status(500).json({
        error:
          "The image model did not return an image.",
        details:
          "Gemini completed the request but no image data was found in the response.",
      });
    }

    // -------------------------------------------------
    // CONVERT TO DATA URL
    // -------------------------------------------------

    const outputMimeType =
      generatedImage.mime_type ||
      generatedImage.mimeType ||
      "image/png";

    const imageData =
      `data:${outputMimeType};base64,${generatedImage.data}`;

    console.log(
      "Room image generated successfully"
    );

    return res.json({
      image: imageData,
    });
  } catch (error) {
    const status = getErrorStatus(error);
    const details = getErrorDetails(error);

    console.error("\n========================================");
    console.error("IMAGE GENERATION ERROR");
    console.error("========================================");
    console.error("Message:", details);
    console.error("Status:", status);
    console.error("Full error:", error);
    console.error("========================================\n");

    return res
      .status(
        status >= 400 && status < 600
          ? status
          : 500
      )
      .json({
        error: "Failed to generate redesigned room",
        details,
      });
  }
});

// =====================================================
// UNKNOWN ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log("\n========================================");

  console.log(
    `Roomora backend running on http://localhost:${PORT}`
  );

  console.log(
    "Chat: Gemini retry and fallback enabled"
  );

  console.log(
    "Image generation: gemini-3.1-flash-image"
  );

  console.log("========================================\n");
});