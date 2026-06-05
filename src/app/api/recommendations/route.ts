import { NextResponse } from "next/server";
import { findSimilarRepositories } from "@/lib/recommendations";
import { detectTechStack } from "@/lib/tech-stack";
import type { RepoData, TechSignals } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { repo, techSignals } = await request.json();
    
    if (!repo) {
      return NextResponse.json(
        { error: "Repository data is required" },
        { status: 400 }
      );
    }
    
    const token = process.env.GITHUB_PAT;
    
    // Detect tech stack if signals provided
    let techStack = undefined;
    if (techSignals) {
      techStack = detectTechStack(techSignals, {
        primaryLanguage: repo.language,
        topics: repo.topics,
        languages: {}, // Not needed for recommendations
        description: repo.description,
      });
    }
    
    // Find similar repositories
    const result = await findSimilarRepositories(
      repo as RepoData,
      techStack,
      token
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
