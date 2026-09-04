'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface UsuarioSistema {
    id: string;
    nombre: string;
    email: string;
    usuario: string;
    username?: string;
    rol: string;
    pass: string;
    password?: string;
    permisos: string[];
    activo: boolean;
    ultimoAcceso: string;
}

export default function GestionUsuariosPage() {
    const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
    const [filtroRol, setFiltroRol] = useState<'Todos' | 'Administrador' | 'Operador'>('Todos');
    
    // Formulario nuevo usuario
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [usuario, setUsuario] = useState('');
    const [pass, setPass] = useState('');
    const [rol, setRol] = useState('Operador');
    const [permisos, setPermisos] = useState<string[]>(['Cotizaciones', 'Agenda']);

    // Modal cambiar clave
    const [modalClaveAbierto, setModalClaveAbierto] = useState(false);
    const [usuarioIdEditando, setUsuarioIdEditando] = useState<string | null>(null);
    const [nuevaClave, setNuevaClave] = useState('');

    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        const guardados = localStorage.getItem('xtreme_usuarios_sistema');
        if (guardados) {
            try {
                setUsuarios(JSON.parse(guardados));
            } catch {}
        } else {
            const iniciales: UsuarioSistema[] = [
                { id: '1', nombre: 'Admin Principal', email: 'admin@xtremeclean.com', usuario: 'admin', username: 'admin', rol: 'Administrador', pass: '123456', password: '123456', permisos: ['Todo'], activo: true, ultimoAcceso: 'Hoy, 10:30 AM' },
                { id: '2', nombre: 'Juan Ortiz', email: 'ceo@hotmail.com', usuario: 'jortiz', username: 'jortiz', rol: 'Administrador', pass: '123456', password: '123456', permisos: ['Todo'], activo: true, ultimoAcceso: 'Ayer, 04:15 PM' }
            ];
            setUsuarios(iniciales);
            localStorage.setItem('xtreme_usuarios_sistema', JSON.stringify(iniciales));
        }
    }, []);

    const guardarStorage = (nuevaLista: UsuarioSistema[]) => {
        setUsuarios(nuevaLista);
        localStorage.setItem('xtreme_usuarios_sistema', JSON.stringify(nuevaLista));
    };

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

    const generarPasswordSegura = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!';
        let passTemp = '';
        for (let i = 0; i < 8; i++) {
            passTemp += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPass(passTemp);
    };

    const handleCheckboxPermiso = (permiso: string) => {
        if (permisos.includes(permiso)) {
            setPermisos(permisos.filter(p => p !== permiso));
        } else {
            setPermisos([...permisos, permiso]);
        }
    };

    const handleCrearUsuario = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !usuario || !pass) return;

        const nuevo: UsuarioSistema = {
            id: Date.now().toString(),
            nombre,
            email: email || `${usuario}@xtremeclean.com`,
            usuario: usuario.trim().toLowerCase(),
            username: usuario.trim().toLowerCase(),
            rol,
            pass: pass.trim(),
            password: pass.trim(),
            permisos: rol === 'Administrador' ? ['Todo'] : permisos,
            activo: true,
            ultimoAcceso: 'Nunca'
        };

        const actualizados = [...usuarios, nuevo];
        guardarStorage(actualizados);
        registrarAuditoria(`Creó el usuario corporativo: ${nombre} (${rol})`);

        setNombre('');
        setEmail('');
        setUsuario('');
        setPass('');
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
    };

    const eliminarUsuario = (id: string, nombreU: string) => {
        if (confirm(`¿Estás seguro de revocar el acceso del usuario "${nombreU}"?`)) {
            const filtrados = usuarios.filter(u => u.id !== id);
            guardarStorage(filtrados);
            registrarAuditoria(`Revocó el acceso al usuario: ${nombreU}`);
        }
    };

    const abrirModalClave = (id: string) => {
        setUsuarioIdEditando(id);
        setNuevaClave('');
        setModalClaveAbierto(true);
    };

    const guardarNuevaClave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevaClave || !usuarioIdEditando) return;

        const actualizados = usuarios.map(u => u.id === usuarioIdEditando ? { ...u, pass: nuevaClave.trim(), password: nuevaClave.trim() } : u);
        guardarStorage(actualizados);
        registrarAuditoria(`Actualizó la contraseña de credenciales para el usuario ID: ${usuarioIdEditando}`);
        
        setModalClaveAbierto(false);
        setUsuarioIdEditando(null);
        alert('¡Contraseña actualizada con éxito en el sistema!');
    };

    const usuariosFiltrados = usuarios.filter(u => {
        if (filtroRol === 'Todos') return true;
        return u.rol === filtroRol;
    });

    return (
        <div className="min-h-screen bg-[#051610] p-4 sm:p-6 md:p-10 text-slate-100 font-sans relative">
        
        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 border-b border-[#c5a059]/30 pb-6">
            <div>
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
                Control de Accesos Enterprise
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">👥 Gestión de Usuarios y Credenciales</h1>
            <p className="text-xs sm:text-sm text-slate-400">Crea accesos seguros, asigna roles operativos y audita contraseñas.</p>
            </div>
            <Link href="/admin" className="w-full sm:w-auto text-center px-5 py-2.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/30 text-slate-200 text-xs font-bold rounded-xl transition-all shadow-lg">
            ← Volver al Dashboard
            </Link>
        </div>

        {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ¡Nuevo usuario registrado y habilitado en el sistema!
            </div>
        )}

        {/* CONTENEDOR EN GRILLA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FORMULARIO NUEVO USUARIO */}
            <div className="lg:col-span-5 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl">
            <h3 className="font-bold text-base text-[#e6ca84] mb-4 border-b border-[#c5a059]/20 pb-2">
                ✨ Registrar Nuevo Usuario
            </h3>

            <form onSubmit={handleCrearUsuario} className="space-y-4">
                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre Completo</label>
                <input type="text" required placeholder="Ej. Carlos Gómez" className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:border-[#c5a059] focus:outline-none" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Correo Electrónico</label>
                <input type="email" placeholder="carlos@xtremeclean.com" className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:border-[#c5a059] focus:outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Usuario de Acceso</label>
                    <input type="text" required placeholder="cgomez" className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:border-[#c5a059] focus:outline-none font-mono" value={usuario} onChange={e => setUsuario(e.target.value)} />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Contraseña</label>
                    <button type="button" onClick={generarPasswordSegura} className="text-[10px] text-[#e6ca84] hover:underline">Generar ✦</button>
                    </div>
                    <input type="text" required placeholder="******" className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:border-[#c5a059] focus:outline-none font-mono" value={pass} onChange={e => setPass(e.target.value)} />
                </div>
                </div>

                <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Rol Asignado</label>
                <select className="w-full p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:border-[#c5a059] focus:outline-none" value={rol} onChange={e => setRol(e.target.value)}>
                    <option value="Operador">Operador (Restringido)</option>
                    <option value="Administrador">Administrador (Acceso Total)</option>
                </select>
                </div>

                {rol === 'Operador' && (
                <div className="space-y-2 pt-2 border-t border-[#c5a059]/20">
                    <label className="block text-xs font-bold text-[#e6ca84] uppercase">Permisos de Módulo</label>
                    <div className="space-y-1.5 bg-[#051610] p-3 rounded-xl border border-[#c5a059]/20">
                    {['Cotizaciones', 'Agenda', 'Servicios', 'WhatsApp Bot'].map(perm => (
                        <label key={perm} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={permisos.includes(perm)} 
                            onChange={() => handleCheckboxPermiso(perm)}
                            className="rounded border-[#c5a059]/40 bg-[#09261d] text-[#c5a059] focus:ring-0"
                        />
                        Gestionar {perm}
                        </label>
                    ))}
                    </div>
                </div>
                )}

                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl shadow-lg cursor-pointer hover:brightness-110 transition-all text-xs">
                Registrar Usuario Funcional 🚀
                </button>
            </form>
            </div>

            {/* LISTADO DE USUARIOS CON FILTROS */}
            <div className="lg:col-span-7 bg-[#09261d] border border-[#c5a059]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#c5a059]/20 pb-4 gap-3">
                <h3 className="font-bold text-base text-[#e6ca84]">
                Usuarios Activos ({usuariosFiltrados.length})
                </h3>
                <div className="flex gap-2">
                {(['Todos', 'Administrador', 'Operador'] as const).map(r => (
                    <button
                    key={r}
                    onClick={() => setFiltroRol(r)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                        filtroRol === r 
                        ? 'bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 shadow-md' 
                        : 'bg-[#051610] text-slate-300 border border-[#c5a059]/20 hover:border-[#c5a059]/50'
                    }`}
                    >
                    {r}
                    </button>
                ))}
                </div>
            </div>

            <div className="space-y-4">
                {usuariosFiltrados.map(u => (
                <div key={u.id} className="p-4 bg-[#051610] border border-[#c5a059]/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-inner">
                    <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h4 className="font-bold text-white text-sm">
                        {u.nombre} <span className="text-[10px] text-slate-400 font-normal">({u.email})</span>
                        </h4>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                        <span className="px-2.5 py-0.5 bg-[#c5a059]/20 border border-[#c5a059]/30 text-[#e6ca84] text-[10px] font-bold rounded-md">
                        {u.rol}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                        Usuario: <strong className="text-white">{u.usuario}</strong>
                        </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                        Permisos: <span className="text-slate-300">{u.permisos.join(', ')}</span> • Último acceso: {u.ultimoAcceso}
                    </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button onClick={() => abrirModalClave(u.id)} className="px-3 py-1.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/40 text-[#e6ca84] text-xs font-bold rounded-xl cursor-pointer transition-all">
                        Cambiar Clave
                    </button>
                    {u.usuario !== 'admin' && (
                        <button onClick={() => eliminarUsuario(u.id, u.nombre)} className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                        Eliminar
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>

            </div>

        </div>

        {/* MODAL CAMBIAR CONTRASEÑA */}
        {modalClaveAbierto && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#09261d] border border-[#c5a059]/40 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-white relative">
                <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-3">
                <h3 className="font-bold text-base text-[#e6ca84]">🔒 Cambiar Credencial de Acceso</h3>
                <button onClick={() => setModalClaveAbierto(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                </div>

                <form onSubmit={guardarNuevaClave} className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Nueva Contraseña</label>
                    <button type="button" onClick={() => {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!';
                        let p = '';
                        for (let i = 0; i < 8; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
                        setNuevaClave(p);
                    }} className="text-[10px] text-[#e6ca84] hover:underline">Generar ✦</button>
                    </div>
                    <input 
                    type="text" 
                    required 
                    placeholder="Ingrese o genere nueva clave" 
                    className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#c5a059]"
                    value={nuevaClave} 
                    onChange={e => setNuevaClave(e.target.value)} 
                    />
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl text-xs cursor-pointer hover:brightness-110 shadow-lg">
                    Actualizar Credencial 🔑
                </button>
                </form>
            </div>
            </div>
        )}

        </div>
    );
}