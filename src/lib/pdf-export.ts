import { jsPDF } from "jspdf";
import type { AnalyzeApiResponse } from "./types";

export type PDFExportData = {
  repo: AnalyzeApiResponse["repo"];
  scores: AnalyzeApiResponse["scores"];
  languages: Record<string, number>;
  techStack: Array<{ name: string; category: string; confidence: number }>;
  aiSummary: string;
  learningRecommendations: string[];
  license?: string | null;
  contributors?: Array<{ login: string; contributions: number }>;
};

export class PDFExporter {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin = 20;
  private currentY = 20;
  private readonly lineHeight = 7;
  private readonly primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  private readonly textColor: [number, number, number] = [31, 41, 55]; // Gray-800
  private readonly secondaryColor: [number, number, number] = [107, 114, 128]; // Gray-500

  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private addNewPageIfNeeded(requiredSpace: number = 20): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private addText(
    text: string,
    fontSize: number = 10,
    fontStyle: "normal" | "bold" = "normal",
    color: [number, number, number] = this.textColor,
    maxWidth?: number
  ): void {
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", fontStyle);
    this.doc.setTextColor(color[0], color[1], color[2]);

    const width = maxWidth || this.pageWidth - 2 * this.margin;
    const lines = this.doc.splitTextToSize(text, width);

    for (const line of lines) {
      this.addNewPageIfNeeded();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addHeader(): void {
    // Title
    this.doc.setFillColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    this.doc.rect(0, 0, this.pageWidth, 40, "F");

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("GitStack Radar", this.margin, 20);

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Repository Analysis Report", this.margin, 30);

    this.currentY = 50;
  }

  private addMetadata(generatedDate: string): void {
    this.addNewPageIfNeeded(15);

    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
    this.doc.text(`Generated: ${generatedDate}`, this.margin, this.currentY);

    this.currentY += 15;
  }

  private addSection(title: string): void {
    this.addNewPageIfNeeded(15);

    // Section divider line
    this.doc.setDrawColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);

    this.currentY += 5;

    // Section title
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    this.doc.text(title, this.margin, this.currentY);

    this.currentY += 10;
  }

  private addKeyValue(key: string, value: string | number, indent: number = 0): void {
    this.addNewPageIfNeeded();

    const xPos = this.margin + indent;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(this.textColor[0], this.textColor[1], this.textColor[2]);
    this.doc.text(`${key}:`, xPos, this.currentY);

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);

    const keyWidth = this.doc.getTextWidth(`${key}: `);
    const maxValueWidth = this.pageWidth - 2 * this.margin - keyWidth - indent;
    const valueLines = this.doc.splitTextToSize(String(value), maxValueWidth);

    this.doc.text(valueLines[0], xPos + keyWidth, this.currentY);
    this.currentY += this.lineHeight;

    for (let i = 1; i < valueLines.length; i++) {
      this.addNewPageIfNeeded();
      this.doc.text(valueLines[i], xPos + keyWidth, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addBulletPoint(text: string, indent: number = 5): void {
    this.addNewPageIfNeeded();

    const xPos = this.margin + indent;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(this.textColor[0], this.textColor[1], this.textColor[2]);

    // Add bullet
    this.doc.circle(xPos - 2, this.currentY - 1.5, 0.8, "F");

    // Add text
    const maxWidth = this.pageWidth - 2 * this.margin - indent - 5;
    const lines = this.doc.splitTextToSize(text, maxWidth);

    for (let i = 0; i < lines.length; i++) {
      if (i > 0) this.addNewPageIfNeeded();
      this.doc.text(lines[i], xPos + 3, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addScoreBar(label: string, score: number | string, color: [number, number, number]): void {
    this.addNewPageIfNeeded(12);

    const barWidth = 120;
    const barHeight = 8;
    const xPos = this.margin;

    // Label
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(this.textColor[0], this.textColor[1], this.textColor[2]);
    this.doc.text(label, xPos, this.currentY);

    // Score value
    this.doc.setFont("helvetica", "normal");
    const scoreText = typeof score === "number" ? `${score}` : score;
    this.doc.text(scoreText, xPos + barWidth + 15, this.currentY);

    this.currentY += 3;

    // Background bar
    this.doc.setFillColor(229, 231, 235); // Gray-200
    this.doc.roundedRect(xPos, this.currentY, barWidth, barHeight, 2, 2, "F");

    // Score bar
    const scoreValue = typeof score === "number" ? score : parseFloat(String(score));
    const fillWidth = (barWidth * Math.min(100, Math.max(0, scoreValue))) / 100;
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.roundedRect(xPos, this.currentY, fillWidth, barHeight, 2, 2, "F");

    this.currentY += barHeight + 8;
  }

  private addFooter(): void {
    const totalPages = this.doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);

      this.doc.setDrawColor(229, 231, 235);
      this.doc.setLineWidth(0.3);
      this.doc.line(
        this.margin,
        this.pageHeight - 15,
        this.pageWidth - this.margin,
        this.pageHeight - 15
      );

      this.doc.setFontSize(8);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
      this.doc.text(
        "Generated by GitStack Radar",
        this.margin,
        this.pageHeight - 10
      );

      this.doc.text(
        `Page ${i} of ${totalPages}`,
        this.pageWidth - this.margin - 20,
        this.pageHeight - 10
      );
    }
  }

  public generatePDF(data: PDFExportData): Blob {
    const generatedDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Header
    this.addHeader();
    this.addMetadata(generatedDate);

    // Repository Information
    this.addSection("Repository Information");
    this.addKeyValue("Repository Name", data.repo.fullName || data.repo.name);

    if (data.repo.description) {
      this.addKeyValue("Description", data.repo.description);
    }

    this.addKeyValue("Primary Language", data.repo.language || "N/A");
    this.addKeyValue("Stars", data.repo.stars.toLocaleString());
    this.addKeyValue("Forks", data.repo.forks.toLocaleString());
    this.addKeyValue("Open Issues", data.repo.openIssuesCount.toLocaleString());
    this.addKeyValue("Repository Size", `${(data.repo.size / 1024).toFixed(2)} MB`);

    if (data.license) {
      this.addKeyValue("License", data.license);
    }

    const lastUpdated = new Date(data.repo.pushedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    this.addKeyValue("Last Updated", lastUpdated);

    if (data.repo.topics && data.repo.topics.length > 0) {
      this.addKeyValue("Topics", data.repo.topics.join(", "));
    }

    this.currentY += 5;

    // Analysis Scores
    this.addSection("Analysis Scores");

    this.addScoreBar("Health Score", data.scores.healthScore, [34, 197, 94]); // Green
    this.addScoreBar("Activity Score", data.scores.activityScore, [59, 130, 246]); // Blue
    this.addScoreBar("Complexity Score", data.scores.complexityScore, [168, 85, 247]); // Purple

    // Risk score (lower is better)
    const riskValue = typeof data.scores.riskScore === "number"
      ? data.scores.riskScore
      : parseFloat(String(data.scores.riskScore).replace("%", ""));
    const riskColor: [number, number, number] =
      riskValue < 30 ? [34, 197, 94] : riskValue < 60 ? [251, 191, 36] : [239, 68, 68];
    this.addScoreBar("Risk Level", `${riskValue}%`, riskColor);

    this.currentY += 5;

    // Technology Stack
    if (data.techStack && data.techStack.length > 0) {
      this.addSection("Technology Stack");

      const categories = ["Languages", "Frontend", "Backend", "Database", "DevOps", "Testing"];
      const stackByCategory = categories.reduce((acc, cat) => {
        acc[cat] = data.techStack.filter((t) => t.category === cat);
        return acc;
      }, {} as Record<string, typeof data.techStack>);

      for (const category of categories) {
        const items = stackByCategory[category];
        if (items && items.length > 0) {
          this.addKeyValue(category, "");
          items.slice(0, 10).forEach((tech) => {
            this.addBulletPoint(`${tech.name} (${tech.confidence}% confidence)`, 10);
          });
          this.currentY += 2;
        }
      }

      this.currentY += 3;
    }

    // Languages
    if (data.languages && Object.keys(data.languages).length > 0) {
      this.addSection("Programming Languages");

      const sortedLanguages = Object.entries(data.languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      const totalBytes = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);

      sortedLanguages.forEach(([lang, bytes]) => {
        const percentage = ((bytes / totalBytes) * 100).toFixed(1);
        this.addBulletPoint(`${lang}: ${percentage}%`);
      });

      this.currentY += 5;
    }

    // Top Contributors
    if (data.contributors && data.contributors.length > 0) {
      this.addSection("Top Contributors");

      data.contributors.slice(0, 10).forEach((contributor) => {
        this.addBulletPoint(
          `${contributor.login} - ${contributor.contributions.toLocaleString()} contribution${contributor.contributions === 1 ? "" : "s"}`
        );
      });

      this.currentY += 5;
    }

    // AI Summary
    if (data.aiSummary) {
      this.addSection("AI Analysis Summary");
      this.addText(data.aiSummary, 10, "normal", this.textColor);
      this.currentY += 5;
    }

    // Learning Recommendations
    if (data.learningRecommendations && data.learningRecommendations.length > 0) {
      this.addSection("Recommendations");

      data.learningRecommendations.forEach((rec) => {
        this.addBulletPoint(rec);
      });

      this.currentY += 5;
    }

    // Footer
    this.addFooter();

    return this.doc.output("blob");
  }

  public static getFileName(repoName: string): string {
    const sanitized = repoName.replace(/[^a-zA-Z0-9-_]/g, "-");
    return `GitStack-Radar-${sanitized}.pdf`;
  }
}
