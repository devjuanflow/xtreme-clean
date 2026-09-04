'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerConfigWeb, guardarConfigWeb, configInicial, ConfigWeb } from '@/app/services';

export default function EditorCMSPage() {
    const [config, setConfig] = useState<ConfigWeb>(configInicial);
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        setConfig(obtenerConfigWeb());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const nuevaConfig = { ...config, [name]: value };
        setConfig(nuevaConfig);
        
        // Sincronización instantánea en tiempo real
        guardarConfigWeb(nuevaConfig);
        if (typeof window !== 'undefined') {
        window.postMessage({ type: 'ACTUALIZAR_CONFIG_INSTANTANEA', config: nuevaConfig }, '*');
        }
    };

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        guardarConfigWeb(config);
        setMensajeExito(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setMensajeExito(false), 3500);
    };

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                CMS Corporativo
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">⚙️ Editor Web Avanzado & Tiempo Real</h1>
            <p className="text-xs sm:text-sm text-slate-400">Personaliza textos, logotipos, imágenes de la galería y contactos con actualización instantánea.</p>
            </div>
            <Link href="/admin" className="px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl shadow-lg transition-all">
            ← Volver al Dashboard
            </Link>
        </div>

        {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            ¡Configuración guardada y sincronizada correctamente en el sistema!
            </div>
        )}

        <form onSubmit={handleGuardar} className="space-y-8 max-w-4xl mx-auto pb-12">
            
            {/* SECCIÓN DE GESTIÓN DE IMÁGENES (GALERÍA ANTES Y DESPUÉS) */}
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="font-bold text-base text-[#e6ca84] border-b border-[#c5a059]/20 pb-2">🖼️ Imágenes de la Galería (Antes y Después)</h3>
            
            <div className="space-y-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">URL Imagen ANTES (Mueble Sucio)</label>
                <input type="text" name="imagenAntesUrl" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs font-mono focus:outline-none" value={config.imagenAntesUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">URL Imagen DESPUÉS (Mueble Limpio)</label>
                <input type="text" name="imagenDespuesUrl" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs font-mono focus:outline-none" value={config.imagenDespuesUrl} onChange={handleChange} placeholder="https://..." />
                </div>
            </div>
            </div>

            {/* SECCIÓN IDENTIDAD, LOGO Y CONTACTO */}
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="font-bold text-base text-[#e6ca84] border-b border-[#c5a059]/20 pb-2">🏢 Identidad, Logotipo y Contacto</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre Empresa</label>
                <input type="text" name="nombreEmpresa" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.nombreEmpresa} onChange={handleChange} />
                </div>
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subtítulo / Lema de Empresa</label>
                <input type="text" name="subtituloEmpresa" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.subtituloEmpresa} onChange={handleChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tipo de Logotipo</label>
                <select name="logoTipo" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.logoTipo} onChange={handleChange}>
                    <option value="texto">Texto / Iniciales (Ej. XC)</option>
                    <option value="imagen">Imagen URL</option>
                </select>
                </div>
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Texto o Iniciales del Logo (`logoTexto`)</label>
                <input type="text" name="logoTexto" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none font-mono" value={config.logoTexto} onChange={handleChange} />
                </div>
            </div>

            {config.logoTipo === 'imagen' && (
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">URL de la Imagen del Logo</label>
                <input type="text" name="logoImagenUrl" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs font-mono focus:outline-none" value={config.logoImagenUrl} onChange={handleChange} placeholder="https://..." />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Teléfono WhatsApp (Ej. 573001234567)</label>
                <input type="text" name="telefonoContacto" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs font-mono focus:outline-none" value={config.telefonoContacto} onChange={handleChange} />
                </div>
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Correo de Contacto</label>
                <input type="text" name="emailContacto" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.emailContacto} onChange={handleChange} />
                </div>
            </div>
            </div>

            {/* SECCIÓN HERO PRINCIPAL */}
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="font-bold text-base text-[#e6ca84] border-b border-[#c5a059]/20 pb-2">✨ Sección Principal (Hero)</h3>
            
            <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Título Principal (Hero)</label>
                <input type="text" name="tituloHero" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.tituloHero} onChange={handleChange} />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subtítulo Principal (Hero)</label>
                <textarea name="subtituloHero" rows={3} className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.subtituloHero} onChange={handleChange} />
            </div>
            </div>

            {/* SECCIÓN FOOTER Y HORARIOS */}
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="font-bold text-base text-[#e6ca84] border-b border-[#c5a059]/20 pb-2">🕒 Horarios y Pie de Página</h3>
            
            <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Horario de Atención</label>
                <input type="text" name="horario" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.horario} onChange={handleChange} />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Texto del Footer</label>
                <input type="text" name="textoFooter" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" value={config.textoFooter} onChange={handleChange} />
            </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-black rounded-2xl text-sm shadow-2xl cursor-pointer hover:brightness-110 transition-all">
            Guardar Cambios Definitivos 🚀
            </button>

        </form>
        </div>
    );
}