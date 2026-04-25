import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Next.js',
        content: 'Next.js is a powerful React framework that enables server-side rendering and static site generation.',
        published: true,
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Building APIs with Express.js',
        content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features.',
        published: true,
        authorId: users[1].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Database Design Best Practices',
        content: 'Designing efficient database schemas is crucial for application performance and scalability.',
        published: false,
        authorId: users[2].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'TypeScript in Full-Stack Development',
        content: 'TypeScript brings type safety to JavaScript, making large-scale applications more maintainable.',
        published: true,
        authorId: users[3].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Deploying Modern Web Applications',
        content: 'Modern deployment strategies involve CI/CD pipelines, containerization, and cloud services.',
        published: false,
        authorId: users[4].id,
      },
    }),
  ])

  console.log(`✅ Created ${posts.length} posts`)

  // Create sample data
  const sampleData = await Promise.all([
    prisma.sampleData.create({
      data: {
        name: 'Performance Metrics',
        description: 'System performance monitoring data',
        value: 95,
        category: 'Monitoring',
      },
    }),
    prisma.sampleData.create({
      data: {
        name: 'User Analytics',
        description: 'User engagement and behavior analytics',
        value: 87,
        category: 'Analytics',
      },
    }),
    prisma.sampleData.create({
      data: {
        name: 'Revenue Data',
        description: 'Monthly revenue tracking',
        value: 125000,
        category: 'Finance',
      },
    }),
    prisma.sampleData.create({
      data: {
        name: 'Server Load',
        description: 'Current server utilization',
        value: 42,
        category: 'Infrastructure',
      },
    }),
    prisma.sampleData.create({
      data: {
        name: 'Error Rate',
        description: 'Application error percentage',
        value: 2,
        category: 'Quality',
      },
    }),
  ])

  console.log(`✅ Created ${sampleData.length} sample data records`)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: ${users.length}`)
  console.log(`- Posts: ${posts.length}`)
  console.log(`- Sample Data: ${sampleData.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
