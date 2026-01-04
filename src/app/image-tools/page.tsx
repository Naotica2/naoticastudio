"use client";

import { ImageUp, Eraser, Wrench } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const tools = [
    {
        title: "Image Upscaler",
        description: "Enhance and upscale your images using AI technology. Increase resolution up to 4x without losing quality.",
        icon: ImageUp,
        gradient: "from-pink-500 to-rose-500",
        features: ["4x Resolution", "AI Enhanced", "Batch Processing"],
    },
    {
        title: "Background Remover",
        description: "Remove backgrounds from images instantly. Perfect for product photos, portraits, and more.",
        icon: Eraser,
        gradient: "from-purple-500 to-indigo-500",
        features: ["Instant Removal", "HD Quality", "Transparent PNG"],
    },
];

export default function ImageToolsPage() {
    return (
        <div className="page-container">
            <section className="section">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                        <ImageUp size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Image <span className="gradient-text">Tools</span>
                    </h1>
                    <p className="text-[var(--text-muted)]">
                        Powerful AI-powered tools to enhance, upscale, and edit your images.
                        Professional results in seconds.
                    </p>
                </div>

                {/* Maintenance Notice */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="glass-card p-6 border-yellow-500/30 bg-yellow-500/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-yellow-500/20">
                                <Wrench size={24} className="text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-yellow-500">Under Maintenance</h3>
                                <p className="text-sm text-[var(--text-muted)]">
                                    We&apos;re upgrading our image processing servers. Tools will be back soon!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <GlassCard key={tool.title} className="opacity-60">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6`}>
                                    <Icon size={28} className="text-white" />
                                </div>

                                <h2 className="text-2xl font-bold mb-3">{tool.title}</h2>
                                <p className="text-[var(--text-muted)] mb-6">{tool.description}</p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {tool.features.map((feature) => (
                                        <span
                                            key={feature}
                                            className="px-3 py-1 text-xs rounded-full bg-[var(--border)] text-[var(--text-secondary)]"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Disabled Upload Area */}
                                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-not-allowed">
                                    <Icon size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
                                    <p className="text-[var(--text-muted)]">Coming Soon</p>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>

                {/* Email Notification */}
                <div className="max-w-xl mx-auto mt-16 text-center">
                    <h3 className="text-xl font-semibold mb-4">Get Notified When Available</h3>
                    <p className="text-[var(--text-muted)] mb-6">
                        Leave your email and we&apos;ll notify you when image tools are back online.
                    </p>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)]"
                            disabled
                        />
                        <button className="btn-primary opacity-50 cursor-not-allowed" disabled>
                            Notify Me
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
