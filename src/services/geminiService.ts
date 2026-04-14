/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Generates a storyboard for a meme video based on a product description
   */
  async generateStoryboard(productDescription: string) {
    const prompt = `
      You are an expert affiliate marketer. Create a storyboard for a 15-second "Cat Meme" promotional video for the following product:
      Product: ${productDescription}
      
      The video should have 3 scenes. Each scene should feature a popular cat meme (e.g., "Crying Cat", "Happy Cat", "Huh Cat").
      Provide the output in JSON format with the following structure:
      {
        "scenes": [
          {
            "memeType": "string",
            "textOverlay": "string",
            "duration": number
          }
        ]
      }
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  }
}
