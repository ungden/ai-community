import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Post, Group, Notification, Comment, Reaction } from './types';
import { currentUser, mockPosts, mockGroups, mockNotifications } from './mockData';

interface CommunityStore {
    // State
    currentUser: User | null;
    posts: Post[];
    groups: Group[];
    notifications: Notification[];
    activeGroupId: string | null;
    isLoading: boolean;

    // User Actions
    setCurrentUser: (user: User | null) => void;

    // Post Actions
    addPost: (post: Post) => void;
    updatePost: (id: string, updates: Partial<Post>) => void;
    deletePost: (id: string) => void;
    togglePinPost: (id: string) => void;

    // Comment Actions
    addComment: (postId: string, comment: Comment) => void;

    // Reaction Actions
    addReaction: (postId: string, reaction: Reaction) => void;
    removeReaction: (postId: string, userId: string) => void;

    // Group Actions
    setActiveGroup: (groupId: string | null) => void;
    joinGroup: (groupId: string) => void;
    leaveGroup: (groupId: string) => void;

    // Notification Actions
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;

    // Utility
    getUnreadNotificationCount: () => number;
}

export const useCommunityStore = create<CommunityStore>()(
    persist(
        (set, get) => ({
            // Initial State
            currentUser: currentUser,
            posts: mockPosts,
            groups: mockGroups,
            notifications: mockNotifications,
            activeGroupId: null,
            isLoading: false,

            // User Actions
            setCurrentUser: (user) => set({ currentUser: user }),

            // Post Actions
            addPost: (post) => set((state) => ({
                posts: [post, ...state.posts]
            })),

            updatePost: (id, updates) => set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === id ? { ...post, ...updates } : post
                ),
            })),

            deletePost: (id) => set((state) => ({
                posts: state.posts.filter((post) => post.id !== id),
            })),

            togglePinPost: (id) => set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === id ? { ...post, isPinned: !post.isPinned } : post
                ),
            })),

            // Comment Actions
            addComment: (postId, comment) => set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === postId
                        ? { ...post, comments: [...post.comments, comment] }
                        : post
                ),
            })),

            // Reaction Actions
            addReaction: (postId, reaction) => set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === postId
                        ? { ...post, reactions: [...post.reactions, reaction] }
                        : post
                ),
            })),

            removeReaction: (postId, userId) => set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === postId
                        ? { ...post, reactions: post.reactions.filter((r) => r.userId !== userId) }
                        : post
                ),
            })),

            // Group Actions
            setActiveGroup: (groupId) => set({ activeGroupId: groupId }),

            joinGroup: (groupId) => set((state) => ({
                groups: state.groups.map((group) =>
                    group.id === groupId
                        ? { ...group, isJoined: true, memberCount: group.memberCount + 1 }
                        : group
                ),
            })),

            leaveGroup: (groupId) => set((state) => ({
                groups: state.groups.map((group) =>
                    group.id === groupId
                        ? { ...group, isJoined: false, memberCount: group.memberCount - 1 }
                        : group
                ),
            })),

            // Notification Actions
            markNotificationRead: (id) => set((state) => ({
                notifications: state.notifications.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                ),
            })),

            markAllNotificationsRead: () => set((state) => ({
                notifications: state.notifications.map((notif) => ({ ...notif, isRead: true })),
            })),

            // Utility
            getUnreadNotificationCount: () => {
                return get().notifications.filter((n) => !n.isRead).length;
            },
        }),
        {
            name: 'community-store',
            partialize: (state) => ({
                // Only persist these fields
                notifications: state.notifications,
            }),
        }
    )
);
