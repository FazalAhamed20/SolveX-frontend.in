
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyCGXXAvQWqvwdFzbf6pMFo1YbRdLUUtpJc');

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export async function generateQuizQuestions(topic: string, numberOfQuestions: number): Promise<QuizQuestion[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a quiz with ${numberOfQuestions} multiple-choice questions about ${topic}. 
    Each question should have 4 options. Format the response as a JSON array of objects, 
    where each object has the properties: question, options (an array of 4 strings), and correctAnswer.`;

  try {
    const result = await model.generateContent(prompt);
    console.log("result",result)
    const response = await result.response;
    const text = response.text();
    const jsonStringMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    console.log("string",jsonStringMatch);
    
    if (!jsonStringMatch) {
      throw new Error('Failed to extract JSON from the response');
    }

    const jsonString = jsonStringMatch[1];
    return JSON.parse(jsonString) as QuizQuestion[];
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
}