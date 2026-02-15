'use client';

import { useState, useRef } from 'react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image,
    Video,
    FileText,
    BarChart3,
    Smile,
    MapPin,
    AtSign,
    X,
    Send,
} from 'lucide-react';
import { useCommunityStore } from '@/lib/store';
import { Post, User } from '@/lib/types';

export default function CreatePost() {
    const { currentUser, addPost } = useCommunityStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (!content.trim() && images.length === 0) return;

        const newPost: Post = {
            id: `post-${Date.now()}`,
            author: currentUser as User,
            content: content.trim(),
            images: images.length > 0 ? images : undefined,
            createdAt: new Date(),
            reactions: [],
            comments: [],
            shares: 0,
            isPinned: false,
            visibility: 'public',
        };

        addPost(newPost);
        setContent('');
        setImages([]);
        setIsExpanded(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.metaKey) {
            handleSubmit();
        }
    };

    const actionButtons = [
        { icon: Image, label: 'Photo', color: 'text-green-500' },
        { icon: Video, label: 'Video', color: 'text-red-500' },
        { icon: BarChart3, label: 'Poll', color: 'text-yellow-500' },
        { icon: FileText, label: 'Article', color: 'text-blue-500' },
    ];

    return (
        <motion.div
            layout
            className="card overflow-hidden"
        >
            <div className="p-4">
                <div className="flex gap-3">
                    <NextImage
                        src={currentUser?.avatar || '/placeholder-avatar.png'}
                        alt={currentUser?.name || 'User'}
                        width={40}
                        height={40}
                        className="avatar shrink-0"
                        unoptimized
                    />
                    <div className="flex-1">
                        <div
                            className={`relative transition-all ${isExpanded ? '' : 'cursor-pointer'
                                }`}
                            onClick={() => !isExpanded && setIsExpanded(true)}
                        >
                            {isExpanded ? (
                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="What's on your mind?"
                                    className="w-full p-4 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl resize-none focus:outline-none focus:border-[var(--primary)] min-h-[120px]"
                                    autoFocus
                                />
                            ) : (
                                <div className="w-full p-4 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-full text-[var(--text-tertiary)] hover:bg-[var(--surface-hover)] transition-colors">
                                    What&apos;s on your mind, {currentUser?.name?.split(' ')[0]}?
                                </div>
                            )}
                        </div>

                        {/* Image Preview */}
                        <AnimatePresence>
                            {images.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 grid grid-cols-2 gap-2"
                                >
                                    {images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <NextImage
                                                src={img}
                                                alt={`Upload ${index + 1}`}
                                                width={200}
                                                height={128}
                                                className="w-full h-32 object-cover rounded-xl"
                                                unoptimized
                                            />
                                            <button
                                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Expanded Actions */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-3 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-1">
                                        <button className="btn-ghost p-2">
                                            <Smile className="w-5 h-5 text-[var(--accent-yellow)]" />
                                        </button>
                                        <button className="btn-ghost p-2">
                                            <AtSign className="w-5 h-5 text-[var(--primary)]" />
                                        </button>
                                        <button className="btn-ghost p-2">
                                            <MapPin className="w-5 h-5 text-[var(--accent-red)]" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setIsExpanded(false);
                                                setContent('');
                                                setImages([]);
                                            }}
                                            className="btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!content.trim() && images.length === 0}
                                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-4 h-4" />
                                            Post
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Quick Action Buttons */}
            {!isExpanded && (
                <div className="px-4 pb-4">
                    <div className="divider !my-0 mb-3" />
                    <div className="flex items-center justify-around">
                        {actionButtons.map((btn) => (
                            <button
                                key={btn.label}
                                onClick={() => setIsExpanded(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                            >
                                <btn.icon className={`w-5 h-5 ${btn.color}`} />
                                <span className="text-sm text-[var(--text-secondary)] hidden sm:block">
                                    {btn.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
