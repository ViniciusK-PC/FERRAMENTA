import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-red-600/20 border border-red-600/50 rounded flex items-center justify-center">
              <span className="text-red-500 font-mono font-bold text-xs">HS</span>
            </div>
            <span className="font-mono text-lg font-bold text-foreground">
              0x4m4<span className="text-red-500">_</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="#projects"
              className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
              Projetos
            </Link>
            <Link
              href="#contact"
              className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
              Contato
            </Link>
            <Link
              href="https://hexstalke.com"
              target="_blank"
              className="text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              Hex Stalke
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-primary">{">"}</span> {currentYear} 0x4m4. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Designed with <span className="text-primary">{"<3"}</span> by 0x4m4
          </p>
        </div>
      </div>
    </footer>
  )
}
