export async function POST(request) {
    const { message, personality } = await request.json();
    // ... your Gemini API code with GEMINI_API_KEY ...
    return Response.json({ reply: "I am JARVIS..." });
}