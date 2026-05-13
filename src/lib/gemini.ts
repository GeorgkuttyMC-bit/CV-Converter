import { GoogleGenAI, Type, Schema } from '@google/genai';
import { CVData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const cvSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personal: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        role: { type: Type.STRING, description: "Professional title or role" },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        summary: { type: Type.STRING, description: "A creative, compelling professional summary (revised for impact)" },
        website: { type: Type.STRING }
      },
      required: ["name", "role", "email", "summary"]
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique random string ID" },
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          highlights: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Action-oriented bullet points"
          }
        },
        required: ["id", "company", "position", "startDate", "endDate", "highlights"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique random string ID" },
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          date: { type: Type.STRING }
        },
        required: ["id", "institution", "degree", "date"]
      }
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["personal", "experience", "education", "skills"]
};

export async function parseCVFile(file: File): Promise<CVData> {
  const base64Data = await fileToBase64(file);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Data.split(',')[1],
              mimeType: file.type
            }
          },
          {
            text: `Extract the resume data from the uploaded document. 
            Additionally, act as an expert resume writer:
            1. Enhance the professional summary to be more creative and impactful.
            2. Rewrite the experience bullet points to be action-oriented and highlight achievements.
            3. Organize the skills logically.
            Ensure the output strictly matches the provided JSON schema.`
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: cvSchema,
      temperature: 0.7,
    }
  });

  if (!response.text) {
    throw new Error("Failed to parse document");
  }

  const rawText = response.text;
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
  }

  return JSON.parse(cleanText) as CVData;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
