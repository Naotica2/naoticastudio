"use client";

import { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true, ...props }: GlassCardProps) {
    return (
        <div
            className={`glass-card p-6 ${hover ? "hover:border-[var(--border-hover)] hover:translate-y-[-2px]" : ""} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

interface ToolCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
    maintenance?: boolean;
}

export function ToolCard({ title, description, icon, children, maintenance = false }: ToolCardProps) {
    return (
        <div className={`tool-card flex flex-col ${maintenance ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)]">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-sm text-[var(--text-muted)]">{description}</p>
                    </div>
                </div>
                {maintenance && (
                    <span className="maintenance-badge">
                        Maintenance
                    </span>
                )}
            </div>
            <div className="flex-1 flex flex-col justify-end">
                {maintenance ? (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                        <p>This tool is currently under maintenance.</p>
                        <p className="text-sm mt-1">Check back later!</p>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
