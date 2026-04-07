"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const skillCategories = {
  security: {
    title: "Segurança",
    skills: [
      { name: "Penetration Testing", level: 95 },
      { name: "Digital Forensics", level: 90 },
      { name: "Malware Analysis", level: 85 },
      { name: "Reverse Engineering", level: 88 },
      { name: "Network Security", level: 92 },
      { name: "Web App Security", level: 94 },
    ],
  },
  development: {
    title: "Desenvolvimento",
    skills: [
      { name: "Python", level: 95 },
      { name: "Bash/Shell", level: 90 },
      { name: "C/C++", level: 80 },
      { name: "JavaScript", level: 85 },
      { name: "Go", level: 75 },
      { name: "Assembly", level: 70 },
    ],
  },
  tools: {
    title: "Ferramentas",
    skills: [
      { name: "Burp Suite", level: 95 },
      { name: "Metasploit", level: 92 },
      { name: "Wireshark", level: 90 },
      { name: "Nmap", level: 95 },
      { name: "Ghidra/IDA", level: 85 },
      { name: "Docker/K8s", level: 80 },
    ],
  },
  platforms: {
    title: "Plataformas",
    skills: [
      { name: "Linux", level: 95 },
      { name: "Windows", level: 88 },
      { name: "AWS", level: 82 },
      { name: "Azure", level: 78 },
      { name: "Active Directory", level: 85 },
      { name: "SIEM Tools", level: 88 },
    ],
  },
}

export function Skills() {
  const [activeTab, setActiveTab] = useState("security")

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-2">{"// Habilidades"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Minhas Competências
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            {Object.entries(skillCategories).map(([key, category]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(skillCategories).map(([key, category]) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {category.skills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground font-medium">
                            {skill.name}
                          </span>
                          <span className="text-primary font-mono">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
