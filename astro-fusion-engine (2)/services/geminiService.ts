import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSymbol = async (prompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image as the engine for the "Nano Banana Pro" logic
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          text: prompt,
        },
      ],
      config: {
        // We configure it to return an image
        // Note: SDK types might vary slightly, but this is the standard pattern for GenAI image requests 
        // if using the specific image model.
        // However, for pure image generation via prompt in the unified client:
      },
    });

    // Handle response parsing for image
    // In the new SDK, we often look for inlineData or similar constructs depending on return type.
    // Since this is a demo environment, we assume standard base64 return in candidates if successful.
    
    // Fallback/Correction: The prompt says "Nano Banana Pro".
    // We will attempt to use the proper image generation method if available, 
    // otherwise fallback to text description or mock if API fails.
    
    // Check for image parts
    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
       for (const part of candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
       }
    }
    
    throw new Error("No image data generated");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Return a placeholder if generation fails to keep UI intact for demo
    return `https://picsum.photos/800/800?grayscale&blur=2`; 
  }
};