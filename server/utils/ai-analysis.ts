import axios from "axios";

export interface AIAnalysisResult {
  category: string;
  urgency: string;
  sentiment: string;
  summary: string;
}

const ANALYSIS_PROMPT = `You are an AI assistant for a university grievance redressal system.
Given a student complaint:
1. Categorize the issue into Hostel, Academics, Mess, Infrastructure, Safety, Health, or Other.
2. Determine urgency: Low, Medium, or High.
3. Detect sentiment: Neutral, Angry, or Distressed.
4. Summarize the issue in 2–3 concise lines for administrators.
Return ONLY valid JSON in the format:
{
  "category": "string",
  "urgency": "string",
  "sentiment": "string",
  "summary": "string"
}`;

/**
 * Generate mock AI analysis for testing/fallback purposes
 */
function generateMockAnalysis(complaint: string): AIAnalysisResult {
  // Simple rule-based mock analysis
  const lowerComplaint = complaint.toLowerCase();

  let category = "Other";
  if (
    lowerComplaint.includes("hostel") ||
    lowerComplaint.includes("dorm") ||
    lowerComplaint.includes("room")
  ) {
    category = "Hostel";
  } else if (
    lowerComplaint.includes("class") ||
    lowerComplaint.includes("exam") ||
    lowerComplaint.includes("grade") ||
    lowerComplaint.includes("academic")
  ) {
    category = "Academics";
  } else if (
    lowerComplaint.includes("mess") ||
    lowerComplaint.includes("food") ||
    lowerComplaint.includes("canteen") ||
    lowerComplaint.includes("meal")
  ) {
    category = "Mess";
  } else if (
    lowerComplaint.includes("lab") ||
    lowerComplaint.includes("library") ||
    lowerComplaint.includes("building") ||
    lowerComplaint.includes("infrastructure") ||
    lowerComplaint.includes("facility")
  ) {
    category = "Infrastructure";
  } else if (
    lowerComplaint.includes("safety") ||
    lowerComplaint.includes("safe") ||
    lowerComplaint.includes("security") ||
    lowerComplaint.includes("guard")
  ) {
    category = "Safety";
  } else if (
    lowerComplaint.includes("health") ||
    lowerComplaint.includes("medical") ||
    lowerComplaint.includes("sick") ||
    lowerComplaint.includes("doctor")
  ) {
    category = "Health";
  }

  let urgency = "Low";
  if (
    lowerComplaint.includes("urgent") ||
    lowerComplaint.includes("critical") ||
    lowerComplaint.includes("emergency") ||
    lowerComplaint.includes("immediate")
  ) {
    urgency = "High";
  } else if (
    lowerComplaint.includes("important") ||
    lowerComplaint.includes("serious")
  ) {
    urgency = "Medium";
  }

  let sentiment = "Neutral";
  if (
    lowerComplaint.includes("angry") ||
    lowerComplaint.includes("furious") ||
    lowerComplaint.includes("outraged") ||
    lowerComplaint.includes("disgusted") ||
    lowerComplaint.includes("hate")
  ) {
    sentiment = "Angry";
  } else if (
    lowerComplaint.includes("distressed") ||
    lowerComplaint.includes("upset") ||
    lowerComplaint.includes("worried") ||
    lowerComplaint.includes("concerned") ||
    lowerComplaint.includes("anxious")
  ) {
    sentiment = "Distressed";
  }

  const summaryStart = complaint.substring(0, 120);
  const summary =
    summaryStart.length < complaint.length
      ? summaryStart + "..."
      : summaryStart;

  return {
    category,
    urgency,
    sentiment,
    summary,
  };
}

/**
 * Analyze grievance using Google Gemini API
 */
async function analyzeWithGemini(
  complaint: string,
): Promise<AIAnalysisResult | null> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.warn(
      "Gemini API key not configured, falling back to mock analysis",
    );
    return null;
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${ANALYSIS_PROMPT}\n\nStudent Complaint: "${complaint}"`,
              },
            ],
          },
        ],
      },
      {
        timeout: 10000,
      },
    );

    const responseText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.warn("Invalid response from Gemini API");
      return null;
    }

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not extract JSON from Gemini response");
      return null;
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (
      !analysis.category ||
      !analysis.urgency ||
      !analysis.sentiment ||
      !analysis.summary
    ) {
      console.warn("Gemini response missing required fields");
      return null;
    }

    return analysis as AIAnalysisResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}

/**
 * Main function to analyze a grievance
 * Attempts Gemini API first, falls back to mock analysis
 */
export async function analyzeGrievance(
  complaint: string,
): Promise<AIAnalysisResult> {
  try {
    // Try Gemini API first
    const geminiResult = await analyzeWithGemini(complaint);
    if (geminiResult) {
      console.log("Using Gemini API analysis");
      return geminiResult;
    }

    // Fall back to mock analysis
    console.log("Using mock AI analysis");
    return generateMockAnalysis(complaint);
  } catch (error) {
    console.error("Error in AI analysis pipeline:", error);
    // Ensure we always return valid mock data
    return generateMockAnalysis(complaint);
  }
}
