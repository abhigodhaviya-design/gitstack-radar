import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { repo } = await request.json();
    if (!repo) {
      return NextResponse.json({ error: "Repository is required" }, { status: 400 });
    }

    // Step 1: Fetch README from GitHub
    const token = process.env.GITHUB_PAT;
    const readmeRes = await fetch(`https://api.github.com/repos/${repo}/readme`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/vnd.github.raw+json",
      },
    });

    if (readmeRes.status === 404) {
      return NextResponse.json({ error: "No README found" }, { status: 404 });
    }

    if (!readmeRes.ok) {
      return NextResponse.json({ error: "Failed to fetch README" }, { status: 500 });
    }

    const readmeText = await readmeRes.text();
    const truncated = readmeText.slice(0, 4000);

    const prompt = `You are a developer documentation expert. Analyze this GitHub README and evaluate its quality.

README content:
${truncated}

Respond ONLY with a valid JSON object. No markdown. No backticks. No explanation. Exactly this shape:
{
  "qualityScore": <number 0-100>,
  "grade": "<A+|A|B|C|D|F>",
  "wordCount": <number>,
  "hasInstallInstructions": <true|false>,
  "hasUsageExamples": <true|false>,
  "hasContributingGuide": <true|false>,
  "hasLicense": <true|false>,
  "hasBadges": <true|false>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "summary": "2 sentence summary of what this README covers and its overall quality"
}`;

    // Use Groq API with detailed error messages
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!groqKey) {
      console.error("GROQ_API_KEY not configured");
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert software engineering analyst. Always respond with valid JSON only. No markdown. No backticks. No explanation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      console.error("Groq API error:", errorText);
      
      // Check for rate limit
      if (errorData.error?.code === "rate_limit_exceeded") {
        return NextResponse.json({ 
          error: "AI rate limit reached. Please wait a few minutes and try again." 
        }, { status: 429 });
      }
      
      return NextResponse.json({ 
        error: "README analysis temporarily unavailable" 
      }, { status: 500 });
    }

    const data = await groqRes.json();
    let text = data.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({ error: "AI analysis unavailable" }, { status: 500 });
    }

    // Strip accidental markdown backticks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      console.error("JSON parse error:", text);
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }
  } catch (error) {
    console.error("README Route Error:", error);
    return NextResponse.json({ error: "AI analysis unavailable" }, { status: 500 });
  }
}
