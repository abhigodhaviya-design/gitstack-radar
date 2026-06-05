import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repo, scores, commits, contributors, languages } = body;

    const fullName = repo?.fullName || "Unknown";
    const description = repo?.description || "No description provided.";
    const language = repo?.language || "N/A";
    const stars = repo?.stars || 0;
    const forks = repo?.forks || 0;
    const openIssuesCount = repo?.openIssuesCount || 0;
    const topics = repo?.topics?.length > 0 ? repo.topics.join(", ") : "None";
    const pushedAt = repo?.pushedAt || "Unknown";

    const healthScore = scores?.healthScore || 0;
    const activityScore = scores?.activityScore || 0;
    const complexityScore = scores?.complexityScore || 0;
    const riskScore = scores?.riskScore || 0;

    const commitMessages = (commits || []).slice(0, 10).map((c: any) => c.message).join(" | ");
    const topContributors = (contributors || []).slice(0, 5).map((c: any) => c.login).join(", ");
    const languageKeys = Object.keys(languages || {}).join(", ");

    const prompt = `You are a senior software engineering analyst. Analyze this GitHub repository and provide insights.

Repository: ${fullName}
Description: ${description}
Primary Language: ${language}
Stars: ${stars} | Forks: ${forks}
Open Issues: ${openIssuesCount}
Topics: ${topics}
Last Push: ${pushedAt}

Health Score: ${healthScore}/100
Activity Score: ${activityScore}/100
Complexity Score: ${complexityScore}/100
Risk Score: ${riskScore}/100

Recent commits (last 10): ${commitMessages}
Top contributors: ${topContributors}
Languages used: ${languageKeys}

Respond ONLY with a valid JSON object. No markdown. No explanation. No backticks. Exactly this shape:
{
  "summary": "2-3 sentence overall assessment of this repository",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "risks": ["risk 1", "risk 2"],
  "recommendation": "1 sentence actionable recommendation for a developer considering using or contributing to this repo"
}`;

    // Use Groq API with detailed error messages
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!groqKey) {
      console.error("GROQ_API_KEY not configured");
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    if (!response.ok) {
      const errorText = await response.text();
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
        error: "AI analysis temporarily unavailable" 
      }, { status: 500 });
    }

    const data = await response.json();
    let text = data.choices[0].message.content;

    if (!text) {
      throw new Error("No text returned from Groq");
    }

    // Strip any accidental markdown backticks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, text);
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }
  } catch (error) {
    console.error("Insights Route Error:", error);
    return NextResponse.json({ error: "AI analysis unavailable" }, { status: 500 });
  }
}
