import { GoogleGenAI } from "@google/genai";

// This function will be deployed as a serverless function.
// It is the backend proxy that securely handles the API key.
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Allow': 'POST' },
    });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // This error is for the server logs, the client will see a generic message.
      console.error("API_KEY environment variable is not set.");
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const fullPrompt = `A minimalist HD wallpaper, modern aesthetic, ${prompt}, vibrant colors, clean, simple, high resolution, aesthetic, 4k`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      return new Response(JSON.stringify({ imageUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'No image was generated. The response may have been blocked due to safety policies.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error("Error in generate function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    
    if (errorMessage.includes('API key not valid')) {
        return new Response(JSON.stringify({ error: "The application's API key is invalid. Please contact the administrator." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
     if (errorMessage.includes('blocked') || errorMessage.includes('SAFETY')) {
        return new Response(JSON.stringify({ error: "The generation request was blocked due to safety settings. Please try a different prompt." }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
