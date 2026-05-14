export interface WorkspaceMember {
  userId: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  logo?: string
  ownerId: string
  members: WorkspaceMember[]
  projectCount: number
  memberCount: number
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: string
}
