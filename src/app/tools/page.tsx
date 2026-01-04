import Link from "next/link";
import { Download, MessageSquare, ImageUp, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const tools = [
    {
        title: "All-in-One Downloader",
        description: "Download videos from YouTube, TikTok, Instagram, and more platforms",
        icon: Download,
        href: "/downloader",
        gradient: "from-indigo-500 to-purple-500",
        status: "active",
    },
    {
        title: "AI Chatbot",
        description: "Chat with DeepSeek AI for coding, writing, research, and more",
        icon: MessageSquare,
        href: "/ai",
        gradient: "from-blue-500 to-cyan-500",
        status: "active",
    },
    {
        title: "Image Tools",
        description: "Upscale images and remove backgrounds with AI technology",
        icon: ImageUp,
        href: "/image-tools",
        gradient: "from-pink-500 to-rose-500",
        status: "maintenance",
    },
];

export default function ToolsPage() {
    return (
        <div className="page-container">
            <section className="section">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        All <span className="gradient-text">Tools</span>
                    </h1>
                    <p className="text-[var(--text-muted)]">
                        A collection of free tools to boost your productivity.
                        Choose a tool to get started.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={tool.title} href={tool.href}>
                                <GlassCard className="h-full group cursor-pointer relative overflow-hidden">
                                    {/* Status Badge */}
                                    {tool.status === "maintenance" && (
                                        <div className="absolute top-4 right-4">
                                            <span className="maintenance-badge">
                                                Maintenance
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon size={28} className="text-white" />
                                    </div>

                                    {/* Content */}
                                    <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
                                    <p className="text-[var(--text-muted)] mb-4">{tool.description}</p>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-[var(--accent)] mt-auto pt-4">
                                        <span className="text-sm font-medium">
                                            {tool.status === "maintenance" ? "View Status" : "Open Tool"}
                                        </span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </GlassCard>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
