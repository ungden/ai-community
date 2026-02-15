'use client';

import { useCommunityStore } from '@/lib/store';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

export default function Feed() {
    const { posts } = useCommunityStore();

    // Sort posts: pinned first, then by date
    const sortedPosts = [...posts].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="space-y-4">
            <CreatePost />

            <div className="space-y-4">
                {sortedPosts.map((post, index) => (
                    <div
                        key={post.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </div>
    );
}
