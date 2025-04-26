import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Users, FolderGit2, Briefcase } from "lucide-react"

export function ProjectsOverview({ data }) {
  if (!data) return null

  const { totalProjects, ownedProjects, teamProjects } = data

  // Calculate at-risk projects
  const atRiskProjects = data.projectProgress?.filter((project) => project.atRisk)?.length || 0

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects || 0}</div>
          <p className="text-xs text-muted-foreground">All projects you are involved with</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Owned Projects</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ownedProjects || 0}</div>
          <p className="text-xs text-muted-foreground">Projects you created and manage</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Projects</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teamProjects || 0}</div>
          <p className="text-xs text-muted-foreground">Projects you collaborate on</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          <FolderGit2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{atRiskProjects}</div>
          <p className="text-xs text-muted-foreground">Projects behind schedule</p>
        </CardContent>
      </Card>
    </>
  )
}
