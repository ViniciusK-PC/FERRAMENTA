"use client"

import { ShieldAlert, RefreshCcw, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full bg-zinc-950 border-2 border-red-900/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(153,0,0,0.2)] text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/10 blur-[80px] -z-10" />
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <ShieldAlert className="w-20 h-20 text-red-600 animate-pulse" />
            <Lock className="w-8 h-8 text-red-400 absolute bottom-0 right-0 bg-zinc-950 rounded-full p-1 border border-red-900/50" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-red-500 mb-2 tracking-tighter uppercase">
          ACESSO EXPIRADO
        </h1>
        
        <div className="h-0.5 w-16 bg-red-900/50 mx-auto mb-6" />

        <p className="text-zinc-400 mb-8 leading-relaxed">
          Sua assinatura de segurança binária expirou ou foi invalidada pelo protocolo de autodestruição.
        </p>

        <div className="bg-red-950/20 border border-red-900/20 rounded-lg p-4 mb-8 text-sm text-red-400 font-bold uppercase tracking-widest animate-in fade-in zoom-in duration-700">
          ⚠️ VOCÊ DEVE GERAR UMA NOVA CHAVE PARA LOGIN
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-6 group transition-all">
              <RefreshCcw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              VOLTAR AO INÍCIO
            </Button>
          </Link>
          
          <p className="text-[10px] text-zinc-600 uppercase mt-4">
            Hex Stalcke Offensive Security • Intelligence Nucleus
          </p>
        </div>
      </div>
    </div>
  )
}
