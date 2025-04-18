import React from "react"
import { cn } from "@/lib/utils"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export function InputOTPPattern({ value, onChange, className, ...props }) {
  return (
    <InputOTP
      value={value}
      onChange={onChange}
      maxLength={6}
      className={cn("", className)}
      {...props}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} className="h-12 w-12 border-2 border-primary/15 focus:border-primary" />
        <InputOTPSlot index={1} className="h-12 w-12 border-2 border-primary/15 focus:border-primary" />
        <InputOTPSlot index={2} className="h-12 w-12 border-2 border-primary/15 focus:border-primary" />
        <InputOTPSlot index={3} className="h-12 w-12 border-2 border-primary/15 focus:border-primary" />
        <InputOTPSlot index={4} className="h-12 w-12 border-2 border-primary/15 focus:border-primary" />
        <InputOTPSlot index={5} className="h-12 w-12 border-2 border-primary/15 focus:border-primary" />
      </InputOTPGroup>
    </InputOTP>
  )
}