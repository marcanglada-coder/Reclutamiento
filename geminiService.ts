import { GoogleGenAI } from "@google/genai";

export const analyzeCandidate = async (candidateData: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza el siguiente perfil de transportista para una empresa de logística en Barcelona. Resume su idoneidad para el sector FARMA (frío) o multi-sector. Datos: ${JSON.stringify(candidateData)}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al analizar candidato.";
  }
};

export const generateMarketingText = async (sector: string, channel: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un texto persuasivo para ${channel} para captar transportistas autónomos en Barcelona para el sector ${sector}. Sé profesional, directo y destaca la estabilidad.`,
    });
    return response.text;
  } catch (error) {
    return "No se pudo generar el texto.";
  }
};