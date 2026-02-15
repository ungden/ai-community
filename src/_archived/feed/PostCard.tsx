'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MoreHorizontal,
    ThumbsUp,
    MessageCircle,
    Share2,
    Bookmark,
    Pin,
    Heart,
    Laugh,
    AlertCircle,
    Send,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Post, Comment, Reaction, User } from '@/lib/types';
import { useCommunityStore } from '@/lib/store';

interface PostCardProps {
    post: Post;
}

const reactionEmojis = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠',
};

export default function PostCard({ post }: PostCardProps) {
    const { currentUser, addReaction, removeReaction, addComment } = useCommunityStore();
    const [showReactions, setShowReactions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    const userReaction = post.reactions.find(r => r.userId === currentUser?.id);
    const reactionCount = post.reactions.length;
    const commentCount = post.comments.length;

    // Group reactions by type
    const reactionGroups = post.reactions.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topReactions = Object.entries(reactionGroups)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const handleReaction = (type: Reaction['type']) => {
        if (userReaction) {
            if (userReaction.type === type) {
                removeReaction(post.id, currentUser!.id);
            } else {
                removeReaction(post.id, currentUser!.id);
                addReaction(post.id, {
                    type,
                    userId: currentUser!.id,
                    createdAt: new Date(),
                });
            }
        } else {
            addReaction(post.id, {
                type,
                userId: currentUser!.id,
                createdAt: new Date(),
            });
        }
        setShowReactions(false);
    };

    const handleComment = () => {
        if (!commentText.trim()) return;

        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: currentUser as User,
            content: commentText.trim(),
            createdAt: new Date(),
            reactions: [],
            replies: [],
        };

        addComment(post.id, newComment);
        setCommentText('');
    };

    const displayedComments = showAllComments
        ? post.comments
        : post.comments.slice(0, 2);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
        >
            {/* Pinned Badge */}
            {post.isPinned && (
                <div className="px-4 py-2 bg-[var(--primary)]/10 border-b border-[var(--border)] flex items-center gap-2 text-sm text-[var(--primary)]">
                    <Pin className="w-4 h-4" />
                    <span>Pinned Post</span>
                </div>
            )}

            {/* Header */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={post.author.avatar || '/placeholder-avatar.png'}
                                alt={post.author.name || 'User'}
                                width={40}
                                height={40}
                                className="avatar"
                                unoptimized
                            />
                            {post.author.isOnline && (
                                <div className="online-indicator" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold hover:underline cursor-pointer">
                                    {post.author.name}
                                </span>
                                {post.author.role === 'admin' && (
                                    <span className="badge badge-primary text-xs py-0.5">Admin</span>
                                )}
                                {post.author.role === 'moderator' && (
                                    <span className="badge text-xs py-0.5">Mod</span>
                                )}
                            </div>
                            <p className="text-sm text-[var(--text-tertiary)]">
                                {getTimeAgo(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            className="btn-icon"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-1 w-48 card py-2 z-10"
                                >
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                                        <Bookmark className="w-4 h-4" />
                                        <span>Save Post</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Report</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-3">
                    <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </p>
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                    <div className={`mt-3 grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' :
                            post.images.length === 2 ? 'grid-cols-2' :
                                'grid-cols-2'
                        }`}>
                        {post.images.map((img, index) => (
                            <motion.img
                                key={index}
                                src={img}
                                alt={`Post image ${index + 1}`}
                                className={`w-full object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity ${post.images!.length === 1 ? 'max-h-[500px]' : 'h-48'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                            />
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1">
                        {topReactions.length > 0 && (
                            <>
                                <div className="flex -space-x-1">
                                    {topReactions.map(([type]) => (
                                        <span key={type} className="text-base">
                                            {reactionEmojis[type as keyof typeof reactionEmojis]}
                                        </span>
                                    ))}
                                </div>
                                <span className="ml-1">{reactionCount}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {commentCount > 0 && (
                            <button
                                onClick={() => setShowComments(!showComments)}
                                className="hover:underline"
                            >
                                {commentCount} comments
                            </button>
                        )}
                        {post.shares > 0 && (
                            <span>{post.shares} shares</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4">
                <div className="divider !my-0 mb-2" />
                <div className="flex items-center justify-around relative">
                    {/* Like Button with Reactions */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowReactions(true)}
                        onMouseLeave={() => setShowReactions(false)}
                    >
                        <button
                            onClick={() => handleReaction('like')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${userReaction
                                    ? 'text-[var(--primary)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                }`}
                        >
                            {userReaction ? (
                                <span className="text-lg">
                                    {reactionEmojis[userReaction.type]}
                                </span>
                            ) : (
                                <ThumbsUp className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                                {userReaction ? capitalize(userReaction.type) : 'Like'}
                            </span>
                        </button>

                        {/* Reaction Picker */}
                        <AnimatePresence>
                            {showReactions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-[var(--surface)] rounded-full border border-[var(--border)] shadow-lg flex items-center gap-1"
                                >
                                    {Object.entries(reactionEmojis).map(([type, emoji]) => (
                                        <motion.button
                                            key={type}
                                            whileHover={{ scale: 1.3, y: -5 }}
                                            onClick={() => handleReaction(type as Reaction['type'])}
                                            className="w-9 h-9 flex items-center justify-center text-2xl hover:bg-[var(--surface-hover)] rounded-full transition-colors"
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Comment</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-[var(--border)]"
                    >
                        <div className="p-4 space-y-4">
                            {/* Comment Input */}
                            <div className="flex items-start gap-3">
                                <Image
                                    src={currentUser?.avatar || '/placeholder-avatar.png'}
                                    alt={currentUser?.name || 'User'}
                                    width={32}
                                    height={32}
                                    className="avatar-sm shrink-0"
                                    unoptimized
                                />
                                <div className="flex-1 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                                        placeholder="Write a comment..."
                                        className="input flex-1"
                                    />
                                    <button
                                        onClick={handleComment}
                                        disabled={!commentText.trim()}
                                        className="btn-icon text-[var(--primary)] disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-3">
                                {displayedComments.map((comment) => (
                                    <CommentItem key={comment.id} comment={comment} />
                                ))}
                            </div>

                            {/* Show More/Less */}
                            {post.comments.length > 2 && (
                                <button
                                    onClick={() => setShowAllComments(!showAllComments)}
                                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {showAllComments ? (
                                        <>
                                            <ChevronUp className="w-4 h-4" />
                                            Show less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            View {post.comments.length - 2} more comments
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}

// Comment Item Component
function CommentItem({ comment }: { comment: Comment }) {
    return (
        <div className="flex items-start gap-3">
            <Image
                src={comment.author.avatar || '/placeholder-avatar.png'}
                alt={comment.author.name || 'User'}
                width={32}
                height={32}
                className="avatar-sm shrink-0"
                unoptimized
            />
            <div className="flex-1">
                <div className="inline-block bg-[var(--bg-tertiary)] rounded-2xl px-4 py-2">
                    <p className="font-semibold text-sm">{comment.author.name}</p>
                    <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-[var(--text-tertiary)]">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                    <span>{getTimeAgo(comment.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}

// Helper functions
function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

    return date.toLocaleDateString();
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
