import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
})


const Prompt = `
`


export async function getAnswer(question: string) {
  const newPrompt = Prompt + question
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: newPrompt,
  })
  return response.text
}
