'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Home,
    Users,
    BookOpen,
    Calendar,
    Trophy,
    Star,
    TrendingUp,
    Clock,
    ChevronRight,
} from 'lucide-react';
import { useCommunityStore } from '@/lib/store';
import { mockLeaderboard, mockEvents } from '@/lib/mockData';

// Left Sidebar Component
export function LeftSidebar() {
    const { currentUser, groups } = useCommunityStore();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const joinedGroups = groups.filter((g: any) => g.isJoined);

    const menuItems = [
        { icon: Home, label: 'News Feed', href: '/', active: true },
        { icon: Users, label: 'My Groups', href: '/groups', count: joinedGroups.length },
        { icon: BookOpen, label: 'My Courses', href: '/classroom' },
        { icon: Calendar, label: 'Events', href: '/events' },
        { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
    ];

    return (
        <aside className="left-sidebar sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-4 space-y-4">
            {/* User Quick Info */}
            <div className="card p-4">
                <Link href="/profile" className="flex items-center gap-3 group">
                    <Image
                        src={currentUser?.avatar || '/placeholder-avatar.png'}
                        alt={currentUser?.name || 'User'}
                        width={40}
                        height={40}
                        className="avatar"
                        unoptimized
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate group-hover:text-[var(--primary)] transition-colors">
                            {currentUser?.name}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] truncate">
                            @{currentUser?.username}
                        </p>
                    </div>
                </Link>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="font-bold text-lg">{currentUser?.points.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">Points</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">{currentUser?.followers.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">Followers</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">{currentUser?.level}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">Level</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="card py-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${item.active
                            ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="flex-1 font-medium">{item.label}</span>
                        {item.count && (
                            <span className="text-sm text-[var(--text-tertiary)]">{item.count}</span>
                        )}
                    </Link>
                ))}
            </div>

            {/* Joined Groups */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">My Groups</h3>
                    <Link href="/groups" className="text-xs text-[var(--primary)] hover:underline">
                        See all
                    </Link>
                </div>
                <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {joinedGroups.slice(0, 5).map((group: any) => (
                        <Link
                            key={group.id}
                            href={`/groups/${group.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center text-lg">
                                {group.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{group.name}</p>
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    {group.memberCount.toLocaleString()} members
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

// Right Sidebar Component
export function RightSidebar() {
    const upcomingEvents = mockEvents.slice(0, 3);
    const topMembers = mockLeaderboard.slice(0, 5);

    return (
        <aside className="space-y-4">
            {/* Upcoming Events */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--primary)]" />
                        Upcoming Events
                    </h3>
                    <Link href="/events" className="text-xs text-[var(--primary)] hover:underline">
                        See all
                    </Link>
                </div>
                <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                        <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="block p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-[var(--primary)]">
                                        {event.startDate.toLocaleDateString('en', { month: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold text-[var(--primary)]">
                                        {event.startDate.getDate()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{event.title}</p>
                                    <p className="text-xs text-[var(--text-tertiary)] mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {event.startDate.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                        {event.attendees.length} attending
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[var(--accent-yellow)]" />
                        Top Contributors
                    </h3>
                    <Link href="/leaderboard" className="text-xs text-[var(--primary)] hover:underline">
                        See all
                    </Link>
                </div>
                <div className="space-y-2">
                    {topMembers.map((entry, index) => (
                        <div
                            key={entry.user.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                    index === 2 ? 'bg-orange-600/20 text-orange-600' :
                                        'bg-[var(--surface)] text-[var(--text-tertiary)]'
                                }`}>
                                {entry.rank}
                            </div>
                            <Image
                                src={entry.user.avatar || '/placeholder-avatar.png'}
                                alt={entry.user.name || 'User'}
                                width={32}
                                height={32}
                                className="avatar-sm"
                                unoptimized
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{entry.user.name}</p>
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    {entry.points.toLocaleString()} pts
                                </p>
                            </div>
                            {entry.change !== 0 && (
                                <div className={`flex items-center gap-0.5 text-xs ${entry.change > 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'
                                    }`}>
                                    <TrendingUp className={`w-3 h-3 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                                    {Math.abs(entry.change)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Discover Groups */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Star className="w-4 h-4 text-[var(--accent-purple)]" />
                        Discover Groups
                    </h3>
                </div>
                <div className="space-y-3">
                    <DiscoverGroupCard
                        icon="🤖"
                        name="AI & Machine Learning VN"
                        members={4500}
                    />
                    <DiscoverGroupCard
                        icon="🎨"
                        name="Design & Creative"
                        members={5800}
                    />
                </div>
                <Link
                    href="/groups/discover"
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--primary)] hover:underline"
                >
                    Explore more
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </aside>
    );
}

// Helper Component
function DiscoverGroupCard({ icon, name, members }: { icon: string; name: string; members: number }) {
    return (
        <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center text-xl">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                        {members.toLocaleString()} members
                    </p>
                </div>
            </div>
            <button className="btn-secondary w-full mt-3 text-sm py-2">
                Join Group
            </button>
        </div>
    );
}
