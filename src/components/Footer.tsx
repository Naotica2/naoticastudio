"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Github, Instagram, Mail, MapPin, ArrowUpRight } from "lucide-react";

interface ContactSettings {
    contactEmail: string;
    githubUrl: string;
    instagramUrl: string;
}

const footerLinks = {
    tools: [
        { label: "Downloader", href: "/downloader" },
        { label: "AI Chat", href: "/ai" },
        { label: "Image Tools", href: "/image-tools" },
        { label: "All Tools", href: "/tools" },
    ],
    resources: [
        { label: "Projects", href: "/projects" },
        { label: "Documentation", href: "#" },
        { label: "API Status", href: "#" },
        { label: "Changelog", href: "#" },
    ],
    legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ],
};

export function Footer() {
    const currentYear = new Date().getFullYear();
    const [contact, setContact] = useState<ContactSettings>({
        contactEmail: "hello@naotica.studio",
        githubUrl: "https://github.com",
        instagramUrl: "https://instagram.com",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/settings");
            const data = await response.json();
            if (data.success && data.settings) {
                setContact({
                    contactEmail: data.settings.contactEmail || "hello@naotica.studio",
                    githubUrl: data.settings.githubUrl || "https://github.com",
                    instagramUrl: data.settings.instagramUrl || "https://instagram.com",
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    const socialLinks = [
        { icon: Github, href: contact.githubUrl, label: "GitHub" },
        { icon: Instagram, href: contact.instagramUrl, label: "Instagram" },
        { icon: Mail, href: `mailto:${contact.contactEmail}`, label: "Email" },
    ];

    return (
        <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
            {/* Main Footer */}
            <div className="page-container py-8 md:py-16 px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
                        <Link href="/" className="inline-block mb-3 md:mb-4">
                            <span className="text-xl md:text-2xl font-bold gradient-text">Naotica</span>
                            <span className="text-[var(--text-muted)] text-xs md:text-sm ml-2">Studio</span>
                        </Link>
                        <p className="text-[var(--text-muted)] text-xs md:text-sm mb-4 md:mb-6 max-w-sm mx-auto sm:mx-0">
                            Building beautiful digital experiences and powerful website.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-[var(--text-muted)]">
                            <a
                                href={`mailto:${contact.contactEmail}`}
                                className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
                            >
                                <Mail size={14} />
                                <span>{contact.contactEmail}</span>
                            </a>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>Indonesia</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target={social.label === "Email" ? "_self" : "_blank"}
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tools Column */}
                    <div className="hidden sm:block">
                        <h3 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Tools</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {footerLinks.tools.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-xs md:text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="hidden lg:block">
                        <h3 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Resources</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-xs md:text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.href === "#" && <ArrowUpRight size={10} />}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--border)]">
                <div className="page-container py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[var(--text-muted)]">
                            © {currentYear} Naotica Studio. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                All systems operational
                            </span>
                            <span>v1.0.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
