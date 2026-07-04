import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 20MB limit to handle base64 image uploads comfortably
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Helper function to extract base64 raw data and mime type
function parseBase64Image(dataUrl: string) {
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return { mimeType: "image/jpeg", data: dataUrl };
  }
  return {
    mimeType: matches[1],
    data: matches[2]
  };
}

// Lazy-initialization of Gemini SDK to prevent startup crash if API key is missing
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY is not configured. Please add your Gemini API key in the 'Settings' -> 'Secrets' panel in the AI Studio UI.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});

// Endpoint: Reimagine Room Style
app.post("/api/reimagine", async (req, res) => {
  try {
    const { image, style, customPrompt } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing room image. Please upload an image first." });
    }
    if (!style) {
      return res.status(400).json({ error: "Missing design style selection." });
    }

    const ai = getAI();
    const { mimeType, data: base64Data } = parseBase64Image(image);

    // Prompt for the image generation model (Gemini 3.1 Flash Image)
    const editPrompt = `You are a world-class interior designer. Recreate and reimagine this interior space in the exact style of "${style}".
Keep the overall architectural layout, window placement, and basic structure of the room, but replace the furniture, wall treatments, decor, lighting, flooring, and color scheme to match a highly premium, clean, and elegant "${style}" aesthetic.
Return ONLY the newly designed and edited image.`;

    const promptWithCustom = customPrompt 
      ? `${editPrompt} Additionally, please incorporate this feedback: ${customPrompt}` 
      : editPrompt;

    console.log(`Calling gemini-3.1-flash-image to reimagine room in style: ${style}`);
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: promptWithCustom,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
          imageSize: "1K"
        }
      }
    });

    let reimaginedImageBase64 = "";
    if (imageResponse.candidates?.[0]?.content?.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          reimaginedImageBase64 = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!reimaginedImageBase64) {
      throw new Error("No image was returned by the AI model. Try again or check your prompt.");
    }

    // Call the text model to analyze the new room and generate shoppable items
    const analysisPrompt = `You are an expert interior design consultant.
Compare the original room layout and the newly reimagined "${style}" style room design.
Identify exactly 3 to 4 key pieces of furniture, lighting, or decor that dominate this new "${style}" look.
For each item, provide:
1. Item Name (distinct, premium name)
2. Category (e.g., Seating, Lighting, Tables, Decor, Rugs)
3. A short, stylish description explaining why it works in this room and what to look for
4. A typical price range (e.g. $150 - $300)
5. A search keyword query that can be used on popular home decor sites (e.g. "mid century modern brass floor lamp")

Return the response as a JSON array of objects. Each object MUST have these properties:
"name", "category", "description", "priceRange", "searchQuery"

Return ONLY the raw JSON block, do not include markdown blocks or any conversational wrapping.`;

    console.log(`Calling gemini-3.5-flash to analyze reimagined room and extract shoppable items`);

    const analysisResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            }
          },
          {
            inlineData: {
              data: reimaginedImageBase64.split(",")[1],
              mimeType: "image/png",
            }
          },
          {
            text: analysisPrompt,
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    let recommendations = [];
    try {
      const text = analysisResponse.text?.trim() || "[]";
      const cleanedJson = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      recommendations = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Failed to parse recommendations JSON:", parseError);
      recommendations = [
        {
          name: `${style} Accent Chair`,
          category: "Seating",
          description: `A beautiful accent piece designed to capture the core aesthetic of ${style} interior design.`,
          priceRange: "$250 - $550",
          searchQuery: `${style.toLowerCase()} elegant accent chair`
        },
        {
          name: `${style} Minimalist Floor Lamp`,
          category: "Lighting",
          description: "Elevates the room's ambience with subtle warmth and premium design.",
          priceRange: "$90 - $190",
          searchQuery: `${style.toLowerCase()} modern floor lamp`
        },
        {
          name: `Hand-Woven ${style} Area Rug`,
          category: "Rugs",
          description: "Ties the room together with complementary textures and color palettes.",
          priceRange: "$180 - $380",
          searchQuery: `${style.toLowerCase()} elegant area rug`
        }
      ];
    }

    // Enrich items with shoppable links
    const enrichedRecs = recommendations.map((item: any, idx: number) => {
      const encodedQuery = encodeURIComponent(item.searchQuery || item.name);
      return {
        id: String(idx + 1),
        name: item.name,
        category: item.category,
        description: item.description,
        priceRange: item.priceRange,
        searchQuery: item.searchQuery,
        searchUrl: `https://www.wayfair.com/sd/?q=${encodedQuery}`
      };
    });

    res.json({
      imageUrl: reimaginedImageBase64,
      recommendations: enrichedRecs
    });

  } catch (error: any) {
    console.error("Error in /api/reimagine:", error);
    res.status(500).json({ error: error.message || "Failed to reimagine room style" });
  }
});

// Endpoint: Context-Aware Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, originalImage, currentStyledImage, style } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message." });
    }

    const ai = getAI();

    // Classification of user message intent
    const classificationPrompt = `Analyze the user's message in the context of an interactive home makeover session.
The user's current room is styled in "${style || 'modern'}".
User message: "${message}"

Does the user's message explicitly ask to modify or change the visual design, items, colors, layout, or components of the room?
Examples of edits:
- "Make the rug blue"
- "Add a potted plant in the corner"
- "Change the sofa to leather"
- "Keep the layout but make the walls light gray"
- "Replace the lamp with a brass floor lamp"

Examples of non-edits (questions, explanations, general chat):
- "What do you think of this layout?"
- "Where can I buy a rug like that?"
- "Why does Scandinavian style use light woods?"
- "Can you suggest some color schemes?"

Reply with EXACTLY "EDIT" if the user wants to visually modify the room image.
Reply with EXACTLY "CHAT" if they are asking questions, explaining things, or engaging in general discussion without asking for a direct image alteration.
Do not output anything else.`;

    console.log("Classifying user intent for chat message...");
    const classificationResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: classificationPrompt,
    });

    const intent = classificationResponse.text?.trim().toUpperCase();
    console.log(`Classification result: ${intent}`);

    if (intent === "EDIT" && currentStyledImage) {
      console.log(`Processing image edit for instruction: "${message}"`);
      const { mimeType, data: base64Data } = parseBase64Image(currentStyledImage);

      const editPrompt = `You are a world-class interior designer. Please edit the current styled room image to implement the user's instruction.
User's instruction: "${message}"
Make sure to keep all other furniture, walls, floor, layout, and lighting consistent with the current styled room, and ONLY apply the requested change.
Return ONLY the edited image.`;

      const editResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: editPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "4:3",
            imageSize: "1K"
          }
        }
      });

      let newImageUrl = "";
      if (editResponse.candidates?.[0]?.content?.parts) {
        for (const part of editResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            newImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!newImageUrl) {
        throw new Error("Could not modify the image design. Please rephrase your request or make it more specific.");
      }

      // Generate a detailed conversational reply explaining the update
      const replyPrompt = `You are an expert AI Interior Design Consultant.
The user wanted to modify their room: "${message}"
You have successfully generated the updated design image.
Write a warm, professional, encouraging reply to the user, explaining the visual adjustment you made and why it enhances the room's overall aesthetic.
Keep the response to 2-3 sentences.
Additionally, identify 1 or 2 new or modified items in this update (e.g., the blue rug, the plant, the new lamp).
Provide details for these new items in a JSON structure below.

Format your output EXACTLY like this:
RESPONSE_TEXT: <Your conversational reply here>

ITEMS_JSON:
[
  {
    "name": "...",
    "category": "...",
    "description": "...",
    "priceRange": "...",
    "searchQuery": "..."
  }
]`;

      const textResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: replyPrompt
      });

      const responseContent = textResponse.text || "";
      const textMatch = responseContent.match(/RESPONSE_TEXT:\s*([\s\S]*?)(?=ITEMS_JSON:|$)/i);
      const jsonMatch = responseContent.match(/ITEMS_JSON:\s*([\s\S]*)$/i);

      let replyText = textMatch ? textMatch[1].trim() : "I've successfully updated the design for you according to your request!";
      let newRecs: any[] = [];

      if (jsonMatch) {
        try {
          const rawJson = jsonMatch[1].trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
          const items = JSON.parse(rawJson);
          newRecs = items.map((item: any, idx: number) => {
            const encodedQuery = encodeURIComponent(item.searchQuery || item.name);
            return {
              id: `edit-${idx + 1}`,
              name: item.name,
              category: item.category,
              description: item.description,
              priceRange: item.priceRange,
              searchUrl: `https://www.wayfair.com/sd/?q=${encodedQuery}`
            };
          });
        } catch (e) {
          console.error("Failed to parse edit item recommendations:", e);
        }
      }

      return res.json({
        text: replyText,
        newImageUrl: newImageUrl,
        newRecommendations: newRecs
      });

    } else {
      // General CHAT query
      console.log(`Processing standard chat query: "${message}"`);
      const systemInstruction = `You are a warm, professional, and highly knowledgeable AI Interior Design Consultant.
You are helping the user makeover their room. The current active design style is "${style || 'Modern'}".
Provide expert, creative, and specific answers to their design questions.
When appropriate, suggest elements, colors, and layout ideas that make their space feel balanced and cohesive.
Offer specific product names or search terms and explain where they can search for them (like Wayfair, West Elm, Ikea, Target).
If they ask about decor items, always frame your suggestions with shoppable links in markdown format, using this exact URL format:
[Item Name on Wayfair](https://www.wayfair.com/sd/?q=search+terms) where 'search+terms' is the URL-encoded query.
Keep your answers conversational, concise, and focused on user-friendly design tips. Do not include references to code or file names.`;

      const parts: any[] = [];
      
      // Inject styled or original image as visual context if present
      if (currentStyledImage) {
        const { mimeType, data: base64Data } = parseBase64Image(currentStyledImage);
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      } else if (originalImage) {
        const { mimeType, data: base64Data } = parseBase64Image(originalImage);
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      // Format standard chat history
      const chatHistory = history || [];
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: systemInstruction,
        },
        history: chatHistory.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      });

      parts.push({ text: message });

      const response = await chat.sendMessage({
        message: parts
      });

      return res.json({
        text: response.text
      });
    }

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Failed to process chat conversation" });
  }
});

// Vite Middleware & SPA serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production files from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started. Running on port ${PORT}`);
  });
}

startServer();
