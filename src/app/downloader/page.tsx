"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle, XCircle, Youtube, Instagram, Music, Zap, Target, Gift, Info } from "lucide-react";

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
    return (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-50 ${type === "success" ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"
            }`}>
            {type === "success" ? <CheckCircle className="text-green-500" size={18} /> : <XCircle className="text-red-500" size={18} />}
            <span className="text-sm">{message}</span>
            <button onClick={onClose} className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">×</button>
        </div>
    );
}

const platforms = [
    { name: "YouTube", icon: Youtube, color: "text-red-500" },
    { name: "TikTok", icon: Music, color: "text-pink-500" },
    { name: "Instagram", icon: Instagram, color: "text-purple-500" },
];

export default function DownloaderPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const handleDownload = async () => {
        if (!url.trim()) {
            setToast({ message: "Please enter a URL", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/tools/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (data.success && data.downloadUrl) {
                // Use proxy route to bypass CDN restrictions
                const proxyUrl = `/api/tools/download/proxy?url=${encodeURIComponent(data.downloadUrl)}&filename=${encodeURIComponent(data.title || "video")}&format=mp4`;

                try {
                    // Test if proxy works
                    const proxyTest = await fetch(proxyUrl, { method: "HEAD" });

                    if (proxyTest.ok) {
                        // Proxy works - trigger download
                        const link = document.createElement("a");
                        link.href = proxyUrl;
                        link.download = `${data.title || "video"}.mp4`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setToast({ message: "Download started!", type: "success" });
                    } else {
                        throw new Error("Proxy failed");
                    }
                } catch {
                    // Proxy failed - fallback to direct URL in new tab
                    window.open(data.downloadUrl, "_blank");
                    setToast({
                        message: "Video opened! Right-click → Save video as...",
                        type: "success"
                    });
                }

                setUrl("");
            } else {
                setToast({ message: data.error || "Download failed", type: "error" });
            }
        } catch {
            setToast({ message: "Something went wrong", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <section className="section min-h-[80vh] flex flex-col justify-center">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12 px-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <Download size={32} className="text-white md:hidden" />
                        <Download size={40} className="text-white hidden md:block" />
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                        All-in-One <span className="gradient-text">Downloader</span>
                    </h1>
                    <p className="text-sm md:text-base text-[var(--text-muted)]">
                        Download videos from YouTube, TikTok, Instagram, Twitter, and more.
                    </p>
                </div>

                {/* Supported Platforms */}
                <div className="flex justify-center gap-4 md:gap-6 mb-6 md:mb-8 overflow-x-auto pb-2 px-4">
                    {platforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                            <div key={platform.name} className="flex flex-col items-center gap-1 md:gap-2 flex-shrink-0">
                                <div className="p-2 md:p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                    <Icon size={20} className={`${platform.color} md:w-6 md:h-6`} />
                                </div>
                                <span className="text-[10px] md:text-xs text-[var(--text-muted)]">{platform.name}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Download Form */}
                <div className="max-w-2xl mx-auto w-full px-4 md:px-0">
                    <div className="glass-card p-4 sm:p-6 md:p-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-[var(--text-muted)] mb-2">
                                    Video URL
                                </label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://youtube.com/watch?v=... or tiktok.com/..."
                                    className="input-field text-lg"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                onClick={handleDownload}
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={22} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Download size={22} />
                                        Download Now
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Tips */}
                        <div className="mt-6 pt-6 border-t border-[var(--border)]">
                            <p className="text-sm text-[var(--text-muted)] text-center flex items-center justify-center gap-2">
                                <Info size={14} />
                                Paste the video URL directly from the app or browser
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12">
                    <div className="text-center p-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-3">
                            <Zap size={20} className="text-[var(--accent)]" />
                        </div>
                        <h3 className="font-medium mb-1">Fast Download</h3>
                        <p className="text-sm text-[var(--text-muted)]">High-speed servers</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-3">
                            <Target size={20} className="text-[var(--accent)]" />
                        </div>
                        <h3 className="font-medium mb-1">No Watermark</h3>
                        <p className="text-sm text-[var(--text-muted)]">Clean downloads</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-3">
                            <Gift size={20} className="text-[var(--accent)]" />
                        </div>
                        <h3 className="font-medium mb-1">100% Free</h3>
                        <p className="text-sm text-[var(--text-muted)]">No hidden fees</p>
                    </div>
                </div>
            </section>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
}
