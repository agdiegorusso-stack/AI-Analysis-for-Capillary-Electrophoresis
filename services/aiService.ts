
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { AnalysisResult, GroundingSource } from '../types';

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 * @param file The File object to convert.
 * @returns A promise that resolves with the Part object.
 */
async function fileToGenerativePart(file: File) {
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      mimeType: file.type,
      data: base64Data,
    },
  };
}

/**
 * Extracts a JSON object from a string that may contain markdown.
 * @param str The string to parse.
 * @returns The parsed JSON object.
 */
function extractJsonFromString(str: string): any {
  const jsonMatch = str.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
  if (!jsonMatch) {
    throw new Error("No JSON block found in the AI response.");
  }
  // Use the first non-null capture group
  const jsonString = jsonMatch[1] || jsonMatch[2];
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON string:", jsonString);
    throw new Error("Invalid JSON format in the AI response.");
  }
}

/**
 * Calls the Gemini AI model to analyze a capillary electrophoresis image file.
 * @param file The image file of the sample to analyze.
 * @returns A promise that resolves with the analysis result and grounding sources.
 */
export const runAnalysis = async (file: File): Promise<{ analysis: AnalysisResult; sources: GroundingSource[] }> => {
  console.log(`Starting AI analysis for uploaded file: ${file.name}...`);

  if (!file) {
    console.error(`No file provided for analysis.`);
    throw new Error(`No file provided for analysis.`);
  }

  try {
    const imagePart = await fileToGenerativePart(file);

    const textPart = {
      text: `
        You are a world-class hematologist AI expert in interpreting capillary electrophoresis results from a Sebia Capillarys instrument. Your knowledge base is vast and includes authoritative sources like the Globin Gene Server (HbVar - globin.bx.psu.edu) and Bio-Rad's hemoglobinopathy resources.

        Analyze the provided electropherogram image. Use your Google Search tool to ground your findings in the latest medical information and guidelines.

        Your analysis must be meticulous. Pay close attention to:
        1.  The migration position of every peak in all zones.
        2.  The percentage value of each peak.
        3.  The shape of each peak (e.g., sharp, broad, split).
        4.  The overall pattern compared to a normal profile.

        Your response MUST contain a single, valid JSON object that strictly conforms to the following structure. Do not include any other text outside the JSON block.

        {
          "summary": "A concise, one-line diagnostic summary. If a rare variant is suspected, mention it here.",
          "interpretation": "A detailed paragraph explaining your findings. Describe the significant peaks, their characteristics, and what they indicate. Correlate your findings with known variants. Explain the likely condition.",
          "confidence": 99.5,
          "peaks": [
            {
              "name": "Hemoglobin Fraction (e.g., HbA2)",
              "value": 3.5,
              "normalRange": "2.5 - 3.5",
              "isAbnormal": false
            }
          ],
          "recommendations": "Suggest brief, appropriate next steps. If a rare variant is suspected, recommend specific confirmatory tests."
        }
      `,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [imagePart, textPart] }],
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.1, // Use a very low temperature for clinical consistency
      },
    });

    console.log('AI analysis complete. Parsing response.');
    const analysisData = extractJsonFromString(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingSource[] || [];
    
    console.log('Grounding sources found:', sources);

    return { analysis: analysisData, sources: sources };
  } catch (error) {
    console.error("An error occurred during AI analysis:", error);
    // Re-throw a more user-friendly error.
    throw new Error("Failed to get a valid analysis from the AI model. Please try again.");
  }
};
