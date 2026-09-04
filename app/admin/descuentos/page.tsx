'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerDescuentos, guardarDescuentos, DescuentoCupon } from '@/app/services';

export default function GestionDescuentosPage() {
    const [descuentos, setDescuentos] = useState<DescuentoCupon[]>([]);
    const [codigo, setCodigo] = useState('');
    const [tipo, setTipo] = useState<'porcentaje' | 'monto_fijo'>('porcentaje');
    const [valor, setValor] = useState('');
    
    const [idEditando, setIdEditando] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        setDescuentos(obtenerDescuentos());
    }, []);

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!codigo || !valor) return;

        const valorNum = parseFloat(valor) || 0;

        if (idEditando) {
        const actualizados = descuentos.map(d => d.id === idEditando ? {
            ...d,
            codigo: codigo.toUpperCase(),
            tipo,
            valor: valorNum
        } : d);

        guardarDescuentos(actualizados);
        setDescuentos(actualizados);
        setIdEditando(null);
        } else {
        const nuevo: DescuentoCupon = {
            id: Date.now().toString(),
            codigo: codigo.toUpperCase(),
            tipo,
            valor: valorNum,
            activo: true
        };

        const actualizados = [...descuentos, nuevo];
        guardarDescuentos(actualizados);
        setDescuentos(actualizados);
        }

        setCodigo('');
        setValor('');
        setTipo('porcentaje');
        setMensajeExito(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setMensajeExito(false), 3500);
    };

    const iniciarEdicion = (d: DescuentoCupon) => {
        setIdEditando(d.id);
        setCodigo(d.codigo);
        setTipo(d.tipo);
        setValor(d.valor.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggle = (id: string) => {
        const actualizados = descuentos.map(d => d.id === id ? { ...d, activo: !d.activo } : d);
        guardarDescuentos(actualizados);
        setDescuentos(actualizados);
    };

    const handleEliminar = (id: string, cod: string) => {
        if (confirm(`¿Estás seguro de eliminar el cupón "${cod}"?`)) {
        const actualizados = descuentos.filter(d => d.id !== id);
        guardarDescuentos(actualizados);
        setDescuentos(actualizados);
        }
    };

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Marketing & Promociones
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">🎟️ Gestión de Descuentos y Cupones</h1>
            <p className="text-xs sm:text-sm text-slate-400">Crea códigos promocionales por porcentaje o monto fijo aplicables en el cotizador web.</p>
            </div>
            <Link href="/admin" className="px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl shadow-lg transition-all">
            ← Volver al Dashboard
            </Link>
        </div>

        {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            ¡Cupón guardado y sincronizado con el cotizador web en tiempo real!
            </div>
        )}

        {/* CONTENEDOR EN GRILLA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FORMULARIO */}
            <div className="lg:col-span-5 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-[#c5a059]/20 pb-2">
                <h3 className="font-bold text-base text-[#e6ca84]">
                {idEditando ? '✏️ Editar Cupón' : '➕ Crear Nuevo Cupón'}
                </h3>
                {idEditando && (
                <button 
                    onClick={() => { setIdEditando(null); setCodigo(''); setValor(''); setTipo('porcentaje'); }} 
                    className="text-[11px] text-red-400 hover:underline"
                >
                    Cancelar
                </button>
                )}
            </div>

            <form onSubmit={handleGuardar} className="space-y-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Código Promocional</label>
                <input 
                    type="text" 
                    required 
                    placeholder="Ej. XTREME20" 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none font-mono uppercase" 
                    value={codigo} 
                    onChange={e => setCodigo(e.target.value)} 
                />
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tipo de Descuento</label>
                <select 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                    value={tipo} 
                    onChange={e => setTipo(e.target.value as 'porcentaje' | 'monto_fijo')}
                >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="monto_fijo">Monto Fijo en Dinero (COP)</option>
                </select>
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    {tipo === 'porcentaje' ? 'Valor del Porcentaje (Ej. 10 para 10%)' : 'Monto de Descuento (Ej. 20000)'}
                </label>
                <input 
                    type="number" 
                    required 
                    placeholder={tipo === 'porcentaje' ? 'Ej. 10' : 'Ej. 20000'} 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none font-mono" 
                    value={valor} 
                    onChange={e => setValor(e.target.value)} 
                />
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl text-xs shadow-xl cursor-pointer hover:brightness-110 transition-all">
                {idEditando ? 'Actualizar Cupón 💾' : 'Guardar Cupón 🚀'}
                </button>
            </form>
            </div>

            {/* LISTADO DE CUPONES */}
            <div className="lg:col-span-7 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[#e6ca84] border-b border-[#c5a059]/20 pb-3">
                Cupones Registrados ({descuentos.length})
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {descuentos.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">No hay cupones de descuento registrados.</p>
                ) : (
                descuentos.map(d => (
                    <div key={d.id} className="p-4 bg-[#051610] border border-[#c5a059]/20 rounded-2xl flex justify-between items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                        <span className="font-black text-white font-mono text-sm tracking-wider bg-[#c5a059]/20 px-2.5 py-0.5 rounded border border-[#c5a059]/40">
                            {d.codigo}
                        </span>
                        <span className="text-xs text-[#e6ca84] font-bold">
                            {d.tipo === 'porcentaje' ? `${d.valor}% de Descuento` : `$${d.valor.toLocaleString()} COP de Descuento`}
                        </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                        onClick={() => handleToggle(d.id)} 
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-xl cursor-pointer transition-all ${
                            d.activo 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                        >
                        {d.activo ? 'Activo' : 'Inactivo'}
                        </button>

                        <button 
                        onClick={() => iniciarEdicion(d)} 
                        className="px-2.5 py-1 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/40 text-[#e6ca84] text-[11px] font-bold rounded-xl cursor-pointer"
                        >
                        Editar
                        </button>

                        <button 
                        onClick={() => handleEliminar(d.id, d.codigo)} 
                        className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-[11px] font-bold rounded-xl cursor-pointer"
                        >
                        Eliminar
                        </button>
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>

        </div>
        </div>
    );
}