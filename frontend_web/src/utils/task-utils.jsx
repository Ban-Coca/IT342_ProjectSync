import { CheckCircle2, Circle, Clock } from "lucide-react"

// Helper function to get priority badge color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "Low":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Helper function to get status icon
export const getStatusIcon = (status) => {
  switch (status) {
    case "Done":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "To Do":
      return <Circle className="h-4 w-4 text-gray-400" />
    default:
      return <Circle className="h-4 w-4 text-gray-400" />
  }
}