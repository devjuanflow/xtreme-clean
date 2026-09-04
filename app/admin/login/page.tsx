'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [intentos, setIntentos] = useState(0);

    // Asegurar perfiles de usuario perfectamente sincronizados al cargar
    useEffect(() => {
        const usuariosBase = [
            { id: '1', nombre: 'Admin Principal', username: 'admin', usuario: 'admin', password: '123456', pass: '123456', rol: 'Administrador', permisos: ['Todo'] },
            { id: '2', nombre: 'Juan Ortiz', username: 'jortiz', usuario: 'jortiz', password: '123456', pass: '123456', rol: 'Administrador', permisos: ['Todo'] },
            { id: '3', nombre: 'Carlos Operador', username: 'operador', usuario: 'operador', password: '123456', pass: '123456', rol: 'Operador', permisos: ['Cotizaciones', 'Agenda'] }
        ];
        localStorage.setItem('xtreme_usuarios_sistema', JSON.stringify(usuariosBase));
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        
        const guardados = localStorage.getItem('xtreme_usuarios_sistema');
        let listaUsuarios = [];
        
        try {
            listaUsuarios = guardados ? JSON.parse(guardados) : [];
        } catch {
            listaUsuarios = [];
        }

        // Si la lista está vacía, metemos los predeterminados por seguridad
        if (listaUsuarios.length === 0) {
            listaUsuarios = [
                { nombre: 'Admin Principal', username: 'admin', usuario: 'admin', password: '123456', pass: '123456', rol: 'Administrador', permisos: ['Todo'] },
                { nombre: 'Juan Ortiz', username: 'jortiz', usuario: 'jortiz', password: '123456', pass: '123456', rol: 'Administrador', permisos: ['Todo'] },
                { nombre: 'Carlos Operador', username: 'operador', usuario: 'operador', password: '123456', pass: '123456', rol: 'Operador', permisos: ['Cotizaciones', 'Agenda'] }
            ];
        }

        const inputUsuario = usuario.trim().toLowerCase();
        const inputPass = password.trim();

        // Buscar coincidencia flexible contemplando 'usuario', 'username', 'pass' y 'password'
        const encontrado = listaUsuarios.find((u: any) => {
            const uName = (u.usuario || u.username || '').trim().toLowerCase();
            const uPass = (u.pass || u.password || '').trim();
            return uName === inputUsuario && uPass === inputPass;
        });

        if (encontrado) {
            const datosSesion = {
                nombre: encontrado.nombre || 'Administrador',
                rol: encontrado.rol || 'Administrador',
                permisos: encontrado.permisos || ['Todo']
            };

            localStorage.setItem('xtreme_usuario_actual', JSON.stringify(datosSesion));

            // Registrar log de auditoría
            const logsGuardados = localStorage.getItem('xtreme_logs_auditoria') || '[]';
            try {
                const lista = JSON.parse(logsGuardados);
                const nuevoLog = {
                    id: Date.now().toString(),
                    usuario: datosSesion.nombre,
                    rol: datosSesion.rol,
                    accion: 'Inicio de sesión autorizado en el sistema CMS',
                    fecha: new Date().toLocaleString()
                };
                localStorage.setItem('xtreme_logs_auditoria', JSON.stringify([nuevoLog, ...lista]));
            } catch {}

            // Redirección completa garantizada
            window.location.href = '/admin';
        } else {
            setError(true);
            setIntentos(prev => prev + 1);

            // Registrar intento fallido
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

    return (
        <div className="min-h-screen bg-[#051610] flex items-center justify-center p-4 text-slate-100 font-sans relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#09261d] border border-[#c5a059]/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
            
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
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl text-center">
                    Credenciales incorrectas. El intento fue registrado por seguridad.
                </div>
            )}

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

            <div className="pt-2 text-center">
                <Link href="/" className="text-xs text-slate-400 hover:text-[#e6ca84] transition-colors font-medium">
                    ← Volver al sitio principal
                </Link>
            </div>

        </div>
        </div>
    );
}