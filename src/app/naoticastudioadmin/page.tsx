"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    Activity,
    Download,
    MessageSquare,
    LogOut,
    Loader2,
    TrendingUp,
    Settings,
    Power,
    ImageIcon,
    Plus,
    Trash2,
    FolderOpen,
    ExternalLink,
    Mail,
    Link as LinkIcon,
    Briefcase,
    Edit3
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ChartSkeleton, StatSkeleton } from "@/components/Skeleton";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface StatsData {
    totalHits: number;
    toolUsage: { tool: string; hits: number; color: string }[];
    dailyTraffic: { date: string; visits: number }[];
    growth: string;
}

interface MaintenanceSettings {
    aiChatMaintenance: boolean;
    imageToolsMaintenance: boolean;
    downloaderMaintenance: boolean;
}

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    category: string;
    liveUrl: string | null;
    githubUrl: string | null;
}

interface Service {
    id: string;
    placeName: string;
    description: string;
    startYear: number;
    endYear: number | null;
    link: string | null;
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2">
                <p className="text-sm text-[var(--text-secondary)]">{label}</p>
                <p className="text-lg font-semibold text-[var(--accent)]">{payload[0].value} visits</p>
            </div>
        );
    }
    return null;
}

// Toggle Switch Component
function ToggleSwitch({
    enabled,
    onChange,
    label,
    description,
    icon: Icon
}: {
    enabled: boolean;
    onChange: (val: boolean) => void;
    label: string;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-[var(--text-muted)]">{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-green-500" : "bg-[var(--border)]"
                    }`}
            >
                <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-7" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [maintenance, setMaintenance] = useState<MaintenanceSettings>({
        aiChatMaintenance: true,
        imageToolsMaintenance: true,
        downloaderMaintenance: false,
    });
    const [savingSettings, setSavingSettings] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [showAddProject, setShowAddProject] = useState(false);
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        tags: "",
        category: "Web App",
        liveUrl: "",
        githubUrl: "",
    });
    const [savingProject, setSavingProject] = useState(false);
    const [contactSettings, setContactSettings] = useState({
        contactEmail: "",
        githubUrl: "",
        instagramUrl: "",
    });
    const [savingContact, setSavingContact] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [services, setServices] = useState<Service[]>([]);
    const [showAddService, setShowAddService] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [newService, setNewService] = useState({
        placeName: "",
        description: "",
        startYear: new Date().getFullYear().toString(),
        endYear: "",
        isOngoing: true,
        link: "",
    });
    const [savingService, setSavingService] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchStats();
        fetchSettings();
        fetchProjects();
        fetchServices();

        // Update time on client side only
        setCurrentTime(new Date().toLocaleTimeString());
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/stats");
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/settings");
            const data = await response.json();
            if (data.success) {
                setMaintenance(data.settings);
                setContactSettings({
                    contactEmail: data.settings.contactEmail || "",
                    githubUrl: data.settings.githubUrl || "",
                    instagramUrl: data.settings.instagramUrl || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    const updateMaintenance = async (key: keyof MaintenanceSettings, value: boolean) => {
        setSavingSettings(true);
        setMaintenance(prev => ({ ...prev, [key]: value }));

        try {
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [key]: value }),
            });
        } catch (error) {
            console.error("Failed to update settings:", error);
            // Revert on error
            setMaintenance(prev => ({ ...prev, [key]: !value }));
        } finally {
            setSavingSettings(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects");
            const data = await response.json();
            if (data.success) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    const saveContactSettings = async () => {
        setSavingContact(true);
        try {
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactSettings),
            });
        } catch (error) {
            console.error("Failed to save contact settings:", error);
        } finally {
            setSavingContact(false);
        }
    };

    const addProject = async () => {
        if (!newProject.title.trim()) return;

        setSavingProject(true);
        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newProject,
                    tags: newProject.tags.split(",").map(t => t.trim()).filter(Boolean),
                }),
            });
            const data = await response.json();
            if (data.success) {
                setProjects(prev => [...prev, data.project]);
                setNewProject({ title: "", description: "", tags: "", category: "Web App", liveUrl: "", githubUrl: "" });
                setShowAddProject(false);
            }
        } catch (error) {
            console.error("Failed to add project:", error);
        } finally {
            setSavingProject(false);
        }
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Delete this project?")) return;

        try {
            const response = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
                setProjects(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    // Services CRUD functions
    const fetchServices = async () => {
        try {
            const response = await fetch("/api/services");
            const data = await response.json();
            if (data.success) {
                setServices(data.services);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        }
    };

    const addService = async () => {
        if (!newService.placeName.trim() || !newService.startYear) return;

        setSavingService(true);
        try {
            const response = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    placeName: newService.placeName,
                    description: newService.description,
                    startYear: newService.startYear,
                    endYear: newService.isOngoing ? null : newService.endYear,
                    link: newService.link || null,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setServices(prev => [...prev, data.service]);
                setNewService({ placeName: "", description: "", startYear: new Date().getFullYear().toString(), endYear: "", isOngoing: true, link: "" });
                setShowAddService(false);
            }
        } catch (error) {
            console.error("Failed to add service:", error);
        } finally {
            setSavingService(false);
        }
    };

    const updateService = async () => {
        if (!editingService) return;

        setSavingService(true);
        try {
            const response = await fetch("/api/services", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingService),
            });
            const data = await response.json();
            if (data.success) {
                setServices(prev => prev.map(s => s.id === editingService.id ? data.service : s));
                setEditingService(null);
            }
        } catch (error) {
            console.error("Failed to update service:", error);
        } finally {
            setSavingService(false);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Delete this service?")) return;

        try {
            const response = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
                setServices(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth", { method: "DELETE" });
            router.push("/naoticastudioadmin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Admin Header */}
            <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <div className="page-container py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                            <Settings size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold">Admin Dashboard</h1>
                            <p className="text-sm text-[var(--text-muted)]">Naotica Studio</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary flex items-center gap-2 text-red-400 border-red-400/30 hover:border-red-400"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="page-container py-8">
                {/* Maintenance Controls */}
                <GlassCard hover={false} className="mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Power size={20} className="text-[var(--accent)]" />
                        <h2 className="text-lg font-semibold">Service Controls</h2>
                        {savingSettings && <Loader2 size={16} className="animate-spin text-[var(--text-muted)]" />}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <ToggleSwitch
                            enabled={!maintenance.downloaderMaintenance}
                            onChange={(val) => updateMaintenance("downloaderMaintenance", !val)}
                            label="Downloader"
                            description={maintenance.downloaderMaintenance ? "Offline" : "Online"}
                            icon={Download}
                        />
                        <ToggleSwitch
                            enabled={!maintenance.aiChatMaintenance}
                            onChange={(val) => updateMaintenance("aiChatMaintenance", !val)}
                            label="AI Chat"
                            description={maintenance.aiChatMaintenance ? "Offline" : "Online"}
                            icon={MessageSquare}
                        />
                        <ToggleSwitch
                            enabled={!maintenance.imageToolsMaintenance}
                            onChange={(val) => updateMaintenance("imageToolsMaintenance", !val)}
                            label="Image Tools"
                            description={maintenance.imageToolsMaintenance ? "Offline" : "Online"}
                            icon={ImageIcon}
                        />
                    </div>
                </GlassCard>

                {/* Contact Settings */}
                <GlassCard hover={false} className="mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Mail size={20} className="text-[var(--accent)]" />
                        <h2 className="text-lg font-semibold">Contact Settings</h2>
                        {savingContact && <Loader2 size={16} className="animate-spin text-[var(--text-muted)]" />}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-[var(--text-muted)] mb-2">Email</label>
                            <input
                                type="email"
                                value={contactSettings.contactEmail}
                                onChange={(e) => setContactSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                                placeholder="hello@example.com"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-muted)] mb-2">GitHub URL</label>
                            <input
                                type="url"
                                value={contactSettings.githubUrl}
                                onChange={(e) => setContactSettings(prev => ({ ...prev, githubUrl: e.target.value }))}
                                placeholder="https://github.com/username"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-muted)] mb-2">Instagram URL</label>
                            <input
                                type="url"
                                value={contactSettings.instagramUrl}
                                onChange={(e) => setContactSettings(prev => ({ ...prev, instagramUrl: e.target.value }))}
                                placeholder="https://instagram.com/username"
                                className="input-field"
                            />
                        </div>
                    </div>
                    <button
                        onClick={saveContactSettings}
                        disabled={savingContact}
                        className="btn-primary flex items-center gap-2"
                    >
                        {savingContact ? <Loader2 size={16} className="animate-spin" /> : <LinkIcon size={16} />}
                        Save Contact Settings
                    </button>
                </GlassCard>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {loading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        <>
                            <GlassCard hover={false}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Total Hits</p>
                                        <p className="text-2xl font-bold">{stats?.totalHits.toLocaleString()}</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard hover={false}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                        <Download size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Downloads</p>
                                        <p className="text-2xl font-bold">{stats?.toolUsage[0]?.hits.toLocaleString()}</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard hover={false}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">AI Chats</p>
                                        <p className="text-2xl font-bold">{stats?.toolUsage[1]?.hits.toLocaleString()}</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard hover={false}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Growth</p>
                                        <p className="text-2xl font-bold">{stats?.growth || "0%"}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </>
                    )}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Traffic Chart */}
                    {loading ? (
                        <ChartSkeleton />
                    ) : (
                        <GlassCard hover={false}>
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 size={20} className="text-[var(--accent)]" />
                                <h2 className="text-lg font-semibold">Weekly Traffic</h2>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.dailyTraffic}>
                                        <defs>
                                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="var(--text-muted)"
                                            fontSize={12}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            stroke="var(--text-muted)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="visits"
                                            stroke="#6366f1"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorVisits)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    )}

                    {/* Tool Usage Chart */}
                    {loading ? (
                        <ChartSkeleton />
                    ) : (
                        <GlassCard hover={false}>
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 size={20} className="text-[var(--accent)]" />
                                <h2 className="text-lg font-semibold">Tool Usage</h2>
                            </div>
                            <div className="h-64 flex items-center">
                                <ResponsiveContainer width="50%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats?.toolUsage}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="hits"
                                        >
                                            {stats?.toolUsage.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex-1 space-y-3">
                                    {stats?.toolUsage.map((item) => (
                                        <div key={item.tool} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm">{item.tool}</span>
                                            </div>
                                            <span className="text-sm text-[var(--text-muted)]">
                                                {item.hits.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    )}
                </div>

                {/* Projects Management */}
                <GlassCard hover={false} className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <FolderOpen size={20} className="text-[var(--accent)]" />
                            <h2 className="text-lg font-semibold">Projects Management</h2>
                        </div>
                        <button
                            onClick={() => setShowAddProject(!showAddProject)}
                            className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
                        >
                            <Plus size={16} />
                            Add Project
                        </button>
                    </div>

                    {/* Add Project Form */}
                    {showAddProject && (
                        <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Project Title *"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                                    className="input-field"
                                />
                                <select
                                    value={newProject.category}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                                    className="input-field"
                                >
                                    <option value="Web App">Web App</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Library">Library</option>
                                    <option value="Template">Template</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Description"
                                value={newProject.description}
                                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                className="input-field mb-4 min-h-[80px]"
                            />
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Tags (comma separated)"
                                    value={newProject.tags}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, tags: e.target.value }))}
                                    className="input-field"
                                />
                                <input
                                    type="text"
                                    placeholder="Live URL"
                                    value={newProject.liveUrl}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                                    className="input-field"
                                />
                                <input
                                    type="text"
                                    placeholder="GitHub URL"
                                    value={newProject.githubUrl}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                                    className="input-field"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={addProject}
                                    disabled={savingProject || !newProject.title.trim()}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {savingProject ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    Save Project
                                </button>
                                <button
                                    onClick={() => setShowAddProject(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Projects List */}
                    <div className="space-y-3">
                        {projects.length === 0 ? (
                            <p className="text-[var(--text-muted)] text-center py-8">No projects yet. Add your first project!</p>
                        ) : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-medium">{project.title}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                                                {project.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-1">{project.description}</p>
                                        {project.tags && project.tags.length > 0 && (
                                            <div className="flex gap-1 mt-2">
                                                {project.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[var(--border)] text-[var(--text-muted)]">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)]"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>

                {/* Services Management */}
                <GlassCard hover={false} className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Briefcase size={20} className="text-[var(--accent)]" />
                            <h2 className="text-lg font-semibold">Services Management</h2>
                        </div>
                        <button
                            onClick={() => setShowAddService(!showAddService)}
                            className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
                        >
                            <Plus size={16} />
                            Add Service
                        </button>
                    </div>

                    {/* Add Service Form */}
                    {showAddService && (
                        <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                            <h3 className="font-medium mb-4">Add New Service</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Place/Company Name *"
                                    value={newService.placeName}
                                    onChange={(e) => setNewService(prev => ({ ...prev, placeName: e.target.value }))}
                                    className="input-field"
                                />
                                <input
                                    type="url"
                                    placeholder="Website Link (optional)"
                                    value={newService.link}
                                    onChange={(e) => setNewService(prev => ({ ...prev, link: e.target.value }))}
                                    className="input-field"
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                value={newService.description}
                                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                                className="input-field mb-4 min-h-[80px]"
                            />
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <input
                                    type="number"
                                    placeholder="Start Year *"
                                    value={newService.startYear}
                                    onChange={(e) => setNewService(prev => ({ ...prev, startYear: e.target.value }))}
                                    className="input-field"
                                    min="1900"
                                    max="2100"
                                />
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="End Year"
                                        value={newService.endYear}
                                        onChange={(e) => setNewService(prev => ({ ...prev, endYear: e.target.value }))}
                                        className="input-field"
                                        disabled={newService.isOngoing}
                                        min="1900"
                                        max="2100"
                                    />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newService.isOngoing}
                                        onChange={(e) => setNewService(prev => ({ ...prev, isOngoing: e.target.checked, endYear: e.target.checked ? "" : prev.endYear }))}
                                        className="w-4 h-4 accent-[var(--accent)]"
                                    />
                                    <span className="text-sm">Currently Ongoing</span>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={addService}
                                    disabled={savingService || !newService.placeName.trim() || !newService.startYear}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {savingService ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    Save Service
                                </button>
                                <button
                                    onClick={() => setShowAddService(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Edit Service Form */}
                    {editingService && (
                        <div className="mb-6 p-4 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-muted)]">
                            <h3 className="font-medium mb-4">Edit Service</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Place/Company Name *"
                                    value={editingService.placeName}
                                    onChange={(e) => setEditingService(prev => prev ? { ...prev, placeName: e.target.value } : null)}
                                    className="input-field"
                                />
                                <input
                                    type="url"
                                    placeholder="Website Link (optional)"
                                    value={editingService.link || ""}
                                    onChange={(e) => setEditingService(prev => prev ? { ...prev, link: e.target.value || null } : null)}
                                    className="input-field"
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                value={editingService.description}
                                onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                                className="input-field mb-4 min-h-[80px]"
                            />
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <input
                                    type="number"
                                    placeholder="Start Year *"
                                    value={editingService.startYear}
                                    onChange={(e) => setEditingService(prev => prev ? { ...prev, startYear: parseInt(e.target.value) || 0 } : null)}
                                    className="input-field"
                                    min="1900"
                                    max="2100"
                                />
                                <input
                                    type="number"
                                    placeholder="End Year (leave empty for Now)"
                                    value={editingService.endYear || ""}
                                    onChange={(e) => setEditingService(prev => prev ? { ...prev, endYear: e.target.value ? parseInt(e.target.value) : null } : null)}
                                    className="input-field"
                                    min="1900"
                                    max="2100"
                                />
                                <div className="flex items-center text-sm text-[var(--text-muted)]">
                                    Leave end year empty for &quot;Now&quot;
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={updateService}
                                    disabled={savingService || !editingService.placeName.trim()}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {savingService ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />}
                                    Update Service
                                </button>
                                <button
                                    onClick={() => setEditingService(null)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Services List */}
                    <div className="space-y-3">
                        {services.length === 0 ? (
                            <p className="text-[var(--text-muted)] text-center py-8">No services yet. Add your first service!</p>
                        ) : (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-medium">{service.placeName}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                                                {service.startYear} - {service.endYear || "Now"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-1">{service.description}</p>
                                        {service.link && (
                                            <a
                                                href={service.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-[var(--accent)] hover:underline mt-1 inline-flex items-center gap-1"
                                            >
                                                <ExternalLink size={12} />
                                                {service.link}
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingService(service)}
                                            className="p-2 rounded-lg hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)]"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteService(service.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>

                {/* System Info */}
                <GlassCard hover={false} className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">System Status</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">API Status</span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Database</span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Connected
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Last Updated</span>
                            <span>{currentTime || "--"}</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
