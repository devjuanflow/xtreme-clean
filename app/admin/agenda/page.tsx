'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Cita {
    id: string;
    dia: number;
    mesAnio: string;
    cliente: string;
    servicio: string;
    hora: string;
    estado: 'Programada' | 'Completada' | 'Cancelada';
    }

    export default function AgendaPage() {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [mesSeleccionado, setMesSeleccionado] = useState('Septiembre 2026');
    
    const [modalAbierto, setModalAbierto] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState<number>(1);
    const [cliente, setCliente] = useState('');
    const [servicio, setServicio] = useState('Limpieza de Sala / Sofá');
    const [hora, setHora] = useState('10:00 AM');

    const mesesDisponibles = ['Agosto 2026', 'Septiembre 2026', 'Octubre 2026', 'Noviembre 2026'];
    const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);

    useEffect(() => {
        // 1. Cargar citas guardadas y sincronizar cotizaciones pendientes de WhatsApp si existen
        const guardadas = localStorage.getItem('xtreme_agenda_citas');
        let listaCitas: Cita[] = [];
        
        if (guardadas) {
        try { listaCitas = JSON.parse(guardadas); } catch {}
        } else {
        // Citas de ejemplo iniciales
        listaCitas = [
            { id: '1', dia: 4, mesAnio: 'Septiembre 2026', cliente: 'Juan Pérez', servicio: 'Limpieza de Sala / Sofá', hora: '10:00 AM', estado: 'Programada' },
            { id: '2', dia: 12, mesAnio: 'Septiembre 2026', cliente: 'Camila Torres', servicio: 'Limpieza de Colchón Doble', hora: '02:30 PM', estado: 'Programada' }
        ];
        }
        setCitas(listaCitas);
    }, []);

    const guardarEnStorage = (nuevas: Cita[]) => {
        setCitas(nuevas);
        localStorage.setItem('xtreme_agenda_citas', JSON.stringify(nuevas));
    };

    const abrirModalParaDia = (dia: number) => {
        setDiaSeleccionado(dia);
        setModalAbierto(true);
    };

    const registrarModificacionAuditoria = (accion: string) => {
        const rawUser = localStorage.getItem('xtreme_usuario_actual');
        let nombreUsuario = 'Admin Principal';
        let rolUsuario = 'Administrador';
        if (rawUser) {
        try {
            const u = JSON.parse(rawUser);
            nombreUsuario = u.nombre;
            rolUsuario = u.rol;
        } catch {}
        }

        const logsGuardados = localStorage.getItem('xtreme_logs_auditoria') || '[]';
        try {
        const lista = JSON.parse(logsGuardados);
        const nuevoLog = {
            id: Date.now().toString(),
            usuario: nombreUsuario,
            rol: rolUsuario,
            accion: accion,
            fecha: new Date().toLocaleString()
        };
        localStorage.setItem('xtreme_logs_auditoria', JSON.stringify([nuevoLog, ...lista]));
        } catch (e) {
        console.error(e);
        }
    };

    const handleCrearCita = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cliente) return;

        const nuevaCita: Cita = {
        id: Date.now().toString(),
        dia: diaSeleccionado,
        mesAnio: mesSeleccionado,
        cliente,
        servicio,
        hora,
        estado: 'Programada'
        };

        const actualizadas = [...citas, nuevaCita];
        guardarEnStorage(actualizadas);
        registrarModificacionAuditoria(`Agendó cita para ${cliente} el día ${diaSeleccionado} de ${mesSeleccionado}`);
        
        setCliente('');
        setModalAbierto(false);
    };

    const cambiarEstadoCita = (id: string, nuevoEstado: 'Programada' | 'Completada' | 'Cancelada') => {
        const actualizadas = citas.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c);
        guardarEnStorage(actualizadas);
        registrarModificacionAuditoria(`Cambió estado de cita #${id} a ${nuevoEstado}`);
    };

    const eliminarCita = (id: string) => {
        if (confirm('¿Eliminar esta cita de la agenda?')) {
        const filtradas = citas.filter(c => c.id !== id);
        guardarEnStorage(filtradas);
        registrarModificacionAuditoria(`Eliminó la cita #${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans relative">
        
        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Logística y Operaciones
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">📅 Agenda y Calendario Profesional</h1>
            <p className="text-xs sm:text-sm text-slate-400">Control de servicios a domicilio en Villavicencio y alrededores.</p>
            </div>
            <Link href="/admin" className="w-full sm:w-auto text-center px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl transition-all shadow-lg">
            ← Volver al Dashboard
            </Link>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="bg-[#09261d] border border-[#c5a059]/30 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
            
            {/* SELECTOR DE MESES Y UBICACIÓN */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#c5a059]/20 pb-4 gap-3">
            <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 font-bold uppercase">Mes:</span>
                <select 
                className="bg-[#051610] border border-[#c5a059]/40 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#c5a059]"
                value={mesSeleccionado}
                onChange={e => setMesSeleccionado(e.target.value)}
                >
                {mesesDisponibles.map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
                </select>
            </div>
            <span className="px-3 py-1 bg-[#051610] border border-[#c5a059]/30 text-[11px] sm:text-xs font-bold text-[#e6ca84] rounded-xl">
                📍 Villavicencio, Meta
            </span>
            </div>

            {/* CABECERA DÍAS */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center font-bold text-[10px] sm:text-[11px] text-[#e6ca84] uppercase tracking-wider">
            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
            </div>

            {/* GRILLA DE DÍAS ADAPTABLE */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {diasMes.map((dia) => {
                const citasDelDia = citas.filter(c => c.dia === dia && c.mesAnio === mesSeleccionado);
                const tieneCitas = citasDelDia.length > 0;

                return (
                <div 
                    key={dia} 
                    onClick={() => abrirModalParaDia(dia)}
                    className={`min-h-[80px] sm:min-h-[110px] p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group ${
                    tieneCitas 
                        ? 'bg-[#051610] border-[#c5a059] shadow-lg ring-1 ring-[#c5a059]/30' 
                        : 'bg-[#051610]/60 border-[#c5a059]/10 hover:border-[#c5a059]/40'
                    }`}
                >
                    <div className="flex justify-between items-center">
                    <span className={`text-[11px] sm:text-xs font-bold ${tieneCitas ? 'text-[#e6ca84]' : 'text-slate-400'}`}>
                        {dia}
                    </span>
                    <span className="text-[10px] text-[#e6ca84] hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity font-bold">+ Agendar</span>
                    </div>

                    {tieneCitas && (
                    <div className="space-y-1 mt-1">
                        <div className="px-1.5 py-1 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 rounded-lg text-[9px] sm:text-[10px] font-black shadow-md text-center truncate">
                        📌 {citasDelDia.length} Servicio{citasDelDia.length > 1 ? 's' : ''}
                        </div>
                    </div>
                    )}
                </div>
                );
            })}
            </div>

        </div>

        {/* MODAL INTELIGENTE DE CITAS */}
        {modalAbierto && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#09261d] border border-[#c5a059]/40 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-white relative my-auto">
                
                <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-4">
                <div>
                    <span className="text-[10px] text-[#e6ca84] font-bold uppercase tracking-wider">Agenda Diaria</span>
                    <h3 className="text-lg sm:text-xl font-black">Día {diaSeleccionado} de {mesSeleccionado}</h3>
                </div>
                <button onClick={() => setModalAbierto(false)} className="w-8 h-8 rounded-full bg-[#051610] border border-[#c5a059]/30 text-slate-300 hover:text-white flex items-center justify-center font-bold">✕</button>
                </div>

                {/* LISTA DE CITAS DEL DÍA */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Servicios Programados:</h4>
                {citas.filter(c => c.dia === diaSeleccionado && c.mesAnio === mesSeleccionado).length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No hay servicios agendados para este día.</p>
                ) : (
                    citas.filter(c => c.dia === diaSeleccionado && c.mesAnio === mesSeleccionado).map(cita => (
                    <div key={cita.id} className="p-3 bg-[#051610] border border-[#c5a059]/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                        <h5 className="font-bold text-xs text-white">{cita.cliente} <span className="text-[#e6ca84] font-mono">({cita.hora})</span></h5>
                        <p className="text-[11px] text-slate-300">{cita.servicio}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            cita.estado === 'Completada' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                            {cita.estado}
                        </span>
                        </div>
                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-end">
                        <button onClick={() => cambiarEstadoCita(cita.id, 'Completada')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl cursor-pointer">Completar</button>
                        <button onClick={() => eliminarCita(cita.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-xl cursor-pointer">Eliminar</button>
                        </div>
                    </div>
                    ))
                )}
                </div>

                {/* FORMULARIO AGREGAR CITA */}
                <form onSubmit={handleCrearCita} className="pt-4 border-t border-[#c5a059]/20 space-y-3">
                <h4 className="text-xs font-bold text-[#e6ca84] uppercase">Programar Nuevo Servicio</h4>
                <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Nombre del Cliente</label>
                    <input type="text" required placeholder="Ej. Carlos Mendoza" className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#c5a059]" value={cliente} onChange={e => setCliente(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Servicio / Variante</label>
                    <input type="text" required placeholder="Lavado de Sala" className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#c5a059]" value={servicio} onChange={e => setServicio(e.target.value)} />
                    </div>
                    <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Hora de Visita</label>
                    <input type="text" required placeholder="10:00 AM" className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#c5a059]" value={hora} onChange={e => setHora(e.target.value)} />
                    </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl text-xs cursor-pointer hover:brightness-110 shadow-lg">
                    Agendar Cita en el Calendario
                </button>
                </form>

            </div>
            </div>
        )}

        </div>
    );
}