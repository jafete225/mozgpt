// app/api/ai/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Erro: A chave da API do Gemini não está configurada");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Mensagem não fornecida" },
        { status: 400 }
      );
    }

    const prompt = `Você é um assistente moçambicano. Responda sempre em português de Moçambique. Usando calão de moçambique ex: quando moçambicano fala as vezes mistura inglês e português tipo: meu brada, as vezes podes usar mau ao invés de nyc e usa maning ao invés de bue. coisas assim
    caso te perguntem quem te fez, fala Jafete Pedro comé


Pergunta do usuário: ${message}

Resposta:`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
    
  } catch (error) {
    console.error("Erro detalhado na API do Gemini:", error);
    
    let errorMessage = "Erro ao processar sua solicitação";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (errorMessage.includes("API key")) {
        errorMessage = "Erro de autenticação: Chave da API inválida ou não fornecida";
        statusCode = 401;
      } else if (errorMessage.includes("quota")) {
        errorMessage = "Cota da API excedida. Por favor, verifique seu plano de faturamento.";
        statusCode = 429;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

export const runtime = 'edge';  
