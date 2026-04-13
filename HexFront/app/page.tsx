"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Certifications } from "@/components/certifications"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import NucleoPage from "./[id]/page"

export default function Home() {
  const [isNucleoMode, setIsNucleoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (window.location.hash && window.location.hash.length > 1) {
      setIsNucleoMode(true);
    } else {
      setIsNucleoMode(false);
    }

    const handleHashChange = () => {
      if (window.location.hash && window.location.hash.length > 1) {
        setIsNucleoMode(true);
      } else {
        setIsNucleoMode(false);
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (isNucleoMode) {
    return <NucleoPage />
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  )
}
