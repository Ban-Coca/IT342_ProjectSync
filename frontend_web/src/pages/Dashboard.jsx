import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { ProjectsOverview } from "@/components/projects-overview"
import { TasksOverview } from "@/components/tasks-overview"
import { ProjectProgress } from "@/components/project-progress"
import { TeamPerformance } from "@/components/team-performance"
import { TaskTrends } from "@/components/task-trends"
import { DueSoonTasks } from "@/components/due-soon-tasks"
import { OverdueTasks } from "@/components/overdue-tasks"
import { addDays, format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/authentication-context"
import MainLayout from "@/components/main-layout"
import { Grid } from 'ldrs/react'

const API_URL = import.meta.env.VITE_API_BASE_DASHBOARD_SERVICE || "http://localhost:8080"

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const userId = currentUser?.userId || ""

  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const [analyticsData, setAnalyticsData] = useState(null)
  const [trendsData, setTrendsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : ""
        const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : ""

        const analyticsResponse = await fetch(
          `${API_URL}/analytics/${userId}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
          }
        )

        if (!analyticsResponse.ok) {
          throw new Error("Failed to fetch analytics data")
        }

        const analyticsJson = await analyticsResponse.json()
        setAnalyticsData(analyticsJson)

        // Fetch trends data
        const trendsResponse = await fetch(`${API_URL}/trends/${userId}`, {
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })

        if (!trendsResponse.ok) {
          throw new Error("Failed to fetch trends data")
        }

        const trendsJson = await trendsResponse.json()
        setTrendsData(trendsJson)

        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userId, date])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <MainLayout>
        {loading ? (
            <div className="mx-auto py-12 flex flex-col h-full items-center justify-center">
                <Grid
                    size="60"
                    speed="1.5"
                    color="black" 
                />
                Loading Dashboard    
            </div>
        ) : (
            <div className="container mx-auto py-6">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
                    <p className="text-muted-foreground">Monitor your projects, tasks, and team performance</p>
                    </div>
                    <DatePickerWithRange date={date} setDate={setDate} />
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <ProjectsOverview data={analyticsData} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Project Progress</CardTitle>
                            <CardDescription>Track the progress of your active projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProjectProgress data={analyticsData?.projectProgress || []} />
                        </CardContent>
                        </Card>

                        <Card>
                        <CardHeader>
                            <CardTitle>Tasks by Status</CardTitle>
                            <CardDescription>Distribution of tasks by their current status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TasksOverview data={analyticsData?.tasksByStatus || {}} />
                        </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                        <CardHeader>
                            <CardTitle>Due Soon</CardTitle>
                            <CardDescription>Tasks due in the next 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DueSoonTasks tasks={analyticsData?.dueSoonTasks || []} />
                        </CardContent>
                        </Card>

                        <Card>
                        <CardHeader>
                            <CardTitle>Overdue</CardTitle>
                            <CardDescription>Tasks that are past their due date</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OverdueTasks tasks={analyticsData?.overdueTasks || []} />
                        </CardContent>
                        </Card>
                    </div>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4">
                    <Card>
                        <CardHeader>
                        <CardTitle>Project Progress</CardTitle>
                        <CardDescription>Detailed view of all your projects and their progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <ProjectProgress data={analyticsData?.projectProgress || []} detailed />
                        </CardContent>
                    </Card>
                    </TabsContent>

                    <TabsContent value="tasks" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                        <CardHeader>
                            <CardTitle>Tasks by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TasksOverview data={analyticsData?.tasksByStatus || {}} />
                        </CardContent>
                        </Card>

                        <Card>
                        <CardHeader>
                            <CardTitle>Tasks by Priority</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TasksOverview data={analyticsData?.tasksByPriority || {}} type="priority" />
                        </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                        <CardHeader>
                            <CardTitle>Due Soon</CardTitle>
                            <CardDescription>Tasks due in the next 7 days</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-96 overflow-auto">
                            <DueSoonTasks tasks={analyticsData?.dueSoonTasks || []} />
                        </CardContent>
                        </Card>

                        <Card>
                        <CardHeader>
                            <CardTitle>Overdue</CardTitle>
                            <CardDescription>Tasks that are past their due date</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-96 overflow-auto">
                            <OverdueTasks tasks={analyticsData?.overdueTasks || []} />
                        </CardContent>
                        </Card>
                    </div>
                    </TabsContent>

                    <TabsContent value="team" className="space-y-4">
                    <Card>
                        <CardHeader>
                        <CardTitle>Team Performance</CardTitle>
                        <CardDescription>Performance metrics for team members</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <TeamPerformance data={analyticsData?.teamPerformance?.memberStats || []} />
                        </CardContent>
                    </Card>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-4">
                    <Card>
                        <CardHeader>
                        <CardTitle>Task Trends</CardTitle>
                        <CardDescription>Task distribution over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <TaskTrends
                            tasksByMonth={trendsData?.tasksByMonth || {}}
                            statusDistribution={trendsData?.statusDistributionByMonth || {}}
                        />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                        <CardTitle>Tasks per Project</CardTitle>
                        <CardDescription>Distribution of tasks across projects</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                        <TasksOverview data={trendsData?.tasksPerProject || {}} type="project" />
                        </CardContent>
                    </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )}
    
        
    </MainLayout>
  )
}
