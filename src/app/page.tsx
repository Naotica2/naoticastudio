"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Download, MessageSquare, Sparkles, Cake, Calendar, MapPin, Briefcase, ExternalLink, Film, Star } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";

// Service interface
interface Service {
  id: string;
  placeName: string;
  description: string;
  startYear: number;
  endYear: number | null;
  link: string | null;
}

// Watchlist interface
interface WatchlistItem {
  id: string;
  title: string;
  type: "movie" | "series";
  genre: string | null;
  year: number | null;
  rating: number | null;
  recommended: boolean;
  posterUrl: string | null;
  notes: string | null;
}

// Animated Counter Component
function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

// Static Stat Card Component
function StatCard({ value, label, suffix, isText }: { value: string; label: string; suffix?: string; isText?: boolean }) {
  return (
    <div className="text-center p-2">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1 md:mb-2">
        {isText ? value : <>{value}{suffix}</>}
      </div>
      <div className="text-xs sm:text-sm text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

// Suppress unused variable warning
void AnimatedCounter;

const tools = [
  {
    title: "All-in-One Downloader",
    description: "Download videos from multiple platforms",
    icon: <Download size={24} />,
    href: "/downloader",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "AI Chatbot",
    description: "Powered by DeepSeek AI",
    icon: <MessageSquare size={24} />,
    href: "/ai",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Image Tools",
    description: "Upscale & remove backgrounds",
    icon: <Sparkles size={24} />,
    href: "/image-tools",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function HomePage() {
  const [projectCount, setProjectCount] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    fetchProjectCount();
    fetchServices();
    fetchWatchlist();
  }, []);

  const fetchProjectCount = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjectCount(data.count || data.projects?.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch project count:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await fetch("/api/watchlist");
      const data = await response.json();
      if (data.success) {
        setWatchlist(data.watchlist || []);
      }
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    }
  };

  return (
    <div className="page-container overflow-x-hidden">
      {/* Hero Section */}
      <section className="section min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center pt-20 md:pt-24">
        <div className="max-w-3xl">
          <div
            data-aos="fade-down"
            data-aos-delay="100"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] text-xs md:text-sm mb-4 md:mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Available for work
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
          >
            Hi, I&apos;m{" "}
            <span className="gradient-text">Naotica</span>
            <br />
            <span className="text-[var(--text-secondary)]">Creative Developer</span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-base md:text-lg lg:text-xl text-[var(--text-muted)] mb-6 md:mb-8 max-w-xl"
          >
            Building beautiful digital experiences and powerful website.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <Link href="/tools" className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              Explore Tools
              <ArrowRight size={18} />
            </Link>
            <Link href="#about" className="btn-secondary text-center w-full sm:w-auto">
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="section py-8 md:py-12">
        <GlassCard data-aos="zoom-in" className="py-6 md:py-12 px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div data-aos="fade-up" data-aos-delay="100"><StatCard value="3" label="Tools Available" /></div>
            <div data-aos="fade-up" data-aos-delay="200"><StatCard value={projectCount.toString()} label="Projects" /></div>
            <div data-aos="fade-up" data-aos-delay="300"><StatCard value="100" label="Free Usage" suffix="%" /></div>
            <div data-aos="fade-up" data-aos-delay="400"><StatCard value="Fast" label="Performance" isText /></div>
          </div>
        </GlassCard>
      </section>

      {/* About Section */}
      <section id="about" className="section py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div data-aos="fade-right" className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="space-y-3 md:space-y-4 text-sm md:text-base text-[var(--text-secondary)]">
              <p>
                I&apos;m a creative developer who loves learning about technology. It's such a cool field!
              </p>
              <p>
                Learning tech has enabled me to build beautiful websites like this one. Even though I hit some
                roadblocks while studying, luckily there's AI now to help me out hahahahha
              </p>
            </div>
          </div>

          <div data-aos="fade-left" className="flex justify-center order-1 md:order-2">
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 opacity-20 blur-3xl" />
              <div className="relative w-full h-full rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Naotica Logo"
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="section py-8 md:py-16">
        <div data-aos="fade-up" className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            My <span className="gradient-text">Profile</span>
          </h2>
          <p className="text-sm md:text-base text-[var(--text-muted)]">A bit more about me</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <GlassCard data-aos="fade-up" data-aos-delay="100" className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white">
                <Cake size={20} className="md:hidden" />
                <Cake size={24} className="hidden md:block" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">Age</p>
                <p className="text-lg md:text-xl font-semibold">17 Years Old</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard data-aos="fade-up" data-aos-delay="200" className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                <Calendar size={20} className="md:hidden" />
                <Calendar size={24} className="hidden md:block" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">Birthday</p>
                <p className="text-lg md:text-xl font-semibold">July 26, 2008</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard data-aos="fade-up" data-aos-delay="300" className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <MapPin size={20} className="md:hidden" />
                <MapPin size={24} className="hidden md:block" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">Location</p>
                <p className="text-lg md:text-xl font-semibold">Kuningan, Indonesia</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Services/Experience Section */}
      {services.length > 0 && (
        <section className="section py-8 md:py-16">
          <div data-aos="fade-up" className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              My <span className="gradient-text">Services</span>
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)]">Work experience & projects I&apos;ve contributed to</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => (
              <a
                key={service.id}
                href={service.link || "#"}
                target={service.link ? "_blank" : undefined}
                rel={service.link ? "noopener noreferrer" : undefined}
                data-aos="fade-up"
                data-aos-delay={100 * (index + 1)}
                className={service.link ? "cursor-pointer" : "cursor-default"}
              >
                <GlassCard className="h-full group p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                      <Briefcase size={20} className="md:hidden" />
                      <Briefcase size={24} className="hidden md:block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg md:text-xl font-semibold truncate">{service.placeName}</h3>
                        {service.link && (
                          <ExternalLink size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-[var(--accent)] mb-2">
                        {service.startYear} - {service.endYear || "Now"}
                      </p>
                      <p className="text-sm md:text-base text-[var(--text-muted)] line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Watchlist Section */}
      {watchlist.length > 0 && (
        <section className="section py-8 md:py-16">
          <div data-aos="fade-up" className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              My <span className="gradient-text">Watchlist</span>
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)]">Movies &amp; series I&apos;ve watched</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {watchlist.map((item, index) => (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={50 * (index + 1)}
              >
                <GlassCard className="h-full p-3 md:p-4 relative overflow-hidden">
                  {/* Recommended Badge */}
                  {item.recommended && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-semibold flex items-center gap-1">
                      <Star size={10} className="fill-white" />
                      <span>Recommended</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${item.type === "movie"
                        ? "bg-gradient-to-br from-red-500 to-pink-500"
                        : "bg-gradient-to-br from-blue-500 to-purple-500"
                      }`}>
                      <Film size={16} />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] capitalize">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-1">{item.title}</h3>

                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    {item.year && <span>{item.year}</span>}
                    {item.year && item.genre && <span>•</span>}
                    {item.genre && <span className="truncate">{item.genre}</span>}
                  </div>

                  {item.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{item.rating}/10</span>
                    </div>
                  )}
                </GlassCard>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project Gallery */}
      <section className="section py-8 md:py-16">
        <div data-aos="fade-up" className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Featured <span className="gradient-text">Tools</span>
          </h2>
          <Link
            href="/tools"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 md:gap-2 text-xs md:text-sm"
          >
            View All
            <ArrowRight size={14} className="md:hidden" />
            <ArrowRight size={16} className="hidden md:block" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {tools.map((tool, index) => (
            <Link key={tool.title} href={tool.href} data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
              <GlassCard className="h-full group cursor-pointer p-4 md:p-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{tool.title}</h3>
                <p className="text-sm md:text-base text-[var(--text-muted)]">{tool.description}</p>
                <div className="mt-3 md:mt-4 text-[var(--accent)] flex items-center gap-2 text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now
                  <ArrowRight size={14} />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section py-8 md:py-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <GlassCard data-aos="fade-up" data-aos-delay="100" className="text-center py-8 md:py-12 px-4 md:px-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
              Explore <span className="gradient-text">Tools</span>
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)] mb-4 md:mb-6">
              Free tools to boost your productivity
            </p>
            <Link href="/tools" className="btn-primary inline-flex items-center gap-2 text-sm md:text-base">
              View Tools
              <ArrowRight size={16} className="md:hidden" />
              <ArrowRight size={18} className="hidden md:block" />
            </Link>
          </GlassCard>

          <GlassCard data-aos="fade-up" data-aos-delay="200" className="text-center py-8 md:py-12 px-4 md:px-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
              My <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)] mb-4 md:mb-6">
              Check out my coding portfolio
            </p>
            <Link href="/projects" className="btn-secondary inline-flex items-center gap-2 text-sm md:text-base">
              View Projects
              <ArrowRight size={16} className="md:hidden" />
              <ArrowRight size={18} className="hidden md:block" />
            </Link>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
