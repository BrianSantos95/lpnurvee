import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Store,
    ArrowRight,
    TrendingUp,
    Check,
    CheckCircle2,
    Users,
    Wallet,
    ShoppingCart,
    LayoutDashboard,
    Package,
    Target,
    LineChart,
    FileText,
    Tag,
    Truck,
    ArrowDownToLine,
    Star,
    ChevronRight,
    Handshake,
    DollarSign,
    Repeat,
    BarChart3,
    Zap,
    Shield,
} from 'lucide-react';

// ─── Utils ───────────────────────────────────────────────────────────────
const cn = (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(' ');

// ─── Animated Counter ────────────────────────────────────────────────────
function Counter({
    value,
    prefix = '',
    suffix = '',
    decimals = 0,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(
        `${prefix}0${decimals ? ',00' : ''}${suffix}`
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const duration = 1800;
                    const startTime = performance.now();

                    const update = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress =
                            progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        const latest = 0 + (value - 0) * easeProgress;

                        let formatted: string;
                        if (decimals) {
                            formatted = latest.toLocaleString('pt-BR', {
                                minimumFractionDigits: decimals,
                                maximumFractionDigits: decimals,
                            });
                        } else {
                            formatted = Math.floor(latest).toString();
                        }
                        setDisplay(`${prefix}${formatted}${suffix}`);

                        if (progress < 1) requestAnimationFrame(update);
                    };
                    requestAnimationFrame(update);
                } else {
                    setDisplay(`${prefix}0${decimals ? ',00' : ''}${suffix}`);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [value, prefix, suffix, decimals]);

    return <span ref={ref}>{display}</span>;
}

// ─── Comission Calculator (interactive) ─────────────────────────────────
function CommissionCalculator() {
    const [usuarios, setUsuarios] = useState(10);

    // Valores reais de comissão por plano
    const commissionPro = 22.30;
    const commissionEssencial = 15.33;
    // Média ponderada (assumindo mix 50/50)
    const avgCommission = (commissionPro + commissionEssencial) / 2; // ≈ 18.82

    const monthly = parseFloat((usuarios * avgCommission).toFixed(2));
    const annual = parseFloat((monthly * 12).toFixed(2));

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 md:p-10 shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-2">
                Simule seus ganhos mensais
            </h3>
            <p className="text-blue-200 text-sm mb-6">
                Arraste para ver o potencial de renda passiva recorrente conforme sua base de usuários ativos cresce
            </p>

            {/* Slider */}
            <div className="mb-8">
                <div className="flex justify-between mb-3">
                    <span className="text-white/70 text-sm font-medium">
                        Usuários ativos indicados
                    </span>
                    <span className="text-white font-bold text-lg">{usuarios} usuários</span>
                </div>
                <input
                    type="range"
                    min={1}
                    max={100}
                    value={usuarios}
                    onChange={(e) => setUsuarios(Number(e.target.value))}
                    className="w-full h-2 appearance-none rounded-full cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #4c8eff ${usuarios}%, rgba(255,255,255,0.2) ${usuarios}%)`,
                    }}
                />
                <div className="flex justify-between mt-1 text-white/40 text-xs">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                        Comissão Mensal
                    </p>
                    <p className="text-white font-black text-3xl">
                        R$ <Counter value={monthly} decimals={2} />
                    </p>
                    <p className="text-blue-300 text-xs mt-1 font-medium">todo mês, recorrente</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                        Projeção Anual
                    </p>
                    <p className="text-white font-black text-3xl">
                        R$ <Counter value={annual} decimals={2} />
                    </p>
                    <p className="text-blue-300 text-xs mt-1 font-medium">sem precisar reindicar</p>
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                <Repeat className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm leading-relaxed">
                    Enquanto o usuário mantiver a assinatura ativa, você recebe sua comissão{' '}
                    <strong className="text-white">todo mês</strong>, sem precisar fazer
                    nada. Uma indicação vira renda recorrente.
                </p>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function Proposta() {
    const publicoItems = [
        {
            emoji: '🌱',
            title: 'Quem está começando',
            desc: 'A lojista que acabou de abrir a porta e ainda não sabe por onde começar a organizar as finanças e o estoque.',
        },
        {
            emoji: '📝',
            title: 'Quem ainda usa papel ou caderninho',
            desc: 'Anota tudo à mão, não sabe o lucro real e perde informação toda hora. Está pronta para dar o próximo passo.',
        },
        {
            emoji: '📊',
            title: 'Quem vive de planilha',
            desc: 'Sabe usar o Excel, mas perde horas por mês formatando dados e ainda assim não tem clareza nos números.',
        },
        {
            emoji: '🏪',
            title: 'A loja que já fatura bem',
            desc: 'Está crescendo, tem equipe, múltiplos fornecedores e precisa de uma ferramenta que acompanhe esse ritmo.',
        },
    ];

    const tools = [
        {
            icon: <LayoutDashboard className="w-6 h-6" />,
            title: 'Dashboard Financeiro',
            desc: 'Faturamento, lucro líquido, margem e ticket médio em tempo real. Uma tela, tudo que importa.',
        },
        {
            icon: <Tag className="w-6 h-6" />,
            title: 'PDV — Ponto de Venda',
            desc: 'Registro de vendas em segundos. Aceita PIX, cartão e dinheiro. Histórico organizado sem esforço.',
        },
        {
            icon: <Package className="w-6 h-6" />,
            title: 'Gestão de Estoque',
            desc: 'Alertas de reposição, curva ABC de produtos e controle de entradas/saídas com rastreabilidade.',
        },
        {
            icon: <Wallet className="w-6 h-6" />,
            title: 'Fluxo de Caixa',
            desc: 'Entradas e saídas categorizadas. Nunca mais misture finanças pessoais com as da loja.',
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'CRM de Clientes',
            desc: 'Histórico completo de cada compra, frequência e ticket médio por cliente.',
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: 'Precificação Inteligente',
            desc: 'Calcule o preço ideal com markup automático baseado no custo real do produto.',
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: 'Pedidos & Entregas',
            desc: 'Controle de pedidos em aberto, status de entrega e histórico de despachos.',
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: 'Metas & Relatórios',
            desc: 'Defina metas mensais, acompanhe o progresso e veja relatórios automáticos do desempenho.',
        },
    ];

    const diferenciais = [
        'Comissão recorrente mensal por cada usuário ativo',
        'Suporte de onboarding para cada usuário que você indicar',
        'Material de divulgação pronto para usar',
        'Dashboard do parceiro para acompanhar suas indicações',
        'Sem limite de indicações — quanto mais usuários, mais ganhos',
        'Feito exclusivamente para quem gerencia varejo de moda',
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

            {/* ═══ SEÇÃO 1: HERO — PROPOSTA COMERCIAL ════════════════════════════ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#004cf2] overflow-hidden text-white px-4">

                {/* Background glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[600px] bg-white opacity-20 blur-[150px] rounded-full pointer-events-none z-0" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Floating badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/25 backdrop-blur-md text-sm font-semibold mb-8 text-blue-50"
                >
                    <Handshake className="w-4 h-4 text-blue-200" />
                    Proposta Exclusiva de Parceria — Nurvee
                </motion.div>

                {/* Main headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="relative z-10 text-center max-w-5xl mx-auto"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
                        Proposta
                        <br />
                        <span className="text-blue-200 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                            Comercial
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-blue-100/90 mb-4 leading-relaxed max-w-3xl mx-auto font-medium [text-wrap:balance]">
                        Uma parceria pensada para quem quer construir{' '}
                        <strong className="text-white">renda passiva recorrente</strong>{' '}
                        indicando o sistema que lojas de roupa estavam precisando.
                    </p>
                    <p className="text-blue-200/70 text-base max-w-2xl mx-auto mb-12 [text-wrap:balance]">
                        Cada usuário que você indica gera comissão todo mês, enquanto a assinatura estiver ativa —
                        sem você precisar fazer mais nada.
                    </p>

                    {/* Hero metrics */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center flex-wrap">
                        {[
                            { value: '∞', label: 'sem limite de indicações' },
                            { value: '100', suffix: '%', label: 'recorrente e automático' },
                            { value: '0', suffix: '', label: 'custo para ser parceiro' },
                        ].map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex flex-col items-center bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl px-8 py-5 min-w-[150px]"
                            >
                                <span className="text-4xl font-black text-white mb-1">
                                    {m.value}
                                    {m.suffix}
                                </span>
                                <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider text-center">
                                    {m.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-blue-200/60"
                >
                    <span className="text-xs font-medium uppercase tracking-widest">
                        Continue lendo
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-5 h-8 border-2 border-white/20 rounded-full flex items-center justify-center"
                    >
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ SEÇÃO 2: A NURVEE FOI FEITA PARA UMA LOJA REAL ═══════════════ */}
            <section className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#004cf2] opacity-5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-flex items-center gap-2 bg-blue-900/40 text-blue-300 font-semibold tracking-wide px-5 py-2 rounded-full text-sm mb-8 border border-blue-700/50">
                            <Store className="w-4 h-4" /> A origem do Nurvee
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 [text-wrap:balance] max-w-3xl mx-auto leading-tight">
                            A Nurvee foi feita para{' '}
                            <span className="text-[#4c8eff] drop-shadow-[0_0_20px_rgba(76,142,255,0.5)]">
                                uma loja real
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-6 text-slate-300 text-lg leading-relaxed"
                        >
                            <p>
                                O Nurvee não nasceu em uma mesa de escritório. Ele nasceu da
                                frustração de quem estava por dentro de uma loja de roupas{' '}
                                <strong className="text-white">
                                    e não encontrava um sistema que realmente funcionasse
                                </strong>{' '}
                                para o varejo de moda.
                            </p>
                            <p>
                                Os sistemas existentes eram complexos demais, caros demais, ou
                                simplesmente não entendiam a{' '}
                                <strong className="text-white">realidade do lojista</strong> —
                                que precisa lançar uma venda em segundos, saber o estoque de
                                cabeça e fechar o caixa sem dor de cabeça.
                            </p>
                            <p>
                                Por isso cada funcionalidade do Nurvee foi desenhada com uma
                                pergunta em mente:{' '}
                                <em className="text-white not-italic font-bold">
                                    "Isso resolve um problema real de uma loja real?"
                                </em>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: <Shield className="w-6 h-6" />, title: 'Segurança', desc: 'Dados protegidos com criptografia de ponta' },
                                { icon: <Zap className="w-6 h-6" />, title: 'Velocidade', desc: 'Lançamento de venda em menos de 10 segundos' },
                                { icon: <BarChart3 className="w-6 h-6" />, title: 'Clareza', desc: 'Números que qualquer lojista entende' },
                                { icon: <Repeat className="w-6 h-6" />, title: 'Consistência', desc: 'Funciona todos os dias, sem surpresas' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-[#004cf2]/50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-[#004cf2]/20 rounded-xl flex items-center justify-center text-[#4c8eff] mb-3">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ SEÇÃO 3: PARA QUAL PÚBLICO FOI CRIADA ═══════════════════════════ */}
            <section className="py-24 md:py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-flex items-center gap-2 text-[#004cf2] font-bold tracking-wider uppercase text-sm mb-6 bg-blue-50 py-1.5 px-5 rounded-full border border-blue-100">
                            <Users className="w-4 h-4" /> Público-alvo
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 [text-wrap:balance] max-w-3xl mx-auto">
                            Para quem o Nurvee foi{' '}
                            <span className="text-[#004cf2]">criado</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto [text-wrap:balance]">
                            Desde a loja que acabou de abrir até a que fatura bem mas ainda
                            vive de planilha. O Nurvee cobre todo o espectro.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {publicoItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group bg-white border border-slate-200 rounded-3xl p-7 hover:border-[#004cf2]/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-default"
                            >
                                <div className="text-4xl mb-5">{item.emoji}</div>
                                <h3 className="text-slate-900 font-bold text-base mb-3 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Connector note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 bg-[#004cf2] rounded-xl flex items-center justify-center shrink-0">
                            <Handshake className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold mb-1">
                                Por que isso importa para você como parceiro?
                            </p>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                O mercado potencial é enorme.{' '}
                                <strong>
                                    Existem mais de 1 milhão de lojas de varejo de moda no
                                    Brasil
                                </strong>
                                , a grande maioria ainda controlando tudo em papel ou
                                planilhas. Cada uma delas é uma indicação em potencial.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ SEÇÃO 4: AS FERRAMENTAS ════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-[#040812] relative overflow-hidden border-y border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,76,242,0.08)_0%,rgba(0,0,0,0)_70%)]" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-flex items-center gap-2 bg-blue-900/40 text-blue-300 font-semibold tracking-wide px-5 py-2 rounded-full text-sm mb-8 border border-blue-700/50">
                            <Zap className="w-4 h-4" /> O que você está indicando
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 [text-wrap:balance] max-w-3xl mx-auto">
                            Todas as ferramentas que uma loja precisa,{' '}
                            <span className="text-[#4c8eff]">em um só lugar</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto [text-wrap:balance]">
                            Não é mais um sistema genérico. É o único feito exclusivamente para
                            quem vende roupa.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {tools.map((tool, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07, duration: 0.4 }}
                                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 hover:border-[#004cf2]/60 hover:shadow-[0_0_25px_rgba(0,76,242,0.1)] transition-all group cursor-default"
                            >
                                <div className="w-11 h-11 bg-[#004cf2]/20 rounded-xl flex items-center justify-center text-[#4c8eff] mb-4 group-hover:bg-[#004cf2]/30 transition-colors">
                                    {tool.icon}
                                </div>
                                <h3 className="text-white font-bold text-sm mb-2 leading-snug">
                                    {tool.title}
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    {tool.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SEÇÃO 5: A MATEMÁTICA DA PARCERIA ══════════════════════════════ */}
            <section className="py-24 md:py-32 bg-[#004cf2] relative overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white opacity-10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-flex items-center gap-2 bg-white/15 text-white font-semibold tracking-wide px-5 py-2 rounded-full text-sm mb-8 border border-white/25 backdrop-blur-md">
                            <DollarSign className="w-4 h-4" /> A matemática da parceria
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 [text-wrap:balance] max-w-3xl mx-auto leading-tight">
                            O jogo muda quando você{' '}
                            <span className="text-blue-200">pensa em quantidade</span>
                        </h2>
                        <p className="text-blue-100/80 text-lg max-w-2xl mx-auto [text-wrap:balance]">
                            Uma comissão sozinha pode parecer pouco. Mas quando você começa a
                            acumular usuários ativos, ela se transforma em uma renda passiva
                            significativa — e cresce todo mês sem esforço extra. Veja a simulação.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Calculator */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <CommissionCalculator />
                        </motion.div>

                        {/* Why volume matters */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="space-y-5"
                        >
                            <h3 className="text-white font-black text-2xl mb-6">
                                Por que a quantidade é o segredo
                            </h3>

                            {[
                                {
                                    n: '01',
                                    title: 'Renda recorrente, não pontual',
                                    desc: 'Você faz UMA indicação. A comissão chega TODO MÊS enquanto o usuário mantiver a assinatura ativa. Uma indicação pode valer centenas de reais ao longo do tempo.',
                                },
                                {
                                    n: '02',
                                    title: 'Sem teto de ganhos',
                                    desc: '10 usuários, 50, 100 — sem limite de indicações. O potencial de renda escala junto com o seu esforço e rede de contatos.',
                                },
                                {
                                    n: '03',
                                    title: 'O produto se vende sozinho',
                                    desc: 'Você não precisa ser vendedor. Mostre o sistema, explique o problema que ele resolve, e a conversão acontece naturalmente.',
                                },
                                {
                                    n: '04',
                                    title: 'Mercado com baixa penetração',
                                    desc: 'A maioria dos lojistas de moda ainda não usa nenhum sistema. Você está entrando em um mercado com pouquíssima concorrência.',
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5"
                                >
                                    <span className="font-black text-2xl text-white/30 leading-none shrink-0 w-8">
                                        {item.n}
                                    </span>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                        <p className="text-blue-100/70 text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Scale table */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-white font-bold text-lg">
                                Tabela de escala — média de R$ 18,82 por usuário ativo/mês
                            </h3>
                            <p className="text-blue-200/70 text-sm mt-1">
                                Essencial: R$ 15,33/usuário · Pro: R$ 22,30/usuário · média dos dois planos
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-4 text-blue-200 text-sm font-semibold">
                                            Usuários ativos indicados
                                        </th>
                                        <th className="text-center p-4 text-blue-200 text-sm font-semibold">
                                            Mensal
                                        </th>
                                        <th className="text-center p-4 text-blue-200 text-sm font-semibold">
                                            Anual
                                        </th>
                                        <th className="text-center p-4 text-blue-200 text-sm font-semibold hidden sm:table-cell">
                                            Equivale a
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { usuarios: 30, monthly: 'R$ 564,60', annual: 'R$ 6.775,20', equiv: '1 salário mín./mês' },
                                        { usuarios: 50, monthly: 'R$ 941,00', annual: 'R$ 11.292,00', equiv: 'Renda significativa' },
                                        { usuarios: 100, monthly: 'R$ 1.882,00', annual: 'R$ 22.584,00', equiv: '2+ salários/mês' },
                                        { usuarios: 150, monthly: 'R$ 2.823,00', annual: 'R$ 33.876,00', equiv: 'Renda sólida passiva' },
                                        { usuarios: 200, monthly: 'R$ 3.764,00', annual: 'R$ 45.168,00', equiv: '+3 salários/mês no automático', highlight: true },
                                    ].map((row, i) => (
                                        <tr
                                            key={i}
                                            className={cn(
                                                'transition-colors hover:bg-white/5',
                                                row.highlight && 'bg-white/10 font-bold'
                                            )}
                                        >
                                            <td className="p-4 text-white text-sm">
                                                {row.usuarios} usuários {row.highlight && '🏆'}
                                            </td>
                                            <td className="p-4 text-center text-white text-sm font-bold">
                                                {row.monthly}
                                            </td>
                                            <td className="p-4 text-center text-blue-200 text-sm">
                                                {row.annual}
                                            </td>
                                            <td className="p-4 text-center text-white/50 text-xs hidden sm:table-cell">
                                                {row.equiv}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ SEÇÃO 6: O QUE VOCÊ RECEBE COMO PARCEIRO ═══════════════════════ */}
            <section className="py-24 md:py-32 bg-slate-900">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 [text-wrap:balance]">
                            O que você recebe como{' '}
                            <span className="text-[#4c8eff]">parceiro</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Além da comissão, você conta com suporte para indicar e crescer seu
                            portfólio de clientes.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {diferenciais.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-[#004cf2]/40 transition-colors"
                            >
                                <div className="w-8 h-8 bg-[#004cf2]/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-[#4c8eff]" />
                                </div>
                                <p className="text-slate-200 font-medium leading-relaxed">
                                    {item}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SEÇÃO 7: CTA FINAL ══════════════════════════════════════════════ */}
            <section className="py-24 bg-[#f8fafc]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        {/* Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#004cf2] rounded-full blur-[120px] opacity-30 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <span className="bg-white/10 text-white font-medium px-5 py-2 rounded-full mb-8 backdrop-blur-md border border-white/20 inline-flex items-center gap-2 text-sm">
                                <Handshake className="w-4 h-4 text-blue-300" /> Vamos construir
                                isso juntos
                            </span>

                            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight max-w-2xl [text-wrap:balance]">
                                Uma parceria feita para{' '}
                                <span className="text-[#4c8eff]">durar e crescer junto.</span>
                            </h2>

                            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed [text-wrap:balance]">
                                Não queremos parceiros de uma indicação só. Queremos construir uma
                                relação de longo prazo, onde quanto mais a sua rede cresce, mais
                                você ganha — e mais o Nurvee cresce junto com você.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
                                <a
                                    href="https://wa.me/5500000000000?text=Ol%C3%A1%2C%20vi%20a%20proposta%20de%20parceria%20do%20Nurvee%20e%20quero%20saber%20mais!"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-[#004cf2] to-blue-500 rounded-full font-bold text-white hover:shadow-[0_0_30px_rgba(0,76,242,0.5)] transition-all flex items-center justify-center gap-2"
                                >
                                    Quero ser parceiro
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <a
                                    href="/"
                                    className="flex-1 py-4 px-6 bg-transparent border border-white/30 rounded-full font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <Store className="w-4 h-4" /> Ver a plataforma
                                </a>
                            </div>

                            <p className="text-white/40 text-xs mt-8 max-w-sm">
                                Ao entrar em contato, você não assume nenhum compromisso.
                                Vamos explicar como funciona e tirar todas as suas dúvidas antes de qualquer decisão.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-8 border-t border-slate-800 text-slate-400">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 justify-center opacity-80">
                        <Store className="w-5 h-5" />
                        <span className="font-bold text-lg text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            Nurvee
                        </span>
                    </div>
                    <p className="text-sm">© {new Date().getFullYear()} Nurvee. Todos os direitos reservados.</p>
                    <a href="/" className="text-[#4c8eff] text-sm hover:underline">
                        ← Voltar para a página principal
                    </a>
                </div>
            </footer>
        </div>
    );
}
