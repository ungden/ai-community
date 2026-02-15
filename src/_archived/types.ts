// ============================================
// COMMUNITY PLATFORM - TYPE DEFINITIONS
// ============================================

// User Types
export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverPhoto?: string;
    bio?: string;
    role: 'admin' | 'moderator' | 'member';
    isOnline: boolean;
    lastSeen?: Date;
    joinedAt: Date;
    points: number;
    level: number;
    badges: Badge[];
    groups: string[];
    followers: number;
    following: number;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: Date;
}

// Post Types
export interface Post {
    id: string;
    author: User;
    content: string;
    images?: string[];
    video?: string;
    poll?: Poll;
    groupId?: string;
    createdAt: Date;
    updatedAt?: Date;
    reactions: Reaction[];
    comments: Comment[];
    shares: number;
    isPinned: boolean;
    visibility: 'public' | 'members' | 'private';
}

export interface Poll {
    question: string;
    options: PollOption[];
    endsAt?: Date;
    allowMultiple: boolean;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
    voters: string[];
}

export interface Reaction {
    type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
    userId: string;
    createdAt: Date;
}

export interface Comment {
    id: string;
    author: User;
    content: string;
    createdAt: Date;
    reactions: Reaction[];
    replies: Comment[];
}

// Group Types
export interface Group {
    id: string;
    name: string;
    slug: string;
    description: string;
    coverPhoto: string;
    icon: string;
    category: GroupCategory;
    visibility: 'public' | 'private' | 'secret';
    memberCount: number;
    members: GroupMember[];
    admins: string[];
    moderators: string[];
    courses: Course[];
    events: Event[];
    createdAt: Date;
    isJoined?: boolean;
    price?: number;
    features?: string[];
}

export interface GroupMember {
    userId: string;
    user: User;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: Date;
    points: number;
}

export type GroupCategory =
    | 'business'
    | 'technology'
    | 'health'
    | 'education'
    | 'lifestyle'
    | 'creative'
    | 'finance'
    | 'marketing'
    | 'other';

// Course Types
export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: User;
    groupId: string;
    lessons: Lesson[];
    totalDuration: number;
    enrolledCount: number;
    rating: number;
    createdAt: Date;
    progress?: number;
}

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    duration: number;
    order: number;
    resources?: Resource[];
    isCompleted?: boolean;
}

export interface Resource {
    id: string;
    name: string;
    type: 'pdf' | 'link' | 'file';
    url: string;
}

// Event Types
export interface Event {
    id: string;
    title: string;
    description: string;
    coverPhoto?: string;
    groupId: string;
    host: User;
    startDate: Date;
    endDate?: Date;
    location?: string;
    isOnline: boolean;
    meetingLink?: string;
    attendees: string[];
    maxAttendees?: number;
    createdAt: Date;
}

// Notification Types
export interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'mention' | 'event' | 'course' | 'group';
    title: string;
    message: string;
    actor: User;
    targetId: string;
    targetType: 'post' | 'comment' | 'event' | 'course' | 'group';
    isRead: boolean;
    createdAt: Date;
}

// Message Types
export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    id: string;
    conversationId: string;
    sender: User;
    content: string;
    attachments?: Attachment[];
    isRead: boolean;
    createdAt: Date;
}

export interface Attachment {
    id: string;
    type: 'image' | 'video' | 'file';
    url: string;
    name: string;
    size: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
    rank: number;
    user: User;
    points: number;
    change: number;
}

// Store Types
export interface CommunityState {
    currentUser: User | null;
    posts: Post[];
    groups: Group[];
    notifications: Notification[];
    conversations: Conversation[];
    activeGroup: Group | null;
    isLoading: boolean;

    // Actions
    setCurrentUser: (user: User | null) => void;
    addPost: (post: Post) => void;
    updatePost: (id: string, updates: Partial<Post>) => void;
    deletePost: (id: string) => void;
    addComment: (postId: string, comment: Comment) => void;
    addReaction: (postId: string, reaction: Reaction) => void;
    setActiveGroup: (group: Group | null) => void;
    markNotificationRead: (id: string) => void;
}
