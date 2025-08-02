"use client";
import { AIOption, Message } from "@/types";
import React, { useEffect, useRef, useMemo } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bot, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentAI: AIOption;
}

interface MessageItemProps {
  message: Message;
  currentAI: AIOption;
}

const MessageItem = React.memo(({ message, currentAI }: MessageItemProps) => {
  const isUser = message.sender === "user";
  const timestamp = useMemo(
    () => new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [message.timestamp]
  );

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex max-w-[90%] sm:max-w-[85%] space-x-2 sm:space-x-3 transition-all duration-200 ease-in-out",
        isUser && "flex-row-reverse space-x-reverse sm:space-x-reverse"
      )}>
        <Avatar className={cn(
          "h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 transition-transform duration-200 hover:scale-110",
          isUser ? "bg-blue-500" : `bg-gradient-to-r ${currentAI.color}`
        )}>
          <AvatarFallback className="bg-transparent">
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </AvatarFallback>
        </Avatar>
        
        <Card className={cn(
          "group relative overflow-hidden transition-shadow duration-200 hover:shadow-md",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-card border border-border/50"
        )}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-2 sm:p-4 relative">
            <p className="text-sm sm:text-[0.9375rem] leading-relaxed whitespace-pre-wrap break-words">
              {message.text}
            </p>
            <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[0.6875rem] sm:text-xs opacity-80">
              <Badge variant={isUser ? "default" : "secondary"} className="font-normal">
                {isUser ? "Você" : currentAI.name}
              </Badge>
              <span className="text-xs opacity-70">
                {timestamp}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const MessageList = ({ messages, isLoading, currentAI }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-3 px-1 py-2 sm:space-y-4 sm:px-2 sm:py-4">
      {messages?.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          currentAI={currentAI} 
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex max-w-[90%] sm:max-w-[85%] space-x-2 sm:space-x-3">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-muted/30 to-muted/60">
              <AvatarFallback className="bg-transparent">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <Card className="w-full bg-muted/20 border-muted/30 overflow-hidden">
              <CardContent className="p-2 sm:p-4">
                <div className="flex items-center space-x-1.5">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-muted-foreground/80 animate-bounce" />
                  <div 
                    className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-muted-foreground/80 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div 
                    className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-muted-foreground/80 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};

export default MessageList;
