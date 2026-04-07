import { Award, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const certifications = [
  {
    name: "Certified Network Defender (CND)",
    issuer: "EC-Council",
    date: "2023",
    credentialId: "CND-XXXXX",
    color: "text-primary",
  },
  {
    name: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    date: "2022",
    credentialId: "CEH-XXXXX",
    color: "text-primary",
  },
  {
    name: "Google Cybersecurity Professional",
    issuer: "Google",
    date: "2023",
    credentialId: "GCP-XXXXX",
    color: "text-accent",
  },
  {
    name: "AWS Penetration Testing",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-XXXXX",
    color: "text-accent",
  },
]

const proLabs = [
  { name: "Dante", platform: "Hack The Box", difficulty: "Intermediate" },
  { name: "Zephyr", platform: "Hack The Box", difficulty: "Advanced" },
  { name: "Offshore", platform: "Hack The Box", difficulty: "Advanced" },
  { name: "RastaLabs", platform: "Hack The Box", difficulty: "Expert" },
  { name: "APTLabs", platform: "Hack The Box", difficulty: "Expert" },
  { name: "Cybernetics", platform: "Hack The Box", difficulty: "Expert" },
]

export function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-2">
            {"// Certificações"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Credenciais e Conquistas
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Certifications */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certificações Profissionais
            </h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <Card
                  key={index}
                  className="bg-card border-border hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold ${cert.color}`}>
                          {cert.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {cert.credentialId} | {cert.date}
                        </p>
                      </div>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pro Labs */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Pro Labs Completos
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {proLabs.map((lab, index) => (
                <Card
                  key={index}
                  className="bg-card border-border hover:border-accent/30 transition-colors"
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground">{lab.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {lab.platform}
                    </p>
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                        lab.difficulty === "Expert"
                          ? "bg-destructive/20 text-destructive"
                          : lab.difficulty === "Advanced"
                          ? "bg-accent/20 text-accent"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {lab.difficulty}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
