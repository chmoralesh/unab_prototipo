import React, { useState } from "react";
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
  Lightbulb,
  DollarSign,
  Maximize2,
  Minimize2,
} from "lucide-react";

// Tarifa referencial por m3 en CLP (ejemplo promedio).
const PRICE_PER_M3 = 1050;

// Datos simulados para la maqueta
const MOCK_DATA = {
  currentUsage: 14.5, // m3
  lastYearUsage: 12.2, // m3
  trend: "up", // 'up' (aumento) or 'down' (descenso)
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
    { month: "Nov", value: 13.8 }, // <-- CORREGIDO: De 'viernes' a 'value'
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
      msg: "Reduzca el tiempo de ducha para ahorrar 5%",
      time: "Consejo del día",
    },
  ],
};

/**
 * Componente para el elemento de la barra lateral (SidebarItem).
 * Definido fuera del componente principal para evitar errores de alcance.
 * @param {object} props - Propiedades del componente.
 */
const SidebarItem = ({ icon: Icon, label, id, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 ${
      activeTab === id
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "text-slate-500 hover:bg-blue-50"
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

// Componente principal del prototipo
const WaterMonitorPrototipo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helpers de cálculo y formato
  const diff =
    ((MOCK_DATA.currentUsage - MOCK_DATA.lastYearUsage) /
      MOCK_DATA.lastYearUsage) *
    100;
  const isHigher = MOCK_DATA.currentUsage > MOCK_DATA.lastYearUsage;

  const formatCLP = (value) => {
    // Convierte m3 a CLP y aplica formato de moneda chilena
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value * PRICE_PER_M3);
  };

  const toggleFullScreen = () => {
    // Función para manejar la pantalla completa
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

  // Determinamos el valor máximo para escalar correctamente el gráfico
  const maxHistoryValue = Math.max(...MOCK_DATA.history.map((d) => d.value));

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar / Navegación */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="flex items-center space-x-3 mb-10 text-blue-600">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Droplets size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">EcoFlow</h1>
        </div>

        <nav className="space-y-2 flex-1">
          {/* Se pasan los estados a SidebarItem */}
          <SidebarItem
            icon={Home}
            label="Dashboard General"
            id="dashboard"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <SidebarItem
            icon={BarChart3}
            label="Análisis Detallado"
            id="analytics"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <SidebarItem
            icon={Wifi}
            label="Dispositivos"
            id="devices"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <SidebarItem
            icon={Settings}
            label="Configuración"
            id="settings"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </nav>

        <div className="p-4 bg-blue-50 rounded-xl mt-auto">
          <div className="flex items-center space-x-2 text-blue-800 mb-2">
            <Lightbulb size={18} />
            <span className="font-bold text-sm">Eco Tip</span>
          </div>
          <p className="text-xs text-blue-600 leading-relaxed">
            Cerrar el grifo al cepillarse los dientes ahorra hasta 4 litros por
            minuto.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Header Mobile Only */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-blue-600">
            <Droplets size={24} />
            <h1 className="text-lg font-bold">EcoFlow</h1>
          </div>
          <button
            onClick={toggleFullScreen}
            className="p-2 bg-white rounded-full shadow-sm text-slate-500"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Resumen de Consumo
            </h2>
            <p className="text-slate-500">Bienvenido, Familia Pérez</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleFullScreen}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              title="Pantalla Completa"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <span className="text-sm text-slate-500">
              Última act: Hace 5 min
            </span>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              FP
            </div>
          </div>
        </header>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Consumo Actual */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Droplets size={80} className="text-blue-500" />
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

            {/* Precio destacado */}
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold mb-3">
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-slate-500 text-sm font-medium mb-1">
              Mismo mes año anterior
            </p>
            <div className="flex items-end space-x-2 mb-2">
              <span className="text-4xl font-bold text-slate-800">
                {MOCK_DATA.lastYearUsage}
              </span>
              <span className="text-lg text-slate-400 font-medium mb-1">
                m³
              </span>
            </div>
            {/* Precio pequeño */}
            <div className="text-sm text-slate-500 font-medium mb-4 flex items-center">
              <span className="text-slate-400 mr-2">Costo aprox:</span>
              {formatCLP(MOCK_DATA.lastYearUsage)}
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
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

          {/* Card 3: Tendencia */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-slate-500 text-sm font-medium mb-1">
              Tendencia de Consumo
            </p>
            <div className="flex items-center mt-2 mb-4">
              {MOCK_DATA.trend === "up" ? (
                <div className="p-3 bg-red-50 rounded-full text-red-500 mr-4">
                  <TrendingUp size={32} />
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-500 mr-4">
                  <TrendingDown size={32} />
                </div>
              )}
              <div>
                <span className="block text-lg font-bold text-slate-800">
                  {MOCK_DATA.trend === "up" ? "Aumento Leve" : "Descenso"}
                </span>
                <span className="text-sm text-slate-400">
                  Gasto diario prom: {formatCLP(MOCK_DATA.currentUsage / 30)}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Proyección fin de mes</span>
                <span className="font-bold text-slate-700">
                  {MOCK_DATA.projected} m³
                </span>
              </div>
              <div className="text-right text-xs font-bold text-blue-600">
                ~ {formatCLP(MOCK_DATA.projected)}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Chart and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center">
                <BarChart3 size={20} className="mr-2 text-blue-500" />
                Histórico de Consumo (12 Meses)
              </h3>
              <select className="text-sm border-none bg-slate-50 text-slate-600 rounded-lg p-2 focus:ring-0 cursor-pointer">
                <option>Último Año</option>
                <option>Últimos 6 Meses</option>
              </select>
            </div>

            {/* Custom CSS Bar Chart */}
            <div className="h-64 flex items-end justify-between space-x-2 md:space-x-4 px-2">
              {MOCK_DATA.history.map((item, index) => {
                // Cálculo de altura relativo al valor máximo del historial para un escalado correcto.
                const heightPercentage = (item.value / maxHistoryValue) * 100;
                const isCurrentMonth = index === MOCK_DATA.history.length - 1;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 group relative h-full justify-end"
                  >
                    {/* Texto con valor visible encima de la barra */}
                    <span
                      className={`text-[10px] md:text-xs font-semibold mb-1 ${
                        isCurrentMonth ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      {item.value}
                    </span>

                    {/* Tooltip on hover updated with CLP */}
                    <div className="absolute bottom-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-2 px-3 rounded-lg mb-2 pointer-events-none whitespace-nowrap z-10 shadow-xl text-center">
                      <div className="font-bold text-sm">{item.value} m³</div>
                      <div className="text-blue-300 font-medium">
                        {formatCLP(item.value)}
                      </div>
                      {/* Triangulito del tooltip */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>

                    <div
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out relative ${
                        isCurrentMonth
                          ? "bg-blue-600"
                          : "bg-blue-200 group-hover:bg-blue-300"
                      }`}
                      style={{ height: `${heightPercentage}%` }} // <-- CORREGIDO: Usamos porcentaje directo en h-64
                    ></div>
                    <span
                      className={`text-xs mt-3 ${
                        isCurrentMonth
                          ? "font-bold text-blue-600"
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <AlertTriangle size={20} className="mr-2 text-orange-500" />
              Avisos y Recomendaciones
            </h3>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {MOCK_DATA.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className={`mt-1 mr-3 flex-shrink-0`}>
                    {alert.type === "critical" && (
                      <AlertOctagon size={18} className="text-red-500" />
                    )}
                    {alert.type === "warning" && (
                      <AlertTriangle size={18} className="text-orange-500" />
                    )}
                    {alert.type === "info" && (
                      <Lightbulb size={18} className="text-blue-500" />
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

            <button className="mt-4 w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
              Ver histórico de alertas
            </button>
          </div>
        </div>

        {/* Bottom Section: Instrument Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <Wifi size={20} className="mr-2 text-purple-500" />
            Estado de Instrumentos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_DATA.devices.map((device) => (
              <div
                key={device.id}
                className="border border-slate-200 rounded-xl p-4 flex items-center justify-between"
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
      </main>
    </div>
  );
};

export default WaterMonitorPrototipo;
