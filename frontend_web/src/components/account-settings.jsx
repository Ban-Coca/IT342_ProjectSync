import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { updateUserProfile } from "@/service/UserService/userService"
import { useAuth } from "@/contexts/authentication-context"

export function AccountSettings({ user, updateUser }) {
  const { getAuthHeader } = useAuth()
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  })
  
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateUserProfile(data, user.userId, false, getAuthHeader()),
    onSuccess: (data) => {
      updateUser(formData)
      toast.success("Settings updated", {
        description: "Your account settings have been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to update settings. Please try again.",
      })
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    updateProfileMutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <Button type="submit" disabled={updateProfileMutation.isPending}>
        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
