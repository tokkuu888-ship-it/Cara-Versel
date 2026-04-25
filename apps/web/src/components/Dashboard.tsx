'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Database, Users, Activity, Server } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchApiData } from '@/lib/api'

interface DashboardData {
  id: string
  name: string | null
  email: string
  createdAt: string
}

export function Dashboard() {
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchApiData,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const stats = [
    {
      title: 'Total Users',
      value: apiData?.length || 0,
      icon: Users,
      description: 'Active users in database'
    },
    {
      title: 'API Status',
      value: error ? 'Error' : 'Online',
      icon: Server,
      description: 'Express API connection'
    },
    {
      title: 'Database',
      value: 'Connected',
      icon: Database,
      description: 'Vercel Postgres status'
    },
    {
      title: 'Last Updated',
      value: new Date().toLocaleTimeString(),
      icon: Activity,
      description: 'Real-time data'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Full-stack application with Next.js, Express.js, and Vercel Postgres
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Data from Express API</CardTitle>
            <CardDescription>
              Real-time data fetched from your Express.js backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Failed to fetch data from API</p>
                <p className="text-sm text-gray-500 mt-2">
                  Please check your Express server is running on port 3001
                </p>
              </div>
            ) : apiData && apiData.length > 0 ? (
              <div className="space-y-4">
                {apiData.map((item: DashboardData) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{item.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No data available</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try adding some sample data to your database
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
