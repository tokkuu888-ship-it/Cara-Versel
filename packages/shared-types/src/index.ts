// Enums
export enum UserRole {
  DEAN = 'DEAN',
  COORDINATOR = 'COORDINATOR',
  FACULTY = 'FACULTY',
  PHD_CANDIDATE = 'PHD_CANDIDATE',
  TECHNICAL_MODERATOR = 'TECHNICAL_MODERATOR'
}

export enum SeminarPhase {
  PRESENTATION = 'PRESENTATION',
  PEER_REVIEW = 'PEER_REVIEW',
  FACULTY_VIVA = 'FACULTY_VIVA',
  MENTORSHIP = 'MENTORSHIP'
}

export enum PilotPhaseStatus {
  ORIENTATION = 'ORIENTATION',
  SENIOR_SHOWCASE = 'SENIOR_SHOWCASE',
  FULL_INTEGRATION = 'FULL_INTEGRATION'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  TENTATIVE = 'TENTATIVE'
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PresentationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  PRESENTED = 'PRESENTED',
  CANCELLED = 'CANCELLED'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISION_REQUIRED = 'REVISION_REQUIRED'
}

export enum FeedbackCategory {
  TECHNICAL = 'TECHNICAL',
  RHETORICAL = 'RHETORICAL',
  METHODOLOGY = 'METHODOLOGY',
  STRUCTURE = 'STRUCTURE',
  PRESENTATION_SKILLS = 'PRESENTATION_SKILLS',
  MENTORSHIP = 'MENTORSHIP'
}

export enum NotificationType {
  SEMINAR_SCHEDULED = 'SEMINAR_SCHEDULED',
  SEMINAR_REMINDER = 'SEMINAR_REMINDER',
  PROGRESS_REPORT_DUE = 'PROGRESS_REPORT_DUE',
  AVAILABILITY_POLL = 'AVAILABILITY_POLL',
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}

// Database Models (matching Prisma schema)
export interface User {
  id: string
  name: string | null
  email: string
  role: UserRole
  department: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  content: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
}

export interface SeminarWindow {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SeminarSession {
  id: string
  title: string
  description: string | null
  scheduledAt: Date
  duration: number
  location: string | null
  isHybrid: boolean
  hybridLink: string | null
  phase: SeminarPhase
  status: SessionStatus
  windowId: string
  createdAt: Date
  updatedAt: Date
}

export interface Presentation {
  id: string
  title: string
  abstract: string | null
  chapter: string | null
  methodology: string | null
  presenterId: string
  sessionId: string
  slidesUrl: string | null
  status: PresentationStatus
  createdAt: Date
  updatedAt: Date
}

export interface ProgressReport {
  id: string
  title: string
  content: string
  achievements: string | null
  challenges: string | null
  nextSteps: string | null
  timeline: string | null
  studentId: string
  submittedAt: Date
  reviewedAt: Date | null
  reviewerId: string | null
  reviewComments: string | null
  status: ReportStatus
  createdAt: Date
  updatedAt: Date
}

export interface AvailabilityPoll {
  id: string
  windowId: string
  pollerId: string
  title: string
  description: string | null
  deadline: Date
  createdAt: Date
  updatedAt: Date
}

export interface AvailabilityResponse {
  id: string
  pollId: string
  respondentId: string
  status: AvailabilityStatus
  preferredTimes: string | null
  comments: string | null
  submittedAt: Date
  updatedAt: Date
}

export interface Feedback {
  id: string
  sessionId: string | null
  presentationId: string | null
  giverId: string
  receiverId: string
  category: FeedbackCategory
  content: string
  rating: number | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  recipientId: string
  isRead: boolean
  data: any | null
  createdAt: Date
  updatedAt: Date
}

export interface PilotPhaseConfig {
  id: string
  name: string
  description: string | null
  phase: PilotPhaseStatus
  startDate: Date
  endDate: Date
  isActive: boolean
  objectives: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SampleData {
  id: string
  name: string
  description: string | null
  value: number | null
  category: string | null
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
  }
  count?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Request/Response DTOs
export interface CreateUserRequest {
  name?: string
  email: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
}

export interface CreatePostRequest {
  title: string
  content?: string
  published?: boolean
  authorId: string
}

export interface UpdatePostRequest {
  title?: string
  content?: string
  published?: boolean
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number
  totalPosts: number
  activeConnections: number
  apiStatus: 'online' | 'offline' | 'error'
}

export interface DashboardData {
  users: User[]
  posts: Post[]
  stats: DashboardStats
}

// Error Types
export interface ApiError {
  message: string
  statusCode?: number
  isOperational?: boolean
  stack?: string
}

// Environment Variable Types
export interface EnvironmentConfig {
  POSTGRES_PRISMA_URL: string
  EXPRESS_API_URL: string
  JWT_SECRET: string
  NODE_ENV: 'development' | 'production' | 'test'
  PORT?: number
  FRONTEND_URL?: string
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
