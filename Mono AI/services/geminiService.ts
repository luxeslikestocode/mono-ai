
// This service now acts as a client to our own backend endpoint.
// It no longer directly interacts with the Google GenAI SDK.
export const generateWallpaper = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the server responded with an error, throw it to be caught by the UI.
      // The error message comes from our own backend's JSON response.
      throw new Error(data.error || 'An unknown error occurred.');
    }

    if (!data.imageUrl) {
        throw new Error('The response from the server was invalid.');
    }

    return data.imageUrl;

  } catch (error) {
    console.error("Error calling generation service:", error);
    // Re-throw the error to be handled by the component's state.
    // This allows UI to display specific error messages.
    if (error instanceof Error) {
        // Add a fallback for network errors etc. that don't come from our API.
        throw new Error(error.message || 'Failed to connect to the generation service.');
    }
    throw new Error('An unknown error occurred while communicating with the server.');
  }
};
