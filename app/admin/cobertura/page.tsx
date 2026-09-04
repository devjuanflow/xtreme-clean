'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerMunicipios, guardarMunicipios, MunicipioCobertura } from '@/app/services';

export default function GestionCoberturaPage() {
    const [municipios, setMunicipios] = useState<MunicipioCobertura[]>([]);
    const [nombre, setNombre] = useState('');
    const [recargo, setRecargo] = useState('');
    const [tipo, setTipo] = useState<'municipio' | 'barrio'>('municipio');
    
    // Filtros y búsqueda
    const [filtroTipo, setFiltroTipo] = useState<'todos' | 'municipio' | 'barrio'>('todos');
    const [busqueda, setBusqueda] = useState('');
    
    // Estado de edición
    const [idEditando, setIdEditando] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        setMunicipios(obtenerMunicipios());
    }, []);

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre) return;

        const recargoNum = parseFloat(recargo) || 0;

        if (idEditando) {
        const actualizados = municipios.map(m => m.id === idEditando ? {
            ...m,
            nombre,
            recargo: recargoNum,
            tipo
        } : m);

        guardarMunicipios(actualizados);
        setMunicipios(actualizados);
        setIdEditando(null);
        } else {
        const nuevo: MunicipioCobertura = {
            id: Date.now().toString(),
            nombre,
            recargo: recargoNum,
            activo: true,
            tipo
        };

        const actualizados = [...municipios, nuevo];
        guardarMunicipios(actualizados);
        setMunicipios(actualizados);
        }

        setNombre('');
        setRecargo('');
        setTipo('municipio');
        setMensajeExito(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setMensajeExito(false), 3000);
    };

    const iniciarEdicion = (item: MunicipioCobertura) => {
        setIdEditando(item.id);
        setNombre(item.nombre);
        setRecargo(item.recargo.toString());
        setTipo(item.tipo || 'municipio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggle = (id: string) => {
        const actualizados = municipios.map(m => m.id === id ? { ...m, activo: !m.activo } : m);
        guardarMunicipios(actualizados);
        setMunicipios(actualizados);
    };

    const handleEliminar = (id: string, nombreZona: string) => {
        if (confirm(`¿Estás seguro de eliminar "${nombreZona}"?`)) {
        const actualizados = municipios.filter(m => m.id !== id);
        guardarMunicipios(actualizados);
        setMunicipios(actualizados);
        }
    };

    // Filtrado de zonas
    const zonasFiltradas = municipios.filter(m => {
        const cumpleTipo = filtroTipo === 'todos' || m.tipo === filtroTipo;
        const cumpleBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return cumpleTipo && cumpleBusqueda;
    });

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Logística & Zonas
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">📍 Gestión de Cobertura, Municipios y Barrios</h1>
            <p className="text-xs sm:text-sm text-slate-400">Configura los municipios principales y los barrios específicos con sus recargos de domicilio.</p>
            </div>
            <Link href="/admin" className="px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl shadow-lg transition-all">
            ← Volver al Dashboard
            </Link>
        </div>

        {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            ¡Zona o barrio guardado y sincronizado con el cotizador web!
            </div>
        )}

        {/* CONTENEDOR EN GRILLA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FORMULARIO */}
            <div className="lg:col-span-5 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-[#c5a059]/20 pb-2">
                <h3 className="font-bold text-base text-[#e6ca84]">
                {idEditando ? '✏️ Editar Zona o Barrio' : '➕ Agregar Municipio o Barrio'}
                </h3>
                {idEditando && (
                <button 
                    onClick={() => { setIdEditando(null); setNombre(''); setRecargo(''); setTipo('municipio'); }} 
                    className="text-[11px] text-red-400 hover:underline"
                >
                    Cancelar
                </button>
                )}
            </div>

            <form onSubmit={handleGuardar} className="space-y-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tipo de Zona</label>
                <select 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                    value={tipo} 
                    onChange={e => setTipo(e.target.value as 'municipio' | 'barrio')}
                >
                    <option value="municipio">🏙️ Municipio Principal</option>
                    <option value="barrio">🏠 Barrio / Sector Específico</option>
                </select>
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre (Ej. Villavicencio, Restrepo, Barzal...)</label>
                <input 
                    type="text" 
                    required 
                    placeholder="Nombre de la zona" 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                />
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Recargo por Traslado (COP)</label>
                <input 
                    type="number" 
                    placeholder="Ej. 20000 (0 si es gratis)" 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none font-mono" 
                    value={recargo} 
                    onChange={e => setRecargo(e.target.value)} 
                />
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl text-xs shadow-xl cursor-pointer hover:brightness-110 transition-all">
                {idEditando ? 'Actualizar Zona 💾' : 'Guardar Zona / Barrio 🚀'}
                </button>
            </form>
            </div>

            {/* LISTADO CON FILTROS Y BÚSQUEDA */}
            <div className="lg:col-span-7 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#c5a059]/20 pb-3">
                <h3 className="font-bold text-base text-[#e6ca84]">
                Zonas Registradas ({zonasFiltradas.length})
                </h3>
                
                {/* PESTAÑAS DE FILTRO */}
                <div className="flex bg-[#051610] p-1 rounded-xl border border-[#c5a059]/20">
                <button 
                    onClick={() => setFiltroTipo('todos')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${filtroTipo === 'todos' ? 'bg-[#c5a059] text-slate-950' : 'text-slate-300'}`}
                >
                    Todos
                </button>
                <button 
                    onClick={() => setFiltroTipo('municipio')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${filtroTipo === 'municipio' ? 'bg-[#c5a059] text-slate-950' : 'text-slate-300'}`}
                >
                    Municipios
                </button>
                <button 
                    onClick={() => setFiltroTipo('barrio')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${filtroTipo === 'barrio' ? 'bg-[#c5a059] text-slate-950' : 'text-slate-300'}`}
                >
                    Barrios
                </button>
                </div>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div>
                <input 
                type="text"
                placeholder="🔍 Buscar barrio o municipio..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-xs text-white focus:outline-none"
                />
            </div>

            {/* LISTA */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {zonasFiltradas.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">No se encontraron zonas o barrios registrados.</p>
                ) : (
                zonasFiltradas.map(m => (
                    <div key={m.id} className="p-4 bg-[#051610] border border-[#c5a059]/20 rounded-2xl flex justify-between items-center gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            m.tipo === 'municipio' 
                            ? 'bg-[#c5a059]/20 text-[#e6ca84] border border-[#c5a059]/40' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                            {m.tipo === 'municipio' ? '🏙️ MUNICIPIO' : '🏠 BARRIO'}
                        </span>
                        <h4 className="font-bold text-white text-sm">{m.nombre}</h4>
                        </div>
                        <p className="text-xs text-[#e6ca84] font-mono mt-1">Recargo: ${m.recargo.toLocaleString()} COP</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                        onClick={() => handleToggle(m.id)} 
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-xl cursor-pointer transition-all ${
                            m.activo 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                        >
                        {m.activo ? 'Activo' : 'Inactivo'}
                        </button>

                        <button 
                        onClick={() => iniciarEdicion(m)} 
                        className="px-2.5 py-1 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/40 text-[#e6ca84] text-[11px] font-bold rounded-xl cursor-pointer"
                        >
                        Editar
                        </button>

                        <button 
                        onClick={() => handleEliminar(m.id, m.nombre)} 
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