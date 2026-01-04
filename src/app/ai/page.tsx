"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Bot, User, Trash2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch("/api/tools/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            if (data.success) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: data.error || "AI service is currently under maintenance. Please try again later." }]);
            }
        } catch {
            setMessages((prev) => [...prev, { role: "assistant", content: "AI service is currently unavailable. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="page-container min-h-[calc(100vh-80px)] flex flex-col py-4 md:py-8 px-2 md:px-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-0">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <MessageSquare size={20} className="text-white md:hidden" />
                        <MessageSquare size={24} className="text-white hidden md:block" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold">AI Chatbot</h1>
                        <p className="text-xs md:text-sm text-[var(--text-muted)]">Powered by DeepSeek AI</p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="btn-secondary flex items-center gap-1 md:gap-2 text-xs md:text-sm py-2 px-3 md:px-4"
                    >
                        <Trash2 size={14} className="md:hidden" />
                        <Trash2 size={16} className="hidden md:block" />
                        <span className="hidden sm:inline">Clear Chat</span>
                    </button>
                )}
            </div>

            {/* Chat Container */}
            <div className="flex-1 glass-card flex flex-col overflow-hidden min-h-[400px] md:min-h-[500px]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--accent-muted)] flex items-center justify-center mb-3 md:mb-4">
                                <Bot size={24} className="text-[var(--accent)] md:hidden" />
                                <Bot size={32} className="text-[var(--accent)] hidden md:block" />
                            </div>
                            <h2 className="text-lg md:text-xl font-semibold mb-2">Start a Conversation</h2>
                            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-md">
                                Ask me anything! I can help with coding, writing, research, and more.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 justify-center">
                                {["Explain quantum computing", "Write a poem", "Help with coding"].map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => setInput(prompt)}
                                        className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center flex-shrink-0">
                                            <Bot size={18} className="text-[var(--accent)]" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] sm:max-w-[75%] px-3 md:px-4 py-2 md:py-3 rounded-2xl text-sm md:text-base ${msg.role === "user"
                                            ? "bg-[var(--accent)] text-white rounded-br-md"
                                            : "bg-[var(--border)] text-[var(--text-primary)] rounded-bl-md"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="w-8 h-8 rounded-lg bg-[var(--border)] flex items-center justify-center flex-shrink-0">
                                            <User size={18} className="text-[var(--text-secondary)]" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                                        <Bot size={18} className="text-[var(--accent)]" />
                                    </div>
                                    <div className="bg-[var(--border)] px-4 py-3 rounded-2xl rounded-bl-md">
                                        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 md:p-4 border-t border-[var(--border)]">
                    <div className="flex gap-2 md:gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[var(--accent)] transition-colors"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="btn-primary px-4 md:px-5 rounded-xl"
                        >
                            <Send size={18} className="md:hidden" />
                            <Send size={20} className="hidden md:block" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
