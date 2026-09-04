'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerAsesores, guardarAsesores, AsesorWhatsApp } from '@/app/services';

export default function GestionAsesoresPage() {
    const [asesores, setAsesores] = useState<AsesorWhatsApp[]>([]);
    const [nombre, setNombre] = useState('');
    const [cargo, setCargo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [idEditando, setIdEditando] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        setAsesores(obtenerAsesores());
    }, []);

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !telefono) return;

        if (idEditando) {
        const actualizados = asesores.map(a => a.id === idEditando ? { ...a, nombre, cargo, telefono } : a);
        guardarAsesores(actualizados);
        setAsesores(actualizados);
        setIdEditando(null);
        } else {
        const nuevo: AsesorWhatsApp = {
            id: Date.now().toString(),
            nombre,
            cargo: cargo || 'Asesor Comercial',
            telefono
        };
        const actualizados = [...asesores, nuevo];
        guardarAsesores(actualizados);
        setAsesores(actualizados);
        }

        setNombre('');
        setCargo('');
        setTelefono('');
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
    };

    const handleEliminar = (id: string, nombreAsesor: string) => {
        if (confirm(`¿Estás seguro de eliminar al asesor "${nombreAsesor}"?`)) {
        const actualizados = asesores.filter(a => a.id !== id);
        guardarAsesores(actualizados);
        setAsesores(actualizados);
        }
    };

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans">
        <div className="flex justify-between items-center mb-8 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase">Atención al Cliente</span>
            <h1 className="text-2xl font-black text-white mt-2">💬 Gestión de Asesores de WhatsApp</h1>
            <p className="text-xs text-slate-400">Configura los nombres y números de los asesores que aparecerán en la ventana de chat.</p>
            </div>
            <Link href="/admin" className="px-5 py-2.5 bg-[#09261d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl">← Volver al Dashboard</Link>
        </div>

        {mensajeExito && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl">¡Asesor guardado con éxito!</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleGuardar} className="lg:col-span-5 bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-2">
                <h3 className="font-bold text-base text-[#e6ca84]">{idEditando ? '✏️ Editar Asesor' : '➕ Agregar Asesor'}</h3>
                {idEditando && <button type="button" onClick={() => { setIdEditando(null); setNombre(''); setCargo(''); setTelefono(''); }} className="text-xs text-red-400 underline">Cancelar</button>}
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre</label>
                <input type="text" required placeholder="Ej. Laura Gómez" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs" value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Cargo / Zona</label>
                <input type="text" placeholder="Ej. Asesor Comercial Villavicencio" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs" value={cargo} onChange={e => setCargo(e.target.value)} />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Teléfono WhatsApp (Ej. 573001234567)</label>
                <input type="text" required placeholder="573001234567" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs font-mono" value={telefono} onChange={e => setTelefono(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-black rounded-xl text-xs shadow-lg">Guardar Asesor 🚀</button>
            </form>

            <div className="lg:col-span-7 bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-[#e6ca84] border-b border-[#c5a059]/20 pb-2">Asesores Activos ({asesores.length})</h3>
            <div className="space-y-3">
                {asesores.map(a => (
                <div key={a.id} className="p-4 bg-[#051610] border border-[#c5a059]/20 rounded-2xl flex justify-between items-center">
                    <div>
                    <h4 className="font-bold text-white text-sm">{a.nombre}</h4>
                    <p className="text-xs text-[#e6ca84]">{a.cargo}</p>
                    <p className="text-[11px] text-slate-400 font-mono">📱 +{a.telefono}</p>
                    </div>
                    <div className="flex gap-2">
                    <button onClick={() => { setIdEditando(a.id); setNombre(a.nombre); setCargo(a.cargo); setTelefono(a.telefono); }} className="px-3 py-1 bg-[#09261d] border border-[#c5a059]/40 text-[#e6ca84] text-xs font-bold rounded-xl">Editar</button>
                    <button onClick={() => handleEliminar(a.id, a.nombre)} className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-bold rounded-xl">Eliminar</button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
}