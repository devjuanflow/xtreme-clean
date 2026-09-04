'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LogItem {
    id: string;
    usuario: string;
    rol: string;
    accion: string;
    fecha: string;
    }

    export default function AuditoriaPage() {
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroRol, setFiltroRol] = useState<string>('Todos');

    useEffect(() => {
        const guardados = localStorage.getItem('xtreme_logs_auditoria');
        if (guardados) {
        try { setLogs(JSON.parse(guardados)); } catch {}
        } else {
        const iniciales: LogItem[] = [
            { id: '1', usuario: 'Admin Principal', rol: 'Administrador', accion: 'Inicio de sesión en el sistema', fecha: new Date().toLocaleString() }
        ];
        setLogs(iniciales);
        localStorage.setItem('xtreme_logs_auditoria', JSON.stringify(iniciales));
        }
    }, []);

    const limpiarLogs = () => {
        if (confirm('¿Estás seguro de vaciar todo el historial de auditoría?')) {
        localStorage.removeItem('xtreme_logs_auditoria');
        setLogs([]);
        }
    };

    const exportarCSV = () => {
        if (logs.length === 0) {
        alert('No hay registros para exportar.');
        return;
        }
        const headers = ['ID,Usuario,Rol,Accion,Fecha\n'];
        const rows = logs.map(l => `"${l.id}","${l.usuario}","${l.rol}","${l.accion}","${l.fecha}"\n`);
        const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auditoria_xtreme_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const logsFiltrados = logs.filter(l => {
        const coincideTexto = l.usuario.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                            l.accion.toLowerCase().includes(filtroTexto.toLowerCase());
        const coincideRol = filtroRol === 'Todos' || l.rol === filtroRol;
        return coincideTexto && coincideRol;
    });

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans">
        
        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Seguridad Enterprise & Auditoría
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">🛡️ Registro de Auditoría y Trazabilidad</h1>
            <p className="text-xs sm:text-sm text-slate-400">Monitorea cada cambio en tiempo real y exporta reportes en formato CSV.</p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-start md:justify-end">
            {logs.length > 0 && (
                <>
                <button onClick={exportarCSV} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md flex items-center gap-1.5">
                    📥 Exportar CSV
                </button>
                <button onClick={limpiarLogs} className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md">
                    Vaciar Historial
                </button>
                </>
            )}
            <Link href="/admin" className="px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl transition-all shadow-lg">
                ← Volver al Dashboard
            </Link>
            </div>
        </div>

        {/* TARJETAS DE ESTADÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Total Eventos Registrados</p>
                <h4 className="text-2xl font-black text-white mt-1">{logs.length}</h4>
            </div>
            <span className="text-2xl">📋</span>
            </div>
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Eventos Filtrados</p>
                <h4 className="text-2xl font-black text-[#e6ca84] mt-1">{logsFiltrados.length}</h4>
            </div>
            <span className="text-2xl">🔍</span>
            </div>
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Estado de Seguridad</p>
                <h4 className="text-2xl font-black text-emerald-400 mt-1">Óptimo</h4>
            </div>
            <span className="text-2xl">🔒</span>
            </div>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
            
            {/* FILTROS Y BÚSQUEDA */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#c5a059]/20 pb-4">
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-300 font-bold uppercase mr-1">Filtrar Rol:</span>
                {['Todos', 'Administrador', 'Operador'].map(rol => (
                <button
                    key={rol}
                    onClick={() => setFiltroRol(rol)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    filtroRol === rol 
                        ? 'bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 shadow-md' 
                        : 'bg-[#051610] text-slate-300 border border-[#c5a059]/20 hover:border-[#c5a059]/50'
                    }`}
                >
                    {rol}
                </button>
                ))}
            </div>

            <input 
                type="text" 
                placeholder="🔍 Buscar por usuario o acción..." 
                className="p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-xs text-white w-full sm:w-72 focus:outline-none focus:border-[#c5a059]"
                value={filtroTexto}
                onChange={e => setFiltroTexto(e.target.value)}
            />
            </div>

            {/* LISTADO DE EVENTOS */}
            {logsFiltrados.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
                No se encontraron registros de auditoría coincidentes.
            </div>
            ) : (
            <div className="space-y-3">
                {logsFiltrados.map(log => (
                <div key={log.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#051610] border border-[#c5a059]/20 rounded-2xl gap-3 shadow-inner hover:border-[#c5a059]/50 transition-all">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c5a059] to-[#e6ca84] flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-md">
                        {log.usuario ? log.usuario.substring(0, 2).toUpperCase() : 'XC'}
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        {log.usuario} 
                        <span className="text-[10px] px-2 py-0.5 bg-[#c5a059]/20 border border-[#c5a059]/30 text-[#e6ca84] rounded-md font-semibold">
                            {log.rol}
                        </span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">{log.accion}</p>
                    </div>
                    </div>
                    
                    <div className="text-[11px] font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 self-end sm:self-center">
                    🕒 {log.fecha}
                    </div>
                </div>
                ))}
            </div>
            )}

        </div>
        </div>
    );
}