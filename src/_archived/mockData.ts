import { User, Post, Group, Course, Event, Notification, Badge } from './types';

// ============================================
// MOCK DATA - Users
// ============================================

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Alex Nguyen',
        username: 'alexng',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        coverPhoto: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
        bio: 'Founder & CEO | Building communities that matter 🚀',
        role: 'admin',
        isOnline: true,
        joinedAt: new Date('2023-01-15'),
        points: 15420,
        level: 25,
        badges: [
            { id: 'b1', name: 'Founder', icon: '👑', description: 'Platform founder', earnedAt: new Date('2023-01-15') },
            { id: 'b2', name: 'Top Contributor', icon: '⭐', description: '1000+ helpful posts', earnedAt: new Date('2023-06-01') },
        ],
        groups: ['g1', 'g2', 'g3'],
        followers: 12500,
        following: 342,
    },
    {
        id: '2',
        name: 'Minh Tran',
        username: 'minhtran',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh',
        bio: 'Tech Lead @ Big Tech | Sharing knowledge',
        role: 'moderator',
        isOnline: true,
        joinedAt: new Date('2023-02-20'),
        points: 8750,
        level: 18,
        badges: [
            { id: 'b3', name: 'Expert', icon: '🎓', description: 'Verified expert', earnedAt: new Date('2023-04-15') },
        ],
        groups: ['g1', 'g2'],
        followers: 5800,
        following: 156,
    },
    {
        id: '3',
        name: 'Linh Pham',
        username: 'linhpham',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linh',
        bio: 'Digital Marketing Specialist | Content Creator',
        role: 'member',
        isOnline: false,
        lastSeen: new Date(Date.now() - 3600000),
        joinedAt: new Date('2023-03-10'),
        points: 4320,
        level: 12,
        badges: [],
        groups: ['g1', 'g3'],
        followers: 2100,
        following: 423,
    },
    {
        id: '4',
        name: 'Huy Le',
        username: 'huyle',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huy',
        bio: 'Startup enthusiast | Building products',
        role: 'member',
        isOnline: true,
        joinedAt: new Date('2023-04-05'),
        points: 3150,
        level: 10,
        badges: [],
        groups: ['g1', 'g2'],
        followers: 890,
        following: 234,
    },
    {
        id: '5',
        name: 'Thao Vo',
        username: 'thaovo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thao',
        bio: 'UX Designer | Making products beautiful',
        role: 'member',
        isOnline: false,
        lastSeen: new Date(Date.now() - 7200000),
        joinedAt: new Date('2023-05-15'),
        points: 2780,
        level: 9,
        badges: [],
        groups: ['g1'],
        followers: 1560,
        following: 312,
    },
];

export const currentUser = mockUsers[0];

// ============================================
// MOCK DATA - Posts
// ============================================

export const mockPosts: Post[] = [
    {
        id: 'p1',
        author: mockUsers[0],
        content: `🚀 Chào mừng tất cả mọi người đến với cộng đồng của chúng ta!

Đây là nơi chúng ta cùng nhau học hỏi, chia sẻ kinh nghiệm và phát triển. Mình rất vui được kết nối với các bạn.

Hãy giới thiệu bản thân trong comments nhé! 👇`,
        images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'],
        createdAt: new Date(Date.now() - 3600000),
        reactions: [
            { type: 'like', userId: '2', createdAt: new Date() },
            { type: 'love', userId: '3', createdAt: new Date() },
            { type: 'like', userId: '4', createdAt: new Date() },
            { type: 'love', userId: '5', createdAt: new Date() },
        ],
        comments: [
            {
                id: 'c1',
                author: mockUsers[1],
                content: 'Rất vui được làm quen với mọi người! Mình là Minh, hiện đang làm Tech Lead. Hy vọng được chia sẻ nhiều kiến thức với cộng đồng 🙌',
                createdAt: new Date(Date.now() - 3000000),
                reactions: [{ type: 'like', userId: '1', createdAt: new Date() }],
                replies: [],
            },
            {
                id: 'c2',
                author: mockUsers[2],
                content: 'Xin chào! Mình là Linh, làm Marketing. Rất mong được học hỏi từ mọi người ❤️',
                createdAt: new Date(Date.now() - 2400000),
                reactions: [],
                replies: [],
            },
        ],
        shares: 24,
        isPinned: true,
        visibility: 'public',
    },
    {
        id: 'p2',
        author: mockUsers[1],
        content: `💡 Tips để học lập trình hiệu quả:

1. **Thực hành mỗi ngày** - Coding ít nhất 1 tiếng/ngày
2. **Build projects thực tế** - Đừng chỉ xem tutorial
3. **Tham gia cộng đồng** - Học từ người đi trước
4. **Review code người khác** - Hiểu nhiều cách tiếp cận
5. **Đừng sợ fail** - Mỗi bug là một bài học

Bạn có tips nào khác không? Share bên dưới nhé! 👇`,
        createdAt: new Date(Date.now() - 7200000),
        reactions: [
            { type: 'like', userId: '1', createdAt: new Date() },
            { type: 'like', userId: '3', createdAt: new Date() },
            { type: 'wow', userId: '4', createdAt: new Date() },
        ],
        comments: [
            {
                id: 'c3',
                author: mockUsers[3],
                content: 'Tip số 2 quan trọng lắm! Mình đã học được rất nhiều khi bắt tay vào làm project thực tế 💪',
                createdAt: new Date(Date.now() - 6000000),
                reactions: [],
                replies: [],
            },
        ],
        shares: 18,
        isPinned: false,
        visibility: 'public',
    },
    {
        id: 'p3',
        author: mockUsers[2],
        content: `📊 Vừa hoàn thành khóa học Marketing Automation!

Chia sẻ một số key takeaways:
• Email marketing vẫn là kênh ROI cao nhất
• Personalization là chìa khóa trong 2024
• AI đang thay đổi cách chúng ta làm content

Ai đang làm marketing cũng nên học automation để scale up công việc!`,
        images: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        ],
        createdAt: new Date(Date.now() - 14400000),
        reactions: [
            { type: 'like', userId: '1', createdAt: new Date() },
            { type: 'love', userId: '2', createdAt: new Date() },
        ],
        comments: [],
        shares: 12,
        isPinned: false,
        visibility: 'public',
    },
    {
        id: 'p4',
        author: mockUsers[3],
        content: `🎉 Finally shipped my first SaaS product!

6 tháng coding, 3 lần pivot, vô số đêm thức trắng... nhưng cuối cùng cũng đã launch được!

Cảm ơn cộng đồng đã support suốt quá trình 🙏

Link demo trong comment nếu ai muốn xem!`,
        createdAt: new Date(Date.now() - 28800000),
        reactions: [
            { type: 'love', userId: '1', createdAt: new Date() },
            { type: 'love', userId: '2', createdAt: new Date() },
            { type: 'wow', userId: '3', createdAt: new Date() },
            { type: 'like', userId: '5', createdAt: new Date() },
        ],
        comments: [
            {
                id: 'c4',
                author: mockUsers[0],
                content: 'Congrats bro! 🎉 Rất tự hào có member như bạn trong community!',
                createdAt: new Date(Date.now() - 27000000),
                reactions: [{ type: 'love', userId: '4', createdAt: new Date() }],
                replies: [],
            },
        ],
        shares: 35,
        isPinned: false,
        visibility: 'public',
    },
    {
        id: 'p5',
        author: mockUsers[4],
        content: `🎨 Design tip của ngày:

Khi thiết kế UI, hãy nhớ nguyên tắc "Less is More":
- Loại bỏ những elements không cần thiết
- Sử dụng whitespace hợp lý  
- Chọn color palette đơn giản (2-3 màu chính)
- Typography nhất quán

Mình vừa redesign lại portfolio theo hướng minimalist và feedback tích cực hơn hẳn! ✨`,
        images: [
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        ],
        createdAt: new Date(Date.now() - 43200000),
        reactions: [
            { type: 'like', userId: '1', createdAt: new Date() },
            { type: 'like', userId: '2', createdAt: new Date() },
        ],
        comments: [],
        shares: 8,
        isPinned: false,
        visibility: 'public',
    },
];

// ============================================
// MOCK DATA - Groups
// ============================================

export const mockGroups: Group[] = [
    {
        id: 'g1',
        name: 'Tech Startup VN',
        slug: 'tech-startup-vn',
        description: 'Cộng đồng dành cho founders và những người đam mê startup công nghệ tại Việt Nam. Chia sẻ kinh nghiệm, networking và cùng nhau phát triển.',
        coverPhoto: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
        icon: '🚀',
        category: 'business',
        visibility: 'public',
        memberCount: 12500,
        members: mockUsers.map((u, i) => ({
            userId: u.id,
            user: u,
            role: i === 0 ? 'admin' : i === 1 ? 'moderator' : 'member',
            joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            points: Math.floor(Math.random() * 5000),
        })),
        admins: ['1'],
        moderators: ['2'],
        courses: [],
        events: [],
        createdAt: new Date('2023-01-01'),
        isJoined: true,
        features: ['Exclusive content', 'Weekly AMAs', 'Job board', 'Mentorship'],
    },
    {
        id: 'g2',
        name: 'Web Development Mastery',
        slug: 'web-dev-mastery',
        description: 'Học và master web development từ cơ bản đến nâng cao. React, Next.js, Node.js, và nhiều hơn nữa!',
        coverPhoto: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
        icon: '💻',
        category: 'technology',
        visibility: 'public',
        memberCount: 8750,
        members: [],
        admins: ['2'],
        moderators: ['1'],
        courses: [],
        events: [],
        createdAt: new Date('2023-02-15'),
        isJoined: true,
        price: 299000,
        features: ['50+ hours video', 'Real projects', 'Certificate', 'Discord access'],
    },
    {
        id: 'g3',
        name: 'Digital Marketing Pro',
        slug: 'digital-marketing-pro',
        description: 'Cộng đồng marketing số #1 Việt Nam. Học từ các chuyên gia, cập nhật trends mới nhất.',
        coverPhoto: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200',
        icon: '📈',
        category: 'marketing',
        visibility: 'public',
        memberCount: 6200,
        members: [],
        admins: ['3'],
        moderators: [],
        courses: [],
        events: [],
        createdAt: new Date('2023-03-01'),
        isJoined: false,
        features: ['Case studies', 'Templates', 'Weekly workshops'],
    },
    {
        id: 'g4',
        name: 'AI & Machine Learning VN',
        slug: 'ai-ml-vn',
        description: 'Khám phá thế giới AI và Machine Learning. Từ basics đến advanced, cùng nhau học và build projects.',
        coverPhoto: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
        icon: '🤖',
        category: 'technology',
        visibility: 'public',
        memberCount: 4500,
        members: [],
        admins: ['1'],
        moderators: ['2'],
        courses: [],
        events: [],
        createdAt: new Date('2023-04-01'),
        isJoined: false,
        features: ['AI tools tutorials', 'Research papers', 'Project collaborations'],
    },
    {
        id: 'g5',
        name: 'Design & Creative',
        slug: 'design-creative',
        description: 'Nơi hội tụ của designers và creatives. UI/UX, Graphic Design, Motion Graphics và nhiều hơn nữa.',
        coverPhoto: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200',
        icon: '🎨',
        category: 'creative',
        visibility: 'public',
        memberCount: 5800,
        members: [],
        admins: ['5'],
        moderators: [],
        courses: [],
        events: [],
        createdAt: new Date('2023-05-01'),
        isJoined: false,
        features: ['Design resources', 'Portfolio reviews', 'Job opportunities'],
    },
];

// ============================================
// MOCK DATA - Courses
// ============================================

export const mockCourses: Course[] = [
    {
        id: 'course1',
        title: 'React & Next.js Complete Guide',
        description: 'Khóa học toàn diện về React và Next.js từ cơ bản đến nâng cao',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        instructor: mockUsers[1],
        groupId: 'g2',
        lessons: [
            { id: 'l1', title: 'Giới thiệu React', duration: 15, order: 1, isCompleted: true },
            { id: 'l2', title: 'JSX và Components', duration: 25, order: 2, isCompleted: true },
            { id: 'l3', title: 'Props và State', duration: 30, order: 3, isCompleted: false },
            { id: 'l4', title: 'Hooks cơ bản', duration: 35, order: 4, isCompleted: false },
            { id: 'l5', title: 'Advanced Hooks', duration: 40, order: 5, isCompleted: false },
        ],
        totalDuration: 145,
        enrolledCount: 2340,
        rating: 4.8,
        createdAt: new Date('2023-06-01'),
        progress: 40,
    },
    {
        id: 'course2',
        title: 'Node.js Backend Development',
        description: 'Xây dựng backend chuyên nghiệp với Node.js, Express và MongoDB',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        instructor: mockUsers[1],
        groupId: 'g2',
        lessons: [
            { id: 'l6', title: 'Node.js Fundamentals', duration: 20, order: 1 },
            { id: 'l7', title: 'Express.js Basics', duration: 25, order: 2 },
            { id: 'l8', title: 'RESTful APIs', duration: 35, order: 3 },
            { id: 'l9', title: 'MongoDB Integration', duration: 30, order: 4 },
        ],
        totalDuration: 110,
        enrolledCount: 1850,
        rating: 4.7,
        createdAt: new Date('2023-07-01'),
        progress: 0,
    },
    {
        id: 'course3',
        title: 'Facebook Ads Mastery',
        description: 'Học cách chạy quảng cáo Facebook hiệu quả và tối ưu chi phí',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
        instructor: mockUsers[2],
        groupId: 'g3',
        lessons: [
            { id: 'l10', title: 'Facebook Ads Overview', duration: 15, order: 1 },
            { id: 'l11', title: 'Audience Targeting', duration: 25, order: 2 },
            { id: 'l12', title: 'Ad Creative Best Practices', duration: 30, order: 3 },
            { id: 'l13', title: 'Budget & Bidding', duration: 20, order: 4 },
            { id: 'l14', title: 'Analytics & Optimization', duration: 35, order: 5 },
        ],
        totalDuration: 125,
        enrolledCount: 3200,
        rating: 4.9,
        createdAt: new Date('2023-08-01'),
        progress: 60,
    },
];

// ============================================
// MOCK DATA - Events
// ============================================

export const mockEvents: Event[] = [
    {
        id: 'e1',
        title: 'Weekly Startup AMA',
        description: 'Hỏi đáp trực tiếp với founders thành công. Chia sẻ kinh nghiệm, networking và học hỏi.',
        groupId: 'g1',
        host: mockUsers[0],
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isOnline: true,
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        attendees: ['1', '2', '3', '4'],
        createdAt: new Date(),
    },
    {
        id: 'e2',
        title: 'React Workshop: Building a Real App',
        description: 'Workshop thực hành xây dựng ứng dụng thực tế với React và Next.js',
        groupId: 'g2',
        host: mockUsers[1],
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        isOnline: true,
        meetingLink: 'https://zoom.us/j/123456789',
        attendees: ['1', '2', '4', '5'],
        maxAttendees: 50,
        createdAt: new Date(),
    },
    {
        id: 'e3',
        title: 'Marketing Meetup Saigon',
        description: 'Gặp mặt offline tại Saigon. Networking và chia sẻ case studies thực tế.',
        groupId: 'g3',
        host: mockUsers[2],
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        isOnline: false,
        location: 'The Coffee House, Q1, HCM',
        attendees: ['3', '5'],
        maxAttendees: 30,
        createdAt: new Date(),
    },
];

// ============================================
// MOCK DATA - Notifications
// ============================================

export const mockNotifications: Notification[] = [
    {
        id: 'n1',
        type: 'like',
        title: 'New reaction',
        message: 'liked your post',
        actor: mockUsers[1],
        targetId: 'p1',
        targetType: 'post',
        isRead: false,
        createdAt: new Date(Date.now() - 300000),
    },
    {
        id: 'n2',
        type: 'comment',
        title: 'New comment',
        message: 'commented on your post',
        actor: mockUsers[2],
        targetId: 'p1',
        targetType: 'post',
        isRead: false,
        createdAt: new Date(Date.now() - 600000),
    },
    {
        id: 'n3',
        type: 'follow',
        title: 'New follower',
        message: 'started following you',
        actor: mockUsers[3],
        targetId: '1',
        targetType: 'post',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000),
    },
    {
        id: 'n4',
        type: 'event',
        title: 'Event reminder',
        message: 'Weekly Startup AMA starts in 2 days',
        actor: mockUsers[0],
        targetId: 'e1',
        targetType: 'event',
        isRead: true,
        createdAt: new Date(Date.now() - 7200000),
    },
];

// ============================================
// MOCK DATA - Leaderboard
// ============================================

export const mockLeaderboard = mockUsers
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
        rank: index + 1,
        user,
        points: user.points,
        change: Math.floor(Math.random() * 5) - 2,
    }));
