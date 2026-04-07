import { Shield, Code, Search, Server } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const highlights = [
  {
    icon: Shield,
    title: "Segurança Ofensiva",
    description: "Testes de penetração avançados em redes, aplicações web e infraestruturas críticas.",
  },
  {
    icon: Search,
    title: "Forense Digital",
    description: "Análise de evidências, recuperação de dados e investigação de incidentes cibernéticos.",
  },
  {
    icon: Code,
    title: "Desenvolvimento Seguro",
    description: "Criação de ferramentas de segurança e automação de processos de pentest.",
  },
  {
    icon: Server,
    title: "DevSecOps",
    description: "Integração de segurança em pipelines CI/CD e hardening de infraestrutura.",
  },
]

export function About() {
  return (
    <section id="about" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-2">{"// Sobre Mim"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Quem sou eu?
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Sou um profissional de segurança cibernética apaixonado por descobrir 
              vulnerabilidades e proteger sistemas contra ameaças digitais. Com experiência 
              em testes de penetração, análise forense e resposta a incidentes, dedico minha 
              carreira a tornar o mundo digital mais seguro.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Como fundador da <span className="text-red-500 font-semibold">Hex Stalke</span>, 
              lidero uma equipe de especialistas em segurança que oferece serviços de consultoria 
              para empresas de todos os tamanhos. Nossa missão é identificar e eliminar 
              vulnerabilidades antes que atacantes maliciosos possam explorá-las.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-secondary rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-primary">5+</span>
                <p className="text-sm text-muted-foreground">Anos de Experiência</p>
              </div>
              <div className="bg-secondary rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-primary">100+</span>
                <p className="text-sm text-muted-foreground">Projetos Concluídos</p>
              </div>
              <div className="bg-secondary rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-primary">50+</span>
                <p className="text-sm text-muted-foreground">Clientes Satisfeitos</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
