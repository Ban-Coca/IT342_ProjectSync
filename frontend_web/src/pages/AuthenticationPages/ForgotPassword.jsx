import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ForgotPasswordForm } from '@/components/forget_password_1';
import forgotPasswordImg from '@/assets/forgotpassword.svg';
import logo from '@/assets/light-logo.svg'
export default function ForgotPassword() {
    const ref = useRef(null)
    return (
      <div 
        className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <img src={logo} className="h-6 w-6" />
              </div>
              ProjectSync
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
        <div className="hidden lg:flex flex-col items-center relative justify-center bg-primary shadow-2xs">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.6,
                  ease: "easeOut",
                },
              }}
              className="flex flex-col h-auto items-center justify-center text-white gap-2"
            >
              <h1 className="text-5xl font-bold">ProjectSync</h1>
              <h3 className="text-lg font-bold italic">Keep Your Projects in Perfect Sync</h3>
              <img
                src={forgotPasswordImg}
                alt="Image"
                className="animated w-[512px] h-[512px]"
              />
          </motion.div>
        </div>
      </div>
    )
  }