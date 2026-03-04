import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Target,
  ShieldCheck,
  LayoutDashboard,
  ShoppingCart,
  LineChart,
  CheckCircle2,
  Lock,
  Star,
  Users,
  Check,
  X,
  Plus,
  Minus,
  Wallet,
  FileText,
  ArrowUpRight,
  ChevronDown,
  Activity,
  Package,
  CreditCard,
  Tag,
  Truck,
  ArrowDownToLine,
  Box,
  Settings,
  ShieldAlert,
  LogOut,
  User
} from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [isListening, setIsListening] = React.useState(false)
    const [circles, setCircles] = React.useState<Array<{
      id: number
      x: number
      y: number
      color: string
      fadeState: "in" | "out" | null
    }>>([])
    const lastAddedRef = React.useRef(0)

    const createCircle = React.useCallback((x: number, y: number) => {
      const buttonWidth = buttonRef.current?.offsetWidth || 0
      const xPos = x / buttonWidth
      const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${xPos * 100
        }%)`

      setCircles((prev) => [
        ...prev,
        { id: Date.now(), x, y, color, fadeState: null },
      ])
    }, [])

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isListening) return

        const currentTime = Date.now()
        if (currentTime - lastAddedRef.current > 100) {
          lastAddedRef.current = currentTime
          const rect = event.currentTarget.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          createCircle(x, y)
        }
      },
      [isListening, createCircle]
    )

    const handlePointerEnter = React.useCallback(() => {
      setIsListening(true)
    }, [])

    const handlePointerLeave = React.useCallback(() => {
      setIsListening(false)
    }, [])

    React.useEffect(() => {
      circles.forEach((circle) => {
        if (!circle.fadeState) {
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "in" } : c
              )
            )
          }, 0)

          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "out" } : c
              )
            )
          }, 1000)

          setTimeout(() => {
            setCircles((prev) => prev.filter((c) => c.id !== circle.id))
          }, 2200)
        }
      })
    }, [circles])

    return (
      <button
        ref={buttonRef}
        className={cn(
          "relative isolate px-8 py-3 rounded-3xl",
          "text-foreground font-medium text-base leading-6",
          "backdrop-blur-lg bg-[rgba(43,55,80,0.1)]",
          "cursor-pointer overflow-hidden",
          "before:content-[''] before:absolute before:inset-0",
          "before:rounded-[inherit] before:pointer-events-none",
          "before:z-[1]",
          "before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
          "before:mix-blend-multiply before:transition-transform before:duration-300",
          "active:before:scale-[0.975]",
          className
        )}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
        style={{
          "--circle-start": "rgba(255, 255, 255, 0.3)",
          "--circle-end": "rgba(255, 255, 255, 0)",
          ...(props.style as React.CSSProperties),
        } as React.CSSProperties}
      >
        {circles.map(({ id, x, y, color, fadeState }) => (
          <div
            key={id}
            className={cn(
              "absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "blur-lg pointer-events-none z-[-1] transition-opacity duration-300",
              fadeState === "in" && "opacity-75",
              fadeState === "out" && "opacity-0 duration-[1.2s]",
              !fadeState && "opacity-0"
            )}
            style={{
              left: x,
              top: y,
              background: color,
            }}
          />
        ))}
        {children}
      </button>
    )
  }
)

HoverButton.displayName = "HoverButton"

function Counter({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(`${prefix}0${decimals ? ',00' : ''}${suffix}`);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          const update = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const latest = start + (value - start) * easeProgress;

            let formatted;
            if (decimals) {
              formatted = latest.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
            } else {
              formatted = Math.floor(latest).toString();
            }
            setDisplay(`${prefix}${formatted}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(update);
            }
          };
          requestAnimationFrame(update);
        } else {
          setDisplay(`${prefix}0${decimals ? ',00' : ''}${suffix}`);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [value, prefix, suffix, decimals]);

  return <span ref={ref}>{display}</span>;
}

export default function App() {
  const [isAnnual, setIsAnnual] = useState(false);

  const primaryColor = "#004cf2";

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">



      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-24 bg-[#004cf2] overflow-hidden text-white">

        {/* Glow Effects - Feixe de luz no topo */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-white opacity-25 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Quadradinhos mais juntos (Matrix/Dot pattern com transparência) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1.5px, transparent 1.5px)`,
            backgroundSize: '16px 16px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 0%, black 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 0%, black 10%, transparent 70%)'
          }}
        ></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold mb-8 text-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#081b4b]">
                <path d="m22 13-10-5-10 5" />
                <path d="M2 13h20" />
                <path d="M12 8V4a2 2 0 0 1 2-2" />
              </svg>
              Feito para quem vende roupa
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[4rem] font-bold tracking-tight mb-6 leading-[1.1] max-w-4xl text-white">
              Sua loja sob controle.<br />
              <span className="text-blue-100 opacity-90">Decisões com&nbsp;clareza.</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/90 mb-10 leading-relaxed max-w-2xl mx-auto font-medium [text-wrap:balance]">
              Controle cada centavo da sua loja, evite a falta de estoque e descubra seu lucro real, sem tocar em nenhuma&nbsp;planilha.
            </p>

            <a href="#oferta" className="block w-full sm:w-max mt-4 mx-auto">
              <HoverButton className="w-full sm:w-auto h-[64px] sm:h-[72px] text-sm sm:text-xl font-bold rounded-full bg-[#0a1120] text-white group focus:outline-none flex items-center justify-center cursor-pointer transition-transform hover:scale-105 border border-slate-700/50 hover:border-slate-500/50 px-6 sm:px-12 backdrop-blur-xl shadow-2xl">
                QUERO ASSUMIR O CONTROLE
                <span className="w-8 h-8 sm:w-10 sm:h-10 ml-3 sm:ml-4 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </span>
              </HoverButton>
            </a>

            {/* Social Proof Avatars */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 bg-transparent px-2 sm:px-6 py-2 mx-auto w-full sm:w-max">
              <div className="flex -space-x-3">
                <img className="w-8 h-8 rounded-full border-2 border-[#004cf2] object-cover" src="https://randomuser.me/api/portraits/women/43.jpg" alt="Lojista" />
                <img className="w-8 h-8 rounded-full border-2 border-[#004cf2] object-cover" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Lojista" />
                <img className="w-8 h-8 rounded-full border-2 border-[#004cf2] object-cover" src="https://randomuser.me/api/portraits/women/12.jpg" alt="Lojista" />
                <img className="w-8 h-8 rounded-full border-2 border-[#004cf2] object-cover" src="https://randomuser.me/api/portraits/men/22.jpg" alt="Lojista" />
              </div>
              <p className="text-sm font-medium text-blue-100 text-center">Testado e aprovado por <strong className="text-white">+ de 30 lojas</strong></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FLOATING DASHBOARD MOCKUP ON DARK BG */}
      <section className="relative z-20 px-4 bg-slate-900 pt-20 pb-8 md:pt-28 md:pb-16 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight [text-wrap:balance] max-w-3xl mx-auto mb-4">
              Tenha em mãos tudo que precisa para a <span className="text-[#004cf2] drop-shadow-[0_0_15px_rgba(0,76,242,0.4)] whitespace-nowrap">sua loja crescer</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto [text-wrap:balance]">Um dashboard completo, inteligente e em tempo real para você nunca mais perder informações importantes de vista.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-[2rem] p-2 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-[#004cf2]/30 border border-white/30"
          >
            <div className="rounded-[1.5rem] overflow-hidden bg-slate-900 border border-slate-700/50 shadow-inner">
              {/* Fake Browser header */}
              <div className="bg-slate-800/80 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto bg-slate-900/50 text-slate-400 text-xs px-4 py-1.5 rounded-full flex gap-2 items-center w-64 justify-center border border-white/5">
                  <Lock className="w-3 h-3" /> app.nurvee.com
                </div>
              </div>
              {/* Animated Dashboard Mockup (replaces the image) */}
              <div className="bg-[#f4f7f9] text-slate-800 w-full font-sans overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px] rounded-b-[1.5rem]">

                {/* Sidebar Menu - Hidden on Mobile */}
                <div className="hidden md:flex w-[240px] bg-white border-r border-slate-200 h-full flex-col py-6 px-4 shrink-0 z-10" style={{ scrollbarWidth: 'none' }}>
                  <div className="flex items-center gap-2 px-2 mb-8">
                    <div className="w-8 h-8 bg-[#004cf2] rounded-lg flex items-center justify-center">
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-lg leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>Nurvee</div>
                      <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Gestão</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-[#004cf2] text-white rounded-xl mb-2 font-medium text-sm shadow-md shadow-blue-500/20">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium">
                      <Tag className="w-4 h-4" />
                      Vendas (PDV)
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium">
                      <Truck className="w-4 h-4" />
                      Pedidos & Entregas
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium">
                      <ArrowDownToLine className="w-4 h-4" />
                      Entradas / Compras
                    </div>

                    <div className="pt-4 pb-1 px-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                        Cadastros <ChevronDown className="w-3 h-3" />
                      </div>
                      <div className="space-y-1 pl-2 border-l-2 border-slate-100 ml-1.5 mt-2">
                        <div className="flex items-center gap-3 pl-3 py-1.5 text-slate-500 hover:text-slate-800 text-[0.8rem] font-medium"><Box className="w-3.5 h-3.5" /> Produtos & Estoque</div>
                        <div className="flex items-center gap-3 pl-3 py-1.5 text-slate-500 hover:text-slate-800 text-[0.8rem] font-medium"><FileText className="w-3.5 h-3.5" /> Precificação</div>
                        <div className="flex items-center gap-3 pl-3 py-1.5 text-slate-500 hover:text-slate-800 text-[0.8rem] font-medium"><Users className="w-3.5 h-3.5" /> Clientes</div>
                        <div className="flex items-center gap-3 pl-3 py-1.5 text-slate-500 hover:text-slate-800 text-[0.8rem] font-medium"><User className="w-3.5 h-3.5" /> Fornecedores</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 px-3 py-2 mt-4 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium">
                      <Store className="w-4 h-4" />
                      Configurar Loja
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium">
                      <Settings className="w-4 h-4" />
                      Configurações
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3 px-2 py-2 border border-slate-100 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#004cf2] text-sm shrink-0">N</div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-slate-800 truncate">Nurvee</div>
                        <div className="text-[10px] text-slate-400 truncate">loja@nurvee.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 mt-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Sair do sistema
                    </div>
                  </div>
                </div>

                {/* Dashboard Main Content */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

                  {/* Dashboard Header */}
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">DashBoard Financeiro</h2>
                      <p className="text-slate-500 text-sm mt-1">É o melhor momento para gerenciar suas finanças</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                      <span className="text-slate-500">Filtrar por:</span>
                      <span className="text-slate-800 font-bold">Mês Atual</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
                    </div>
                  </div>

                  {/* Top KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                    {[
                      { title: "Faturamento Total", val: 45320, prefix: "R$ ", dec: 2, desc: "+ 12 vendas hoje", animateDelay: 0 },
                      { title: "Lucro Líquido", val: 14280, prefix: "R$ ", dec: 2, desc: "+ 32% vs último mês", animateDelay: 0.1 },
                      { title: "Margem Média", val: 31.5, prefix: "", suf: "%", dec: 1, desc: "Excelente", descColor: "text-green-500", animateDelay: 0.2 },
                      { title: "Ticket Médio", val: 142.5, prefix: "R$ ", dec: 2, desc: "318 vendas", animateDelay: 0.3 },
                    ].map((kpi, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: kpi.animateDelay, duration: 0.5 }}
                        className="bg-white p-3 md:p-4 rounded-xl border border-slate-100 shadow-sm relative group hover:border-[#004cf2]/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-slate-500 text-[11px] sm:text-xs md:text-sm font-medium whitespace-normal sm:whitespace-nowrap overflow-hidden text-ellipsis mr-1 sm:mr-2 leading-tight">{kpi.title}</span>
                          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#004cf2] transition-colors shrink-0" />
                        </div>
                        <div className="text-xl sm:text-lg md:text-2xl font-bold text-slate-800 mb-1 tracking-tight">
                          <Counter value={kpi.val} prefix={kpi.prefix} suffix={kpi.suf} decimals={kpi.dec} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${kpi.descColor || 'text-slate-400'}`}>{kpi.desc}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Middle Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {/* Chart Area */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="col-span-1 lg:col-span-2 bg-white p-4 md:p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-sm md:text-base">Evolução de Vendas</h3>
                        <div className="flex items-center gap-2 text-[10px] md:text-sm text-slate-500 font-medium whitespace-nowrap">
                          <div className="w-2 h-2 rounded-full bg-[#004cf2]"></div> Receita Bruta
                        </div>
                      </div>
                      {/* Fake Chart Area */}
                      <div className="flex-1 relative flex items-end gap-2 w-full pt-4 h-[110px] px-2 md:px-6">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6 border-b border-slate-100 z-0">
                          {[4, 3, 2, 1, 0].map(n => (
                            <div key={n} className="w-full flex items-center h-0 border-t border-slate-50 border-dashed">
                              <span className="absolute -left-1 text-[9px] md:text-[10px] text-slate-300 font-mono -translate-y-1/2 -mb-2">R${n}k</span>
                            </div>
                          ))}
                        </div>
                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-0 right-0 px-2 md:px-6 flex justify-between text-[8px] md:text-[9px] text-slate-400 font-mono font-medium mb-0.5" style={{ transform: 'translateX(-4px)' }}>
                          {['01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31'].map((date, idx) => (
                            <span key={idx}>{date}</span>
                          ))}
                        </div>
                        {/* Animated Line Graph */}
                        <div className="relative z-10 w-full h-[120px] pb-6 flex items-end justify-between">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#004cf2" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#004cf2" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <motion.path
                              d="M 0 65 L 6 55 L 12 75 L 18 40 L 25 45 L 31 30 L 37 50 L 43 20 L 50 35 L 56 60 L 62 15 L 68 25 L 75 45 L 81 10 L 87 30 L 93 55 L 100 25"
                              fill="none"
                              stroke="#004cf2"
                              strokeWidth="3"
                              vectorEffect="non-scaling-stroke"
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              viewport={{ once: false }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            <motion.path
                              d="M 0 65 L 6 55 L 12 75 L 18 40 L 25 45 L 31 30 L 37 50 L 43 20 L 50 35 L 56 60 L 62 15 L 68 25 L 75 45 L 81 10 L 87 30 L 93 55 L 100 25 L 100 100 L 0 100 Z"
                              fill="url(#chartGradient)"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: false }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    {/* Metas & Alertas */}
                    <div className="col-span-1 flex flex-col gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex-1"
                      >
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-[#004cf2]" /> Metas & Alertas</h3>
                        <div className="mb-4">
                          <div className="flex justify-between items-end mb-2">
                            <div>
                              <span className="text-slate-500 text-xs font-medium block">Meta do Mês</span>
                              <span className="font-bold text-slate-800 text-sm">R$ 50.000</span>
                            </div>
                            <span className="text-[#004cf2] font-bold"><Counter value={90.6} suffix="%" decimals={1} /></span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "90.6%" }}
                              viewport={{ once: false }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="bg-[#004cf2] h-2.5 rounded-full"
                            ></motion.div>
                          </div>
                          <p className="text-right text-xs text-slate-400 mt-1">Falta R$ 4.680</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mb-2"><Package className="w-3.5 h-3.5" /> Risco de Estoque</span>
                          <div className="bg-green-50 text-green-700 border border-green-100 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Estoque perfeitamente saudável.
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4 md:pb-0">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="col-span-1 lg:col-span-2 bg-white p-4 md:p-5 rounded-xl border border-slate-100 shadow-sm"
                    >
                      <h3 className="font-bold text-slate-800 mb-4 text-sm md:text-base">Top Produtos Vendidos</h3>
                      <div className="grid grid-cols-4 text-xs font-bold text-slate-400 mb-3 px-2">
                        <div className="col-span-2">Nome do Produto</div>
                        <div>Unidades</div>
                        <div>Valor Gerado</div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-4 items-center text-sm px-2 py-1.5 hover:bg-slate-50 rounded-lg">
                          <div className="col-span-2 font-semibold text-slate-700">T-Shirt Premium Algodão</div>
                          <div className="text-slate-600 font-medium"><Counter value={184} /></div>
                          <div className="text-emerald-600 font-semibold"><Counter value={14536} prefix="R$ " decimals={2} /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center text-sm px-2 py-1.5 hover:bg-slate-50 rounded-lg">
                          <div className="col-span-2 font-semibold text-slate-700">Calça Moletom Confort</div>
                          <div className="text-slate-600 font-medium"><Counter value={92} /></div>
                          <div className="text-emerald-600 font-semibold"><Counter value={11868} prefix="R$ " decimals={2} /></div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm"
                    >
                      <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#004cf2]" /> Meios de Pagamento</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-600">PIX (<Counter value={68} suffix="%" />)</span>
                            <span className="font-bold text-[#004cf2]"><Counter value={30817.6} prefix="R$ " decimals={2} /></span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "68%" }} viewport={{ once: false }} transition={{ duration: 1.5 }} className="bg-[#004cf2] h-1.5 rounded-full"></motion.div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-600">Cartão de Crédito (<Counter value={32} suffix="%" />)</span>
                            <span className="font-bold text-[#004cf2]"><Counter value={14502.4} prefix="R$ " decimals={2} /></span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "32%" }} viewport={{ once: false }} transition={{ duration: 1.5 }} className="bg-blue-300 h-1.5 rounded-full"></motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                </div>

                {/* Mobile Responsive Ready */}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-12 lg:-left-24 top-1/4 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold border border-slate-100 hidden md:flex animate-bounce z-50" style={{ animationDuration: '3s' }}>
              <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
              Meta Atingida!
            </div>
            <div className="absolute -right-12 lg:-right-24 bottom-1/4 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold border border-slate-700 hidden md:flex animate-bounce z-50" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="bg-[#004cf2] p-2 rounded-lg"><AlertTriangle className="w-5 h-5 text-white" /></div>
              Repor Estoque
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. AGITAÇÃO DA DOR - Perguntas */}
      <section className="py-24 md:py-32 bg-slate-900 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight [text-wrap:balance] max-w-3xl mx-auto">
              Você realmente controla <span className="text-[#004cf2] drop-shadow-[0_0_15px_rgba(0,76,242,0.5)] whitespace-nowrap">a sua loja?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {/* Card 1 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#004cf2]/50 transition-colors">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <LineChart className="w-6 h-6 text-[#004cf2]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-6 leading-snug">
                Você sabe seu lucro<br />líquido hoje?
              </h3>
              <div className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                <p>Faturamento não é lucro.</p>
                <p>Sem margem clara você não vê a cor do dinheiro.</p>
                <p>Sem visão diária você decide no escuro.</p>
                <p>Sem controle o dinheiro some.</p>
                <p className="text-slate-200 font-semibold mt-4">Lucro não pode ser surpresa.</p>
              </div>
              <div className="w-full pt-6 border-t border-slate-700/50">
                <p className="text-[#004cf2] font-bold text-sm mb-2 uppercase tracking-wide">NURVEE RESOLVE:</p>
                <p className="text-sm text-slate-300">Dashboard financeiro com lucro líquido calculado automaticamente em tempo real.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#004cf2]/50 transition-colors">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <AlertTriangle className="w-6 h-6 text-[#004cf2]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-6 leading-snug">
                Você sabe o que está<br />faltando no estoque?
              </h3>
              <div className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                <p>Olhar a prateleira não é gestão.</p>
                <p>Sem controle você perde vendas.</p>
                <p>Sem previsão você compra errado.</p>
                <p>Sem alertas você descobre tarde.</p>
                <p className="text-slate-200 font-semibold mt-4">Produto em falta é dinheiro na mesa.</p>
              </div>
              <div className="w-full pt-6 border-t border-slate-700/50">
                <p className="text-[#004cf2] font-bold text-sm mb-2 uppercase tracking-wide">NURVEE RESOLVE:</p>
                <p className="text-sm text-slate-300">Monitoramento inteligente de estoque com alertas preditivos de produtos com risco de falta.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#004cf2]/50 transition-colors">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Wallet className="w-6 h-6 text-[#004cf2]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-6 leading-snug">
                Contas a pagar e receber<br />estão sob controle?
              </h3>
              <div className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                <p>Misturar finanças da loja com pessoal destrói o negócio.</p>
                <p>Sem fluxo atualizado você trava o caixa.</p>
                <p>Sem previsão você assume riscos desnecessários.</p>
                <p className="text-slate-200 font-semibold mt-4">Caixa desorganizado quebra margem.</p>
              </div>
              <div className="w-full pt-6 border-t border-slate-700/50">
                <p className="text-[#004cf2] font-bold text-sm mb-2 uppercase tracking-wide">NURVEE RESOLVE:</p>
                <p className="text-sm text-slate-300">Controle completo de despesas e receitas à prova de erros.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#004cf2]/50 transition-colors">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <FileText className="w-6 h-6 text-[#004cf2]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-6 leading-snug">
                Ainda anota vendas no<br />caderninho ou planilha?
              </h3>
              <div className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                <p>Papel aceita tudo, menos crescimento de verdade.</p>
                <p>Todo dia repetindo trabalhos manuais.</p>
                <p>Todo fechamento é uma dor de cabeça.</p>
                <p>Furos nos cálculos acontecem diariamente.</p>
                <p className="text-slate-200 font-semibold mt-4">Isso não escala.</p>
              </div>
              <div className="w-full pt-6 border-t border-slate-700/50">
                <p className="text-[#004cf2] font-bold text-sm mb-2 uppercase tracking-wide">NURVEE RESOLVE:</p>
                <p className="text-sm text-slate-300">PDV integrado e registro prático de vendas com poucos cliques.</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#004cf2]/50 transition-colors">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Target className="w-6 h-6 text-[#004cf2]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-6 leading-snug">
                Você sabe quais produtos<br />dão mais lucro?
              </h3>
              <div className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                <p>Vender muito não é sinônimo de alta margem.</p>
                <p>Sem dados você foca esforço no produto errado.</p>
                <p>Sem análise o estoque fica encalhado.</p>
                <p>Acha que faturou muito, mas não sobra dinheiro.</p>
                <p className="text-slate-200 font-semibold mt-4">Gestão exige números.</p>
              </div>
              <div className="w-full pt-6 border-t border-slate-700/50">
                <p className="text-[#004cf2] font-bold text-sm mb-2 uppercase tracking-wide">NURVEE RESOLVE:</p>
                <p className="text-sm text-slate-300">Ranking automático dos produtos campeões que realmente dão lucro.</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#004cf2]/50 transition-colors">
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Users className="w-6 h-6 text-[#004cf2]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-6 leading-snug">
                Você sabe quem são<br />seus melhores clientes?
              </h3>
              <div className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                <p>Histórico espalhado em conversas soltas no WhatsApp.</p>
                <p>Sem saber quem compra de forma recorrente.</p>
                <p>Promove descontos sem métrica estratégica.</p>
                <p>Atendimento robotizado, sem personalização.</p>
                <p className="text-slate-200 font-semibold mt-4">Venda sem relacionamento trava.</p>
              </div>
              <div className="w-full pt-6 border-t border-slate-700/50">
                <p className="text-[#004cf2] font-bold text-sm mb-2 uppercase tracking-wide">NURVEE RESOLVE:</p>
                <p className="text-sm text-slate-300">CRM prático com histórico completo de compras de cada cliente.</p>
              </div>
            </div>
          </div>

          {/* Bottom Area */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-slate-400 text-lg mb-6 [text-wrap:balance]">Se você se identificou com <strong className="text-white">pelo menos 2</strong> dessas&nbsp;situações...</p>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-tight leading-tight [text-wrap:balance]">
              Sua loja não está crescendo. <span className="text-[#004cf2] drop-shadow-[0_0_15px_rgba(0,76,242,0.4)] whitespace-nowrap">Está sobrevivendo.</span>
            </h3>

            <a href="#oferta" className="block w-full sm:w-max mt-4 mx-auto">
              <HoverButton className="w-full sm:w-auto h-[64px] sm:h-[72px] text-sm sm:text-xl font-bold rounded-full bg-[#0a1120] text-white group focus:outline-none flex items-center justify-center cursor-pointer transition-transform hover:scale-105 border border-slate-700/50 hover:border-slate-500/50 px-6 sm:px-12 backdrop-blur-xl shadow-2xl">
                QUERO ASSUMIR O CONTROLE
                <span className="w-8 h-8 sm:w-10 sm:h-10 ml-3 sm:ml-4 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </span>
              </HoverButton>
            </a>
          </div>
        </div>
      </section>

      {/* 4. DÚVIDAS E QUEBRAS DE OBJEÇÃO */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#004cf2] font-bold tracking-wider uppercase text-sm mb-4 block bg-blue-50 py-1.5 px-4 rounded-full inline-block">ZERO COMPLICAÇÃO</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Dá para começar agora, <span className="text-[#004cf2]">mesmo&nbsp;que...</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">

            {/* Objection 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#004cf2]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-slate-400 font-normal">...</span> você ainda use planilhas
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                O Nurvee permite transcrever seus dados de planilhas existentes ou recomeçar de forma muito mais simples, facilitando a transição sem dor de cabeça.
              </p>
            </div>

            {/* Objection 2 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#004cf2]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-slate-400 font-normal">...</span> esteja começando do zero
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                A plataforma é perfeita tanto para lojas iniciantes quanto para as já estabelecidas, com módulos fáceis e prontos para usar.
              </p>
            </div>

            {/* Objection 3 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#004cf2]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-slate-400 font-normal">...</span> ache que não entende de tecnologia
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Interface totalmente intuitiva, similar a usar um aplicativo de celular. Não é preciso ser nenhum expert em tecnologia para gerenciar sua loja.
              </p>
            </div>

            {/* Objection 4 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#004cf2]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-slate-400 font-normal">...</span> já use outro sistema e esteja inseguro
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Nós te ajudamos a organizar a casa e começar do jeito certo no Nurvee. O processo de adaptação costuma levar apenas alguns dias para a equipe inteira.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4.5 COMPARATIVO */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-blue-900/40 text-blue-300 font-semibold tracking-wide px-4 py-1.5 rounded-full text-sm mb-6 inline-block border border-blue-700/50">
              Comparativo Visual
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 [text-wrap:balance]">
              Por que o <span className="text-[#004cf2]">Nurvee</span> substitui tudo&nbsp;isso?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto [text-wrap:balance]">
              Compare o Nurvee com misturar planilhas, cadernos e sistemas genéricos, e entenda por que somos a solução definitiva para o controle da sua&nbsp;loja.
            </p>
          </div>

          <div className="bg-slate-800/40 rounded-2xl sm:rounded-3xl border border-slate-700/50 overflow-hidden backdrop-blur-sm -mx-4 sm:mx-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 sm:gap-4 p-4 sm:p-6 border-b border-slate-700/50 items-center bg-slate-800/80">
              <div className="col-span-6 md:col-span-6 font-semibold text-slate-300 text-xs sm:text-base leading-tight pr-1">Recurso Essencial</div>
              <div className="col-span-3 md:col-span-3 text-center">
                <div className="bg-[#004cf2] text-white font-bold py-1 sm:py-2 px-1 sm:px-4 rounded-lg sm:rounded-xl inline-block shadow-[0_0_15px_rgba(0,76,242,0.4)] text-[10px] sm:text-base whitespace-nowrap">
                  Nurvee
                </div>
              </div>
              <div className="col-span-3 md:col-span-3 text-center text-slate-400 font-semibold text-[10px] sm:text-base leading-tight">
                Planilhas
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-700/30">
              {[
                { label: "Dashboard financeiro com lucro real diário", others: "partial" },
                { label: "Monitoramento inteligente de estoque com alertas antecipados", others: "no" },
                { label: "Ranking de produtos baseados na margem de lucro", others: "no" },
                { label: "Fluxo de caixa sem misturar contas pessoais", others: "partial" },
                { label: "Registro rápido de vendas no celular (PDV)", others: "no" },
                { label: "CRM com histórico de compras do cliente", others: "partial" },
                { label: "Feito exclusivamente para lojistas de varejo", others: "no" },
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 sm:gap-4 p-4 sm:p-6 items-center hover:bg-slate-700/20 transition-colors">
                  <div className="col-span-6 md:col-span-6 font-medium text-slate-200 text-[11px] sm:text-base leading-snug">
                    {item.label}
                  </div>
                  <div className="col-span-3 md:col-span-3 flex justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <Check className="w-3 h-3 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 flex justify-center text-center">
                    {item.others === "no" ? (
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500/70" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4.2 O PROCESSADOR DA SUA OPERAÇÃO (SISTEMA) */}
      <section className="py-24 md:py-32 bg-[#040812] relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,76,242,0.06)_0%,rgba(0,0,0,0)_60%)]"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 [text-wrap:balance] max-w-3xl mx-auto">
              Sua loja funciona como <span className="text-[#004cf2] drop-shadow-[0_0_20px_rgba(0,76,242,0.4)] relative whitespace-nowrap">um sistema</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto [text-wrap:balance]">
              Cada área da sua loja gera dados importantes. Todos eles passam e são guiados pelo Nurvee.
            </p>
          </div>

          {/* Desktop/Tablet System Visualization */}
          <div className="hidden md:block relative w-full h-[600px] max-w-4xl mx-auto">
            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {[
                { x: "50%", y: "5%" },    // Top
                { x: "85%", y: "25%" },   // Top Right
                { x: "92%", y: "50%" },   // Right
                { x: "85%", y: "75%" },   // Bottom Right
                { x: "50%", y: "90%" },   // Bottom
                { x: "15%", y: "75%" },   // Bottom Left
                { x: "8%", y: "50%" },    // Left
                { x: "15%", y: "25%" },   // Top Left
              ].map((pt, i) => (
                <motion.line
                  key={i}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                  x1="50%" y1="50%" x2={pt.x} y2={pt.y}
                  stroke="#004cf2" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4"
                />
              ))}
            </svg>

            {/* Central Node */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
            >
              <div className="bg-[#020408] border border-[#004cf2] shadow-[0_0_40px_rgba(0,76,242,0.3)] rounded-2xl p-6 w-64 text-center relative overflow-hidden group hover:border-blue-400 transition-colors">
                <div className="absolute inset-0 bg-[#004cf2]/10 animate-pulse"></div>
                <h3 className="text-white font-black text-2xl mb-1 tracking-widest uppercase relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">NURVEE</h3>
              </div>
              <div className="text-center mt-6">
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2 drop-shadow-md">O PROCESSADOR DA SUA OPERAÇÃO</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider relative">
                  Centraliza. <span className="text-[#004cf2]">Analisa.</span> Conecta. <span className="text-[#004cf2]">Projeta.</span>
                </p>
              </div>
            </motion.div>

            {/* Outer Nodes */}
            {[
              { title: "FINANCEIRO", desc: "Entradas. Saídas. Lucro. Margem.", x: "50%", y: "5%" },
              { title: "VENDAS (PDV)", desc: "Registro rápido. Caixa. Movimentações.", x: "85%", y: "25%" },
              { title: "ESTOQUE", desc: "Produtos. Alertas. Curva ABC.", x: "92%", y: "50%" },
              { title: "CLIENTES", desc: "Histórico. Frequência. Ticket Médio.", x: "85%", y: "75%" },
              { title: "PRECIFICAÇÃO", desc: "Custos. Markup. Preço Ideal.", x: "50%", y: "90%" },
              { title: "METAS", desc: "Progresso diário. Motivação da equipe.", x: "15%", y: "75%" },
              { title: "RELATÓRIOS", desc: "DRE automático. Indicadores de visão.", x: "8%", y: "50%" },
              { title: "FORNECEDORES", desc: "Compras. Histórico. Prazos.", x: "15%", y: "25%" },
            ].map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 bg-[#0A1120]/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 w-48 text-center hover:border-[#004cf2]/60 hover:shadow-[0_0_25px_rgba(0,76,242,0.15)] transition-all cursor-default"
                style={{ left: node.x, top: node.y }}
              >
                <h4 className="text-[#004cf2] font-black text-xs uppercase tracking-wider mb-2 drop-shadow-[0_0_8px_rgba(0,76,242,0.8)]">{node.title}</h4>
                <p className="text-slate-400 text-[11px] font-medium leading-relaxed">{node.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile System Visualization */}
          <div className="md:hidden flex flex-col items-center gap-2 mt-4">
            <div className="bg-[#020408] border border-[#004cf2] shadow-[0_0_30px_rgba(0,76,242,0.3)] rounded-2xl py-8 px-6 w-[95%] text-center relative overflow-hidden mb-6 z-20 mx-auto">
              <div className="absolute inset-0 bg-[#004cf2]/5 animate-pulse"></div>
              <h3 className="text-white font-black text-2xl mb-4 tracking-widest uppercase relative z-10">NURVEE</h3>
              <p className="text-white font-bold text-xs uppercase tracking-widest mb-2 relative z-10">O PROCESSADOR DA SUA OPERAÇÃO</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider relative z-10">Centraliza. Analisa. Conecta. Projeta.</p>
            </div>

            <div className="relative w-full px-2">
              {/* Connecting Lines Background (Mobile) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ top: '-1.5rem', height: 'calc(100% + 1.5rem)' }}>
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.5 }}
                  x1="50%" y1="0" x2="50%" y2="90%"
                  stroke="#004cf2" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4"
                />

                {[12.5, 37.5, 62.5, 87.5].map((y, i) => (
                  <React.Fragment key={i}>
                    {/* Linha pro item da Esquerda */}
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.8, delay: 0.3 * (i + 1) }}
                      x1="50%" y1={`${y}%`} x2="25%" y2={`${y}%`}
                      stroke="#004cf2" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4"
                    />
                    {/* Linha pro item da Direita */}
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.8, delay: 0.3 * (i + 1) }}
                      x1="50%" y1={`${y}%`} x2="75%" y2={`${y}%`}
                      stroke="#004cf2" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4"
                    />
                  </React.Fragment>
                ))}
              </svg>

              <div className="grid grid-cols-2 gap-3 gap-y-12 w-full relative z-10">
                {[
                  { title: "FINANCEIRO", desc: "Entradas. Saídas. Lucro. Margem." },
                  { title: "VENDAS (PDV)", desc: "Registro rápido. Caixa. Movimentações." },
                  { title: "ESTOQUE", desc: "Produtos. Alertas. Curva ABC." },
                  { title: "CLIENTES", desc: "Histórico. Frequência. Ticket." },
                  { title: "PRECIFICAÇÃO", desc: "Custos. Markup. Preço Ideal." },
                  { title: "METAS", desc: "Progresso. Motivação da equipe." },
                  { title: "RELATÓRIOS", desc: "DRE. Indicadores estratégicos." },
                  { title: "FORNECEDORES", desc: "Controle de Compras. Prazos." },
                ].map((node, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.05 }}
                    key={i}
                    className="bg-[#0A1120]/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center hover:border-[#004cf2]/40 transition-colors shadow-lg"
                  >
                    <h4 className="text-[#004cf2] font-black text-[11px] uppercase tracking-wider mb-2 leading-tight">{node.title}</h4>
                    <p className="text-slate-400 text-[10px] leading-tight">{node.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 6. PROVA SOCIAL (Testimonials - Marquee) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-20">
          <span className="text-[#004cf2] font-bold tracking-wider uppercase text-sm mb-6 inline-flex items-center gap-2 bg-blue-50 py-1.5 px-4 rounded-full border border-blue-100">
            <span className="text-base leading-none translate-y-[-1px]">🏆</span> Quem usa, recomenda
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight [text-wrap:balance]">
            Seja a próxima loja a <span className="text-[#004cf2] whitespace-nowrap">multiplicar o&nbsp;lucro!</span>
          </h2>
          <p className="text-slate-600 text-lg mb-8 [text-wrap:balance] max-w-2xl mx-auto">Veja o que acontece quando você passa a entender os números e zera o desperdício&nbsp;financeiro.</p>
        </div>

        {/* Marquee Wrapper */}
        <div className="flex flex-col gap-6 relative w-full overflow-hidden">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

          {/* Row 1: Moving Left */}
          <div className="flex w-full overflow-hidden group">
            {/* We render exactly 2 identical tracks side by side */}
            {[0, 1].map((trackIdx) => (
              <div key={trackIdx} className="flex shrink-0 animate-[marquee_50s_linear_infinite] group-hover:[animation-play-state:paused] gap-6 px-3" aria-hidden={trackIdx === 1 ? 'true' : 'false'}>
                {[
                  { name: "Mariana Silveira", role: "Dona de Boutique • SP", text: "Antes eu achava que estava empatando. O Nurvee me mostrou que alguns produtos consumiam toda a minha margem. No mês seguinte que os cortei, meu lucro dobrou.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                  { name: "Carla Mendes", role: "Empreendedora • RJ", text: "Eu perdia 2 horas todo dia na planilha. Agora eu aperto um botão e vejo tudo que entrou de PIX e Cartão. A paz de espírito não tem preço !", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
                  { name: "Juliana Costa", role: "Lojista • MG", text: "Sempre tive medo de investir em anúncios, mas agora com o fluxo de caixa certinho e sabendo o lucro real, faço isso com a maior segurança.", avatar: "https://randomuser.me/api/portraits/women/89.jpg" },
                  { name: "Amanda Silva", role: "Dona de Loja Infantil • SC", text: "A facilidade de controlar o estoque e PDV na mesma tela me economizou o preço de um funcionário. Indico pra todo mundo.", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
                  { name: "Mariana Silveira", role: "Dona de Boutique • SP", text: "Antes eu achava que estava empatando. O Nurvee me mostrou que alguns produtos consumiam toda a minha margem. No mês seguinte que os cortei, meu lucro dobrou.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                  { name: "Carla Mendes", role: "Empreendedora • RJ", text: "Eu perdia 2 horas todo dia na planilha. Agora eu aperto um botão e vejo tudo que entrou de PIX e Cartão. A paz de espírito não tem preço !", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
                  { name: "Juliana Costa", role: "Lojista • MG", text: "Sempre tive medo de investir em anúncios, mas agora com o fluxo de caixa certinho e sabendo o lucro real, faço isso com a maior segurança.", avatar: "https://randomuser.me/api/portraits/women/89.jpg" },
                  { name: "Amanda Silva", role: "Dona de Loja Infantil • SC", text: "A facilidade de controlar o estoque e PDV na mesma tela me economizou o preço de um funcionário. Indico pra todo mundo.", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
                ].map((node, i) => (
                  <div key={i} className="w-[320px] md:w-[400px] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col shrink-0 transform transition-transform duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img src={node.avatar} className="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-100" alt={node.name} />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{node.name}</h4>
                          <p className="text-xs text-slate-500">{node.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-[#d8b058]">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-2">"{node.text}"</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row 2: Moving Right */}
          <div className="flex w-full overflow-hidden group">
            {[0, 1].map((trackIdx) => (
              <div key={trackIdx} className="flex shrink-0 animate-[marquee-reverse_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-6 px-3" aria-hidden={trackIdx === 1 ? 'true' : 'false'}>
                {[
                  { name: "Bárbara Leão", role: "Empreendedora • MG", text: "O suporte é simplesmente impecável. Sempre que precisamos de algo, a equipe está disponível com um sorriso no rosto. Vale cada centavo.", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
                  { name: "Luiza Moreira", role: "Moda Íntima • SP", text: "Não sou a melhor com tecnologia, mas o Nurvee é tão visual que nem precisei de treinamento. A equipe toda já acostumou rapidinho.", avatar: "https://randomuser.me/api/portraits/women/54.jpg" },
                  { name: "Rafael Torres", role: "Multimarcas • RS", text: "Conseguimos cortar gastos invisíveis com a curva ABC. Saber quem são meus melhores clientes também mudou nosso jogo de vendas.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                  { name: "Cláudia Vieira", role: "Dona de Loja de Calçados", text: "Minha grande dor era não saber onde estava o dinheiro. A plataforma clareou meus números, hoje eu fecho o mês muito tranquila.", avatar: "https://randomuser.me/api/portraits/women/79.jpg" },
                  { name: "Bárbara Leão", role: "Empreendedora • MG", text: "O suporte é simplesmente impecável. Sempre que precisamos de algo, a equipe está disponível com um sorriso no rosto. Vale cada centavo.", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
                  { name: "Luiza Moreira", role: "Moda Íntima • SP", text: "Não sou a melhor com tecnologia, mas o Nurvee é tão visual que nem precisei de treinamento. A equipe toda já acostumou rapidinho.", avatar: "https://randomuser.me/api/portraits/women/54.jpg" },
                  { name: "Rafael Torres", role: "Multimarcas • RS", text: "Conseguimos cortar gastos invisíveis com a curva ABC. Saber quem são meus melhores clientes também mudou nosso jogo de vendas.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                  { name: "Cláudia Vieira", role: "Dona de Loja de Calçados", text: "Minha grande dor era não saber onde estava o dinheiro. A plataforma clareou meus números, hoje eu fecho o mês muito tranquila.", avatar: "https://randomuser.me/api/portraits/women/79.jpg" },
                ].map((node, i) => (
                  <div key={i} className="w-[320px] md:w-[400px] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col shrink-0 transform transition-transform duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img src={node.avatar} className="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-100" alt={node.name} />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{node.name}</h4>
                          <p className="text-xs text-slate-500">{node.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-[#d8b058]">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-2">"{node.text}"</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PREÇO & OFERTA */}
      <section id="oferta" className="py-24 bg-white relative text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Investimento Simples e Transparente</h2>
            <p className="text-lg text-slate-600">Escolha o plano ideal para profissionalizar a sua loja.</p>
          </div>

          {/* Toggle Mensal/Anual */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-100 p-1.5 rounded-full flex text-sm font-semibold shadow-inner">
              <button
                onClick={() => setIsAnnual(false)}
                className={`py-2 px-6 rounded-full transition-all duration-300 ${!isAnnual ? 'bg-[#004cf2] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`py-2 px-6 rounded-full transition-all duration-300 flex items-center gap-2 ${isAnnual ? 'bg-[#004cf2] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Anual <span className={`${isAnnual ? 'text-blue-200' : 'text-slate-400'} font-normal text-xs`}> (2 meses grátis)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto text-left">
            <div className="border border-slate-200 rounded-3xl p-8 bg-white relative shadow-sm flex flex-col order-2 md:order-1">
              <div className="flex flex-wrap items-center gap-2 mb-2 md:mt-0">
                <h3 className="text-2xl font-bold text-slate-900 mr-2">Essencial</h3>
                {isAnnual && (
                  <div className="bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                    ECONOMIA DE R$ 134
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 text-[#004cf2] mb-6">
                <span className="text-xl font-bold text-slate-900">R$</span>
                <span className="text-4xl font-bold">{isAnnual ? '670' : '67'}</span>
                <span className="text-slate-500 font-medium">/{isAnnual ? 'ano' : 'mês'}</span>
              </div>

              <ul className="space-y-4 text-slate-600 mb-8 flex-1 text-sm md:text-base">
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-400 shrink-0" /> Dashboard financeiro completo</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-400 shrink-0" /> Controle avançado de Estoque e PDV</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-400 shrink-0" /> Cadastro de Clientes (CRM)</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-400 shrink-0" /> Gestão de Pedidos e Entregas</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-400 shrink-0" /> Cadastro de Fornecedores</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-400 shrink-0" /> Histórico de Fluxo de Caixa</li>
                <li className="flex gap-3 text-slate-400 opacity-60"><X className="w-5 h-5 text-slate-300 shrink-0" /> <span className="line-through decoration-slate-300">Vitrine Online (Loja)</span></li>
              </ul>

              <a
                href={isAnnual ? "https://pay.kiwify.com.br/0Cs1h3H" : "https://pay.kiwify.com.br/otDQDiC"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center block"
              >
                Assinar Essencial
              </a>
            </div>

            <div className="border-2 border-[#004cf2] rounded-3xl p-8 bg-white relative shadow-xl flex flex-col transform hover:-translate-y-1 transition-transform order-1 md:order-2">
              <div className="flex flex-wrap items-center gap-2 mb-2 md:mt-0">
                <h3 className="text-2xl font-bold text-slate-900 mr-2">Pro</h3>
                <span className="bg-[#004cf2] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shrink-0">RECOMENDADO</span>
                {isAnnual && (
                  <div className="bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                    ECONOMIA DE R$ 194
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 text-[#004cf2] mb-6">
                <span className="text-xl font-bold text-slate-900">R$</span>
                <span className="text-4xl font-bold">{isAnnual ? '970' : '97'}</span>
                <span className="text-slate-500 font-medium">/{isAnnual ? 'ano' : 'mês'}</span>
              </div>

              <ul className="space-y-4 text-slate-600 mb-8 flex-1 text-sm md:text-base">
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-500 shrink-0" /> Dashboard financeiro completo</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-500 shrink-0" /> Controle avançado de Estoque e PDV</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-500 shrink-0" /> Cadastro de Clientes (CRM)</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-500 shrink-0" /> Gestão de Pedidos e Entregas</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-500 shrink-0" /> Cadastro de Fornecedores</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-slate-500 shrink-0" /> Histórico de Fluxo de Caixa</li>
                <li className="flex gap-3 text-slate-900 font-bold"><Check className="w-5 h-5 text-[#004cf2] shrink-0 font-bold" /> Vitrine Online (Loja) Integrada</li>
              </ul>

              <a
                href={isAnnual ? "https://pay.kiwify.com.br/6H8QtFb" : "https://pay.kiwify.com.br/QiPSl1L"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl font-bold text-white bg-[#004cf2] hover:bg-blue-700 transition-colors shadow-lg shadow-[#004cf2]/30 text-center block"
              >
                Assinar Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GARANTIA */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden">

          {/* Custom 7-Day Guarantee Circular Badge */}
          <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,76,242,0.12)] border border-blue-50">
            {/* Outermost subtle dashes */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_40s_linear_infinite]" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="92" fill="none" stroke="#004cf2" strokeWidth="1" strokeDasharray="2 6" opacity="0.2" />
            </svg>

            {/* Rotating Text using SVG */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_25s_linear_infinite]" viewBox="0 0 200 200">
              <defs>
                <path id="textCircle" d="M 100, 26 A 74,74 0 1,1 99.9,26" />
              </defs>
              <text fill="#004cf2" fontSize="13.5" fontWeight="bold" letterSpacing="4.7">
                <textPath href="#textCircle" startOffset="0%">
                  7 DIAS DE GARANTIA • 7 DIAS DE GARANTIA •
                </textPath>
              </text>
            </svg>

            {/* Inner dashes */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_35s_linear_infinite_reverse]" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="48" fill="none" stroke="#004cf2" strokeWidth="2" strokeDasharray="4 6" opacity="0.4" />
            </svg>

            {/* Additional inner glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-xl pointer-events-none"></div>

            {/* Center Number */}
            <div className="relative z-10 font-black text-[4.5rem] text-[#004cf2] transform translate-y-1 drop-shadow-sm leading-none tracking-tighter">
              7
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-6 relative z-10">
            <span className="bg-gradient-to-r from-[#004cf2] to-blue-400 bg-clip-text text-transparent">Risco Zero:</span> 7 Dias de Garantia
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed relative z-10">
            Assine agora, cadastre seus produtos, teste os painéis e conheça a plataforma. Se você não se adaptar ou achar que voltar pro caderninho é melhor, devolvemos 100% do seu pagamento na mesma hora.
          </p>
        </div>
      </section>


      {/* 10. BIG FINAL CTA (Novo Visual) */}
      <section className="pb-24 pt-8 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004cf2] rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <span className="bg-white/10 text-white font-medium px-5 py-2 rounded-full mb-8 backdrop-blur-md border border-white/20 inline-flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-blue-300" /> Assuma o controle da sua loja
              </span>

              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight max-w-2xl text-white [text-wrap:balance]">
                Pare de perder tempo com planilhas e cadernos.
              </h2>

              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed [text-wrap:balance]">
                Faça sua assinatura agora. Elimine prejuízos com estoque parado e tenha o controle financeiro que a sua loja merece.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
                <a href="#oferta" className="flex-1 py-4 px-6 bg-gradient-to-r from-[#004cf2] to-blue-500 rounded-full font-bold text-white hover:shadow-[0_0_30px_rgba(0,76,242,0.4)] transition-all">
                  Assinar Nurvee
                </a>
                <a href="#oferta" className="flex-1 py-4 px-6 bg-transparent border border-white/30 rounded-full font-bold text-white hover:bg-white/10 transition-all">
                  Ver planos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-slate-900 py-10 border-t border-slate-800 text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 justify-center opacity-80">
            <Store className="w-5 h-5" />
            <span className="font-bold text-lg text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>Nurvee</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Nurvee. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
