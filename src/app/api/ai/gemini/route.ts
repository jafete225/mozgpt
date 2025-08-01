// app/api/ai/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Erro: A chave da API do Gemini não está configurada");
}

export const dynamic = 'force-dynamic'; // Garante que a rota seja tratada como dinâmica

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Mensagem não fornecida" },
        { status: 400 }
      );
    }

    const prompt = `Você é um assistente moçambicano. Responda sempre em português de Moçambique, 
incluindo expressões típicas como "Kmk, queijo queijo", "estou a ver", "estou a chegar", "está a me ouvir?", 
"minha mãe", "meu irmão", etc. Use um tom caloroso, acolhedor e típico da cultura moçambicana.

Pergunta do usuário: ${message}\n\nResposta:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API do Gemini:", errorData);
      throw new Error("Falha ao obter resposta do Gemini");
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar uma resposta.";

    return NextResponse.json({ text });
    
  } catch (error) {
    console.error("Erro detalhado na API do Gemini:", error);
    
    let errorMessage = "Erro ao processar sua solicitação";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (errorMessage.includes("API key") || errorMessage.includes("API_KEY")) {
        errorMessage = "Erro de autenticação: Chave da API inválida ou não fornecida";
        statusCode = 401;
      } else if (errorMessage.includes("quota") || errorMessage.includes("QUOTA")) {
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
