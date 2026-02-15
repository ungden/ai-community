'use client';

import { motion } from 'framer-motion';

// Skeleton for Post Card
export function PostSkeleton() {
    return (
        <div className="card p-4 animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)]" />
                <div className="flex-1">
                    <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded mb-2" />
                    <div className="h-3 w-20 bg-[var(--bg-tertiary)] rounded" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-4/6" />
            </div>

            {/* Image placeholder */}
            <div className="h-48 bg-[var(--bg-tertiary)] rounded-xl mb-4" />

            {/* Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-[var(--border)]">
                <div className="h-8 w-20 bg-[var(--bg-tertiary)] rounded-lg" />
                <div className="h-8 w-20 bg-[var(--bg-tertiary)] rounded-lg" />
                <div className="h-8 w-20 bg-[var(--bg-tertiary)] rounded-lg" />
            </div>
        </div>
    );
}

// Skeleton for Course Card
export function CourseSkeleton() {
    return (
        <div className="card overflow-hidden animate-pulse">
            <div className="h-44 bg-[var(--bg-tertiary)]" />
            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)]" />
                    <div className="h-3 w-24 bg-[var(--bg-tertiary)] rounded" />
                </div>
                <div className="h-5 bg-[var(--bg-tertiary)] rounded w-full mb-2" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-[var(--bg-tertiary)] rounded" />
                    <div className="h-4 w-16 bg-[var(--bg-tertiary)] rounded" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for Group Card
export function GroupSkeleton() {
    return (
        <div className="card overflow-hidden animate-pulse">
            <div className="h-24 bg-[var(--bg-tertiary)]" />
            <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)]" />
                    <div className="flex-1">
                        <div className="h-5 w-32 bg-[var(--bg-tertiary)] rounded mb-2" />
                        <div className="h-3 w-20 bg-[var(--bg-tertiary)] rounded" />
                    </div>
                </div>
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full mb-2" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3" />
            </div>
        </div>
    );
}

// Skeleton for Event Card
export function EventSkeleton() {
    return (
        <div className="card overflow-hidden animate-pulse">
            <div className="flex">
                <div className="w-24 p-4 bg-[var(--bg-tertiary)]" />
                <div className="flex-1 p-4">
                    <div className="h-5 w-48 bg-[var(--bg-tertiary)] rounded mb-2" />
                    <div className="h-4 w-full bg-[var(--bg-tertiary)] rounded mb-2" />
                    <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for Sidebar Item
export function SidebarSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)]" />
                    <div className="h-4 flex-1 bg-[var(--bg-tertiary)] rounded" />
                </div>
            ))}
        </div>
    );
}

// Skeleton for Profile Header
export function ProfileHeaderSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-64 bg-[var(--bg-tertiary)]" />
            <div className="max-w-5xl mx-auto px-4 -mt-20">
                <div className="flex items-end gap-4">
                    <div className="w-40 h-40 rounded-2xl bg-[var(--bg-tertiary)] border-4 border-[var(--bg-primary)]" />
                    <div className="flex-1 pb-4">
                        <div className="h-8 w-48 bg-[var(--bg-tertiary)] rounded mb-2" />
                        <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded mb-4" />
                        <div className="flex gap-4">
                            <div className="h-4 w-24 bg-[var(--bg-tertiary)] rounded" />
                            <div className="h-4 w-24 bg-[var(--bg-tertiary)] rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading Spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`${sizeClasses[size]} animate-spin`}>
            <svg viewBox="0 0 24 24" fill="none" className="text-[var(--primary)]">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}

// Full Page Loading
export function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">C</span>
                </div>
                <Spinner size="md" />
                <p className="text-[var(--text-secondary)]">Loading...</p>
            </motion.div>
        </div>
    );
}

// Feed Loading
export function FeedLoader() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
            ))}
        </div>
    );
}
