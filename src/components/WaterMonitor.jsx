import React, { useState, useRef, useEffect } from "react";
import {
  Droplets,
  Activity,
  AlertTriangle,
  Home,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wifi,
  Battery,
  AlertOctagon,
  Lightbulb, // Usaremos este icono para los tips
  DollarSign,
  Maximize2,
  Minimize2,
  Palette,
  Bell,
  GlassWater,
  Mail, // Nuevo icono para contacto
  Phone, // Nuevo icono para soporte telefónico
  HelpCircle, // Nuevo icono para el centro de ayuda
} from "lucide-react";

// Tarifa referencial por m3 en CLP (ejemplo promedio).
const PRICE_PER_M3 = 1050;

// VOLUMEN DEL VASO (0.25 litros)
const GLASS_VOLUME = 0.25;

// --- LISTA DE RECOMENDACIONES (ECO_TIPS) ---
const ECO_TIPS = [
  {
    msg: (glasses) =>
      `Cerrar la llave mientras te cepillas los dientes ahorra **${glasses} vasos de agua** al mes.`,
    litersSaved: 120, // Aprox. 4L/min * 1min * 30 días = 120 L
  },
  {
    msg: (glasses) =>
      `Acortar la ducha en 2 minutos puede ahorrar **${glasses} vasos de agua** al día.`,
    litersSaved: 18, // Aprox. 9L/min * 2min = 18 L
  },
  {
    msg: (glasses) =>
      `Revisa y repara las fugas de inodoros, ¡podrías ahorrar **${glasses} vasos al día**!`,
    litersSaved: 200, // Una fuga pequeña puede ser 200L/día
  },
  {
    msg: (glasses) =>
      `Llenar el lavavajillas completamente antes de usarlo ahorra hasta **${glasses} vasos de agua** por ciclo.`,
    litersSaved: 50, // Ahorro de lavar a mano vs lavavajillas lleno
  },
  {
    msg: (glasses) =>
      `Usa una cubeta en lugar de la manguera para lavar el auto y ahorra **${glasses} vasos de agua**.`,
    litersSaved: 1000, // Una manguera gasta mucho
  },
];

// --- DEFINICIÓN DE PALETAS DE COLORES ---
const THEMES = {
  ocean: {
    name: "Océano",
    primary: "blue",
    accent: "purple",
    neutral: "slate",
    background: "bg-slate-50",
    text: "text-slate-800",
    chart: {
      barCurrent: "bg-blue-600",
      barPast: "bg-blue-200",
      barHover: "group-hover:bg-blue-300",
      value: "text-blue-600",
      tooltip: "text-blue-300",
    },
  },
  forest: {
    name: "Bosque",
    primary: "emerald",
    accent: "teal",
    neutral: "slate",
    background: "bg-green-50",
    text: "text-slate-800",
    chart: {
      barCurrent: "bg-emerald-600",
      barPast: "bg-emerald-200",
      barHover: "group-hover:bg-emerald-300",
      value: "text-emerald-600",
      tooltip: "text-emerald-300",
    },
  },
  sunset: {
    name: "Atardecer",
    primary: "orange",
    accent: "red",
    neutral: "stone",
    background: "bg-yellow-50",
    text: "text-stone-800",
    chart: {
      barCurrent: "bg-orange-600",
      barPast: "bg-orange-200",
      barHover: "group-hover:bg-orange-300",
      value: "text-orange-600",
      tooltip: "text-orange-300",
    },
  },
  violet: {
    name: "Violeta",
    primary: "violet",
    accent: "pink",
    neutral: "gray",
    background: "bg-purple-50",
    text: "text-gray-800",
    chart: {
      barCurrent: "bg-violet-600",
      barPast: "bg-violet-200",
      barHover: "group-hover:bg-violet-300",
      value: "text-violet-600",
      tooltip: "text-violet-300",
    },
  },
};

// Datos simulados
const MOCK_DATA = {
  currentUsage: 14.5,
  lastYearUsage: 12.2,
  trend: "up", // 'up' or 'down'
  projected: 15.2,
  history: [
    { month: "Ene", value: 12.5 },
    { month: "Feb", value: 11.8 },
    { month: "Mar", value: 13.2 },
    { month: "Abr", value: 14.0 },
    { month: "May", value: 13.5 },
    { month: "Jun", value: 12.0 },
    { month: "Jul", value: 11.5 },
    { month: "Ago", value: 12.8 },
    { month: "Sep", value: 13.5 },
    { month: "Oct", value: 14.2 },
    { month: "Nov", value: 13.8 },
    { month: "Dic", value: 14.5 },
  ],
  devices: [
    {
      id: 1,
      name: "Medidor Principal",
      status: "online",
      battery: 85,
      location: "Entrada Principal",
    },
    {
      id: 2,
      name: "Sensor Jardín",
      status: "online",
      battery: 42,
      location: "Patio Trasero",
    },
    {
      id: 3,
      name: "Válvula de Paso",
      status: "offline",
      battery: 0,
      location: "Sótano",
    },
  ],
  alerts: [
    {
      id: 1,
      type: "critical",
      msg: "Fuga detectada en Jardín",
      time: "Hace 20 min",
    },
    {
      id: 2,
      type: "warning",
      msg: "Consumo inusual (2:00 AM)",
      time: "Hace 6 horas",
    },
    {
      id: 3,
      type: "info",
      msg: "Revisa los tips de ahorro!",
      time: "Ahorro",
    },
  ],
};

const SidebarItem = ({
  icon: Icon,
  label,
  id,
  activeTab,
  setActiveTab,
  theme,
}) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 
      ${
        activeTab === id
          ? `bg-${theme.primary}-600 text-white shadow-lg shadow-${theme.primary}-200`
          : `text-slate-500 hover:bg-${theme.primary}-50 hover:text-${theme.primary}-700`
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

// --- NUEVO COMPONENTE: ContactAndSupport ---
const ContactAndSupport = ({ theme }) => {
  const { primary: primaryColor, neutral: neutralColor } = theme;

  return (
    <div
      className={`mt-8 p-6 rounded-2xl shadow-lg border border-slate-100 bg-white`}
    >
      <h3 className="font-bold text-slate-800 mb-6 flex items-center">
        <HelpCircle size={20} className={`mr-2 text-${primaryColor}-500`} />
        Contacto y Soporte
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Opción 1: Centro de Ayuda */}
        <div
          className={`p-4 border-2 border-transparent hover:border-${primaryColor}-200 rounded-xl transition-all duration-300 flex items-center space-x-4 cursor-pointer bg-white shadow-sm hover:shadow-md`}
        >
          <div
            className={`p-3 rounded-full bg-${primaryColor}-50 text-${primaryColor}-600 flex-shrink-0`}
          >
            <HelpCircle size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-700">Centro de Ayuda</p>
            <p className="text-sm text-slate-500">Documentación y FAQs</p>
          </div>
        </div>

        {/* Opción 2: Correo Electrónico */}
        <div
          className={`p-4 border-2 border-transparent hover:border-${primaryColor}-200 rounded-xl transition-all duration-300 flex items-center space-x-4 cursor-pointer bg-white shadow-sm hover:shadow-md`}
        >
          <div
            className={`p-3 rounded-full bg-orange-50 text-orange-600 flex-shrink-0`}
          >
            <Mail size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-700">Soporte Técnico</p>
            <p className="text-sm text-slate-500">soporte@ecoflow.cl</p>
          </div>
        </div>

        {/* Opción 3: Teléfono de Emergencia */}
        <div
          className={`p-4 border-2 border-transparent hover:border-red-200 rounded-xl transition-all duration-300 flex items-center space-x-4 cursor-pointer bg-white shadow-sm hover:shadow-md`}
        >
          <div
            className={`p-3 rounded-full bg-red-50 text-red-600 flex-shrink-0`}
          >
            <Phone size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-700">Emergencia 24/7</p>
            <p className="text-sm text-red-500">Llama al +56 9 1234 5678</p>
          </div>
        </div>
      </div>

      <p className={`text-xs text-${neutralColor}-400 mt-6 text-center`}>
        EcoFlow Prototipo | Todos los derechos reservados 2025.
      </p>
    </div>
  );
};
// --- FIN DEL NUEVO COMPONENTE ---

const WaterMonitorPrototipo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [themeId, setThemeId] = useState("ocean");
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // REFERENCIA PARA SCROLL A ALERTAS
  const alertsSectionRef = useRef(null);

  const theme = THEMES[themeId];
  const primaryColor = theme.primary;
  const accentColor = theme.accent;
  const neutralColor = theme.neutral;

  // --- LÓGICA DE CARRUSEL (USE EFFECT) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % ECO_TIPS.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  // --- LÓGICA DE DATOS Y HELPERS ---
  const diff =
    ((MOCK_DATA.currentUsage - MOCK_DATA.lastYearUsage) /
      MOCK_DATA.lastYearUsage) *
    100;
  const isHigher = MOCK_DATA.currentUsage > MOCK_DATA.lastYearUsage;
  const maxHistoryValue = Math.max(...MOCK_DATA.history.map((d) => d.value));

  const activeAlertsCount = MOCK_DATA.alerts.filter(
    (a) => a.type === "critical" || a.type === "warning"
  ).length;
  const hasCriticalAlerts = activeAlertsCount > 0;

  const projectedDiff = MOCK_DATA.projected - MOCK_DATA.lastYearUsage;
  const isProjectedHigher = projectedDiff > 0;

  const glassesCount = Math.round(
    (Math.abs(projectedDiff) * 1000) / GLASS_VOLUME
  ).toLocaleString("es-CL");

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value * PRICE_PER_M3);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  const scrollToAlerts = () => {
    if (alertsSectionRef.current) {
      alertsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // --- COMPONENTE DEDICADO PARA EL TIP DINÁMICO ---
  const DynamicEcoTip = ({ tip, isMobile = false }) => {
    // Calcula los vasos de agua para el tip actual
    const liters = tip.litersSaved;
    const glasses = Math.round(liters / GLASS_VOLUME).toLocaleString("es-CL");

    // Obtiene el mensaje y sustituye el valor con el formato correcto (Markdown)
    const rawMsg = tip.msg(glasses);

    // Función simple para renderizar texto con negritas (simulando Markdown)
    const renderMessage = (text) => {
      return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    // Si es móvil, usamos un div contenedor más grande para la card
    if (isMobile) {
      return (
        <div
          className={`flex items-start p-4 rounded-xl bg-white shadow-md border border-slate-100 transition-shadow duration-300 hover:shadow-xl`}
        >
          <div
            className={`p-3 bg-${primaryColor}-100 text-${primaryColor}-600 rounded-full flex-shrink-0 mr-4`}
          >
            <Lightbulb size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-800 mb-1">Eco Tip del Momento</p>
            <p className="text-sm text-slate-600 h-10 overflow-hidden">
              {renderMessage(rawMsg)}
            </p>
          </div>
        </div>
      );
    }

    // Versión Sidebar (más compacta)
    return (
      <p
        key={liters}
        className={`text-xs text-${primaryColor}-600 leading-relaxed transition-opacity duration-1000`}
      >
        {renderMessage(rawMsg)}
      </p>
    );
  };

  const ThemeSelector = () => (
    <div className="relative group">
      <div
        className={`p-2 hover:bg-${neutralColor}-100 rounded-full text-${neutralColor}-500 transition-colors cursor-pointer`}
      >
        <Palette size={20} />
      </div>
      <div
        className={`absolute right-0 mt-2 w-40 rounded-xl shadow-2xl bg-white border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2`}
      >
        <p
          className={`text-xs font-semibold mb-2 text-${neutralColor}-600 px-2`}
        >
          Paleta de Colores
        </p>
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setThemeId(key)}
            className={`flex items-center w-full p-2 rounded-lg text-sm transition-colors duration-150 font-medium ${
              key === themeId
                ? `bg-${t.primary}-100 text-${t.primary}-700`
                : `text-${neutralColor}-700 hover:bg-${t.primary}-50`
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full mr-2 bg-${t.primary}-600 border border-white shadow-sm`}
            ></span>
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`flex h-screen ${theme.background} font-sans ${theme.text} overflow-hidden`}
    >
      {/* Sidebar / Navegación (OCULTA en móvil) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div
          className={`flex items-center space-x-3 mb-10 text-${primaryColor}-600`}
        >
          <div className={`p-2 bg-${primaryColor}-100 rounded-lg`}>
            <Droplets size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">EcoFlow</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem
            icon={Home}
            label="Dashboard General"
            id="dashboard"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
          />
          <SidebarItem
            icon={BarChart3}
            label="Análisis Detallado"
            id="analytics"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
          />
          <SidebarItem
            icon={Wifi}
            label="Dispositivos"
            id="devices"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
          />
          <SidebarItem
            icon={Settings}
            label="Configuración"
            id="settings"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
          />
        </nav>

        {/* TIP DINÁMICO PARA DESKTOP/SIDEBAR */}
        <div className={`p-4 bg-${primaryColor}-50 rounded-xl mt-auto`}>
          <div
            className={`flex items-center space-x-2 mb-2 text-${primaryColor}-800`}
          >
            <Lightbulb size={18} />
            <span className="font-bold text-sm">Eco Tip</span>
          </div>
          <div className="h-10 relative overflow-hidden">
            <DynamicEcoTip tip={ECO_TIPS[currentTipIndex]} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Header Mobile Only */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div
            className={`flex items-center space-x-2 text-${primaryColor}-600`}
          >
            <Droplets size={24} />
            <h1 className="text-lg font-bold">EcoFlow</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeSelector />
            <button
              onClick={toggleFullScreen}
              className="p-2 bg-white rounded-full shadow-sm text-slate-500"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text}`}>
              Resumen de Consumo
            </h2>
            <p className="text-slate-500">Bienvenido, Familia Pérez</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSelector />
            <button
              onClick={toggleFullScreen}
              className={`p-2 hover:bg-${neutralColor}-100 rounded-full text-${neutralColor}-500 transition-colors`}
              title="Pantalla Completa"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <span className="text-sm text-slate-500">
              Última act: Hace 5 min
            </span>
            <div
              className={`h-10 w-10 bg-${primaryColor}-100 rounded-full flex items-center justify-center text-${primaryColor}-600 font-bold border-2 border-white shadow-sm`}
            >
              FP
            </div>
          </div>
        </header>

        {/* --- NUEVA TARJETA DE TIP PARA MÓVIL (Visible solo en móvil) --- */}
        <div className="mb-6 md:hidden">
          <DynamicEcoTip tip={ECO_TIPS[currentTipIndex]} isMobile={true} />
        </div>
        {/* ------------------------------------------------------------- */}

        {/* --- KPI Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 4: Estado del Sistema / Alertas (Clickable) */}
          <div
            onClick={scrollToAlerts}
            className={`bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all cursor-pointer ring-2 ring-transparent ${
              hasCriticalAlerts
                ? "hover:ring-red-100 hover:bg-red-50"
                : `hover:ring-${primaryColor}-100`
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  Estado del Sistema
                </p>
                <div className="flex items-end space-x-2 mt-2">
                  <span className="text-4xl font-bold text-slate-800">
                    {hasCriticalAlerts ? activeAlertsCount : "OK"}
                  </span>
                  {hasCriticalAlerts && (
                    <span className="text-lg text-slate-400 font-medium mb-1">
                      avisos
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`p-3 rounded-full ${
                  hasCriticalAlerts
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {hasCriticalAlerts ? (
                  <AlertTriangle size={24} />
                ) : (
                  <Activity size={24} />
                )}
              </div>
            </div>

            {/* Texto destellante si hay alertas */}
            <div className="mt-4">
              {hasCriticalAlerts ? (
                <div className="flex items-center text-red-500 font-bold text-sm animate-pulse">
                  <AlertOctagon size={16} className="mr-2" />
                  <span>¡Atención Requerida!</span>
                </div>
              ) : (
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Funcionando normal
                </div>
              )}
            </div>
          </div>

          {/* Card 1: Consumo Actual */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-shadow">
            <div
              className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}
            >
              <Droplets size={80} className={`text-${primaryColor}-500`} />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">
              Consumo este mes
            </p>
            <div className="flex items-end space-x-2 mb-2">
              <span className="text-4xl font-bold text-slate-800">
                {MOCK_DATA.currentUsage}
              </span>
              <span className="text-lg text-slate-400 font-medium mb-1">
                m³
              </span>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 bg-${primaryColor}-50 text-${primaryColor}-700 rounded-lg text-sm font-semibold mb-3`}
            >
              <DollarSign size={14} className="mr-1" />
              {formatCLP(MOCK_DATA.currentUsage)}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  isHigher
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {isHigher ? "+" : "-"}
                {diff.toFixed(1)}%
              </span>
              <span className="text-slate-400">vs mes pasado</span>
            </div>
          </div>

          {/* Card 2: Comparativa Anual */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <p className="text-slate-500 text-sm font-medium mb-1">
              Consumo del mismo mes, año anterior
            </p>
            <div className="flex items-end space-x-2 mb-2">
              <span className="text-4xl font-bold text-slate-800">
                {MOCK_DATA.lastYearUsage}
              </span>
              <span className="text-lg text-slate-400 font-medium mb-1">
                m³
              </span>
            </div>
            <div className="text-sm text-slate-500 font-medium mb-4 flex items-center">
              <span className="text-slate-400 mr-2">Costo aprox:</span>
              {formatCLP(MOCK_DATA.lastYearUsage)}
            </div>
            <div
              className={`w-full bg-${neutralColor}-100 h-2 rounded-full overflow-hidden`}
            >
              <div
                className={`h-full rounded-full ${
                  isHigher ? "bg-red-500" : "bg-emerald-500"
                }`}
                style={{
                  width: `${
                    (MOCK_DATA.lastYearUsage / MOCK_DATA.currentUsage) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
              Objetivo: Mantener bajo 13 m³
            </p>
          </div>

          {/* Card 3: Tendencia con Vasos de Agua */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow flex flex-col justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">
                Tendencia Proyectada
              </p>
              <div className="flex items-center mt-2 mb-2">
                {MOCK_DATA.trend === "up" ? (
                  <div className="p-2 bg-red-50 rounded-full text-red-500 mr-3">
                    <TrendingUp size={24} />
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-50 rounded-full text-emerald-500 mr-3">
                    <TrendingDown size={24} />
                  </div>
                )}
                <div>
                  <span className="block text-lg font-bold text-slate-800">
                    {MOCK_DATA.trend === "up" ? "Subiendo" : "Bajando"}
                  </span>
                  <span className="text-xs text-slate-400">
                    vs Año Anterior
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE VASOS */}
            <div
              className={`mt-2 p-3 rounded-xl border ${
                isProjectedHigher
                  ? "bg-blue-50 border-blue-100 text-blue-800"
                  : "bg-emerald-50 border-emerald-100 text-emerald-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full bg-white shadow-sm flex-shrink-0 ${
                    isProjectedHigher ? "text-blue-500" : "text-emerald-500"
                  }`}
                >
                  <GlassWater size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide opacity-70 mb-1">
                    Impacto Ambiental
                  </p>
                  <p className="text-sm leading-tight mb-1">
                    {isProjectedHigher
                      ? "Consumo extra equivalente a:"
                      : "Ahorro equivalente a:"}
                  </p>
                  <p
                    className={`text-lg font-bold leading-none ${
                      isProjectedHigher ? "text-blue-600" : "text-emerald-600"
                    }`}
                  >
                    {glassesCount}{" "}
                    <span className="text-xs font-medium text-slate-500">
                      vasos de agua
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Chart and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-100 overflow-x-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center">
                <BarChart3
                  size={20}
                  className={`mr-2 text-${primaryColor}-500`}
                />
                Histórico de Consumo (12 Meses)
              </h3>
              <select
                className={`text-sm border-none bg-${neutralColor}-50 text-slate-600 rounded-lg p-2 focus:ring-0 cursor-pointer`}
              >
                <option>Último Año</option>
                <option>Últimos 6 Meses</option>
              </select>
            </div>

            {/* CONTENEDOR DEL GRÁFICO */}
            <div className="h-64 flex items-end justify-between gap-2 px-1 w-full overflow-hidden">
              {MOCK_DATA.history.map((item, index) => {
                const heightPercentage = (item.value / maxHistoryValue) * 100;
                const isCurrentMonth = index === MOCK_DATA.history.length - 1;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 min-w-0 group relative h-full justify-end"
                  >
                    <span
                      className={`text-[10px] md:text-xs font-semibold mb-1 ${
                        isCurrentMonth ? theme.chart.value : "text-slate-400"
                      }`}
                    >
                      {item.value}
                    </span>

                    {/* TOOLTIP */}
                    <div className="absolute bottom-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-2 px-3 rounded-lg pointer-events-none z-10 shadow-xl text-center max-w-[120px] whitespace-nowrap">
                      <div className="font-bold text-sm">{item.value} m³</div>
                      <div className={`${theme.chart.tooltip} font-medium`}>
                        {formatCLP(item.value)}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>

                    {/* BARRA */}
                    <div
                      className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ease-out ${
                        isCurrentMonth
                          ? theme.chart.barCurrent
                          : `${theme.chart.barPast} ${theme.chart.barHover}`
                      }`}
                      style={{ height: `${heightPercentage}%` }}
                    />

                    <span
                      className={`text-xs mt-3 ${
                        isCurrentMonth
                          ? theme.chart.value + " font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts & Recommendations Section */}
          <div
            ref={alertsSectionRef}
            className={`bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col order-1 transition-colors duration-500 ${
              hasCriticalAlerts ? "border-red-100 shadow-red-50" : ""
            }`}
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Bell
                size={20}
                className={`mr-2 ${
                  hasCriticalAlerts ? "text-red-500" : "text-orange-500"
                }`}
              />
              Avisos y Recomendaciones
            </h3>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {MOCK_DATA.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start p-3 rounded-xl bg-${neutralColor}-50 border border-${neutralColor}-100`}
                >
                  <div className={`mt-1 mr-3 flex-shrink-0`}>
                    {alert.type === "critical" && (
                      <AlertOctagon size={18} className="text-red-500" />
                    )}
                    {alert.type === "warning" && (
                      <AlertTriangle size={18} className="text-orange-500" />
                    )}
                    {alert.type === "info" && (
                      <Lightbulb
                        size={18}
                        className={`text-${primaryColor}-500`}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        alert.type === "critical"
                          ? "text-red-700"
                          : "text-slate-700"
                      }`}
                    >
                      {alert.msg}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`mt-4 w-full py-2 text-sm text-${primaryColor}-600 font-medium hover:bg-${primaryColor}-50 rounded-lg transition-colors`}
            >
              Ver histórico de alertas
            </button>
          </div>
        </div>

        {/* Bottom Section: Instrument Status */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-8">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <Wifi size={20} className={`mr-2 text-${accentColor}-500`} />
            Estado de Instrumentos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_DATA.devices.map((device) => (
              <div
                key={device.id}
                className={`border border-${neutralColor}-200 rounded-xl p-4 flex items-center justify-between transition-shadow hover:shadow-md`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-full ${
                      device.status === "online"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">
                      {device.name}
                    </p>
                    <p className="text-xs text-slate-400">{device.location}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        device.status === "online"
                          ? "bg-emerald-500"
                          : "bg-red-500 animate-pulse"
                      }`}
                    ></span>
                    <span className="text-xs font-medium text-slate-500">
                      {device.status === "online" ? "Activo" : "Error"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Battery size={12} />
                    <span>{device.battery}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- INSERCIÓN DEL NUEVO COMPONENTE DE CONTACTO --- */}
        <ContactAndSupport theme={theme} />
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default WaterMonitorPrototipo;
