interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
    return (
        <div className="tool-card">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="glass-card p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-32" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="glass-card p-6">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
}
