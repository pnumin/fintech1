import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });
const model = 'gemini-2.5-flash';

/**
 * Fetches a definition for a financial term from the Gemini API.
 * @param term The financial term to look up.
 * @returns A string containing the definition and explanation.
 */
export const getFinancialTermDefinition = async (term: string): Promise<string> => {
  const prompt = `'${term}'라는 금융 용어에 대해 자세히 설명해줘. 이 용어의 정의, 중요성, 그리고 실생활에서의 사용 예시를 포함해서 초보자도 쉽게 이해할 수 있도록 설명해줘. 답변은 마크다운 형식으로 보기 좋게 정리해줘. 예를 들어, 중요한 부분은 **굵은 글씨**로 강조해줘.`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    
    if (response && response.text) {
      return response.text;
    } else {
      throw new Error("API로부터 유효한 응답을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Provide a user-friendly error message
    throw new Error("AI 서비스와 통신하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};

/**
 * Summarizes the provided text to be under 500 characters.
 * @param text The text to summarize.
 * @returns A summarized string with markdown.
 */
export const summarizeDefinition = async (text: string): Promise<string> => {
  const prompt = `다음 텍스트를 500자 이내로 요약해줘. 원문의 핵심 내용을 유지하면서 초보자도 이해하기 쉽게 간결하게 만들어줘. 중요한 용어나 문장은 **굵은 글씨**를 사용하는 마크다운 형식을 사용해줘.\n\n---텍스트 시작---\n${text}\n---텍스트 끝---`;

  try {
      const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
      });

      if (response && response.text) {
          return response.text;
      } else {
          throw new Error("요약 API로부터 유효한 응답을 받지 못했습니다.");
      }
  } catch (error) {
      console.error("Gemini API call for summarization failed:", error);
      throw new Error("AI 서비스에서 요약 정보를 생성하는 중 오류가 발생했습니다.");
  }
};
