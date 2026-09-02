import React, { useState, useEffect } from "react";
import {
    ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
    ComposedChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { LayoutGrid, CreditCard, Users, Building2, Package, Sun, Moon, Calendar } from "lucide-react";

/* ─────────────────────────────────────────────
   ӨГӨГДӨЛ — энд л засна. Excel шинэчлэхэд эдгээрийг солино.
   Зээлийн таб = бодит өгөгдөл. Ерөнхий = бүтэц зөв, тоо түр жишээ.
   ───────────────────────────────────────────── */
const M = ["7-р", "8-р", "9-р", "10-р", "11-р", "12-р"];
const OVERVIEW = {
    pnl: M.map((m, i) => ({ m, orlogo: [42,48,51,55,60,66][i], zardal: [30,33,34,36,38,41][i] })),
    balance: M.map((m, i) => ({ m, zeel:[320,360,410,455,500,560][i], esver:[280,315,355,395,430,480][i], aktiv:[340,385,435,485,530,590][i] })),
    cost: [
        { name:"Цалин", value:16, color:"#10a56e" }, { name:"Эх үүсвэр хүү", value:9, color:"#7c5cfc" },
        { name:"Түрээс", value:5, color:"#43a5e6" }, { name:"Автомат", value:4, color:"#f0a63a" },
        { name:"Маркетинг", value:4, color:"#e5533c" }, { name:"НД", value:3, color:"#8fd14f" },
    ],
    plan: [
        { n:"Орлого", tul:60, guits:66, color:"var(--brand)" }, { n:"Ашиг", tul:20, guits:25, color:"var(--violet)" },
        { n:"Олголт", tul:200, guits:185, color:"var(--blue)" }, { n:"Багц", tul:540, guits:560, color:"var(--amber)" },
    ],
    kpi: [
        { icon:Users, label:"Ажилтан", desc:"Нийт бүрэлдэхүүн", val:4, bg:"var(--brand-soft)", fg:"var(--brand)" },
        { icon:Building2, label:"Салбар", desc:"Үйл ажиллагаа", val:1, bg:"var(--violet-soft)", fg:"var(--violet)" },
        { icon:Users, label:"Харилцагч", desc:"Идэвхтэй", val:100, bg:"#e6f3fb", fg:"var(--blue)" },
        { icon:Package, label:"Бүтээгдэхүүн", desc:"Зээлийн төрөл", val:4, bg:"#fdf0dd", fg:"var(--amber)" },
    ],
};
const LOAN = {
    portfolio: M.map((m, i) => ({ m, bagts:[15000,25000,35000,45000,55000,65000][i], har:[10,12,14,16,18,20][i] })),
    disb: M.map((m, i) => ({ m, olgolt:[18000,12000,13000,14000,12000,15000][i], har:[12,10,8,9,7,10][i] })),
    term: [ {n:"0–12",v:1200},{n:"13–24",v:1100},{n:"25–36",v:8900},{n:"37–60",v:12100} ],
    product: [
        { name:"Барьцаат", value:6565, color:"#10a56e" }, { name:"Бизнес", value:2121, color:"#7c5cfc" },
        { name:"Авто", value:1213, color:"#43a5e6" }, { name:"Хэрэглээ", value:1123, color:"#f0a63a" },
    ],
    collateral: [ { name:"Үл хөдлөх", value:60, color:"#10a56e" }, { name:"Хөдлөх", value:40, color:"#f0a63a" } ],
    quality: M.map((m, i) => ({ m, anh:[0,0,150,180,45,60][i] })),
};
const SPARK = {
    bagts:[15,25,35,45,55,65], orlogo:[42,48,51,55,60,66], ashig:[12,15,17,19,22,25],
    lbagts:[15000,25000,35000,45000,55000,65000], olgolt:[18000,12000,13000,14000,12000,15000], har:[10,12,14,16,18,20],
};

const TOKENS = {
    light: { bg:"#eef0f7", surface:"#ffffff", surface2:"#f6f6fb", sidebar:"#ffffff", line:"#ebe9f3",
        text:"#191823", muted:"#8b889a", faint:"#b6b3c3", brand:"#10a56e", brand2:"#0b8a5f", brandSoft:"#e3f6ee",
        violet:"#7c5cfc", violetSoft:"#efeaff", blue:"#43a5e6", amber:"#f0a63a", red:"#e5533c", grid:"#eeecf5" },
    dark: { bg:"#111015", surface:"#1e1d25", surface2:"#191820", sidebar:"#17161d", line:"#2b2933",
        text:"#f3f2f8", muted:"#9b98a9", faint:"#645f72", brand:"#1cb87f", brand2:"#159168", brandSoft:"#16382c",
        violet:"#916bff", violetSoft:"#282142", blue:"#4aa8e6", amber:"#f0a63a", red:"#ec6552", grid:"#2a2833" },
};

const fmt = (v) => Math.round(v).toLocaleString("en-US");

/* count-up hook */
function useCountUp(target, comma = false, duration = 1100) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let raf; const t0 = performance.now();
        const tick = (now) => {
            let t = (now - t0) / duration; if (t > 1) t = 1;
            const e = 1 - Math.pow(2, -10 * t);
            setVal(target * e);
            if (t < 1) raf = requestAnimationFrame(tick); else setVal(target);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return comma ? fmt(val) : Math.round(val).toString();
}

function Card({ children, className = "", delay = 0, style = {} }) {
    return <div className={`wl-card reveal ${className}`} style={{ animationDelay: `${delay}ms`, ...style }}>{children}</div>;
}

function StatCard({ label, target, unit, badge, sparkData, color, comma, delay, id }) {
    const val = useCountUp(target, comma);
    const data = sparkData.map((v) => ({ v }));
    return (
        <Card className="wl-stat" delay={delay}>
            <div className="wl-st-top"><span className="wl-st-lbl">{label}</span><span className="wl-badge up">{badge}</span></div>
            <div className="wl-st-val">{val}<small>{unit}</small></div>
            <div className="wl-spark">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 3, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2.4} fill={`url(#sp-${id})`} isAnimationActive />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

function PlanRow({ o }) {
    const pct = Math.round((o.guits / o.tul) * 100);
    const shown = useCountUp(pct);
    const [w, setW] = useState(0);
    useEffect(() => { const r = requestAnimationFrame(() => setW(Math.min(pct, 100))); return () => cancelAnimationFrame(r); }, [pct]);
    return (
        <div className="wl-prow">
            <div className="wl-ptop"><span>{o.n}</span><span className="wl-pp">{shown}%</span></div>
            <div className="wl-track"><div className="wl-fill" style={{ width: `${w}%`, background: o.color }} /></div>
        </div>
    );
}

const Legend = ({ items }) => (
    <div className="wl-legwrap">{items.map((x) => (
        <span className="wl-chip" key={x.name}><i style={{ background: x.color }} />{x.name}</span>
    ))}</div>
);

export default function WelendDashboard() {
    const [theme, setTheme] = useState("light");
    const [view, setView] = useState("overview");
    const T = TOKENS[theme];

    useEffect(() => {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    }, []);

    const hour = new Date().getHours();
    const greet = hour < 12 ? "Өглөөний мэнд" : hour < 18 ? "Өдрийн мэнд" : "Оройн мэнд";
    const d = new Date();
    const wd = ["Ням","Дав","Мяг","Лха","Пүр","Баа","Бям"][d.getDay()];
    const dateStr = `${d.getMonth() + 1}-р сарын ${d.getDate()} · ${wd}`;

    const cssVars = {
        "--bg": T.bg, "--surface": T.surface, "--surface2": T.surface2, "--sidebar": T.sidebar, "--line": T.line,
        "--text": T.text, "--muted": T.muted, "--faint": T.faint, "--brand": T.brand, "--brand2": T.brand2,
        "--brand-soft": T.brandSoft, "--violet": T.violet, "--violet-soft": T.violetSoft, "--blue": T.blue,
        "--amber": T.amber, "--red": T.red, "--grid": T.grid,
    };

    const tip = { background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, color: T.text, fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,.12)" };
    const axis = { tick: { fill: T.muted, fontSize: 12 }, axisLine: false, tickLine: false };
    const costTotal = OVERVIEW.cost.reduce((a, b) => a + b.value, 0);
    const productTotal = LOAN.product.reduce((a, b) => a + b.value, 0);

    const NavItem = ({ id, icon: Icon, label }) => (
        <button className={`wl-nav ${view === id ? "active" : ""}`} onClick={() => setView(id)}>
            <Icon size={19} /> {label}
        </button>
    );

    const Donut = ({ data, unit, center, sub }) => (
        <div className="wl-cbox dn" style={{ position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius="64%" outerRadius="92%" paddingAngle={2} stroke="none" isAnimationActive>
                        {data.map((c) => <Cell key={c.name} fill={c.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tip} formatter={(v, n) => [`${fmt(v)}${unit}`, n]} />
                </PieChart>
            </ResponsiveContainer>
            <div className="wl-center"><b>{center}</b><span>{sub}</span></div>
        </div>
    );

    return (
        <div data-theme={theme} style={{ ...cssVars, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: T.bg, color: T.text, minHeight: "100vh" }}>
            <style>{CSS}</style>
            <div className="wl-app">
                <aside className="wl-sidebar">
                    <div className="wl-logo">
                        <div className="wl-mk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg></div>
                        <b>Welend</b>
                    </div>
                    <nav>
                        <div className="wl-navlbl">ЦЭС</div>
                        <NavItem id="overview" icon={LayoutGrid} label="Хяналтын самбар" />
                        <NavItem id="loan" icon={CreditCard} label="Зээл" />
                    </nav>
                    <div className="wl-foot"><div className="wl-foot-t">Санхүүгийн тайлан</div><div className="wl-foot-s">2025 · шинэчилсэн</div></div>
                </aside>

                <main className="wl-main">
                    <div className="wl-top">
                        <div><h1 className="wl-h1">{greet} 👋</h1><p className="wl-sub">{view === "loan" ? "Зээлийн багцын тойм" : "Welend санхүүгийн тойм"}</p></div>
                        <div className="wl-topr">
                            <div className="wl-pill"><Calendar size={15} style={{ color: T.violet }} />{dateStr}</div>
                            <button className="wl-theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")} title="Горим солих">
                                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                            <div className="wl-avatar">W</div>
                        </div>
                    </div>

                    {view === "overview" && (
                        <div className="wl-cols" key="overview">
                            <div className="wl-col">
                                <div className="wl-stats">
                                    <StatCard id="o1" label="Зээлийн багц" target={65} unit="сая ₮" badge="+18.2%" sparkData={SPARK.bagts} color={T.brand} delay={0} />
                                    <StatCard id="o2" label="Сарын орлого" target={66} unit="сая ₮" badge="+10.0%" sparkData={SPARK.orlogo} color={T.brand} delay={70} />
                                    <StatCard id="o3" label="Цэвэр ашиг" target={25} unit="сая ₮" badge="+13.6%" sparkData={SPARK.ashig} color={T.violet} delay={140} />
                                </div>
                                <Card delay={210}>
                                    <div className="wl-ch"><h3>Орлого ба зардал</h3><div className="wl-leg"><span className="wl-chip"><i style={{ background: T.brand }} />Орлого</span><span className="wl-chip"><i style={{ background: T.violet }} />Зардал</span></div></div>
                                    <div className="wl-cbox">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={OVERVIEW.pnl} margin={{ top: 6, right: 6, bottom: 0, left: -8 }}>
                                                <defs>
                                                    <linearGradient id="g-orlogo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.brand} stopOpacity={0.28} /><stop offset="100%" stopColor={T.brand} stopOpacity={0} /></linearGradient>
                                                    <linearGradient id="g-zardal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.violet} stopOpacity={0.24} /><stop offset="100%" stopColor={T.violet} stopOpacity={0} /></linearGradient>
                                                </defs>
                                                <CartesianGrid vertical={false} stroke={T.grid} />
                                                <XAxis dataKey="m" {...axis} />
                                                <YAxis {...axis} tickFormatter={fmt} />
                                                <Tooltip contentStyle={tip} formatter={(v, n) => [`${fmt(v)} сая ₮`, n === "orlogo" ? "Орлого" : "Зардал"]} />
                                                <Area type="monotone" dataKey="orlogo" stroke={T.brand} strokeWidth={3} fill="url(#g-orlogo)" />
                                                <Area type="monotone" dataKey="zardal" stroke={T.violet} strokeWidth={3} fill="url(#g-zardal)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                                <div className="wl-pair">
                                    <Card delay={280}>
                                        <div className="wl-ch"><h3>Төлөвлөгөө биелэлт</h3></div>
                                        {OVERVIEW.plan.map((o) => <PlanRow key={o.n} o={o} />)}
                                    </Card>
                                    <Card delay={350}>
                                        <div className="wl-ch"><h3>Балансын хөдөлгөөн</h3><span className="wl-cs">сая ₮</span></div>
                                        <div className="wl-cbox sm">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={OVERVIEW.balance} margin={{ top: 6, right: 6, bottom: 0, left: -8 }}>
                                                    <CartesianGrid vertical={false} stroke={T.grid} />
                                                    <XAxis dataKey="m" {...axis} /><YAxis {...axis} tickFormatter={fmt} />
                                                    <Tooltip contentStyle={tip} formatter={(v) => `${fmt(v)} сая ₮`} />
                                                    <Line type="monotone" dataKey="zeel" stroke={T.brand} strokeWidth={2.5} dot={false} name="Багц" />
                                                    <Line type="monotone" dataKey="esver" stroke={T.blue} strokeWidth={2} dot={false} name="Эх үүсвэр" />
                                                    <Line type="monotone" dataKey="aktiv" stroke={T.violet} strokeWidth={2} dot={false} name="Актив" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            <div className="wl-col">
                                <Card delay={120}>
                                    <div className="wl-ch"><h3>Гол үзүүлэлт</h3></div>
                                    <div className="wl-klist">{OVERVIEW.kpi.map((k) => <KpiRow key={k.label} k={k} />)}</div>
                                </Card>
                                <Card delay={190}>
                                    <div className="wl-ch"><h3>Зардлын ангилал</h3></div>
                                    <Donut data={OVERVIEW.cost} unit=" сая ₮" center={`${costTotal} сая`} sub="Нийт зардал" />
                                    <Legend items={OVERVIEW.cost} />
                                </Card>
                            </div>
                        </div>
                    )}

                    {view === "loan" && (
                        <div className="wl-cols" key="loan">
                            <div className="wl-col">
                                <div className="wl-stats">
                                    <StatCard id="l1" label="Зээлийн багц" target={65000} unit="мянга" badge="+18.2%" sparkData={SPARK.lbagts} color={T.brand} comma delay={0} />
                                    <StatCard id="l2" label="Сарын олголт" target={15000} unit="мянга" badge="+25.0%" sparkData={SPARK.olgolt} color={T.blue} comma delay={70} />
                                    <StatCard id="l3" label="Идэвхтэй харилцагч" target={20} unit="хүн" badge="+11.1%" sparkData={SPARK.har} color={T.violet} delay={140} />
                                </div>
                                <Card delay={210}>
                                    <div className="wl-ch"><h3>Зээлийн багцын өсөлт</h3><div className="wl-leg"><span className="wl-chip"><i style={{ background: T.brand }} />Багц</span><span className="wl-chip"><i style={{ background: T.violet }} />Харилцагч</span></div></div>
                                    <div className="wl-cbox">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={LOAN.portfolio} margin={{ top: 6, right: 6, bottom: 0, left: -8 }}>
                                                <CartesianGrid vertical={false} stroke={T.grid} />
                                                <XAxis dataKey="m" {...axis} />
                                                <YAxis yAxisId="l" {...axis} tickFormatter={fmt} />
                                                <YAxis yAxisId="r" orientation="right" {...axis} />
                                                <Tooltip contentStyle={tip} formatter={(v, n) => [n === "bagts" ? `${fmt(v)} мянга` : `${v} хүн`, n === "bagts" ? "Багц" : "Харилцагч"]} />
                                                <Bar yAxisId="l" dataKey="bagts" fill={T.brand} radius={[7, 7, 0, 0]} maxBarSize={30} />
                                                <Line yAxisId="r" type="monotone" dataKey="har" stroke={T.violet} strokeWidth={3} dot={{ r: 3, fill: T.surface, stroke: T.violet, strokeWidth: 2 }} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                                <div className="wl-pair">
                                    <Card delay={280}>
                                        <div className="wl-ch"><h3>Зээл олголт</h3><span className="wl-cs">мянга</span></div>
                                        <div className="wl-cbox sm">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={LOAN.disb} margin={{ top: 6, right: 6, bottom: 0, left: -8 }}>
                                                    <CartesianGrid vertical={false} stroke={T.grid} />
                                                    <XAxis dataKey="m" {...axis} /><YAxis yAxisId="l" {...axis} tickFormatter={fmt} /><YAxis yAxisId="r" orientation="right" {...axis} />
                                                    <Tooltip contentStyle={tip} formatter={(v, n) => [n === "olgolt" ? `${fmt(v)} мянга` : `${v} хүн`, n === "olgolt" ? "Олголт" : "Харилцагч"]} />
                                                    <Bar yAxisId="l" dataKey="olgolt" fill={T.blue} radius={[7, 7, 0, 0]} maxBarSize={26} />
                                                    <Line yAxisId="r" type="monotone" dataKey="har" stroke={T.amber} strokeWidth={2.5} dot={{ r: 2 }} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                    <Card delay={350}>
                                        <div className="wl-ch"><h3>Хугацаагаар</h3><span className="wl-cs">үлдэгдэл</span></div>
                                        <div className="wl-cbox sm">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={LOAN.term} margin={{ top: 6, right: 6, bottom: 0, left: -8 }}>
                                                    <CartesianGrid vertical={false} stroke={T.grid} />
                                                    <XAxis dataKey="n" {...axis} /><YAxis {...axis} tickFormatter={fmt} />
                                                    <Tooltip contentStyle={tip} formatter={(v) => `${fmt(v)} мянга`} />
                                                    <Bar dataKey="v" radius={[7, 7, 0, 0]} maxBarSize={46}>
                                                        {["#c7ecdc", "#7dd3ab", "#39b985", "#10a56e"].map((c, i) => <Cell key={i} fill={c} />)}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            <div className="wl-col">
                                <Card delay={120}>
                                    <div className="wl-ch"><h3>Бүтээгдэхүүнээр</h3><span className="wl-cs">мянга</span></div>
                                    <Donut data={LOAN.product} unit=" мянга" center={fmt(productTotal)} sub="Нийт багц" />
                                    <Legend items={LOAN.product} />
                                </Card>
                                <Card delay={190}>
                                    <div className="wl-ch"><h3>Барьцаа хөрөнгө</h3></div>
                                    <Donut data={LOAN.collateral} unit="%" center="60/40" sub="Хөдлөх/Үл" />
                                    <Legend items={LOAN.collateral} />
                                </Card>
                                <Card delay={260}>
                                    <div className="wl-ch"><h3>Зээлийн чанар</h3><span className="wl-cs">анхаарал хандуулах</span></div>
                                    <div className="wl-cbox sm">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={LOAN.quality} margin={{ top: 6, right: 6, bottom: 0, left: -8 }}>
                                                <CartesianGrid vertical={false} stroke={T.grid} />
                                                <XAxis dataKey="m" {...axis} /><YAxis {...axis} tickFormatter={fmt} />
                                                <Tooltip contentStyle={tip} formatter={(v) => `${fmt(v)} мянга`} />
                                                <Bar dataKey="anh" fill={T.amber} radius={[7, 7, 0, 0]} maxBarSize={26} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="wl-note">"Чанаргүй зээл" ба "хувь" баганыг Excel-ээс баталгаажуулаад нэмнэ.</div>
                                </Card>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function KpiRow({ k }) {
    const val = useCountUp(k.val);
    const Icon = k.icon;
    return (
        <div className="wl-krow">
            <div className="wl-kico" style={{ background: k.bg, color: k.fg }}><Icon size={20} /></div>
            <div><div className="wl-kn">{k.label}</div><div className="wl-kd">{k.desc}</div></div>
            <div className="wl-kv">{val}</div>
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.wl-app *{box-sizing:border-box;margin:0;padding:0}
.wl-app{display:flex;min-height:100vh}
@keyframes wl-fade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes wl-slide{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:none}}
.reveal{opacity:0;animation:wl-fade .6s cubic-bezier(.22,1,.36,1) forwards}
.wl-sidebar{width:230px;flex:none;background:var(--sidebar);border-right:1px solid var(--line);padding:26px 18px;display:flex;flex-direction:column;gap:26px;position:sticky;top:0;height:100vh;animation:wl-slide .6s cubic-bezier(.22,1,.36,1) both}
.wl-logo{display:flex;align-items:center;gap:11px;padding:0 6px}
.wl-mk{width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,var(--brand),var(--brand2));display:grid;place-items:center;color:#fff;transition:transform .3s;box-shadow:0 6px 16px rgba(16,165,110,.28)}
.wl-mk svg{width:20px;height:20px}
.wl-logo:hover .wl-mk{transform:rotate(-8deg) scale(1.05)}
.wl-logo b{font-size:20px;font-weight:800;letter-spacing:-.02em;color:var(--text)}
.wl-navlbl{font-size:10.5px;font-weight:700;color:var(--faint);letter-spacing:.1em;padding:4px 12px 8px}
.wl-nav{display:flex;align-items:center;gap:13px;padding:12px 14px;border-radius:13px;cursor:pointer;color:var(--muted);font-size:14px;font-weight:600;border:none;background:none;font-family:inherit;width:100%;text-align:left;transition:.22s cubic-bezier(.22,1,.36,1)}
.wl-nav svg{transition:transform .22s}
.wl-nav:hover{background:var(--surface2);color:var(--text)}
.wl-nav:hover svg{transform:translateX(2px)}
.wl-nav.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;box-shadow:0 8px 20px rgba(16,165,110,.28)}
.wl-foot{margin-top:auto;padding:14px;border-radius:14px;background:var(--surface2);border:1px solid var(--line)}
.wl-foot-t{font-size:12.5px;font-weight:700;color:var(--text)}
.wl-foot-s{font-size:11px;color:var(--muted);margin-top:2px}
.wl-main{flex:1;min-width:0;padding:26px clamp(16px,2.5vw,34px)}
.wl-top{display:flex;align-items:center;gap:16px;margin-bottom:28px;flex-wrap:wrap;animation:wl-fade .6s cubic-bezier(.22,1,.36,1) both}
.wl-h1{font-size:27px;font-weight:800;letter-spacing:-.025em}
.wl-sub{font-size:13px;color:var(--muted);margin-top:3px}
.wl-topr{margin-left:auto;display:flex;align-items:center;gap:12px}
.wl-pill{display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:30px;padding:10px 16px;font-size:13px;font-weight:600;white-space:nowrap}
.wl-theme{width:44px;height:40px;border-radius:14px;border:1px solid var(--line);background:var(--surface);display:grid;place-items:center;cursor:pointer;color:var(--amber);transition:.25s}
.wl-theme:hover{transform:translateY(-2px)}
.wl-avatar{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--violet),var(--brand));display:grid;place-items:center;color:#fff;font-weight:800;font-size:15px}
.wl-cols{display:grid;grid-template-columns:1.62fr 1fr;gap:20px}
.wl-col{display:flex;flex-direction:column;gap:20px}
.wl-pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.wl-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.wl-card{background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:20px;box-shadow:0 2px 4px rgba(25,24,35,.03),0 14px 34px rgba(25,24,35,.05);transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s,background .35s,border-color .35s}
.wl-card:hover{transform:translateY(-4px);box-shadow:0 10px 24px rgba(25,24,35,.09),0 28px 56px rgba(25,24,35,.12)}
.wl-ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.wl-ch h3{font-size:15px;font-weight:700;color:var(--text)}
.wl-cs{font-size:12px;color:var(--muted);font-weight:600}
.wl-stat{overflow:hidden}
.wl-st-top{display:flex;justify-content:space-between;align-items:center}
.wl-st-lbl{font-size:13px;color:var(--muted);font-weight:600}
.wl-badge{font-size:11.5px;font-weight:700;padding:4px 9px;border-radius:20px}
.wl-badge.up{color:var(--brand);background:var(--brand-soft)}
.wl-st-val{font-size:27px;font-weight:800;letter-spacing:-.03em;margin-top:15px;color:var(--text)}
.wl-st-val small{font-size:13px;font-weight:600;color:var(--muted);margin-left:3px}
.wl-spark{height:44px;margin:10px -20px -20px}
.wl-cbox{position:relative;height:300px}
.wl-cbox.sm{height:206px}
.wl-cbox.dn{height:236px}
.wl-leg{display:flex;gap:8px}
.wl-chip{display:flex;align-items:center;gap:7px;background:var(--surface2);border-radius:9px;padding:6px 11px;font-size:12px;font-weight:600;color:var(--muted)}
.wl-chip i{width:10px;height:10px;border-radius:3px}
.wl-legwrap{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px}
.wl-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none}
.wl-center b{display:block;font-size:21px;font-weight:800;color:var(--text)}
.wl-center span{font-size:11px;font-weight:600;color:var(--muted)}
.wl-klist{display:flex;flex-direction:column;gap:4px}
.wl-krow{display:flex;align-items:center;gap:13px;padding:11px 8px;border-radius:13px;transition:.2s}
.wl-krow:hover{background:var(--surface2);transform:translateX(3px)}
.wl-kico{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;flex:none}
.wl-kn{font-size:13.5px;font-weight:700;color:var(--text)}
.wl-kd{font-size:11.5px;color:var(--muted);margin-top:1px}
.wl-kv{margin-left:auto;font-size:17px;font-weight:800;color:var(--text)}
.wl-prow{margin-bottom:17px}
.wl-prow:last-child{margin-bottom:0}
.wl-ptop{display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text)}
.wl-pp{font-weight:800}
.wl-track{height:8px;border-radius:6px;background:var(--surface2);overflow:hidden}
.wl-fill{height:100%;border-radius:6px;transition:width 1.1s cubic-bezier(.22,1,.36,1)}
.wl-note{font-size:11.5px;color:var(--amber);margin-top:12px;padding:9px 12px;background:var(--surface2);border:1px solid var(--line);border-radius:12px}
@media(max-width:1050px){.wl-cols{grid-template-columns:1fr}.wl-pair{grid-template-columns:1fr}}
@media(max-width:820px){.wl-sidebar{display:none}.wl-stats{grid-template-columns:1fr}}
`;