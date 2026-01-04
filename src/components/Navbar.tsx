"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Download, MessageSquare, ImageUp, Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/downloader", label: "Downloader", icon: Download },
    { href: "/ai", label: "AI Chat", icon: MessageSquare },
    { href: "/image-tools", label: "Image Tools", icon: ImageUp },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    // Hide navbar on admin pages
    if (pathname.startsWith("/naoticastudioadmin")) {
        return null;
    }

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
                <nav className={`mx-4 md:mx-8 rounded-2xl transition-all duration-300 ${scrolled
                        ? "bg-[rgba(10,10,10,0.95)] backdrop-blur-xl shadow-xl border border-[rgba(255,255,255,0.08)]"
                        : "bg-[rgba(26,26,26,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.05)]"
                    }`}>
                    <div className="page-container">
                        <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
                            {/* Logo */}
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-lg md:text-xl font-semibold tracking-tight group"
                            >
                                <span className="gradient-text group-hover:opacity-80 transition-opacity">Naotica</span>
                                <span className="text-[var(--text-muted)] text-xs md:text-sm font-normal">Studio</span>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)]"
                                                }`}
                                        >
                                            <Icon size={16} />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile Menu Button - Animated Hamburger */}
                            <button
                                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-all duration-200"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <div className="relative w-5 h-5">
                                    <span className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${mobileMenuOpen
                                            ? "top-1/2 -translate-y-1/2 rotate-45"
                                            : "top-1"
                                        }`} />
                                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-current rounded-full transition-all duration-200 ${mobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                                        }`} />
                                    <span className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${mobileMenuOpen
                                            ? "top-1/2 -translate-y-1/2 -rotate-45"
                                            : "bottom-1"
                                        }`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-[rgba(10,10,10,0.98)] backdrop-blur-xl border-l border-[rgba(255,255,255,0.08)] transition-transform duration-300 ease-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.05)]">
                    <span className="text-sm font-medium text-[var(--text-muted)]">Menu</span>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu Links */}
                <div className="p-4 space-y-2">
                    {navLinks.map((link, index) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${isActive
                                    ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)]"
                                    }`}
                                style={{
                                    animation: mobileMenuOpen
                                        ? `slideInFromRight 0.3s ease-out ${index * 0.05}s both`
                                        : "none"
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive
                                            ? "bg-[var(--accent)]/20"
                                            : "bg-[rgba(255,255,255,0.05)]"
                                        }`}>
                                        <Icon size={20} />
                                    </div>
                                    <span>{link.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-[var(--text-muted)]" />
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="text-center">
                        <p className="text-xs text-[var(--text-muted)]">
                            © 2024 Naotica Studio
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS for slide animation */}
            <style jsx global>{`
                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
