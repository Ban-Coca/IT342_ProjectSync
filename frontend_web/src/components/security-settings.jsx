import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { AlertCircle, Check, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (passwordError) {
      setPasswordError("")
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "" }

    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    const isLongEnough = password.length >= 8

    const criteria = [hasLowercase, hasUppercase, hasNumber, hasSpecial, isLongEnough]
    const metCriteria = criteria.filter().length

    if (metCriteria <= 2) return { strength: 25, label: "Weak" }
    if (metCriteria === 3) return { strength: 50, label: "Fair" }
    if (metCriteria === 4) return { strength: 75, label: "Good" }
    return { strength: 100, label: "Strong" }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  return (
    <div className="space-y-8">
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>

        {passwordError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{passwordError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />

          {passwordData.newPassword && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Password strength:</span>
                <span
                  className={
                    passwordStrength.strength <= 25
                      ? "text-red-500"
                      : passwordStrength.strength <= 50
                        ? "text-orange-500"
                        : passwordStrength.strength <= 75
                          ? "text-yellow-500"
                          : "text-green-500"
                  }
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={
                    "h-full transition-all duration-300" +
                    passwordStrength.strength <= 25
                      ? "bg-red-500"
                      : passwordStrength.strength <= 50
                        ? "bg-orange-500"
                        : passwordStrength.strength <= 75
                          ? "bg-yellow-500"
                          : "bg-green-500"

                  }
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
              <ul className="text-xs space-y-1 mt-2">
                <li className="flex items-center">
                  {/[a-z]/.test(passwordData.newPassword) ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  Lowercase letter
                </li>
                <li className="flex items-center">
                  {/[A-Z]/.test(passwordData.newPassword) ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  Uppercase letter
                </li>
                <li className="flex items-center">
                  {/[0-9]/.test(passwordData.newPassword) ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  Number
                </li>
                <li className="flex items-center">
                  {/[^A-Za-z0-9]/.test(passwordData.newPassword) ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  Special character
                </li>
                <li className="flex items-center">
                  {passwordData.newPassword.length >= 8 ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  At least 8 characters
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>

    </div>
  )
}
