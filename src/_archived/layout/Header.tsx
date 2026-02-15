'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Home,
    Users,
    BookOpen,
    Calendar,
    Bell,
    MessageCircle,
    Menu,
    X,
    ChevronDown,
    Settings,
    LogOut,
    User,
    Plus,
    Sun,
    Moon,
} from 'lucide-react';
import { useCommunityStore } from '@/lib/store';
import { useTheme } from '@/components/ThemeProvider';

export default function Header() {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { currentUser, notifications, markNotificationRead, getUnreadNotificationCount } = useCommunityStore();
    const { theme, toggleTheme } = useTheme();
    const unreadCount = getUnreadNotificationCount();

    const navItems = [
        { icon: Home, label: 'Home', href: '/', active: true },
        { icon: Users, label: 'Groups', href: '/groups', active: false },
        { icon: BookOpen, label: 'Classroom', href: '/classroom', active: false },
        { icon: Calendar, label: 'Events', href: '/events', active: false },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-[var(--border)]">
            <div className="h-full max-w-[1600px] mx-auto px-4 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="text-xl font-bold text-gradient hidden sm:block">Community</span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl relative hidden md:block">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]"
                    />
                    <input
                        type="text"
                        placeholder="Search posts, groups, members..."
                        className="search-input w-full"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    <AnimatePresence>
                        {isSearchFocused && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-2 card p-4"
                            >
                                <div className="text-sm text-[var(--text-secondary)]">
                                    Type to search...
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${item.active
                                ? 'bg-[var(--primary)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        <AnimatePresence mode="wait">
                            {theme === 'light' ? (
                                <motion.div
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Moon className="w-5 h-5" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sun className="w-5 h-5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Create Button */}
                    <button className="btn-primary hidden sm:flex">
                        <Plus className="w-4 h-4" />
                        <span>Create</span>
                    </button>

                    {/* Messages */}
                    <button className="btn-icon relative">
                        <MessageCircle className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            className="btn-icon relative"
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-red)] rounded-full text-xs font-bold flex items-center justify-center text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-80 card overflow-hidden"
                                >
                                    <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                                        <h3 className="font-semibold">Notifications</h3>
                                        <button className="text-sm text-[var(--primary)] hover:underline">
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {notifications.slice(0, 5).map((notif: any) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 flex items-start gap-3 hover:bg-[var(--surface-hover)] cursor-pointer transition-colors ${!notif.isRead ? 'bg-[var(--primary)]/5' : ''
                                                    }`}
                                                onClick={() => markNotificationRead(notif.id)}
                                            >
                                                <Image
                                                    src={notif.actor.avatar || '/placeholder-avatar.png'}
                                                    alt={notif.actor.name || 'User'}
                                                    width={32}
                                                    height={32}
                                                    className="avatar-sm"
                                                    unoptimized
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm">
                                                        <span className="font-semibold">{notif.actor.name}</span>{' '}
                                                        <span className="text-[var(--text-secondary)]">{notif.message}</span>
                                                    </p>
                                                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                                        {getTimeAgo(notif.createdAt)}
                                                    </p>
                                                </div>
                                                {!notif.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-[var(--border)]">
                                        <Link
                                            href="/notifications"
                                            className="block text-center text-sm text-[var(--primary)] hover:underline"
                                        >
                                            View all notifications
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Menu */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--surface-hover)] transition-colors"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <Image
                                src={currentUser?.avatar || '/placeholder-avatar.png'}
                                alt={currentUser?.name || 'User'}
                                width={32}
                                height={32}
                                className="avatar-sm"
                                unoptimized
                            />
                            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] hidden sm:block" />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-64 card overflow-hidden"
                                >
                                    <div className="p-4 border-b border-[var(--border)]">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={currentUser?.avatar || '/placeholder-avatar.png'}
                                                alt={currentUser?.name || 'User'}
                                                width={40}
                                                height={40}
                                                className="avatar"
                                                unoptimized
                                            />
                                            <div>
                                                <p className="font-semibold">{currentUser?.name}</p>
                                                <p className="text-sm text-[var(--text-secondary)]">
                                                    @{currentUser?.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="badge badge-primary">Level {currentUser?.level}</span>
                                            <span className="text-sm text-[var(--text-secondary)]">
                                                {currentUser?.points.toLocaleString()} points
                                            </span>
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors"
                                        >
                                            <User className="w-5 h-5" />
                                            <span>View Profile</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors"
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span>Settings</span>
                                        </Link>

                                        {/* Theme Toggle in Menu */}
                                        <button
                                            onClick={toggleTheme}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors"
                                        >
                                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                        </button>
                                    </div>

                                    <div className="py-2 border-t border-[var(--border)]">
                                        <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--accent-red)] hover:bg-[var(--surface-hover)] transition-colors">
                                            <LogOut className="w-5 h-5" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="btn-icon lg:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-[var(--border)] bg-[var(--bg-secondary)]"
                    >
                        <div className="p-4">
                            {/* Mobile Search */}
                            <div className="relative mb-4 md:hidden">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="search-input w-full"
                                />
                            </div>

                            {/* Mobile Nav */}
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                            ? 'bg-[var(--primary)] text-white'
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}

                                {/* Mobile Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-all"
                                >
                                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                    <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                </button>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

// Helper function
function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
}
