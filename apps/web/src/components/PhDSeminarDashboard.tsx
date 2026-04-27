'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  UserCheck,
  BookOpen,
  Award,
  Plus,
  Settings,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchSeminars, fetchUsers, fetchProgressReports, createSeminarWindow, createSeminarSession, createUser, createProgressReport, createAvailabilityPoll } from '@/lib/phd-api'

interface DashboardStats {
  totalSeminars: number
  upcomingSeminars: number
  totalUsers: number
  pendingReports: number
  completedReports: number
  activeWindows: number
}

export function PhDSeminarDashboard() {
  const { data: seminars, isLoading: seminarsLoading } = useQuery({
    queryKey: ['seminars'],
    queryFn: fetchSeminars,
    refetchInterval: 30000,
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: 60000,
  })

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['progress-reports'],
    queryFn: fetchProgressReports,
    refetchInterval: 30000,
  })

  const handleCreateSeminar = async () => {
    try {
      const windowData = {
        title: 'New Seminar Window',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        phase: 'PLANNING'
      }
      await createSeminarWindow(windowData)
      alert('Seminar window created successfully!')
    } catch (error) {
      alert('Failed to create seminar window')
      console.error(error)
    }
  }

  const handleAddUser = async () => {
    try {
      const userData = {
        name: 'New User',
        email: `user${Date.now()}@example.com`,
        role: 'PHD_CANDIDATE',
        department: 'Computer Science'
      }
      await createUser(userData)
      alert('User created successfully!')
    } catch (error) {
      alert('Failed to create user')
      console.error(error)
    }
  }

  const handleCreateReport = async () => {
    try {
      const reportData = {
        title: 'Progress Report',
        content: 'This is a sample progress report',
        studentId: users?.[0]?.id || 'sample-id',
        status: 'PENDING'
      }
      await createProgressReport(reportData)
      alert('Progress report created successfully!')
    } catch (error) {
      alert('Failed to create progress report')
      console.error(error)
    }
  }

  const handleCreatePoll = async () => {
    try {
      const pollData = {
        title: 'Availability Poll',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
      await createAvailabilityPoll(pollData)
      alert('Availability poll created successfully!')
    } catch (error) {
      alert('Failed to create availability poll')
      console.error(error)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  // Calculate stats
  const stats: DashboardStats = {
    totalSeminars: seminars?.sessions?.length || 0,
    upcomingSeminars: seminars?.sessions?.filter((s: any) => 
      new Date(s.scheduledAt) > new Date() && s.status === 'SCHEDULED'
    ).length || 0,
    totalUsers: users?.length || 0,
    pendingReports: reports?.filter((r: any) => r.status === 'PENDING').length || 0,
    completedReports: reports?.filter((r: any) => r.status === 'APPROVED').length || 0,
    activeWindows: seminars?.windows?.filter((w: any) => w.isActive).length || 0,
  }

  const statCards = [
    {
      title: 'Total Seminars',
      value: stats.totalSeminars,
      icon: Calendar,
      description: 'All scheduled sessions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSeminars,
      icon: Clock,
      description: 'Scheduled for future',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'System participants',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports,
      icon: FileText,
      description: 'Awaiting review',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Reports',
      value: stats.completedReports,
      icon: CheckCircle,
      description: 'Approved progress',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Active Windows',
      value: stats.activeWindows,
      icon: BookOpen,
      description: 'Current scheduling periods',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  if (seminarsLoading || usersLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                PhD Seminar Management
              </h1>
              <p className="text-gray-600">
                Comprehensive dashboard for monitoring doctoral progress and seminar activities
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={handleCreateSeminar}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Seminar
            </Button>
            <Button
              onClick={handleAddUser}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Add User
            </Button>
            <Button
              onClick={handleCreateReport}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Submit Report
            </Button>
            <Button
            onClick={handleCreatePoll}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Create Poll
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            View Users
          </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Seminars
              </CardTitle>
              <CardDescription>
                Next scheduled seminar sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {seminars?.sessions?.filter((s: any) => 
                new Date(s.scheduledAt) > new Date() && s.status === 'SCHEDULED'
              ).slice(0, 3).map((session: any, index: number) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg mb-2"
                >
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                      {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {session.phase}
                    </span>
                  </div>
                </motion.div>
              ))}
              {(!seminars?.sessions || seminars.sessions.filter((s: any) => 
                new Date(s.scheduledAt) > new Date() && s.status === 'SCHEDULED'
              ).length === 0) && (
                <p className="text-center text-gray-500 py-4">
                  No upcoming seminars scheduled
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Progress Reports
              </CardTitle>
              <CardDescription>
                Latest student progress submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports?.slice(0, 3).map((report: any, index: number) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg mb-2"
                >
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-gray-500">
                      {report.student?.name} • {new Date(report.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </motion.div>
              ))}
              {(!reports || reports.length === 0) && (
                <p className="text-center text-gray-500 py-4">
                  No progress reports submitted
                </p>
              )}
            </CardContent>
          </Card>

          {/* Users by Role Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Users by Role
              </CardTitle>
              <CardDescription>
                System participants organized by role
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users && users.length > 0 ? (
                <div className="space-y-3">
                  {['DEAN', 'COORDINATOR', 'FACULTY', 'PHD_CANDIDATE', 'ADMIN'].map((role) => {
                    const roleUsers = users.filter((u: any) => u.role === role)
                    if (roleUsers.length === 0) return null
                    return (
                      <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{role.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500">{roleUsers.length} user(s)</p>
                        </div>
                        <div className="flex -space-x-2">
                          {roleUsers.slice(0, 3).map((user: any) => (
                            <div
                              key={user.id}
                              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                            >
                              {user.name?.charAt(0) || 'U'}
                            </div>
                          ))}
                          {roleUsers.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                              +{roleUsers.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No users in the system
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
