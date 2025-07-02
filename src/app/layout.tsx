import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ChatSideBar from "@/components/ChatSideBar";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "AI Chat Hub - Multiple AI Assistants",
  description:
    "Chat with ChatGPT, Claude, Grok, and Gemini all in one place. Multiple AI assistants with seamless switching and conversation history.",
  keywords: [
    "AI chat",
    "ChatGPT",
    "Claude",
    "Grok",
    "Gemini",
    "AI assistant",
    "conversation",
  ],
  authors: [{ name: "AI Chat Hub" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex">
              <ChatSideBar />
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
