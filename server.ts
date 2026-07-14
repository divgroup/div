import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies with generous limits
app.use(express.json({ limit: "50mb" }));

// Lazy initialization of GoogleGenAI client to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in the Settings > Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 2. Route to brainstorm or generate a complete digital card profile using Gemini
app.post("/api/generate-profile", async (req, res) => {
  try {
    const { jobTitle, company, industry, vibe = "professional", textModel = "gemini-3.5-flash" } = req.body;

    if (!jobTitle || !jobTitle.trim()) {
      return res.status(400).json({ error: "Please enter your job title or specialty." });
    }

    const ai = getGenAI();

    const systemInstruction = `You are an elite career coach, personal branding expert, and senior copywriter.
Your goal is to write custom branding copy for a high-converting Digital Business Card / NFC Profile Page based on a user's job title, company, industry, and branding vibe.

CRITICAL: All generated output (headline, bio, tags, avatarPrompt) MUST be written in Vietnamese (tiếng Việt).

Vibe descriptions:
- "professional": Corporate, polished, trustworthy, senior, highly competent.
- "creative": Bold, avant-garde, imaginative, breaking standard patterns.
- "technical": Tech-focused, precise, detail-oriented, analytical, engineer/developer style.
- "warm": Approachable, customer-centric, friendly, community-builder, coach/mentor.
- "minimal": Ultra-concise, high-impact, clean, elegant, high-status.

Generate a comprehensive profile payload in standard JSON format containing:
- "headline": A highly memorable, value-driven tagline in Vietnamese (1 sentence).
- "bio": A persuasive personal biography in Vietnamese (2-3 sentences) summarizing their core mission, key expertise, and how they help others.
- "tags": An array of 4-6 core skills, industries, or focus topics in Vietnamese.
- "theme": Suggest the single best aesthetic theme from these options: "slate", "emerald", "terracotta", "ocean", "amber", "purple".
- "avatarPrompt": A highly descriptive text prompt in Vietnamese (or English if style terms are better, but describe the persona in Vietnamese) to generate a gorgeous, studio-quality professional headshot avatar matching their industry and vibe (e.g., "Chân dung chân thực chụp trong studio chuyên nghiệp, ánh sáng ấm áp, hậu cảnh tối giản, sắc nét...").`;

    const prompt = `Create a high-impact digital business card profile in Vietnamese for:
Job Title: "${jobTitle}"
Company: "${company || "Tự do / Tự kinh doanh"}"
Industry: "${industry || "Công nghệ & Kinh doanh"}"
Vibe: "${vibe}"

Respond with valid JSON matching the system instruction. Ensure there is no markdown enclosing the JSON itself.`;

    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "Memorable tagline (max 120 characters)" },
            bio: { type: Type.STRING, description: "Biography (2-3 sentences)" },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-6 skill or specialty tags"
            },
            theme: { type: Type.STRING, description: "Suggested theme name: slate, emerald, terracotta, ocean, amber, or purple" },
            avatarPrompt: { type: Type.STRING, description: "A high-fidelity prompt to generate a matching avatar image" }
          },
          required: ["headline", "bio", "tags", "theme", "avatarPrompt"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(response.text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error in generate-profile:", error);
    res.status(500).json({ error: error.message || "Failed to generate profile" });
  }
});

// 3. Route to rewrite or improve a bio using Gemini
app.post("/api/improve-bio", async (req, res) => {
  try {
    const { currentBio, instruction, vibe = "professional", textModel = "gemini-3.5-flash" } = req.body;

    if (!currentBio || !currentBio.trim()) {
      return res.status(400).json({ error: "Please enter a current bio to improve." });
    }

    const ai = getGenAI();

    const systemInstruction = `You are a professional editor and copywriter.
The user has a bio for their digital business card and wants to refine or improve it based on a specific instruction or style.
Apply the edit instruction strictly, maintaining the branding tone. 

CRITICAL: Return the improved biography in Vietnamese (tiếng Việt).
Return ONLY the new bio text. No introductions, explanations, or wrapper markdown.`;

    const prompt = `Current Biography:
"""
${currentBio}
"""

Refinement Instruction (Instruction is in Vietnamese or English, please fulfill it in Vietnamese): "${instruction || "Làm cho tiểu sử chuyên nghiệp, súc tích và rõ ràng hơn."}"
Branding Vibe: "${vibe}"

New biography in Vietnamese:`;

    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    if (!response.text) {
      throw new Error("No response received from Gemini.");
    }

    res.json({ improvedBio: response.text.trim() });
  } catch (error: any) {
    console.error("Error in improve-bio:", error);
    res.status(500).json({ error: error.message || "Failed to refine biography." });
  }
});

// 3. Route to generate a specific image
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, model = "gemini-3.1-flash-image", aspectRatio = "1:1", size = "1K" } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Image prompt is required." });
    }

    const ai = getGenAI();

    // Map model names safely to match SKILL guidelines
    let resolvedModel = "gemini-3.1-flash-image";
    if (model.includes("gemini-3-pro-image") || model.includes("gemini-3-pro-image-preview")) {
      resolvedModel = "gemini-3-pro-image";
    } else if (model.includes("gemini-3.1-flash-lite-image")) {
      resolvedModel = "gemini-3.1-flash-lite-image";
    } else if (model.includes("gemini-3.1-flash-image")) {
      resolvedModel = "gemini-3.1-flash-image";
    }

    const config: any = {};
    if (resolvedModel !== "gemini-3.1-flash-lite-image") {
      config.imageConfig = {
        aspectRatio,
        imageSize: size // "512px", "1K", "2K", "4K"
      };
    } else {
      config.imageConfig = {
        aspectRatio // Supported: "1:1", "3:4", "4:3", "9:16", "16:9"
      };
    }

    const response = await ai.models.generateContent({
      model: resolvedModel,
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config
    });

    let base64Image = "";

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No image data returned by the model. Check that your prompt doesn't violate generation safety standards.");
    }

    const imageUrl = `data:image/png;base64,${base64Image}`;
    res.json({ imageUrl });
  } catch (error: any) {
    console.error("Error in generate-image:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

// 4. Setup Vite Middleware or Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
