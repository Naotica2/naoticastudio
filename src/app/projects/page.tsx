"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Github, ArrowLeft, Code, Layers, Smartphone, Globe, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    category: string;
    liveUrl: string | null;
    githubUrl: string | null;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ElementType> = {
    "Web App": Globe,
    "Mobile": Smartphone,
    "Library": Code,
    "Template": Layers,
    "Other": Code,
};

// Gradient mapping for categories
const categoryGradients: Record<string, string> = {
    "Web App": "from-indigo-500 to-purple-600",
    "Mobile": "from-pink-500 to-rose-500",
    "Library": "from-cyan-500 to-blue-500",
    "Template": "from-amber-500 to-orange-500",
    "Other": "from-gray-500 to-slate-600",
};

const categories = ["All", "Web App", "Mobile", "Library", "Template", "Other"];

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [contactEmail, setContactEmail] = useState("hello@naotica.studio");

    useEffect(() => {
        fetchProjects();
        fetchContactEmail();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects");
            const data = await response.json();
            if (data.success) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContactEmail = async () => {
        try {
            const response = await fetch("/api/settings");
            const data = await response.json();
            if (data.success && data.settings.contactEmail) {
                setContactEmail(data.settings.contactEmail);
            }
        } catch (error) {
            console.error("Failed to fetch contact email:", error);
        }
    };

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <div className="page-container px-4 md:px-6">
            <section className="section pt-20 md:pt-24">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 md:mb-8 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="max-w-2xl mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                        My <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="text-sm md:text-base text-[var(--text-muted)]">
                        A collection of my coding projects, from web apps to libraries.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${activeCategory === category
                                ? "bg-[var(--accent)] text-white"
                                : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)]">
                            {activeCategory === "All"
                                ? "No projects yet. Check back later!"
                                : `No ${activeCategory} projects yet.`}
                        </p>
                    </div>
                ) : (
                    /* Projects Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {filteredProjects.map((project) => {
                            const Icon = categoryIcons[project.category] || Code;
                            const gradient = categoryGradients[project.category] || "from-gray-500 to-slate-600";

                            return (
                                <GlassCard key={project.id} className="group p-4 md:p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3 md:mb-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                            <Icon size={20} className="text-white md:hidden" />
                                            <Icon size={24} className="text-white hidden md:block" />
                                        </div>
                                        <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full bg-[var(--border)] text-[var(--text-muted)]">
                                            {project.category}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{project.title}</h3>
                                    <p className="text-[var(--text-muted)] text-xs md:text-sm mb-3 md:mb-4">{project.description}</p>

                                    {/* Tags */}
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-md bg-[var(--accent-muted)] text-[var(--accent)]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 md:gap-4">
                                        {project.liveUrl && (
                                            <Link
                                                href={project.liveUrl}
                                                className="flex items-center gap-1.5 text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                                Live Demo
                                            </Link>
                                        )}
                                        {project.githubUrl && (
                                            <Link
                                                href={project.githubUrl}
                                                target="_blank"
                                                className="flex items-center gap-1.5 text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                                            >
                                                <Github size={14} />
                                                Source Code
                                            </Link>
                                        )}
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                )}

                {/* Contact CTA */}
                <div className="mt-10 md:mt-16 text-center">
                    <GlassCard className="inline-block px-6 md:px-12 py-6 md:py-8">
                        <h2 className="text-lg md:text-2xl font-bold mb-2">Interested in working together?</h2>
                        <p className="text-sm md:text-base text-[var(--text-muted)] mb-4 md:mb-6">Let&apos;s build something amazing</p>
                        <a href={`mailto:${contactEmail}`} className="btn-primary inline-flex items-center gap-2 text-sm md:text-base">
                            Get in Touch
                            <ArrowLeft size={14} className="rotate-180 md:hidden" />
                            <ArrowLeft size={16} className="rotate-180 hidden md:block" />
                        </a>
                    </GlassCard>
                </div>
            </section>
        </div>
    );
}
