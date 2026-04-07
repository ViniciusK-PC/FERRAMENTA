"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Mail, ChevronDown } from "lucide-react"

const roles = [
  "Ethical Hacker",
  "Security Specialist",
  "Digital Forensics Expert",
  "Penetration Tester",
  "SOC Analyst",
]

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const role = roles[currentRole]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < role.length) {
            setDisplayText(role.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentRole((prev) => (prev + 1) % roles.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole])

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-mesh overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-mono text-sm tracking-wider">
                {"// Bem-vindo ao meu terminal"}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Eu sou{" "}
                <span className="text-primary text-glow">0x4m4</span>
              </h1>
              <div className="h-12 flex items-center">
                <span className="text-xl sm:text-2xl text-muted-foreground font-mono">
                  {">"} {displayText}
                  <span className="cursor-blink text-primary">|</span>
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Especialista em segurança cibernética com foco em testes de penetração, 
              forense digital e resposta a incidentes. Fundador e CEO da{" "}
              <span className="text-red-500 font-semibold">Hex Stalke</span>.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="glow-primary bg-zinc-900 border border-red-900/50 hover:bg-zinc-800 text-white">
                <Link href="#contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Entre em Contato
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-zinc-800 hover:bg-zinc-900/50">
                <Link href="#projects">Ver Projetos</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Link
                href="https://github.com"
                target="_blank"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Right Content - Wolf Mascot */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative w-full h-full rounded-full border-2 border-primary/30 overflow-hidden glow-primary">
                <Image
                  src="/images/wolf-mascot.jpg"
                  alt="Hex Stalke Wolf Mascot"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                <span className="text-xs font-mono text-primary">CEH Certified</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                <span className="text-xs font-mono text-accent">500+ CTFs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-muted-foreground" />
      </div>
    </section>
  )
}
