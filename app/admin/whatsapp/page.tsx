'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WhatsAppBotPage() {
    const [numero, setNumero] = useState('+57 300 123 4567');
    const [mensaje, setMensaje] = useState('¡Hola! Bienvenido a Xtreme Clean. ¿En qué servicio de limpieza profunda podemos ayudarte hoy?');
    const [activo, setActivo] = useState(true);
    const [modoIA, setModoIA] = useState(true);
    const [tonoIA, setTonoIA] = useState<'comercial' | 'tecnico' | 'amigable'>('comercial');
    const [mensajeExito, setMensajeExito] = useState(false);
    
    // Métricas simuladas del bot en tiempo real
    const [estadisticas, setEstadisticas] = useState({
        mensajesAtendidos: 142,
        citasGeneradas: 38,
        tasaConversion: '26.7%'
    });

    useEffect(() => {
        const configGuardada = localStorage.getItem('xtreme_whatsapp_config');
        if (configGuardada) {
        try {
            const parsed = JSON.parse(configGuardada);
            if (parsed.numero) setNumero(parsed.numero);
            if (parsed.mensaje) setMensaje(parsed.mensaje);
            if (typeof parsed.activo === 'boolean') setActivo(parsed.activo);
            if (typeof parsed.modoIA === 'boolean') setModoIA(parsed.modoIA);
            if (parsed.tonoIA) setTonoIA(parsed.tonoIA);
        } catch {}
        }
    }, []);

    const registrarAuditoria = (accion: string) => {
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
        } catch {}
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const config = { numero, mensaje, activo, modoIA, tonoIA };
        localStorage.setItem('xtreme_whatsapp_config', JSON.stringify(config));
        registrarAuditoria('Actualizó la configuración avanzada del Bot de WhatsApp e IA');
        
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
    };

    const generarPromoConIA = () => {
        const promos = [
        '¡Hola! 🌟 Aprovecha nuestro combo especial de fin de semana en Villavicencio: Limpieza profunda de Sala + Colchón con 15% de descuento. ¿Te gustaría agendar?',
        '¡Hola! 🛋️ Renueva tus espacios hoy. En Xtreme Clean eliminamos ácaros y manchas difíciles con tecnología eco-friendly. ¿Qué servicio deseas cotizar?',
        '¡Hola! ⚡ ¡Promoción flash activa! Agenda tu lavado de alfombras o muebles hoy y recibe desinfección UV totalmente gratis. ¿Escribes desde Villavicencio?'
        ];
        const randomPromo = promos[Math.floor(Math.random() * promos.length)];
        setMensaje(randomPromo);
    };

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans">
        
        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Automatización Comercial Enterprise
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">🤖 WhatsApp Bot & IA Avanzada</h1>
            <p className="text-xs sm:text-sm text-slate-400">Control de flujos, tonos de respuesta y métricas de conversión comercial.</p>
            </div>
            <Link href="/admin" className="w-full sm:w-auto text-center px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl transition-all shadow-lg">
            ← Volver al Dashboard
            </Link>
        </div>

        {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ¡Configuración avanzada guardada y sincronizada con éxito!
            </div>
        )}

        {/* MÉTRICAS DEL BOT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Mensajes Atendidos</p>
                <h4 className="text-2xl font-black text-white mt-1">{estadisticas.mensajesAtendidos}</h4>
            </div>
            <span className="text-2xl">💬</span>
            </div>
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Citas Generadas</p>
                <h4 className="text-2xl font-black text-[#e6ca84] mt-1">{estadisticas.citasGeneradas}</h4>
            </div>
            <span className="text-2xl">📅</span>
            </div>
            <div className="bg-[#09261d] border border-[#c5a059]/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Tasa de Conversión</p>
                <h4 className="text-2xl font-black text-emerald-400 mt-1">{estadisticas.tasaConversion}</h4>
            </div>
            <span className="text-2xl">📈</span>
            </div>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FORMULARIO */}
            <div className="lg:col-span-7 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#051610] border border-[#c5a059]/30 rounded-2xl flex items-center justify-between">
                    <div>
                    <h3 className="text-xs font-bold text-white uppercase">Estado del Bot</h3>
                    <p className="text-[10px] text-slate-400">Automatización general</p>
                    </div>
                    <button
                    type="button"
                    onClick={() => setActivo(!activo)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        activo ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                    >
                    {activo ? '● Activo' : '○ Pausado'}
                    </button>
                </div>

                <div className="p-4 bg-[#051610] border border-[#c5a059]/30 rounded-2xl flex items-center justify-between">
                    <div>
                    <h3 className="text-xs font-bold text-white uppercase">Asistente IA</h3>
                    <p className="text-[10px] text-slate-400">Respuestas inteligentes</p>
                    </div>
                    <button
                    type="button"
                    onClick={() => setModoIA(!modoIA)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        modoIA ? 'bg-[#c5a059]/20 text-[#e6ca84] border-[#c5a059]/40' : 'bg-slate-700/20 text-slate-400 border-slate-600/40'
                    }`}
                    >
                    {modoIA ? '✦ IA Activa' : '○ Estándar'}
                    </button>
                </div>
                </div>

                <div>
                <label className="block text-xs font-bold text-[#e6ca84] uppercase tracking-wider mb-2">
                    Número de WhatsApp Business Conectado
                </label>
                <input 
                    type="text" 
                    required 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-sm focus:border-[#c5a059] focus:outline-none font-mono"
                    value={numero} 
                    onChange={e => setNumero(e.target.value)} 
                />
                </div>

                {modoIA && (
                <div>
                    <label className="block text-xs font-bold text-[#e6ca84] uppercase tracking-wider mb-2">
                    Tono de Comunicación de la IA
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                    {(['comercial', 'tecnico', 'amigable'] as const).map(t => (
                        <button
                        type="button"
                        key={t}
                        onClick={() => setTonoIA(t)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                            tonoIA === t 
                            ? 'bg-[#c5a059] text-slate-950 border-[#e6ca84] shadow-md' 
                            : 'bg-[#051610] text-slate-300 border-[#c5a059]/20 hover:border-[#c5a059]/50'
                        }`}
                        >
                        {t}
                        </button>
                    ))}
                    </div>
                </div>
                )}

                <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-[#e6ca84] uppercase tracking-wider">
                    Mensaje de Bienvenida / Prompt Base
                    </label>
                    <button 
                    type="button" 
                    onClick={generarPromoConIA} 
                    className="px-3 py-1 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 text-[10px] font-extrabold rounded-lg shadow cursor-pointer hover:brightness-110"
                    >
                    ✨ Generar Promo con IA
                    </button>
                </div>
                <textarea 
                    rows={4} 
                    required 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-sm focus:border-[#c5a059] focus:outline-none leading-relaxed"
                    value={mensaje} 
                    onChange={e => setMensaje(e.target.value)} 
                />
                </div>

                <button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl shadow-lg cursor-pointer hover:brightness-110 transition-all text-sm"
                >
                Guardar Configuración Definitiva 🚀
                </button>
            </form>
            </div>

            {/* SIMULADOR DE CHAT EN VIVO */}
            <div className="lg:col-span-5 bg-[#09261d] border border-[#c5a059]/30 p-6 rounded-3xl shadow-2xl flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-3 mb-4">
                <span className="text-xs font-bold text-[#e6ca84] uppercase">📱 Simulador Interactivo WhatsApp</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">En Línea</span>
                </div>

                <div className="bg-[#051610] border border-[#c5a059]/20 rounded-2xl p-4 space-y-3 min-h-[320px] shadow-inner flex flex-col justify-end">
                <div className="bg-[#0f2e24] p-3 rounded-2xl rounded-tl-sm text-xs text-slate-200 max-w-[85%] border border-[#c5a059]/10 shadow-sm">
                    <p className="font-bold text-[#e6ca84] mb-1">Xtreme Clean Bot ({tonoIA.toUpperCase()})</p>
                    {mensaje}
                </div>

                <div className="bg-[#1b4332] p-3 rounded-2xl rounded-tr-sm text-xs text-white max-w-[80%] self-end shadow-sm">
                    Hola, ¿cuánto cuesta lavar una sala de 3 puestos en Villavicencio?
                </div>

                <div className="bg-[#0f2e24] p-3 rounded-2xl rounded-tl-sm text-xs text-slate-200 max-w-[85%] border border-[#c5a059]/10 shadow-sm animate-fadeIn">
                    <p className="font-bold text-[#e6ca84] mb-1">Xtreme Clean Bot ({tonoIA.toUpperCase()})</p>
                    {tonoIA === 'tecnico' 
                    ? 'Estimado cliente, el servicio de lavado para sala de 3 puestos utiliza extracción mecánica profunda y desinfección contra ácaros por $105.000 COP. Procedemos a agendar?'
                    : '¡Hola! Claro que sí, el lavado de sala de 3 puestos vale $105.000 COP e incluye desinfección profunda a domicilio sin costo en Villavicencio. ¿Te agendamos hoy?'}
                </div>
                </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4">
                El bot utiliza este motor inteligente para responder automáticamente a las solicitudes de tus clientes en WhatsApp.
            </p>
            </div>

        </div>
        </div>
    );
}