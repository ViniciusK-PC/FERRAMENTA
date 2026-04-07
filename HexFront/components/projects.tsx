import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Lock, BookOpen, Flag } from "lucide-react"

const projects = [
  {
    icon: Lock,
    title: "0xCipherLink",
    description:
      "Ferramenta de compartilhamento de arquivos criptografados com AES-256. Permite transferência segura de dados sensíveis entre partes autorizadas.",
    tags: ["Python", "Cryptography", "Flask", "AES-256"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    icon: BookOpen,
    title: "0xAcademy",
    description:
      "Plataforma de aprendizado CTF com desafios interativos de segurança. Inclui categorias como Web, Crypto, Forensics e Reverse Engineering.",
    tags: ["Next.js", "Docker", "PostgreSQL", "CTF"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    icon: Flag,
    title: "BloodCodeCTF",
    description:
      "Repositório de desafios CTF criados para competições de hacking. Inclui writeups detalhados e soluções documentadas.",
    tags: ["Python", "Docker", "CTF", "Security"],
    github: "https://github.com",
  },
  {
    icon: Lock,
    title: "VulnScanner",
    description:
      "Scanner automatizado de vulnerabilidades para aplicações web. Detecta SQLi, XSS, CSRF e outras vulnerabilidades comuns.",
    tags: ["Python", "Selenium", "Security", "Automation"],
    github: "https://github.com",
  },
  {
    icon: BookOpen,
    title: "SecureAuth",
    description:
      "Biblioteca de autenticação segura com 2FA, rate limiting e proteção contra brute force attacks.",
    tags: ["TypeScript", "Node.js", "Security", "Auth"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    icon: Flag,
    title: "MalwareAnalyzer",
    description:
      "Framework para análise estática e dinâmica de malware em ambiente sandbox isolado.",
    tags: ["Python", "YARA", "Sandbox", "Analysis"],
    github: "https://github.com",
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-2">{"// Projetos"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trabalhos Recentes
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <project.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {project.title}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={project.github} target="_blank">
                      <Github className="h-4 w-4 mr-1" />
                      Código
                    </Link>
                  </Button>
                  {project.demo && (
                    <Button asChild size="sm" className="flex-1">
                      <Link href={project.demo} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Demo
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com" target="_blank">
              <Github className="h-5 w-5 mr-2" />
              Ver Todos os Projetos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
