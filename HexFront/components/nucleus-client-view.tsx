"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Terminal, Shield, Zap, Activity, Cpu, 
  Globe, Lock, AlertTriangle, ChevronRight, BarChart3,
  Loader2, Play, RefreshCw, Layers
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

export default function NucleusClientView({ id }: { id: string }) {
  const [target, setTarget] = useState("")
  const [analysisType, setAnalysisType] = useState("comprehensive")
  const [logs, setLogs] = useState<LogLine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState<"connecting" | "online" | "offline">("connecting")
  const [progress, setProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
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
    appendLog(`AUTENTICAÇÃO_STALCKE_ATIVA: ${id}`, "success")
    appendLog("Matriz de segurança binária sincronizada.", "")

    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const binaryHash = id?.toString().split('').map((char: string) => char.charCodeAt(0).toString(2)).join(' ').substring(0, 32) + "..."

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
    appendLog(`Iniciando análise ${analysisType.toUpperCase()} no alvo: ${target}...`, "info")
    
    if (analysisType === 'phone_tracking') {
      appendLog("Sincronizando com satélites de telecomunicações...", "info")
      appendLog("Interceptando sinais de rede (SS7/MAP)...", "warn")
      appendLog("Triangulando coordenadas via ERBs...", "info")
    }


    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 1 : prev))
      }, 500)

      const result = await launchAnalysis(target, analysisType)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (result.success !== false) {
        appendLog(`Operação concluída com sucesso.`, "success")
        
        // Handle phone tracking results which are nested in execution_results
        const phoneData = result.execution_results
        if (analysisType === 'phone_tracking' && phoneData && phoneData.geo) {
          setAnalysisResult(phoneData)
          appendLog(`🌐 Localização detectada: ${phoneData.geo.city || 'Desconhecida'}, ${phoneData.geo.state || ''}`, "success")
          appendLog(`📡 Operadora: ${phoneData.carrier || 'Desconhecida'}`, "info")
        } else {
          setAnalysisResult(result)
        }

        // Exibir resultados brutos se existirem
        if (result.results_raw) {
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-red-500/30 font-mono">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
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
              ID: {id?.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card/30 backdrop-blur-md border border-red-900/20 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
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
                    <option value="vulnerability">Busca de Vulnerabilidades</option>
                    <option value="api">Análise de Segurança de API</option>
                    <option value="phone_tracking">Rastreamento de Telefone (OSINT)</option>
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

          <div className="lg:col-span-8 flex flex-col h-[600px]">
            {analysisType === 'phone_tracking' ? (
              <PhoneMap 
                number={analysisResult?.number || target}
                formatted={analysisResult?.formatted || target}
                region={analysisResult?.region || ""}
                carrier={analysisResult?.carrier || ""}
                line_type={analysisResult?.line_type || ""}
                timezones={analysisResult?.timezones || []}
                geo={analysisResult?.geo || { lat: 0, lon: 0, city: "", state: "", country: "", country_code: "", display_name: "" }}
              />
            ) : (
              <div className="bg-[#0c0c0c] border border-red-900/30 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
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
                          log.type === 'success' ? 'text-green-500' :
                          log.type === 'info' ? 'text-blue-400' :
                          log.type === 'warn' ? 'text-yellow-500' :
                          'text-zinc-400'
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={terminalEndRef} />
                </div>

                <div className="bg-[#0a0a0a] border-t border-red-900/20 px-4 py-2 flex items-center gap-3">
                  <div className="text-red-500 font-bold">»</div>
                  <div className="text-xs text-muted-foreground animate-pulse">HexStalcke Kernel Active @ {id}</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
