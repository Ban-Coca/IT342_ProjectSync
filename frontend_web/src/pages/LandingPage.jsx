import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X, Quote, Phone, Mail, MapPinHouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import hero from "@/assets/hero.svg"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import Lenis from "lenis"
import {motion, useInView, useAnimate} from "motion/react"
import taskManagement from "@/assets/task-management.svg"
import boardListViews from "@/assets/board-list.svg"
import collaborate from "@/assets/collaborate.svg"
import deadlinesReminders from "@/assets/deadline.svg"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import kent from "@/assets/kent.png"
import migs from "@/assets/migs.png"
import derrick from "@/assets/image.png"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
const navlinks = [
  { name: "Home", url: "#home" },
  { name: "Features", url: "#features" },
  { name: "Testimonials", url: "#testimonials" },
  { name: "Contact", url: "#contact" },
]
const features = [
    {
        title: "Task Management",
        description: "Create, assign, and track tasks in a simple interface. Keep your team aligned and productive with clear priorities",
        image: taskManagement,
    },
    {
        title: "Board & List Views",
        description: "Switch between board and list views for a flexible workflow. Visualize progress and move tasks effortlessly",
        image: boardListViews,
    },
    {
        title: "Collaborate",
        description: "Work seamlessly with your team. Comment on tasks, share updates, and keep everyone in sync in one place",
        image: collaborate,
    },
    {
        title: "Deadlines & Reminders",
        description: "Never miss a deadline. Set due dates, receive automatic reminders, and keep your projects on track effortlessly",
        image: deadlinesReminders,
    },
]
const testimonials = [
    {
        name: "Miguel V.",
        text: "This app has transformed the way our team manages projects. It's intuitive and keeps everyone on track!",
        image: migs,
      },
      {
        name: "Derrick E.",
        text: "I love the board and list views! It makes organizing tasks so much easier and more efficient.",
        image: derrick,
      },
      {
        name: "Kent A.",
        text: "Deadlines and reminders keep me accountable. My productivity has never been better!",
        image: kent,
      },
]
export default function LandingPage() {
    const navigate = useNavigate()
    const featuresRef = useRef(null)
    const ref = useRef(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const isInView = useInView(featuresRef, { once: true })
    const [scope, animate] = useAnimate()
    const scopeInView  = useInView(scope)
    useEffect(() => {
        const lenis = new Lenis();
        function raf(time){
        lenis.raf(time);
        requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if(scopeInView){
            animate(scope.current, { opacity: 1 }, { duration: 0.5, delay: 0.3 })
        }
    }, [scopeInView, animate])
    return (
        <div className="bg-background min-h-screen">
        <header className="flex justify-between items-center p-4 md:px-8 lg:px-12">
            {/* Logo */}
            <img src="/logo.svg" alt="ProjectSync Logo" className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 lg:gap-10 font-bold">
            {navlinks.map((link, index) => (
                <a
                key={index}
                href={link.url}
                className="text-base px-4 py-1 rounded-sm hover:bg-primary hover:text-white transition-colors"
                >
                {link.name}
                </a>
            ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-2">
            <Button variant="outline" onClick={() => navigate("/login")} className="font-medium">
                Login
            </Button>
            <Button onClick={() => navigate("/signup")} className="font-medium">
                Signup
            </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 top-[68px] bg-background z-50 p-4">
            <div className="flex flex-col gap-4">
                {navlinks.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    className="text-lg font-medium px-4 py-2 rounded-sm hover:bg-primary hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {link.name}
                </a>
                ))}
                <div className="flex gap-2 mt-4">
                <Button
                    variant="outline"
                    onClick={() => {
                    navigate("/login")
                    setMobileMenuOpen(false)
                    }}
                    className="flex-1 font-medium"
                >
                    Login
                </Button>
                <Button
                    onClick={() => {
                    navigate("/signup")
                    setMobileMenuOpen(false)
                    }}
                    className="flex-1 font-medium"
                >
                    Signup
                </Button>
                </div>
            </div>
            </div>
        )}

        
        <section className="px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:h-[calc(100vh-6rem)] flex flex-col justify-center">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="flex flex-col justify-center items-start order-2 md:order-1">
                    <TypingAnimation duration={50} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        ProjectSync: Streamline Your Projects with Ease
                    </TypingAnimation>
                    
                    <p className="text-base md:text-lg text-muted-foreground mt-4 md:mt-6">
                        With ProjectSync, organize tasks, collaborate with your team, and stay on top of deadlines effortlessly
                    </p>
                    <Button size="lg" className="mt-6 md:mt-8 font-medium">
                        Get Started
                    </Button>
                </div>
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 10,}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                    className="relative order-1 md:order-2 w-full max-w-xl mx-auto">
                    <div className="absolute w-[90%] h-[90%] bg-black rounded-lg -top-2 left-[5%] transform -rotate-2"></div>
                    <img src={hero} alt="ProjectSync Dashboard" className="relative w-full h-auto rounded-lg shadow-lg" />
                </motion.div>
            </div>
        </section>

        <section id="features" className="py-16 p-4 md:p-8 lg:p-12">
            <motion.div
                ref={featuresRef}
                initial={{ opacity: 0, y: 10,}}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="flex flex-col items-center text-center">
                <h1 
                    className="text-2xl md:text-4xl font-bold">
                        Everything You Need to Manage Your Projects
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-4 md:mt-2">
                    Discover tools that simplify project management, enhance collaboration, and keep your team focused on what matters most
                </p>
            </motion.div>
            
            <div className="flex flex-col gap-12 mt-12 max-w-7xl mx-auto">
                <div ref={scope} style={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {features.map((feature, index) => (
                        <div key={index} className="p-4 flex rounded-lg shadow-xl justify-center">
                            <div className="p-4 bg-primary rounded-lg shadow-lg">
                                <img src={feature.image} alt={feature.title} className="w-96 h-36 z-10 rounded-md" />
                            </div>
                            <div className="px-4 flex flex-col justify-center items-start">
                                <h2 className="text-lg text-primary font-bold">{feature.title}</h2>
                                <p className="text-muted-foreground mt-2">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="testimonials" className="h-auto p-4 md:p-8 lg:p-12 bg-muted/50">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-2xl md:text-4xl font-bold">What Our Users Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto my-12">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="p-6 shadow-lg bg-white rounded-xl">
                        <CardContent className="text-center p-0">
                            <Quote className="text-primary size-6 mb-3" />
                            <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                            <div className="mt-4 flex items-center justify-center gap-3">
                                <Avatar>
                                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-gray-900">{testimonial.name}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section id="contact" className="flex flex-col md:grid md:grid-cols-2 h-screen p-4 md:p-8 lg:p-12">
            <div className="flex flex-col justify-center">
                <h2 className="text-2xl md:text-4xl font-bold">Get in Touch</h2>
                <p className="text-base md:text-lg text-muted-foreground mt-4 md:mt-2">
                    Have questions or feedback? We’d love to hear from you. Reach out to us anytime!
                </p>
                <div className="flex gap-4">
                    <Phone className="text-primary mt-4" size={24} />
                    <span className="text-muted-foreground mt-4">+1 (123) 456-7890</span>
                </div>
                <div className="flex gap-4">
                    <Mail className="text-primary mt-4" size={24} />
                    <span className="text-muted-foreground mt-4">team@projectsync.com</span>
                </div>
                <div className="flex gap-4">
                    <MapPinHouse className="text-primary mt-4" size={24} />
                    <span className="text-muted-foreground mt-4">Way Tugpahay, Brgy Tisa, Cebu City</span>
                </div>
            </div>
            <div className="flex flex-col relativ justify-center mt-8 md:mt-0">
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-md font-medium">Name</Label>
                        <div className="flex gap-4">
                            <Input id="name" type="text" placeholder="First Name" required/>
                            <Input id="name" type="text" placeholder="Last Name" required/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-md font-medium">Email</Label>
                        <Input id="email" type="email" placeholder="example@email.com" required/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="number" className="text-md font-medium">Phone Number</Label>
                        <Input id="number" type="text" placeholder="XXXXXXXXXXX" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="message" className="text-mg font-medium">Message</Label>
                        <Textarea id="message" placeholder="Type your message here..." required/>
                    </div>
                    <Button type="submit" className="w-full mt-4 font-medium">
                        Send Message
                    </Button>
                </form>
            </div>
        </section>
        
        <footer className="p-4 md:p-8 lg:p-12 bg-muted">
            <p className="text-center text-muted-foreground">
                © {new Date().getFullYear()} ProjectSync. All rights reserved.
            </p>
        </footer>
        </div>
    )
}