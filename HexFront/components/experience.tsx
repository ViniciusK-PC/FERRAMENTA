import { Briefcase, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const workExperience = [
  {
    title: "Fundador & CEO",
    company: "Hex Stalke",
    period: "2023 - Presente",
    description:
      "Liderança de equipe de segurança cibernética, desenvolvimento de metodologias de pentest e consultoria para clientes corporativos.",
    tags: ["Liderança", "Consultoria", "Red Team"],
  },
  {
    title: "Senior Security Analyst",
    company: "CyberDefense Corp",
    period: "2021 - 2023",
    description:
      "Condução de testes de penetração, análise de vulnerabilidades e desenvolvimento de relatórios técnicos para clientes Fortune 500.",
    tags: ["Pentest", "VAPT", "Relatórios"],
  },
  {
    title: "SOC Analyst",
    company: "SecureNet Solutions",
    period: "2020 - 2021",
    description:
      "Monitoramento de segurança 24/7, resposta a incidentes e análise de logs usando ferramentas SIEM.",
    tags: ["SIEM", "Incident Response", "Monitoring"],
  },
]

const education = [
  {
    degree: "Bacharelado em Cyber Security",
    institution: "SS C@ASE IT",
    period: "2022 - 2026",
    location: "Islamabad",
  },
  {
    degree: "Certificação CEH",
    institution: "EC-Council",
    period: "2022",
    location: "Online",
  },
]

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-2">{"// Experiência"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Minha Jornada
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Experiência Profissional
              </h3>
            </div>

            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              {workExperience.map((item, index) => (
                <div key={index} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-2 w-3 h-3 bg-primary rounded-full border-2 border-background" />

                  <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-accent text-sm mb-3">{item.company}</p>
                      <p className="text-muted-foreground text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Educação
              </h3>
            </div>

            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              {education.map((item, index) => (
                <div key={index} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-2 w-3 h-3 bg-accent rounded-full border-2 border-background" />

                  <Card className="bg-card border-border hover:border-accent/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {item.degree}
                        </h4>
                        <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {item.institution} - {item.location}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
