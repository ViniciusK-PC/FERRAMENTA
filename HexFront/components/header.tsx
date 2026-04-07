"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Sobre", href: "#about" },
  { name: "Habilidades", href: "#skills" },
  { name: "Experiência", href: "#experience" },
  { name: "Projetos", href: "#projects" },
  { name: "Certificações", href: "#certifications" },
  { name: "Contato", href: "#contact" },
]

function GlitchText({ text }: { text: string }) {
  const [glitchedText, setGlitchedText] = useState(text)
  
  useEffect(() => {
    const chars = "0123456789ABCDEF@#$%&*!?<>/\\|"
    let interval: NodeJS.Timeout
    
    const glitch = () => {
      const randomIndex = Math.floor(Math.random() * text.length)
      const randomChar = chars[Math.floor(Math.random() * chars.length)]
      const newText = text.split("")
      newText[randomIndex] = randomChar
      setGlitchedText(newText.join(""))
      
      setTimeout(() => setGlitchedText(text), 100)
    }
    
    interval = setInterval(glitch, 2000)
    return () => clearInterval(interval)
  }, [text])
  
  return <span>{glitchedText}</span>
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      {/* Terminal Style Top Bar */}
      <div className="bg-[#0a0a0a] border-b border-red-900/50 py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4 text-red-600">
            <span className="opacity-70">//0 1 .</span>
            <span className="text-red-500">&lt; Inicio /&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600 tracking-wider">
              <GlitchText text="/#0E850 R0BCBq1V0" />
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-red-600/20 border border-red-600/50 rounded flex items-center justify-center">
              <span className="text-red-500 font-mono font-bold text-sm">HS</span>
            </div>
            <span className="font-mono text-lg font-bold text-foreground">
              0x4m4<span className="text-red-500 animate-pulse">_</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-red-500 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="#contact">Contratar</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-red-500 transition-colors py-2"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">
              <Link href="#contact">Contratar</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
