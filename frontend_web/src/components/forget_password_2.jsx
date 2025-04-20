import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTPPattern } from "./input-code"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { verifyResetCode } from "@/service/AuthenticationService/authenticationService"

export function EnterCodeForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Set email from localStorage when component mounts
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleCodeChange = (value) => {
    setCode(value);
    console.log("Code entered:", value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Submitting code:", code);
    setIsLoading(true);
    setError("");

    try {
      const response = await verifyResetCode(email, code);
      
      // Store the reset token and email for the next step
      navigate("/reset-password", { 
        state: { 
          email: email, 
          resetToken: response.resetToken 
        } 
      });
    } catch (error) {
      console.error("Verification failed:", error);
      setError(
        error.response?.data?.error || 
        "Invalid or expired verification code. Please try again or request a new code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-nowrap">Check Your Email for Reset Code</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We've sent a verification code to your email to reset your password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="code">Enter the code sent to you here</Label>
          <div className="flex items-center justify-center gap-2">
            <InputOTPPattern 
              id="code" 
              type="text" 
              value={code}
              onChange={handleCodeChange}
              placeholder="XXXXXX" 
              className="border border-border focus:ring-primary focus:border-primary"  
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 mt-1 text-center">
              {error}
            </div>
          )}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Verifying..." : "Verify code"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Go back to {" "}
        <Link to="/login" className="underline underline-offset-4">
          Log in?
        </Link>
      </div>
    </form>)
  );
}