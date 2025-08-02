"use client";
import {
  LogIn,
  LogOut,
  MessageCircle,
  Plus,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "./ui/scroll-area";
import { Chat } from "@/types";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { Menu } from "lucide-react";

// Componente MobileMenu para exibir o menu em dispositivos móveis
const MobileMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ChatSideBar = () => {
  const { user, signOut } = useAuth();
  const {
    currentChatId,
    deleteChat,
    isAnonymous,
    createNewChat,
    chats,
    selectChat,
  } = useChat();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const router = useRouter();

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId && newChatId !== "anonymous") {
      router.push(`/chat/${newChatId}`);
    } else if (newChatId === "anonymous") {
      router.push("/chat");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
    }
  };

  const SidebarContent = () => {
    return (
      <div className="flex h-full flex-col">
        <div className="p-4">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Moz Chat</span>
          </Link>
          <Button
            onClick={handleNewChat}
            className="w-full"
            variant="outline"
          >
            <Plus />
            Nova Conversa
          </Button>
        </div>
        <Separator />

        {isAnonymous && (
          <div className="p-4">
            <Card className="border">
              <CardContent className="p-3">
                <p className="text-sm mb-2 text-destructive">
                  💡 Está a conversar como Anónimo
                </p>
                <p className="text-xs mb-3">
                  Inicie sessão para guardar o histórico de conversas
                </p>
                <Button
                  onClick={() => {
                    setAuthMode("signin");
                    setShowAuthModal(true);
                  }}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <LogIn />
                  Entrar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-full">
            {chats?.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {isAnonymous ? "Nenhuma conversa guardada" : "Sem conversas"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAnonymous
                    ? "Inicie sessão para guardar conversas"
                    : "Comece uma conversa para ver aqui"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats?.map((chat: Chat) => (
                  <Card
                    key={chat?.id}
                    className={`cursor-pointer transition-colors group ${
                      currentChatId === chat.id
                        ? "bg-accent border-accent-foreground/20"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => {
                      selectChat(chat.id);
                      router.push(`/chat/${chat.id}`);
                    }}
                  >
                    <CardContent className="px-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {chat?.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {chat?.aiProvider}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {chat.messageCount} mensagens
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                            toast("Conversa apagada com sucesso!");
                          }}
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <Separator />

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  className={isAnonymous ? "bg-yellow-500" : "bg-blue-500"}
                >
                  <User className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="min-h-0 flex-1">
                <p className="text-sm font-medium line-clamp-1">
                  {user?.displayName ||
                    user?.email?.split("@")[0] ||
                    "Utilizador Anónimo"}
                </p>
                <div className="flex mt-0.5 items-center space-x-1">
                  <Badge variant={isAnonymous ? "secondary" : "default"}>
                    {isAnonymous ? "Anónimo" : "Autenticado"}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              {isAnonymous ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setAuthMode("signin");
                    setShowAuthModal(true);
                  }}
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-screen">
      {/* Menu Mobile */}
      <MobileMenu>
        <SidebarContent />
      </MobileMenu>

      {/* Sidebar Desktop */}
      <div className="hidden h-full lg:flex lg:w-80 lg:flex-col lg:border-r">
        <SidebarContent />
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() =>
          setAuthMode(authMode === "signin" ? "signup" : "signin")
        }
      />
    </div>
  );
};

export default ChatSideBar;
