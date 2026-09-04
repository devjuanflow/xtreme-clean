'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [intentos, setIntentos] = useState(0);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        const guardados = localStorage.getItem('xtreme_usuarios_sistema');
        let listaUsuarios = [
        { usuario: 'admin', pass: '123456', nombre: 'Admin Principal', rol: 'Administrador', permisos: ['Todo'] },
        { usuario: 'jortiz', pass: '123456', nombre: 'Juan Ortiz', rol: 'Administrador', permisos: ['Todo'] },
        { usuario: 'operador', pass: '123456', nombre: 'Carlos Operador', rol: 'Operador', permisos: ['Cotizaciones', 'Agenda'] }
        ];

        if (guardados) {
        try {
            const parsed = JSON.parse(guardados);
            if (Array.isArray(parsed) && parsed.length > 0) {
            listaUsuarios = parsed.map((u: any) => ({
                usuario: u.usuario,
                pass: u.pass,
                nombre: u.nombre,
                rol: u.rol,
                permisos: u.permisos
            }));
            }
        } catch {}
        }

        const encontrado = listaUsuarios.find(u => u.usuario.trim().toLowerCase() === usuario.trim().toLowerCase() && u.pass === password);

        if (encontrado) {
        localStorage.setItem('xtreme_usuario_actual', JSON.stringify({
            nombre: encontrado.nombre,
            rol: encontrado.rol,
            permisos: encontrado.permisos
        }));

        // Registrar inicio de sesión exitoso en auditoría
        const logsGuardados = localStorage.getItem('xtreme_logs_auditoria') || '[]';
        try {
            const lista = JSON.parse(logsGuardados);
            const nuevoLog = {
            id: Date.now().toString(),
            usuario: encontrado.nombre,
            rol: encontrado.rol,
            accion: 'Inicio de sesión autorizado en el sistema CMS',
            fecha: new Date().toLocaleString()
            };
            localStorage.setItem('xtreme_logs_auditoria', JSON.stringify([nuevoLog, ...lista]));
        } catch {}

        router.push('/admin');
        } else {
        setError(true);
        setIntentos(prev => prev + 1);

        // Registrar intento fallido en auditoría
        const logsGuardados = localStorage.getItem('xtreme_logs_auditoria') || '[]';
        try {
            const lista = JSON.parse(logsGuardados);
            const nuevoLog = {
            id: Date.now().toString(),
            usuario: usuario || 'Desconocido',
            rol: 'Intruso / Fallido',
            accion: `Intento de acceso fallido con usuario: "${usuario}"`,
            fecha: new Date().toLocaleString()
            };
            localStorage.setItem('xtreme_logs_auditoria', JSON.stringify([nuevoLog, ...lista]));
        } catch {}

        setTimeout(() => setError(false), 3500);
        }
    };

    const seleccionarPerfilDemo = (tipo: 'admin' | 'jortiz' | 'operador') => {
        if (tipo === 'admin') {
        setUsuario('admin');
        setPassword('123456');
        } else if (tipo === 'jortiz') {
        setUsuario('jortiz');
        setPassword('123456');
        } else {
        setUsuario('operador');
        setPassword('123456');
        }
    };

    return (
        <div className="min-h-screen bg-[#051610] flex items-center justify-center p-4 text-slate-100 font-sans relative overflow-hidden">
        
        {/* DECORACIÓN LUMINOSA DE FONDO */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#09261d] border border-[#c5a059]/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
            
            {/* INSIGNIA DE SEGURIDAD */}
            <div className="flex justify-between items-center">
            <span className="px-3.5 py-1.5 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                🛡️ Enterprise Secure Access v2.5
            </span>
            {intentos > 0 && (
                <span className="text-[10px] text-amber-400 font-mono">
                Intentos: {intentos}/3
                </span>
            )}
            </div>

            {/* LOGO Y TÍTULO */}
            <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#c5a059] to-[#e6ca84] flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl">
                XC
            </div>
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Acceso Corporativo</h1>
                <p className="text-[11px] text-[#e6ca84] uppercase tracking-wider font-semibold mt-1">
                Xtreme Clean — Sistema de Lavandería
                </p>
            </div>
            </div>

            {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl text-center animate-shake">
                Credenciales incorrectas. El intento fue registrado por seguridad.
            </div>
            )}

            {/* FORMULARIO DE ACCESO */}
            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Usuario del Sistema
                </label>
                <input 
                type="text" 
                required 
                placeholder="admin" 
                className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-sm focus:border-[#c5a059] focus:outline-none font-mono"
                value={usuario} 
                onChange={e => setUsuario(e.target.value)} 
                />
            </div>

            <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Contraseña de Acceso
                </label>
                <input 
                type="password" 
                required 
                placeholder="••••••" 
                className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-sm focus:border-[#c5a059] focus:outline-none font-mono"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                />
            </div>

            <button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] hover:brightness-110 text-slate-950 font-extrabold rounded-xl shadow-xl transition-all cursor-pointer text-sm mt-2"
            >
                Autenticarse en el Sistema 🚀
            </button>
            </form>

            {/* SELECTOR RÁPIDO DE PERFILES */}
            <div className="pt-2 border-t border-[#c5a059]/20 space-y-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider text-center font-bold">Perfiles de Prueba Rápidos:</p>
            <div className="grid grid-cols-3 gap-2">
                <button 
                type="button" 
                onClick={() => seleccionarPerfilDemo('admin')} 
                className="py-2 px-1 bg-[#051610] border border-[#c5a059]/30 hover:border-[#c5a059] text-[#e6ca84] text-[11px] font-bold rounded-xl cursor-pointer transition-all text-center truncate"
                >
                👑 Admin
                </button>
                <button 
                type="button" 
                onClick={() => seleccionarPerfilDemo('jortiz')} 
                className="py-2 px-1 bg-[#051610] border border-[#c5a059]/30 hover:border-[#c5a059] text-[#e6ca84] text-[11px] font-bold rounded-xl cursor-pointer transition-all text-center truncate"
                >
                💼 J. Ortiz
                </button>
                <button 
                type="button" 
                onClick={() => seleccionarPerfilDemo('operador')} 
                className="py-2 px-1 bg-[#051610] border border-[#c5a059]/30 hover:border-[#c5a059] text-slate-300 text-[11px] font-bold rounded-xl cursor-pointer transition-all text-center truncate"
                >
                👤 Operador
                </button>
            </div>
            </div>

            {/* ENLACE DE RETORNO */}
            <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-[#e6ca84] transition-colors font-medium">
                ← Volver al sitio principal
            </Link>
            </div>

        </div>
        </div>
    );
}