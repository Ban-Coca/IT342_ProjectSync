import { GalleryVerticalEnd } from 'lucide-react'
import { LoginForm } from '@/components/login-form'
import logo from '@/assets/light-logo.svg';
import graphic from '@/assets/WIP-graphic.svg'
import { Separator } from '@/components/ui/separator';
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
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
            <LoginForm />
          </div>
        </div>
      </div>
      
      <div className="relative hidden bg-[#80808033] border border-solid shadow-lg lg:block">
        <img
          src={graphic}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

  