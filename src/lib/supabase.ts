import { createClient } from '@supabase/supabase-js';

// Supabase client for client-side operations (limited access)
export function createSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseAnonKey);
}

// Supabase admin client for server-side operations (full access)
export function createSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// Database types
export interface UsageLog {
    id: string;
    tool: 'downloader' | 'chatbot' | 'upscaler' | 'bgremover';
    created_at: string;
    user_agent?: string;
    referrer?: string;
    ip_hash?: string;
    success: boolean;
}

export interface Project {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    link?: string;
    tags: string[];
    featured: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Settings {
    id: string;
    total_hits: number;
    site_name: string;
    contact_email: string;
    github_url: string;
    instagram_url: string;
    ai_chat_maintenance: boolean;
    image_tools_maintenance: boolean;
    downloader_maintenance: boolean;
    updated_at: string;
}

// Helper function to log API usage
export async function logApiUsage(
    tool: UsageLog['tool'],
    options?: {
        userAgent?: string;
        referrer?: string;
        ipHash?: string;
        success?: boolean;
    }
) {
    try {
        const supabase = createSupabaseAdmin();
        const { data, error } = await supabase.rpc('log_api_usage', {
            p_tool: tool,
            p_user_agent: options?.userAgent,
            p_referrer: options?.referrer,
            p_ip_hash: options?.ipHash,
            p_success: options?.success ?? true,
        });

        if (error) {
            console.error('[Supabase] Failed to log usage:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('[Supabase] Error:', error);
        return null;
    }
}

// Get total hits count
export async function getTotalHits(): Promise<number> {
    try {
        const supabase = createSupabaseAdmin();
        const { data, error } = await supabase
            .from('settings')
            .select('total_hits')
            .eq('id', 'main')
            .single();

        if (error) {
            console.error('[Supabase] Failed to get total hits:', error.message);
            return 0;
        }

        return data?.total_hits ?? 0;
    } catch (error) {
        console.error('[Supabase] Error:', error);
        return 0;
    }
}

// Get featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
    try {
        const supabase = createSupabaseAdmin();
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('featured', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('[Supabase] Failed to get projects:', error.message);
            return [];
        }

        return data ?? [];
    } catch (error) {
        console.error('[Supabase] Error:', error);
        return [];
    }
}
