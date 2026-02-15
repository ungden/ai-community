export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionTier = 'free' | 'basic' | 'premium'
export type UserRole = 'admin' | 'member'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type ToolCategory = 'llm' | 'image' | 'audio' | 'video' | 'automation' | 'coding' | 'writing'
export type ToolPricing = 'free' | 'freemium' | 'paid'
export type GroupPrivacy = 'public' | 'private'
export type GroupMemberRole = 'owner' | 'admin' | 'moderator' | 'member'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: UserRole
          points: number
          subscription_tier: SubscriptionTier
          subscription_expires_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          points?: number
          subscription_tier?: SubscriptionTier
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          points?: number
          subscription_tier?: SubscriptionTier
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_image: string | null
          category_id: string | null
          author_id: string
          group_id: string | null
          required_tier: SubscriptionTier
          views: number
          likes: number
          status: ContentStatus
          is_pinned: boolean
          published_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          cover_image?: string | null
          category_id?: string | null
          author_id: string
          group_id?: string | null
          required_tier?: SubscriptionTier
          views?: number
          likes?: number
          status?: ContentStatus
          is_pinned?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          cover_image?: string | null
          category_id?: string | null
          author_id?: string
          group_id?: string | null
          required_tier?: SubscriptionTier
          views?: number
          likes?: number
          status?: ContentStatus
          is_pinned?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      post_likes: {
        Row: {
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          cover_image: string | null
          category_id: string | null
          instructor_id: string
          group_id: string | null
          required_tier: SubscriptionTier
          required_level: number
          duration_minutes: number
          lessons_count: number
          status: ContentStatus
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          cover_image?: string | null
          category_id?: string | null
          instructor_id: string
          group_id?: string | null
          required_tier?: SubscriptionTier
          required_level?: number
          duration_minutes?: number
          lessons_count?: number
          status?: ContentStatus
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          cover_image?: string | null
          category_id?: string | null
          instructor_id?: string
          group_id?: string | null
          required_tier?: SubscriptionTier
          required_level?: number
          duration_minutes?: number
          lessons_count?: number
          status?: ContentStatus
          created_at?: string
          updated_at?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          video_url: string | null
          order_index: number
          duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          video_url?: string | null
          order_index?: number
          duration_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          order_index?: number
          duration_minutes?: number
          created_at?: string
        }
      }
      user_course_progress: {
        Row: {
          user_id: string
          course_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          user_id: string
          course_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          user_id?: string
          course_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: SubscriptionTier
          price: number
          status: SubscriptionStatus
          payment_method: string | null
          payment_ref: string | null
          starts_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: SubscriptionTier
          price: number
          status?: SubscriptionStatus
          payment_method?: string | null
          payment_ref?: string | null
          starts_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: SubscriptionTier
          price?: number
          status?: SubscriptionStatus
          payment_method?: string | null
          payment_ref?: string | null
          starts_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          subscription_id: string
          user_id: string
          amount: number
          status: PaymentStatus
          sepay_transaction_id: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          user_id: string
          amount: number
          status?: PaymentStatus
          sepay_transaction_id?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          user_id?: string
          amount?: number
          status?: PaymentStatus
          sepay_transaction_id?: string | null
          paid_at?: string | null
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string
          requirement_type: string
          requirement_value: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon: string
          requirement_type: string
          requirement_value: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string
          requirement_type?: string
          requirement_value?: number
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          parent_id: string | null
          content: string
          likes: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          parent_id?: string | null
          content: string
          likes?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          parent_id?: string | null
          content?: string
          likes?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      comment_likes: {
        Row: {
          user_id: string
          comment_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          comment_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          comment_id?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: string
          start_time: string
          duration_minutes: number
          location: string | null
          meeting_url: string | null
          host_id: string
          max_attendees: number | null
          status: ContentStatus
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type: string
          start_time: string
          duration_minutes?: number
          location?: string | null
          meeting_url?: string | null
          host_id: string
          max_attendees?: number | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: string
          start_time?: string
          duration_minutes?: number
          location?: string | null
          meeting_url?: string | null
          host_id?: string
          max_attendees?: number | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string | null
        }
      }
      event_attendees: {
        Row: {
          event_id: string
          user_id: string
          registered_at: string
        }
        Insert: {
          event_id: string
          user_id: string
          registered_at?: string
        }
        Update: {
          event_id?: string
          user_id?: string
          registered_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          about: string | null
          cover_image: string | null
          icon_emoji: string
          color: string
          privacy: GroupPrivacy
          owner_id: string
          member_count: number
          post_count: number
          course_count: number
          is_featured: boolean
          required_tier: SubscriptionTier
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          about?: string | null
          cover_image?: string | null
          icon_emoji?: string
          color?: string
          privacy?: GroupPrivacy
          owner_id: string
          member_count?: number
          post_count?: number
          course_count?: number
          is_featured?: boolean
          required_tier?: SubscriptionTier
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          about?: string | null
          cover_image?: string | null
          icon_emoji?: string
          color?: string
          privacy?: GroupPrivacy
          owner_id?: string
          member_count?: number
          post_count?: number
          course_count?: number
          is_featured?: boolean
          required_tier?: SubscriptionTier
          created_at?: string
          updated_at?: string | null
        }
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          role: GroupMemberRole
          points_in_group: number
          joined_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          role?: GroupMemberRole
          points_in_group?: number
          joined_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          role?: GroupMemberRole
          points_in_group?: number
          joined_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          category: ToolCategory
          pricing: ToolPricing
          pricing_detail: string | null
          features: string[]
          use_cases: string[]
          pros: string[]
          cons: string[]
          rating: number
          is_featured: boolean
          order_index: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          category: ToolCategory
          pricing: ToolPricing
          pricing_detail?: string | null
          features?: string[]
          use_cases?: string[]
          pros?: string[]
          cons?: string[]
          rating?: number
          is_featured?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          category?: ToolCategory
          pricing?: ToolPricing
          pricing_detail?: string | null
          features?: string[]
          use_cases?: string[]
          pros?: string[]
          cons?: string[]
          rating?: number
          is_featured?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_group_member_count: {
        Args: { group_id_input: string }
        Returns: undefined
      }
      decrement_group_member_count: {
        Args: { group_id_input: string }
        Returns: undefined
      }
      increment_group_post_count: {
        Args: { group_id_input: string }
        Returns: undefined
      }
    }
    Enums: {
      subscription_tier: SubscriptionTier
      user_role: UserRole
      content_status: ContentStatus
      subscription_status: SubscriptionStatus
      payment_status: PaymentStatus
      tool_category: ToolCategory
      tool_pricing: ToolPricing
      group_privacy: GroupPrivacy
      group_member_role: GroupMemberRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type Tool = Database['public']['Tables']['tools']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']

// Extended types with relations
export type PostWithAuthor = Post & {
  author: Profile
  category: Category | null
  is_pinned?: boolean
}

export type CourseWithInstructor = Course & {
  instructor: Profile
  category: Category | null
  lessons?: Lesson[]
  required_level?: number
}

export type ProfileWithBadges = Profile & {
  badges: Badge[]
}

// Comment types
export type Comment = Database['public']['Tables']['comments']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventAttendee = Database['public']['Tables']['event_attendees']['Row']

export type CommentWithAuthor = Comment & {
  author: Profile
  replies?: CommentWithAuthor[]
}

export type EventWithHost = Event & {
  host: Profile
  attendees_count?: number
}

// Group types
export type GroupWithOwner = Group & {
  owner: Profile
}

export type GroupMemberWithProfile = GroupMember & {
  profile: Profile
}
