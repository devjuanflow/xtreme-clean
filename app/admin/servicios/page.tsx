'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerServicios, guardarServicios, Servicio, SubopcionServicio } from '@/app/services';

export default function GestionServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [nombre, setNombre] = useState('');
    const [precioBase, setPrecioBase] = useState('');
    const [descripcion, setDescripcion] = useState('');
    
    // Estado para variantes / subtipos
    const [variantes, setVariantes] = useState<SubopcionServicio[]>([]);
    const [nombreVar, setNombreVar] = useState('');
    const [ajusteVar, setAjusteVar] = useState('');

    const [idEditando, setIdEditando] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        setServicios(obtenerServicios());
    }, []);

    const agregarVariante = () => {
        if (!nombreVar) return;
        const ajusteNum = parseFloat(ajusteVar) || 0;
        setVariantes([...variantes, { nombre: nombreVar, ajuste: ajusteNum }]);
        setNombreVar('');
        setAjusteVar('');
    };

    const eliminarVariante = (index: number) => {
        setVariantes(variantes.filter((_, i) => i !== index));
    };

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !precioBase) return;

        const baseNum = parseFloat(precioBase) || 0;

        if (idEditando) {
        const actualizados = servicios.map(s => s.id === idEditando ? {
            ...s,
            nombre,
            precioBase: baseNum,
            descripcion,
            variantes
        } : s);

        guardarServicios(actualizados);
        setServicios(actualizados);
        setIdEditando(null);
        } else {
        const nuevoServicio: Servicio = {
            id: Date.now().toString(),
            nombre,
            precioBase: baseNum,
            descripcion,
            variantes
        };

        const actualizados = [...servicios, nuevoServicio];
        guardarServicios(actualizados);
        setServicios(actualizados);
        }

        setNombre('');
        setPrecioBase('');
        setDescripcion('');
        setVariantes([]);
        setMensajeExito(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setMensajeExito(false), 3500);
    };

    const iniciarEdicion = (s: Servicio) => {
        setIdEditando(s.id);
        setNombre(s.nombre);
        setPrecioBase(s.precioBase.toString());
        setDescripcion(s.descripcion);
        setVariantes(s.variantes || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEliminar = (id: string, nombreServicio: string) => {
        if (confirm(`¿Estás seguro de eliminar el servicio "${nombreServicio}"?`)) {
        const actualizados = servicios.filter(s => s.id !== id);
        guardarServicios(actualizados);
        setServicios(actualizados);
        }
    };

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Catálogo & Cotizador
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">🛠️ Gestión de Servicios y Subtipos</h1>
            <p className="text-xs sm:text-sm text-slate-400">Configura los servicios de limpieza, precios base y variantes o tamaños que verá el cliente.</p>
            </div>
            <Link href="/admin" className="px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl shadow-lg transition-all">
            ← Volver al Dashboard
            </Link>
        </div>

        {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            ¡Servicio guardado y sincronizado con el cotizador web en tiempo real!
            </div>
        )}

        {/* CONTENEDOR EN GRILLA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FORMULARIO */}
            <div className="lg:col-span-6 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-2">
                <h3 className="font-bold text-base text-[#e6ca84]">
                {idEditando ? '✏️ Editar Servicio' : '➕ Crear Nuevo Servicio'}
                </h3>
                {idEditando && (
                <button 
                    onClick={() => { setIdEditando(null); setNombre(''); setPrecioBase(''); setDescripcion(''); setVariantes([]); }} 
                    className="text-[11px] text-red-400 hover:underline"
                >
                    Cancelar
                </button>
                )}
            </div>

            <form onSubmit={handleGuardar} className="space-y-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre del Servicio</label>
                <input 
                    type="text" 
                    required 
                    placeholder="Ej. Limpieza de Colchón o Sala" 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                />
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Precio Base (COP)</label>
                <input 
                    type="number" 
                    required 
                    placeholder="Ej. 70000" 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none font-mono" 
                    value={precioBase} 
                    onChange={e => setPrecioBase(e.target.value)} 
                />
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Descripción Breve</label>
                <textarea 
                    rows={2}
                    placeholder="Ej. Desinfección UV y extracción de ácaros..." 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                />
                </div>

                {/* GESTIÓN DE VARIANTES / SUBTIPOS */}
                <div className="pt-3 border-t border-[#c5a059]/20 space-y-3">
                <label className="block text-xs font-bold text-[#e6ca84] uppercase tracking-wider">Variantes o Tamaños (Subtipos)</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input 
                    type="text" 
                    placeholder="Nombre variante (Ej. King Size)" 
                    className="sm:col-span-6 p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                    value={nombreVar} 
                    onChange={e => setNombreVar(e.target.value)} 
                    />
                    <input 
                    type="number" 
                    placeholder="Ajuste (+/- COP)" 
                    className="sm:col-span-4 p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none font-mono" 
                    value={ajusteVar} 
                    onChange={e => setAjusteVar(e.target.value)} 
                    />
                    <button 
                    type="button" 
                    onClick={agregarVariante} 
                    className="sm:col-span-2 py-3 bg-[#c5a059] text-slate-950 font-black rounded-xl text-xs hover:brightness-110"
                    >
                    + Add
                    </button>
                </div>

                {/* LISTA DE VARIANTES AGREGADAS */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {variantes.map((v, idx) => (
                    <div key={idx} className="p-2.5 bg-[#051610] border border-[#c5a059]/20 rounded-xl flex justify-between items-center text-xs">
                        <div>
                        <span className="font-bold text-white">{v.nombre}</span>
                        <span className="text-[#e6ca84] ml-2 font-mono">({v.ajuste >= 0 ? `+$${v.ajuste.toLocaleString()}` : `-$${Math.abs(v.ajuste).toLocaleString()}`})</span>
                        </div>
                        <button type="button" onClick={() => eliminarVariante(idx)} className="text-red-400 hover:text-red-300 font-bold px-2">✕</button>
                    </div>
                    ))}
                </div>
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl text-xs shadow-xl cursor-pointer hover:brightness-110 transition-all mt-4">
                {idEditando ? 'Actualizar Servicio 💾' : 'Guardar Servicio en el Catálogo 🚀'}
                </button>
            </form>
            </div>

            {/* LISTADO DE SERVICIOS REGISTRADOS */}
            <div className="lg:col-span-6 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[#e6ca84] border-b border-[#c5a059]/20 pb-3">
                Servicios Registrados ({servicios.length})
            </h3>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {servicios.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">No hay servicios registrados en el catálogo.</p>
                ) : (
                servicios.map(s => (
                    <div key={s.id} className="p-4 bg-[#051610] border border-[#c5a059]/20 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                        <h4 className="font-black text-white text-sm">{s.nombre}</h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">{s.descripcion}</p>
                        </div>
                        <div className="text-right">
                        <span className="text-xs font-mono font-black text-[#e6ca84] block">${s.precioBase.toLocaleString()} COP</span>
                        <span className="text-[9px] text-slate-400 uppercase">Precio Base</span>
                        </div>
                    </div>

                    {s.variantes && s.variantes.length > 0 && (
                        <div className="pt-2 border-t border-[#c5a059]/10 space-y-1">
                        <span className="text-[10px] text-[#e6ca84] font-bold uppercase">Variantes / Tamaños:</span>
                        <div className="flex flex-wrap gap-1.5">
                            {s.variantes.map((v, i) => (
                            <span key={i} className="px-2 py-1 bg-[#09261d] border border-[#c5a059]/20 text-slate-200 text-[10px] rounded-lg">
                                {v.nombre} ({v.ajuste >= 0 ? `+$${v.ajuste.toLocaleString()}` : `-$${Math.abs(v.ajuste).toLocaleString()}`})
                            </span>
                            ))}
                        </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#c5a059]/10">
                        <button 
                        onClick={() => iniciarEdicion(s)} 
                        className="px-3 py-1 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/40 text-[#e6ca84] text-[11px] font-bold rounded-xl cursor-pointer"
                        >
                        Editar
                        </button>
                        <button 
                        onClick={() => handleEliminar(s.id, s.nombre)} 
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-[11px] font-bold rounded-xl cursor-pointer"
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