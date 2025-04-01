import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpUser } from "@/service/AuthenticationService/authenticationService";
import { useAuth } from "@/contexts/authentication-context";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export function SignupForm({
  className,
  ...props
}) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await signUpUser(formData);
      login(response.user, response.token); // Automatically log in the user after signup
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };
  return (
    (<form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up to ProjectSync</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              name="firstName" 
              id="firstName" 
              type="text" 
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              name="lastName" 
              id="lastName" 
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe" 
              required />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            name="email" 
            id="email" 
            type="email" 
            placeholder="johndoe@email.com"
            value={formData.email}
            onChange={handleChange}
            required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            name="password" 
            id="password" 
            type="password"
            value={formData.password}
            onChange={handleChange} 
            required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            name="confirmPassword" 
            id="confirmPassword" 
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <div
          className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path d="M9.827 24c0-1.524.253-2.986.705-4.356L2.623 13.604C1.082 16.734.214 20.26.214 24c0 3.737.868 7.261 2.407 10.388l7.904-6.051c-.448-1.365-.698-2.821-.698-4.337z" fill="#FBBC05"/>
            <path d="M23.714 10.133c3.311 0 6.302 1.173 8.652 3.093l6.836-6.826C35.036 2.773 29.695.533 23.714.533 14.427.533 6.445 5.844 2.623 13.604l7.909 6.04c1.822-5.532 7.017-9.511 13.182-9.511z" fill="#EB4335"/>
            <path d="M23.714 37.867c-6.165 0-11.36-3.978-13.182-9.51l-7.909 6.038c3.822 7.761 11.804 13.072 21.091 13.072 5.732 0 11.204-2.036 15.311-5.849l-7.507-5.804c-2.118 1.334-4.785 2.052-7.804 2.052z" fill="#34A853"/>
            <path d="M46.145 24c0-1.387-.214-2.88-.534-4.267H23.714v9.067h12.604c-.63 3.091-2.345 5.468-4.8 7.014l7.507 5.804c4.314-4.004 7.12-9.969 7.12-16.614z" fill="#4285F4"/>
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Login here
        </a>
      </div>
    </form>)
  );
}
