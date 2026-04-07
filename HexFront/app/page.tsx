"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    const checkHash = async () => {
      if (window.location.hash && window.location.hash.length > 1) {
        // Usa decodeURIComponent para decodificar caracteres como %5E para ^, igual o bot gerou
        const hash = decodeURIComponent(window.location.hash.replace('#', ''));
        
        try {
          const res = await fetch(`http://localhost:3005/validate/${encodeURIComponent(hash)}`);
          const data = await res.json();
          
          if (data.valid) {
            setIsNucleoMode(true);
          } else {
            alert('❌ ACESSO NEGADO: Credencial Inválida ou Expirada! (Lembre-se do tempo limite de 10s)');
            window.location.hash = '';
            setIsNucleoMode(false);
          }
        } catch (e) {
          console.error("Erro ao validar hash:", e);
          alert('❌ SERVIDOR DE SEGURANÇA INATIVO. Não foi possível validar o acesso.');
          window.location.hash = '';
          setIsNucleoMode(false);
        }
      } else {
        setIsNucleoMode(false);
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
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
