'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LogReciente {
    id: string;
    usuario: string;
    accion: string;
    fecha: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [usuarioActual, setUsuarioActual] = useState({ nombre: 'Admin Principal', rol: 'Administrador', permisos: ['Todo'] });
    const [logsRecientes, setLogsRecientes] = useState<LogReciente[]>([]);
    const [stats, setStats] = useState({ cotizaciones: 14, citasHoy: 6, pendientes: 2, ingresos: 52000 });
    const [notificacionNueva, setNotificacionNueva] = useState<string | null>('¡Nuevo cliente agendó un servicio de Limpieza de Colchón por WhatsApp!');

    useEffect(() => {
        const rawUser = localStorage.getItem('xtreme_usuario_actual');
        if (rawUser) {
        try {
            const u = JSON.parse(rawUser);
            setUsuarioActual(u);
        } catch {}
        } else {
        const demoUser = { nombre: 'Admin Principal', rol: 'Administrador', permisos: ['Todo'] };
        localStorage.setItem('xtreme_usuario_actual', JSON.stringify(demoUser));
        setUsuarioActual(demoUser);
        }

        const guardados = localStorage.getItem('xtreme_logs_auditoria');
        if (guardados) {
        try {
            const parsed = JSON.parse(guardados);
            setLogsRecientes(parsed.slice(0, 4));
        } catch {}
        } else {
        setLogsRecientes([
            { id: '1', usuario: 'Admin Principal', accion: 'Inicio de sesión en el sistema corporativo', fecha: 'Hace 3 minutos' }
        ]);
        }

        const timer = setTimeout(() => setNotificacionNueva(null), 7000);
        return () => clearTimeout(timer);
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('xtreme_usuario_actual');
        router.push('/admin/login');
    };

    const esAdmin = usuarioActual.rol === 'Administrador' || usuarioActual.permisos?.includes('Todo');

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans relative">
        
        {/* NOTIFICACIÓN FLOTANTE REPOSICIONADA */}
        {notificacionNueva && (
            <div className="fixed bottom-6 left-6 z-50 bg-[#09261d] border border-[#c5a059] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce max-w-sm">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <div className="flex-1">
                <p className="text-[10px] text-[#e6ca84] font-bold uppercase tracking-wider">Nueva Solicitud Web</p>
                <p className="text-xs text-white font-medium">{notificacionNueva}</p>
            </div>
            <button onClick={() => setNotificacionNueva(null)} className="text-slate-400 hover:text-white text-xs font-bold px-1">✕</button>
            </div>
        )}

        {/* HEADER PRINCIPAL RESPONSIVO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#c5a059] to-[#e6ca84] flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl">
                XC
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Panel Ejecutivo</h1>
                <p className="text-xs sm:text-sm text-[#e6ca84] font-semibold mt-0.5">
                XTREME CLEAN — Sistema Operativo de Lavandería Profesional
                </p>
            </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end bg-[#09261d] p-3 rounded-2xl border border-[#c5a059]/20 shadow-inner">
            <div className="text-right">
                <span className="block text-xs font-bold text-white">{usuarioActual.nombre}</span>
                <span className="text-[10px] text-[#e6ca84] uppercase font-mono">{usuarioActual.rol}</span>
            </div>
            <button 
                onClick={cerrarSesion}
                className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-400 hover:text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
                Cerrar Sesión
            </button>
            </div>
        </div>

        {/* MÉTRICAS SUPERIORES EJECUTIVAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl shadow-xl hover:border-[#c5a059] transition-all">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cotizaciones Hoy</p>
            <h3 className="text-3xl font-black text-white mt-2">{stats.cotizaciones}</h3>
            <span className="text-xs text-emerald-400 font-bold mt-1 block">↑ +18% vs ayer</span>
            </div>

            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl shadow-xl hover:border-[#c5a059] transition-all">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Citas Programadas</p>
            <h3 className="text-3xl font-black text-white mt-2">{stats.citasHoy}</h3>
            <span className="text-xs text-[#e6ca84] font-semibold mt-1 block">Villavicencio y Meta</span>
            </div>

            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl shadow-xl hover:border-[#c5a059] transition-all">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pendientes de Pago</p>
            <h3 className="text-3xl font-black text-white mt-2">{stats.pendientes}</h3>
            <span className="text-xs text-amber-400 font-bold mt-1 block">⚠ Requieren confirmación</span>
            </div>

            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl shadow-xl hover:border-[#c5a059] transition-all">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ingresos Proyectados</p>
            <h3 className="text-3xl font-black text-[#e6ca84] mt-2">${stats.ingresos.toLocaleString()} COP</h3>
            <span className="text-xs text-slate-300 font-mono mt-1 block">📈 Meta cumplimiento: 92%</span>
            </div>
        </div>

        {/* SECCIÓN INTERMEDIA: MÓDULOS & ACTIVIDAD RECIENTE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
            
            {/* MÓDULOS DEL SISTEMA */}
            <div className="lg:col-span-8 space-y-4">
            <h2 className="text-sm font-bold text-[#e6ca84] uppercase tracking-wider flex items-center gap-2">
                <span>⚡</span> Módulos del Sistema Operativo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-4">
                <Link href="/admin/servicios" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    ＋
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Nuevo Servicio</h3>
                    <p className="text-[11px] text-slate-400">Catálogo y variantes</p>
                </div>
                </Link>

                <Link href="/admin/cobertura" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    📍
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Cobertura & Zonas</h3>
                    <p className="text-[11px] text-slate-400">Tarifas de traslado</p>
                </div>
                </Link>

                <Link href="/admin/descuentos" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    🎟️
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Descuentos & Cupones</h3>
                    <p className="text-[11px] text-slate-400">Códigos promocionales</p>
                </div>
                </Link>

                {/* NUEVO MÓDULO DE ASESORES WHATSAPP */}
                <Link href="/admin/asesores" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    💬
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Asesores WhatsApp</h3>
                    <p className="text-[11px] text-slate-400">Gestionar números y links</p>
                </div>
                </Link>

                <Link href="/admin/cotizaciones" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    📋
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Cotizaciones</h3>
                    <p className="text-[11px] text-slate-400">Solicitudes web</p>
                </div>
                </Link>

                <Link href="/admin/agenda" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    📅
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Agenda</h3>
                    <p className="text-[11px] text-slate-400">Calendario operativo</p>
                </div>
                </Link>

                <Link href="/admin/whatsapp" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    🤖
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">WhatsApp Bot</h3>
                    <p className="text-[11px] text-slate-400">Configurar IA</p>
                </div>
                </Link>

                {esAdmin && (
                <Link href="/admin/usuarios" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36">
                    <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    👥
                    </div>
                    <div>
                    <h3 className="font-bold text-white text-sm">Usuarios</h3>
                    <p className="text-[11px] text-slate-400">Permisos y claves</p>
                    </div>
                </Link>
                )}

                <Link href="/admin/configuracion" className="bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 p-5 rounded-3xl shadow-xl transition-all group flex flex-col justify-between h-36 sm:col-span-3">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center text-[#e6ca84] font-bold text-base group-hover:scale-110 transition-transform">
                    ⚙️
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Editor Web Avanzado (CMS)</h3>
                    <p className="text-[11px] text-slate-400">Personaliza textos, imágenes y secciones en tiempo real</p>
                </div>
                </Link>
            </div>
            </div>

            {/* ACTIVIDAD RECIENTE */}
            <div className="lg:col-span-4 bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-3">
                <h3 className="font-bold text-sm text-[#e6ca84] uppercase tracking-wider">Última Actividad</h3>
                {esAdmin && <Link href="/admin/auditoria" className="text-[11px] text-slate-400 hover:text-white underline">Ver todo</Link>}
            </div>

            <div className="space-y-3">
                {logsRecientes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay registros recientes.</p>
                ) : (
                logsRecientes.map(log => (
                    <div key={log.id} className="p-3 bg-[#051610] border border-[#c5a059]/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-white">{log.usuario}</span>
                        <span className="text-[9px] text-[#e6ca84] font-mono">{log.fecha}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{log.accion}</p>
                    </div>
                ))
                )}
            </div>
            </div>

        </div>

        {/* PIE DE ESTADO DEL SISTEMA */}
        <div className="bg-[#09261d] border border-[#c5a059]/30 px-6 py-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-white">Sistema Operativo en Línea</span>
            <span>• Sincronización WebSocket activa</span>
            </div>
            <div className="flex gap-4 font-mono text-[11px]">
            <span>Rol: {usuarioActual.rol}</span>
            <span>Seguridad Enterprise</span>
            <span className="text-[#e6ca84]">XTREME CLEAN v1.0</span>
            </div>
        </div>

        </div>
    );
}