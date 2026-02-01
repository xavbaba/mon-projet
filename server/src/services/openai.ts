import OpenAI from "openai";
import fs from "fs";

let _openai: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export interface ObjectAnalysis {
  name: string;
  epoch: string;
  usage: string;
  estimatedValue: string;
  description: string;
}

export async function analyzeObjectImage(
  imagePath: string
): Promise<ObjectAnalysis> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const mimeType = "image/jpeg";

  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyse cet objet et réponds en JSON strict avec les champs suivants :
- "name": nom de l'objet (en français)
- "epoch": époque ou période estimée (ex: "XIXe siècle", "Années 1950")
- "usage": usage ou fonction de l'objet
- "estimatedValue": estimation de la valeur marchande (fourchette en euros, ex: "50 - 150 €")
- "description": description détaillée de l'objet (matériaux, style, état apparent)

Réponds UNIQUEMENT avec le JSON, sans markdown ni texte autour.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  // Strip markdown code fences if present
  const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  return JSON.parse(cleaned) as ObjectAnalysis;
}
