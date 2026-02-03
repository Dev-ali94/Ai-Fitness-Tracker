import { GoogleGenAI } from "@google/genai";
import fs from "fs";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const analyzeImage = async (filePath) => {
    try {
        const base64ImageFile = fs.readFileSync(filePath, {
            encoding: "base64",
        });

        const contents = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64ImageFile,
                },
            },
            {
                text: "Extract the food name and estimated calories from this image in JSON object.",
            },
        ];

        const config = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    calories: { type: "number" },
                },
            },
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: config,
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Image analysis error:", error);
        throw error;
    }
};
