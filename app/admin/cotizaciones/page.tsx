'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CotizacionItem {
    id: string;
    cliente: string;
    telefono: string;
    servicio: string;
    detalle: string;
    total: number;
    estado: 'Pendiente' | 'Completada';
    fecha: string;
}

export default function GestorCotizacionesPage() {
    const [cotizaciones, setCotizaciones] = useState<CotizacionItem[]>([
        {
            id: '1',
            cliente: 'Juan Pérez',
            telefono: '3101234567',
            servicio: 'Limpieza de Sala / Sofá',
            detalle: '3 Puestos (Sofá 3 Puestos)',
            total: 105000,
            estado: 'Pendiente',
            fecha: '2026-09-02 10:30'
        }
    ]);
    
    const [filtroEstado, setFiltroEstado] = useState<'Todas' | 'Pendiente' | 'Completada'>('Todas');

    useEffect(() => {
        const guardadas = localStorage.getItem('xtreme_cotizaciones');
        if (guardadas) {
        try {
            setCotizaciones(JSON.parse(guardadas));
        } catch {}
        }
    }, []);

    const cambiarEstado = (id: string, nuevoEstado: 'Pendiente' | 'Completada') => {
        const actualizadas = cotizaciones.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c);
        setCotizaciones(actualizadas);
        localStorage.setItem('xtreme_cotizaciones', JSON.stringify(actualizadas));
    };

    const eliminarCotizacion = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta cotización?')) {
        const filtradas = cotizaciones.filter(c => c.id !== id);
        setCotizaciones(filtradas);
        localStorage.setItem('xtreme_cotizaciones', JSON.stringify(filtradas));
        }
    };

    const enviarRecordatorioWp = (c: CotizacionItem) => {
        const telLimpio = c.telefono.replace(/\D/g, '');
        const telefonoFinal = telLimpio.startsWith('57') ? telLimpio : `57${telLimpio}`;
        
        const mensaje = `Hola *${c.cliente}*, te saludamos de *Xtreme Clean*. Nos ponemos en contacto para confirmar los detalles de tu servicio de *${c.servicio}* (${c.detalle}). Total a cancelar: *$${c.total.toLocaleString()} COP*.\n\n*Recomendaciones previas:* Por favor contar con un espacio despejado y acceso a toma corriente y agua. ¡Estamos listos para transformar tus espacios! ⚡`;
        
        const url = `https://wa.me/${telefonoFinal}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    const cotizacionesFiltradas = cotizaciones.filter(c => {
        if (filtroEstado === 'Todas') return true;
        return c.estado === filtroEstado;
    });

    return (
        <div className="min-h-screen bg-[#051610] p-6 md:p-10 text-slate-100 font-sans">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Control de Solicitudes
            </span>
            <h1 className="text-3xl font-black text-white mt-2">📋 Gestión de Cotizaciones</h1>
            <p className="text-sm text-slate-400">Administra las solicitudes, estados de cobro y agendamiento de clientes</p>
            </div>
            <Link href="/admin" className="px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl transition-all shadow-lg">
            ← Volver al Dashboard
            </Link>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl shadow-2xl space-y-6">
            
            {/* PESTAÑAS DE FILTRO */}
            <div className="flex gap-2 border-b border-[#c5a059]/20 pb-4">
            {(['Todas', 'Pendiente', 'Completada'] as const).map(estado => {
                const activo = filtroEstado === estado;
                const count = estado === 'Todas' ? cotizaciones.length : cotizaciones.filter(c => c.estado === estado).length;
                return (
                <button
                    key={estado}
                    onClick={() => setFiltroEstado(estado)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activo 
                        ? 'bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 shadow-md' 
                        : 'bg-[#051610] text-slate-300 border border-[#c5a059]/20 hover:border-[#c5a059]/50'
                    }`}
                >
                    {estado} ({count})
                </button>
                );
            })}
            </div>

            {/* TABLA O LISTADO */}
            {cotizacionesFiltradas.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
                No hay cotizaciones registradas en esta categoría.
            </div>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#c5a059]/20 text-[11px] font-bold text-[#e6ca84] uppercase tracking-wider">
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Servicio</th>
                    <th className="py-3 px-4">Detalle / Medida</th>
                    <th className="py-3 px-4">Total Estimado</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#c5a059]/10 text-xs">
                    {cotizacionesFiltradas.map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-bold text-white">
                        {c.cliente}
                        <span className="block text-[10px] text-slate-400 font-normal">{c.telefono}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-200">{c.servicio}</td>
                        <td className="py-4 px-4 text-slate-300">{c.detalle}</td>
                        <td className="py-4 px-4 font-black text-[#e6ca84]">${c.total.toLocaleString()} COP</td>
                        <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            c.estado === 'Pendiente' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                            {c.estado}
                        </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                        <button 
                            onClick={() => enviarRecordatorioWp(c)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 font-bold rounded-xl cursor-pointer transition-all shadow-sm"
                            title="Enviar confirmación y recordatorio por WhatsApp"
                        >
                            💬 Enviar Recordatorio
                        </button>

                        {c.estado === 'Pendiente' ? (
                            <button 
                            onClick={() => cambiarEstado(c.id, 'Completada')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer transition-all shadow-sm"
                            >
                            Atender / Completar
                            </button>
                        ) : (
                            <button 
                            onClick={() => cambiarEstado(c.id, 'Pendiente')}
                            className="px-3 py-1.5 bg-[#051610] border border-[#c5a059]/40 text-[#e6ca84] hover:bg-[#c5a059]/10 font-bold rounded-xl cursor-pointer transition-all"
                            >
                            Marcar Pendiente
                            </button>
                        )}
                        <button 
                            onClick={() => eliminarCotizacion(c.id)}
                            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl cursor-pointer transition-all"
                        >
                            Eliminar
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}

        </div>
        </div>
    );
}