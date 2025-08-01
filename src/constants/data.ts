import { AIOption } from "@/types";
import { Brain, Cpu, MessageCircle, Zap } from "lucide-react";

export const aiOptions: AIOption[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: MessageCircle,
    color: "from-green-400 to-emerald-500",
    description: "Modelo de linguagem avançado da OpenAI",
  },

  {
    id: "grok",
    name: "Grok",
    icon: Zap,
    color: "from-blue-400 to-purple-500",
    description: "Companheiro de IA inteligente do X (Twitter)",
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: Cpu,
    color: "from-pink-400 to-rose-500",
    description: "IA Multimodal da Google",
  },
  {
    id: "claude",
    name: "Claude",
    icon: Brain,
    color: "from-orange-400 to-red-500",
    description: "Assistente inteligente da Anthropic",
  },
];
