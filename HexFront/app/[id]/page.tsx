"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  Terminal, Shield, Zap, Activity,
  Globe, Layers, Loader2, Copy, Download,
  CheckCheck, FolderOpen, Code2, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { launchAnalysis, checkHealth } from "@/lib/api-client"
import PhoneMap from "@/components/PhoneMap"


interface LogLine {
  id: string
  time: string
  message: string
  type: 'info' | 'success' | 'error' | 'warn' | ''
}

export default function NucleoPage() {
  const params = useParams()
  const router = useRouter()
  const [target, setTarget] = useState("")
  const [analysisType, setAnalysisType] = useState("comprehensive")
  const [logs, setLogs] = useState<LogLine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState<"connecting" | "online" | "offline">("connecting")
  const [progress, setProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [cloneResult, setCloneResult] = useState<any>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeCodeTab, setActiveCodeTab] = useState<'preview'|'code'>('code')

  const [displayId, setDisplayId] = useState("")
  const [isValidating, setIsValidating] = useState(true)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finalId = (params?.id as string) || "DESCONHECIDO"
    setDisplayId(finalId)

    const validateAccess = async () => {
      setIsValidating(true)
      if (finalId === "DESCONHECIDO") {
        router.push('/denied')
        return
      }

      try {
        const res = await fetch(`http://${window.location.hostname}:3005/validate/${encodeURIComponent(finalId)}`)
        const data = await res.json()
        if (!data.valid) {
          router.push('/denied')
        } else {
          setIsValidating(false)
        }
      } catch (err) {
        console.error("Erro na validação de acesso:", err)
        router.push('/denied')
      }
    }

    validateAccess()

    const checkServer = async () => {
      try {
        const data = await checkHealth()
        if (data.status === 'healthy') {
          setServerStatus('online')
        } else {
          setServerStatus('offline')
        }
      } catch (err) {
        setServerStatus('offline')
      }
    }

    checkServer()
    const interval = setInterval(checkServer, 10000)

    // Initial log
    appendLog("Criptografia de Baixo Nível Inicializada.", "info")
    appendLog(`AUTENTICAÇÃO_STALCKE_ATIVA: ${finalId}`, "success")
    appendLog("Matriz de segurança binária sincronizada.", "")

    return () => clearInterval(interval)
  }, [params?.id])

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const binaryHash = displayId?.toString().split('').map((char: string) => char.charCodeAt(0).toString(2)).join(' ').substring(0, 32) + "..."

  const appendLog = (message: string, type: LogLine['type'] = '') => {
    const newLine: LogLine = {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
      message,
      type
    }
    setLogs(prev => [...prev, newLine])
  }

  const handleLaunch = async () => {
    if (!target) {
      appendLog("Erro: Alvo (domínio ou IP) não definido.", "error")
      return
    }

    setIsLoading(true)
    setProgress(10)
    setAnalysisResult(null)
    setCloneResult(null)
    appendLog(`Iniciando análise ${analysisType.toUpperCase()} no alvo: ${target}...`, "info")
    
    if (analysisType === 'phone_tracking') {
      appendLog("Sincronizando com satélites de telecomunicações...", "info")
      appendLog("Interceptando sinais de rede (SS7/MAP)...", "warn")
      appendLog("Triangulando coordenadas via ERBs...", "info")
    }

    if (analysisType === 'frontend_generator') {
      appendLog("[*] Conectando ao servidor alvo...", "info")
      appendLog("[*] Baixando estrutura HTML e assets (CSS, JS, imagens)...", "warn")
      appendLog("[*] Reconstruindo codigo fonte localmente...", "info")
    }


    try {
      // Simulate progress for UI feel
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 1 : prev))
      }, 500)

      const result = await launchAnalysis(target, analysisType, displayId)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (result.success !== false) {
        appendLog(`Operação concluída com sucesso.`, "success")
        
        // Handle phone tracking results
        const phoneData = result.execution_results
        if (phoneData && phoneData.geo) {
          setAnalysisResult(phoneData)
          if (analysisType === 'phone_tracking') {
            const addressStr = phoneData.geo.address || `${phoneData.geo.city || 'Desconhecida'}, ${phoneData.geo.state || ''}`
            const meta = phoneData.live_meta || {}
            appendLog(`🆔 Titular Identificado: ${phoneData.owner || 'N/A'}`, "success")
            appendLog(`🌐 Localização detectada: ${addressStr}`, "success")
            appendLog(`📡 Método: ${meta.intercept_method || 'Triangulação Live'}`, "info")
            appendLog(`📶 ERB_ID: ${meta.tower_id || 'N/A'} | SINAL: ${meta.signal || 'N/A'}`, "warn")
            appendLog(`⏱️ Último Ping: ${meta.last_ping || 'Agora'} | Precisão: ${meta.confidence || '90%'}`, "info")
            appendLog(`📱 Operadora: ${phoneData.carrier || 'Desconhecida'}`, "info")
          }
        } else {
          setAnalysisResult(result)
        }

        // Frontend Generator: capture cloneResult and show code preview in terminal
        if (analysisType === 'frontend_generator' && result.execution_results?.success) {
          setCloneResult(result.execution_results)
          setActiveCodeTab('code')
          appendLog(`[+] Clone concluido: ${result.execution_results.assets_downloaded} assets baixados`, "success")
          appendLog(`[+] Titulo: ${result.execution_results.title}`, "success")
          appendLog(`[+] Arquivo salvo em: generated_site/index.html`, "info")
        }

        // Se houver resultados brutos, exibe linha por linha (somente para nao-frontend)
        if (result.results_raw && analysisType !== 'frontend_generator') {
          const lines = result.results_raw.split('\n');
          lines.forEach((line: string) => {
            appendLog(line, "");
          });
        }
      } else {

        appendLog(`Falha no processamento: ${result.error || 'Erro desconhecido'}`, "error")
      }
    } catch (error: any) {
      appendLog(`Erro crítico de conexão: ${error.message}`, "error")
    } finally {
      setIsLoading(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-red-600 p-4">
        <div className="relative mb-6">
          <Shield className="w-16 h-16 animate-pulse" />
          <Loader2 className="w-20 h-20 absolute -top-2 -left-2 border-t-2 border-red-600 rounded-full animate-spin" />
        </div>
        <div className="text-xl font-black tracking-widest uppercase mb-2">Autenticando Assinatura...</div>
        <div className="text-[10px] text-zinc-600 uppercase tracking-tighter">Hex Stalcke Offensive Security Kernel</div>
        <div className="mt-8 w-48 h-1 bg-zinc-900 overflow-hidden">
          <div className="h-full bg-red-600 animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-red-500/30 font-mono">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent uppercase font-mono">
              Núcleo da Inteligência
            </h1>
            <p className="text-muted-foreground font-mono mt-1 flex items-center gap-2">
              <span className="text-red-500 opacity-50">&lt;</span>
              Blood-Red Offensive Core v6.0
              <span className="text-red-500 opacity-50">/&gt;</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`px-3 py-1 font-mono border-dashed ${
              serverStatus === 'online' ? 'text-green-500 border-green-500/50 bg-green-500/5' : 
              serverStatus === 'offline' ? 'text-red-500 border-red-500/50 bg-red-500/5' : 
              'text-yellow-500 border-yellow-500/50'
            }`}>
              <Activity className={`w-3 h-3 mr-2 ${serverStatus === 'online' ? 'animate-pulse' : ''}`} />
              {serverStatus === 'online' ? 'API ONLINE (150+ MODS)' : 
               serverStatus === 'offline' ? 'API OFFLINE' : 'CONECTANDO...'}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 font-mono border-red-900/50 bg-red-950/20 text-red-500 animate-pulse text-[10px]">
              BIN_HASH: {binaryHash}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 font-mono border-red-900/50 bg-red-950/20 text-red-400">
              ID: {displayId?.toString().toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card/30 backdrop-blur-md border border-red-900/20 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors duration-700" />
              
              <div className="flex items-center gap-2 mb-6 text-red-500">
                <Shield className="w-5 h-5" />
                <h2 className="text-lg font-bold font-mono tracking-wider">OFFENSIVE SETUP</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Alvo Principal (Domain/IP)
                  </label>
                  <input 
                    type="text" 
                    placeholder="ex: target-scan.com" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:opacity-30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Modo de Operação
                  </label>
                  <select 
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-600 transition-all"
                  >
                    <option value="comprehensive">Varredura Completa (Stealth)</option>
                    <option value="reconnaissance">Reconhecimento Ativo</option>
                    <option value="osint">Inteligência de Fontes Abertas (OSINT)</option>
                    <option value="phone_tracking">Rastreamento de Telefone (OSINT)</option>
                    <option value="vulnerability">Busca de Vulnerabilidades</option>
                    <option value="api">Análise de Segurança de API</option>
                    <option value="frontend_generator">Gerador de Front End (Site Cloner)</option>
                  </select>
                </div>

                <Button 
                  onClick={handleLaunch}
                  disabled={isLoading || serverStatus === 'offline'}
                  className="w-full mt-4 bg-red-700 hover:bg-red-600 text-white font-bold py-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale overflow-hidden relative"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>PROCESSANDO...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span>INICIAR OPERAÇÃO</span>
                    </div>
                  )}
                  
                  {/* Subtle sweep animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                </Button>
                
                {progress > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-red-500">
                      <span>PROGRESSO DA MISSÃO</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-red-950 border-none rounded-none" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats / Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/20 border border-red-900/10 rounded-xl p-4 font-mono">
                <div className="text-[10px] text-muted-foreground mb-1 uppercase">Módulos</div>
                <div className="text-xl font-bold text-red-500">152+</div>
              </div>
              <div className="bg-card/20 border border-red-900/10 rounded-xl p-4 font-mono">
                <div className="text-[10px] text-muted-foreground mb-1 uppercase">Threat Level</div>
                <div className="text-xl font-bold text-orange-500">HI-SENS</div>
              </div>
            </div>
          </div>

          {/* Terminal / Live Feed or Map */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Phone Tracking Map */}
            {analysisType === 'phone_tracking' && (
              <div className="h-[420px]">
                <PhoneMap 
                  number={analysisResult?.number || target}
                  formatted={analysisResult?.formatted || target}
                  region={analysisResult?.region || ""}
                  carrier={analysisResult?.carrier || ""}
                  line_type={analysisResult?.line_type || ""}
                  timezones={analysisResult?.timezones || []}
                  geo={analysisResult?.geo || { lat: 0, lon: 0, city: "", state: "", country: "", country_code: "", display_name: "" }}
                />
              </div>
            )}

            {/* Frontend Generator Result Panel */}
            {analysisType === 'frontend_generator' && cloneResult && (
              <div className="border border-red-900/30 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-500 flex flex-col" style={{height: '680px'}}>

                {/* Panel Header */}
                <div className="bg-gradient-to-r from-red-950/80 to-black/80 border-b border-red-900/30 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-4 h-4 text-red-400" />
                    <span className="font-mono font-bold text-xs text-red-300 tracking-widest uppercase">Site Clonado</span>
                    <Badge className="bg-green-900/40 text-green-400 border border-green-700/40 text-[10px] font-mono px-2">
                      ✓ {cloneResult.assets_downloaded} assets
                    </Badge>
                    <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[200px]">{cloneResult.url}</span>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex items-center gap-1 bg-black/50 border border-red-900/20 rounded-lg p-1">
                    <button
                      onClick={() => setActiveCodeTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-all ${
                        activeCodeTab === 'preview'
                          ? 'bg-red-700 text-white shadow'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      Visual
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('code')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-all ${
                        activeCodeTab === 'code'
                          ? 'bg-red-700 text-white shadow'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Code2 className="w-3 h-3" />
                      Código
                    </button>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="bg-black/60 border-b border-red-900/20 px-4 py-1.5 flex items-center gap-2 flex-shrink-0">
                  <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded px-3 py-1 font-mono text-[11px] text-zinc-400 truncate">
                    http://localhost:8888/preview
                  </div>
                  <button
                    onClick={() => window.open('http://localhost:8888/preview', '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded font-mono text-xs text-zinc-300 transition-all whitespace-nowrap"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Abrir
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cloneResult.stdout || '')
                      setCopiedCode(true)
                      setTimeout(() => setCopiedCode(false), 2000)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded font-mono text-xs text-zinc-300 transition-all whitespace-nowrap"
                  >
                    {copiedCode ? <CheckCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? 'Copiado!' : 'Copiar HTML'}
                  </button>
                  <button
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = 'http://localhost:8888/preview'
                      a.download = 'clone.html'
                      a.click()
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded font-mono text-xs text-zinc-300 transition-all whitespace-nowrap"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>

                {/* Content Area — full site iframe or source code */}
                <div className="flex-1 overflow-hidden">
                  {activeCodeTab === 'preview' ? (
                    // Full site rendered via Flask /preview route
                    <iframe
                      key={cloneResult.url}
                      src={`http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8888/preview?t=${Date.now()}`}
                      className="w-full h-full border-0"
                      title={`Preview: ${cloneResult.title}`}
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                  ) : (
                    // HTML source view
                    <div className="bg-[#080808] h-full overflow-y-auto">
                      <pre className="p-4 font-mono text-[11px] text-green-400/90 whitespace-pre-wrap break-all leading-relaxed">
                        {(() => {
                          const raw = cloneResult.stdout || ''
                          const parts = raw.split('--- [ PREVIEW DO CODIGO FONTE ] ---')
                          return parts[1]?.split('... (arquivo completo')[0]?.trim() || 'Sem preview disponivel'
                        })()}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-black/80 border-t border-red-900/20 px-4 py-1.5 flex items-center gap-2 flex-shrink-0">
                  <FolderOpen className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                  <span className="text-[10px] font-mono text-zinc-600 truncate">{cloneResult.output_path}</span>
                  <span className="ml-auto text-[10px] font-mono text-zinc-700">{cloneResult.title}</span>
                </div>
              </div>
            )}


            {/* Terminal Console */}
            <div className={`bg-[#0c0c0c] border border-red-900/30 rounded-xl flex flex-col overflow-hidden shadow-2xl ${
              analysisType === 'phone_tracking' ? 'h-[250px]' : 
              (analysisType === 'frontend_generator' && cloneResult) ? 'h-[280px]' : 'h-[680px]'
            }`}>
              {/* Terminal Header */}
              <div className="bg-[#151515] border-b border-red-900/20 px-4 py-2 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  <span>COMMAND_CONSOLE: {target || 'AWAITING_INPUT'}</span>
                </div>
                <div className="w-10" />
              </div>

              {/* Terminal Body */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1.5 scrollbar-thin scrollbar-thumb-red-900/50 scrollbar-track-transparent">
                {logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground opacity-20">
                    <Activity className="w-12 h-12" />
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex gap-3 group animate-in fade-in slide-in-from-left-1 duration-300">
                      <span className="text-muted-foreground/30 flex-shrink-0">[{log.time}]</span>
                      <span className={`break-all ${
                        log.type === 'error' ? 'text-red-500 font-bold' :
                        log.type === 'success' ? 'text-green-400 font-bold' :
                        log.type === 'info' ? 'text-green-600/90' :
                        log.type === 'warn' ? 'text-amber-500' :
                        'text-zinc-300'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Footer */}
              <div className="bg-[#0a0a0a] border-t border-red-900/20 px-4 py-2 flex items-center gap-3">
                <div className="text-red-500 font-bold">»</div>
                <div className="text-xs text-muted-foreground animate-pulse">HexStalcke Kernel Active @ {displayId}</div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
