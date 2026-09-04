'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerConfigWeb, obtenerMunicipios, obtenerDescuentos, obtenerAsesores, configInicial, ConfigWeb, MunicipioCobertura, DescuentoCupon, AsesorWhatsApp } from '@/app/services';

interface SubopcionServicio {
  nombre: string;
  ajuste: number;
}

interface ServicioCatalogo {
  id: string;
  nombre: string;
  precioBase: number;
  descripcion: string;
  variantes: SubopcionServicio[];
}

export default function LandingPage() {
  const [config, setConfig] = useState<ConfigWeb>(configInicial);
  const [servicios, setServicios] = useState<ServicioCatalogo[]>([]);
  const [municipios, setMunicipios] = useState<MunicipioCobertura[]>([]);
  const [cuponesDisponibles, setCuponesDisponibles] = useState<DescuentoCupon[]>([]);
  const [asesoresWp, setAsesoresWp] = useState<AsesorWhatsApp[]>([]);
  
  // Cotizador state
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioCatalogo | null>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<SubopcionServicio | null>(null);
  const [cantidadUnidades, setCantidadUnidades] = useState<number>(1);
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<MunicipioCobertura | null>(null);
  
  // Cupón state
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState<DescuentoCupon | null>(null);
  const [errorCupon, setErrorCupon] = useState('');

  // Modales states
  const [modalVarianteAbierto, setModalVarianteAbierto] = useState(false);
  const [modalZonaAbierto, setModalZonaAbierto] = useState(false);
  const [modalWhatsAppAbierto, setModalWhatsAppAbierto] = useState(false);
  const [zonaEnEdicion, setZonaEnEdicion] = useState<MunicipioCobertura | null>(null);
  const [barrioEspecifico, setBarrioEspecifico] = useState('');
  const [direccionResidencia, setDireccionResidencia] = useState('');
  const [detalleUbicacionFinal, setDetalleUbicacionFinal] = useState('');

  const [cotizacionGenerada, setCotizacionGenerada] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  useEffect(() => {
    // Registro del Service Worker para PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registrado con éxito:', reg.scope))
        .catch((err) => console.error('Error al registrar el Service Worker:', err));
    }

    const data = obtenerConfigWeb();
    if (data) setConfig(data);

    const listaMun = obtenerMunicipios().filter(m => m.activo);
    setMunicipios(listaMun);
    if (listaMun.length > 0) {
      setMunicipioSeleccionado(listaMun[0]);
      setDetalleUbicacionFinal(`${listaMun[0].nombre} (Zona Principal)`);
    }

    setCuponesDisponibles(obtenerDescuentos().filter(c => c.activo));
    setAsesoresWp(obtenerAsesores());

    const guardadosServicios = localStorage.getItem('xtreme_servicios_catalogo');
    if (guardadosServicios) {
      try {
        const parsed = JSON.parse(guardadosServicios);
        setServicios(parsed);
        if (parsed.length > 0) {
          setServicioSeleccionado(parsed[0]);
          if (parsed[0].variantes && parsed[0].variantes.length > 0) {
            setVarianteSeleccionada(parsed[0].variantes[0]);
          }
        }
      } catch {}
    } else {
      const iniciales: ServicioCatalogo[] = [
        {
          id: '1',
          nombre: 'Limpieza de Sala / Sofá',
          precioBase: 85000,
          descripcion: 'Eliminación profunda de manchas, ácaros y malos olores.',
          variantes: [
            { nombre: 'Sofá 2 Puestos', ajuste: 0 },
            { nombre: 'Sofá 3 Puestos', ajuste: 20000 },
            { nombre: 'Sofá en L / Seccional', ajuste: 55000 },
            { nombre: 'Silla Individual / Poltrona', ajuste: -10000 }
          ]
        },
        {
          id: '2',
          nombre: 'Limpieza de Colchón',
          precioBase: 70000,
          descripcion: 'Desinfección UV y extracción de ácaros y sudor acumulado.',
          variantes: [
            { nombre: 'Colchón Sencillo / 1 Plaza', ajuste: 0 },
            { nombre: 'Colchón Doble / Semidoble', ajuste: 25000 },
            { nombre: 'Colchón King Size', ajuste: 50000 }
          ]
        }
      ];
      setServicios(iniciales);
      setServicioSeleccionado(iniciales[0]);
      setVarianteSeleccionada(iniciales[0].variantes[0]);
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ACTUALIZAR_CONFIG_INSTANTANEA') {
        setConfig(event.data.config);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSeleccionarServicio = (serv: ServicioCatalogo) => {
    setServicioSeleccionado(serv);
    setCantidadUnidades(1);
    if (serv.variantes && serv.variantes.length > 0) {
      setVarianteSeleccionada(serv.variantes[0]);
    } else {
      setVarianteSeleccionada(null);
    }
  };

  const aplicarCupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCupon('');
    const encontrado = cuponesDisponibles.find(c => c.codigo.toUpperCase() === codigoIngresado.trim().toUpperCase());
    if (encontrado) {
      setCuponAplicado(encontrado);
      setCodigoIngresado('');
    } else {
      setErrorCupon('Cupón inválido o inactivo.');
    }
  };

  const calcularSubtotal = () => {
    if (!servicioSeleccionado) return 0;
    const base = servicioSeleccionado.precioBase;
    const ajuste = varianteSeleccionada ? varianteSeleccionada.ajuste : 0;
    const recargo = municipioSeleccionado ? municipioSeleccionado.recargo : 0;
    return ((base + ajuste) * cantidadUnidades) + recargo;
  };

  const calcularDescuentoMonto = () => {
    const subtotal = calcularSubtotal();
    if (!cuponAplicado) return 0;
    if (cuponAplicado.tipo === 'porcentaje') {
      return Math.round((subtotal * cuponAplicado.valor) / 100);
    } else {
      return Math.min(subtotal, cuponAplicado.valor);
    }
  };

  const calcularTotal = () => {
    return Math.max(0, calcularSubtotal() - calcularDescuentoMonto());
  };

  const abrirModalZona = (m: MunicipioCobertura) => {
    setZonaEnEdicion(m);
    setModalZonaAbierto(true);
  };

  const handleEnviarCotizacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCliente || !telefonoCliente) return;

    const total = calcularTotal();
    const nuevaCotizacion = {
      id: Date.now().toString(),
      cliente: nombreCliente,
      telefono: telefonoCliente,
      direccion: detalleUbicacionFinal,
      servicio: `${servicioSeleccionado?.nombre} (${varianteSeleccionada?.nombre} x ${cantidadUnidades}) ${cuponAplicado ? `[Cupón: ${cuponAplicado.codigo}]` : ''}`,
      total: total,
      estado: 'Pendiente',
      fecha: new Date().toLocaleString()
    };

    const cotizacionesGuardadas = localStorage.getItem('xtreme_cotizaciones_web') || '[]';
    try {
      const lista = JSON.parse(cotizacionesGuardadas);
      localStorage.setItem('xtreme_cotizaciones_web', JSON.stringify([nuevaCotizacion, ...lista]));
    } catch {
      localStorage.setItem('xtreme_cotizaciones_web', JSON.stringify([nuevaCotizacion]));
    }

    setCotizacionGenerada(true);

    const mensajeWp = `Hola Xtreme Clean, soy ${nombreCliente}. Coticé ${servicioSeleccionado?.nombre} [${varianteSeleccionada?.nombre} x ${cantidadUnidades}] para la ubicación: ${detalleUbicacionFinal}. Total con descuento: $${total.toLocaleString()} COP.`;
    const urlWp = `https://wa.me/${config.telefonoContacto || '573001234567'}?text=${encodeURIComponent(mensajeWp)}`;
    
    setTimeout(() => {
      window.open(urlWp, '_blank');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#051610] text-slate-100 font-sans selection:bg-[#c5a059] selection:text-slate-950 pb-20">
      
      {/* HEADER: Muestra el logo XC a la izquierda, y en PC muestra el menú completo */}
      <header className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-18 sm:h-24 flex items-center justify-between border-b border-[#c5a059]/20 sticky top-0 bg-[#051610]/95 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          {config.logoTipo === 'imagen' && config.logoImagenUrl ? (
            <img src={config.logoImagenUrl} alt="Logo" className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl object-cover shadow-xl" />
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#c5a059] to-[#e6ca84] flex items-center justify-center text-slate-950 font-black text-sm sm:text-lg shadow-xl shrink-0">
              {config.logoTexto || 'XC'}
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-2 sm:gap-6 text-[9.5px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
          <a href="#servicios" className="hover:text-[#e6ca84] transition-colors">Servicios</a>
          <a href="#galeria" className="hover:text-[#e6ca84] transition-colors">Resultados</a>
          <a href="#cotizador" className="hover:text-[#e6ca84] transition-colors">Cotizador</a>
          <Link href="/admin/login" className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/40 text-[#e6ca84] rounded-xl transition-all shadow-md flex items-center gap-1 shrink-0">
            <span>🔒</span> <span>Admin</span>
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
              ✨ Villavicencio, Acacías, Guamal y Restrepo
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {config.tituloHero || 'Limpieza profesional para tu hogar'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {config.subtituloHero || 'Transformamos tus muebles, colchones y alfombras con tecnología de punta a domicilio.'}
            </p>
            <div className="pt-4 flex gap-4">
              <a href="#cotizador" className="px-8 py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-2xl shadow-xl text-sm">
                Cotizar ahora 🚀
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#09261d] border border-[#c5a059]/30 rounded-3xl p-8 shadow-2xl text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-[#c5a059] to-[#e6ca84] flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl">
                XC
              </div>
              <h3 className="font-black text-lg text-white">Garantía Profesional</h3>
              <p className="text-xs text-slate-300">Eliminación total de ácaros y manchas difíciles en el Meta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA INTERACTIVA ANTES Y DESPUÉS */}
      <section id="galeria" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#c5a059]/20">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs text-[#e6ca84] font-bold uppercase tracking-widest">Transformación Real</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Galería Antes y Después</h2>
          <p className="text-sm text-slate-300">Desliza la barra para comprobar el poder de restauración de Xtreme Clean en sofás y tapicería.</p>
        </div>

        <div className="relative w-full max-w-3xl mx-auto h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border border-[#c5a059]/40 shadow-2xl select-none bg-[#09261d]">
          <div className="absolute inset-0">
            <img 
              src={config.imagenDespuesUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"} 
              alt="Sofá Limpio y Restaurado - Después" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3.5 py-1.5 bg-emerald-500/90 text-slate-950 font-black text-[10px] rounded-full shadow-lg uppercase tracking-wider">
                ✨ DESPUÉS
              </span>
            </div>
          </div>

          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-0 w-[800px] sm:w-[768px] max-w-none h-full">
              <img 
                src={config.imagenAntesUrl || "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80"} 
                alt="Sofá con Manchas - Antes" 
                className="w-full h-full object-cover filter brightness-75 contrast-125"
              />
            </div>
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3.5 py-1.5 bg-red-600/90 text-white font-black text-[10px] rounded-full shadow-lg uppercase tracking-wider">
                ⚠️ ANTES
              </span>
            </div>
          </div>

          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderPos} 
            onChange={e => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
          <div className="absolute top-0 bottom-0 w-1 bg-[#c5a059] pointer-events-none z-20 shadow-[0_0_15px_#c5a059]" style={{ left: `${sliderPos}%` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-[#c5a059] to-[#e6ca84] text-slate-950 font-black flex items-center justify-center shadow-2xl text-xs border border-white/40">
              ↔
            </div>
          </div>
        </div>
      </section>

      {/* COTIZADOR INTELIGENTE DINÁMICO */}
      <section id="servicios" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div id="cotizador" className="bg-[#09261d] border border-[#c5a059]/40 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
              Cotizador Inteligente 24/7
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Calcula tu Servicio al Instante</h2>
          </div>

          {cotizacionGenerada ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-4">
              <span className="text-4xl">🎉</span>
              <h3 className="text-xl font-black text-emerald-400">¡Cotización Registrada con Éxito!</h3>
              <p className="text-xs text-slate-200">Redirigiendo a WhatsApp con los detalles de tu zona y cotización...</p>
              <button onClick={() => setCotizacionGenerada(false)} className="px-6 py-2.5 bg-[#c5a059] text-slate-950 font-bold text-xs rounded-xl">
                Realizar otra cotización
              </button>
            </div>
          ) : (
            <form onSubmit={handleEnviarCotizacion} className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-[#e6ca84] uppercase tracking-wider mb-2">1. Selecciona el Servicio</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicios.map(serv => (
                    <button
                      type="button"
                      key={serv.id}
                      onClick={() => handleSeleccionarServicio(serv)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        servicioSeleccionado?.id === serv.id 
                          ? 'bg-[#c5a059] text-slate-950 border-[#e6ca84] font-extrabold shadow-lg' 
                          : 'bg-[#051610] text-slate-300 border-[#c5a059]/20 hover:border-[#c5a059]/50'
                      }`}
                    >
                      <div className="text-xs uppercase font-bold">{serv.nombre}</div>
                      <div className={`text-[11px] mt-1 font-mono ${servicioSeleccionado?.id === serv.id ? 'text-slate-900 font-bold' : 'text-[#e6ca84]'}`}>
                        Desde ${serv.precioBase.toLocaleString()} COP
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {servicioSeleccionado && servicioSeleccionado.variantes && servicioSeleccionado.variantes.length > 0 && (
                <div className="pt-2 border-t border-[#c5a059]/20 space-y-2">
                  <label className="block text-xs font-bold text-[#e6ca84] uppercase tracking-wider">2. Selecciona la Variante, Tipo o Cantidad</label>
                  <button
                    type="button"
                    onClick={() => setModalVarianteAbierto(true)}
                    className="w-full p-4 bg-[#051610] border border-[#c5a059]/40 rounded-xl text-left flex justify-between items-center transition-all cursor-pointer hover:border-[#c5a059]"
                  >
                    <div>
                      <span className="text-[10px] block uppercase font-mono text-[#e6ca84] font-bold">Variante Seleccionada (Cantidad: {cantidadUnidades})</span>
                      <span className="text-sm font-black text-white">{varianteSeleccionada?.nombre || 'Seleccionar variante'}</span>
                    </div>
                    <span className="px-4 py-2 bg-[#c5a059] text-slate-950 font-extrabold text-xs rounded-lg shadow">
                      Cambiar Tipo / Cantidad 🪑
                    </span>
                  </button>
                </div>
              )}

              <div className="space-y-3 pt-2 border-t border-[#c5a059]/20">
                <label className="block text-xs font-bold text-[#e6ca84] uppercase tracking-wider">3. Selecciona tu Municipio de Cobertura</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {municipios.map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => abrirModalZona(m)}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                        municipioSeleccionado?.id === m.id 
                          ? 'bg-[#c5a059] text-slate-950 border-[#e6ca84] font-extrabold shadow-md' 
                          : 'bg-[#051610] text-slate-300 border-[#c5a059]/20 hover:border-[#c5a059]/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className={`text-[9px] block uppercase font-mono tracking-wider ${municipioSeleccionado?.id === m.id ? 'text-slate-900 font-bold' : 'text-[#e6ca84]'}`}>
                          🏙️ Municipio
                        </span>
                        <span className="text-xs font-bold block leading-snug">{m.nombre}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold shrink-0 ml-2 ${municipioSeleccionado?.id === m.id ? 'text-slate-950' : 'text-[#e6ca84]'}`}>
                        {m.recargo > 0 ? `+$${m.recargo.toLocaleString()}` : 'Gratis'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="p-3 bg-[#051610] border border-[#c5a059]/30 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ubicación Seleccionada:</span>
                    <span className="text-[#e6ca84] font-bold">{detalleUbicacionFinal}</span>
                  </div>
                  <button type="button" onClick={() => municipioSeleccionado && abrirModalZona(municipioSeleccionado)} className="px-3 py-1.5 bg-[#09261d] text-[#e6ca84] border border-[#c5a059]/40 rounded-lg text-[11px] font-bold">
                    Añadir Dirección Exacta ✏️
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#c5a059]/20 space-y-2">
                <label className="block text-xs font-bold text-[#e6ca84] uppercase tracking-wider">4. ¿Tienes un Cupón de Descuento?</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ej. XTREME10" 
                    value={codigoIngresado} 
                    onChange={e => setCodigoIngresado(e.target.value)}
                    className="flex-1 p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs font-mono uppercase focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={aplicarCupon}
                    className="px-5 py-3.5 bg-[#09261d] hover:bg-[#0d3b2d] border border-[#c5a059]/40 text-[#e6ca84] font-extrabold rounded-xl text-xs"
                  >
                    Aplicar Cupón 🎟️
                  </button>
                </div>
                {errorCupon && <p className="text-xs text-red-400 font-bold">{errorCupon}</p>}
                {cuponAplicado && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex justify-between items-center text-xs text-emerald-300">
                    <span>✨ ¡Cupón <b>{cuponAplicado.codigo}</b> aplicado con éxito!</span>
                    <button type="button" onClick={() => setCuponAplicado(null)} className="text-red-400 hover:underline font-bold">Quitar</button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#c5a059]/20">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre Completo</label>
                  <input type="text" required placeholder="Ej. Carlos Pérez" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-xs text-white focus:outline-none" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">WhatsApp</label>
                  <input type="text" required placeholder="Ej. 300 123 4567" className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-xs text-white focus:outline-none font-mono" value={telefonoCliente} onChange={e => setTelefonoCliente(e.target.value)} />
                </div>
              </div>

              <div className="p-5 bg-[#051610] border border-[#c5a059]/30 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold">Valor Total (Incluye Domicilio):</span>
                  {cuponAplicado ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 line-through font-mono">${calcularSubtotal().toLocaleString()} COP</span>
                      <div className="text-2xl sm:text-3xl font-black text-[#e6ca84]">${calcularTotal().toLocaleString()} COP</div>
                    </div>
                  ) : (
                    <div className="text-2xl sm:text-3xl font-black text-[#e6ca84] mt-0.5">${calcularTotal().toLocaleString()} COP</div>
                  )}
                </div>
                <button type="submit" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl shadow-xl text-xs flex items-center justify-center gap-2">
                  <span>💬</span> WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* SECCIÓN SEO LOCAL Y COBERTURA MAPA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#c5a059]/20">
        <div className="bg-[#09261d] border border-[#c5a059]/30 rounded-3xl p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca84] font-extrabold text-[10px] rounded-full uppercase tracking-widest">
              Cobertura Oficial en el Meta
            </span>
            <h3 className="text-2xl font-black text-white">Lavandería a Domicilio Profesional</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Brindamos servicios especializados de desinfección UV, lavado de salas, colchones y alfombras directamente a domicilio en las principales zonas urbanas y rurales de:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-[#051610] border border-[#c5a059]/40 text-[#e6ca84] text-xs font-bold rounded-xl">📍 Villavicencio</span>
              <span className="px-3 py-1 bg-[#051610] border border-[#c5a059]/40 text-[#e6ca84] text-xs font-bold rounded-xl">📍 Acacías</span>
              <span className="px-3 py-1 bg-[#051610] border border-[#c5a059]/40 text-[#e6ca84] text-xs font-bold rounded-xl">📍 Guamal</span>
              <span className="px-3 py-1 bg-[#051610] border border-[#c5a059]/40 text-[#e6ca84] text-xs font-bold rounded-xl">📍 Restrepo</span>
            </div>
          </div>

          <div className="bg-[#051610] border border-[#c5a059]/30 rounded-2xl p-6 text-center space-y-4 shadow-inner">
            <div className="text-3xl">🗺️</div>
            <h4 className="font-bold text-white text-base">Departamento del Meta, Colombia</h4>
            <p className="text-xs text-slate-400">Atención rápida y puntual garantizada en todo el sector urbano y conjuntos residenciales.</p>
            <div className="pt-2">
              <a 
                href="https://wa.me/573001234567?text=Hola,%20deseo%20consultar%20si%20llegan%20a%20mi%20barrio." 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
              >
                Consultar Cobertura por WhatsApp ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE SELECCIÓN DE ASESORES DE WHATSAPP */}
      {modalWhatsAppAbierto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09261d] border border-[#c5a059]/40 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-3">
              <div>
                <span className="text-[10px] text-[#e6ca84] font-bold uppercase tracking-widest">Atención Inmediata</span>
                <h3 className="text-lg font-black text-white">💬 Selecciona un Asesor</h3>
              </div>
              <button onClick={() => setModalWhatsAppAbierto(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3">
              {asesoresWp.map(asesor => (
                <a
                  key={asesor.id}
                  href={`https://wa.me/${asesor.telefono}?text=${encodeURIComponent('Hola ' + asesor.nombre + ', deseo recibir asesoría sobre limpieza de muebles.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-[#051610] border border-[#c5a059]/30 hover:border-[#c5a059] rounded-2xl flex justify-between items-center transition-all group block"
                >
                  <div>
                    <span className="text-sm font-black text-white group-hover:text-[#e6ca84] transition-colors">{asesor.nombre}</span>
                    <p className="text-[11px] text-slate-300">{asesor.cargo}</p>
                    <span className="text-[10px] text-[#e6ca84] font-mono">📱 +{asesor.telefono}</span>
                  </div>
                  <span className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs rounded-xl">
                    Chatear ↗
                  </span>
                </a>
              ))}
            </div>

            <button 
              onClick={() => setModalWhatsAppAbierto(false)}
              className="w-full py-3 bg-[#051610] border border-[#c5a059]/30 text-slate-300 font-bold rounded-xl text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE VARIANTE Y CANTIDAD */}
      {modalVarianteAbierto && servicioSeleccionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09261d] border border-[#c5a059]/40 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-3">
              <div>
                <span className="text-[10px] text-[#e6ca84] font-bold uppercase tracking-widest">Personalizar Servicio</span>
                <h3 className="text-lg font-black text-white">🪑 {servicioSeleccionado.nombre}</h3>
              </div>
              <button onClick={() => setModalVarianteAbierto(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-300 uppercase">Selecciona el Tipo / Variante:</label>
              <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {servicioSeleccionado.variantes.map((v, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setVarianteSeleccionada(v)}
                    className={`p-3.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                      varianteSeleccionada?.nombre === v.nombre 
                        ? 'bg-[#c5a059] text-slate-950 border-[#e6ca84] font-extrabold shadow-md' 
                        : 'bg-[#051610] text-slate-300 border-[#c5a059]/20 hover:border-[#c5a059]/50'
                    }`}
                  >
                    <span className="text-xs font-bold">{v.nombre}</span>
                    <span className={`text-xs font-mono font-bold ${varianteSeleccionada?.nombre === v.nombre ? 'text-slate-950' : 'text-[#e6ca84]'}`}>
                      {v.ajuste >= 0 ? `+$${v.ajuste.toLocaleString()}` : `-$${Math.abs(v.ajuste).toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-[#c5a059]/20">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Cantidad de Unidades:</label>
                <div className="flex items-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => setCantidadUnidades(Math.max(1, cantidadUnidades - 1))}
                    className="w-12 h-12 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white font-black text-lg hover:bg-[#c5a059] hover:text-slate-950 transition-all"
                  >
                    -
                  </button>
                  <span className="text-xl font-black text-[#e6ca84] font-mono px-4">{cantidadUnidades}</span>
                  <button 
                    type="button" 
                    onClick={() => setCantidadUnidades(cantidadUnidades + 1)}
                    className="w-12 h-12 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white font-black text-lg hover:bg-[#c5a059] hover:text-slate-950 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setModalVarianteAbierto(false)}
                className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl text-xs shadow-xl mt-4"
              >
                Aplicar Selección ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SELECCIÓN DE BARRIO Y DIRECCIÓN */}
      {modalZonaAbierto && zonaEnEdicion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09261d] border border-[#c5a059]/40 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-3">
              <div>
                <span className="text-[10px] text-[#e6ca84] font-bold uppercase tracking-widest">Configurar Ubicación</span>
                <h3 className="text-lg font-black text-white">📍 {zonaEnEdicion.nombre}</h3>
              </div>
              <button onClick={() => setModalZonaAbierto(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setMunicipioSeleccionado(zonaEnEdicion);
              const detalle = `${zonaEnEdicion.nombre} ${barrioEspecifico ? `- Barrio: ${barrioEspecifico}` : ''} ${direccionResidencia ? `- Dir: ${direccionResidencia}` : ''}`;
              setDetalleUbicacionFinal(detalle);
              setModalZonaAbierto(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Barrio o Sector (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ej. Barzal, San Benito, Centro..." 
                  value={barrioEspecifico} 
                  onChange={e => setBarrioEspecifico(e.target.value)}
                  className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Dirección Exacta de Residencia</label>
                <input 
                  type="text" 
                  placeholder="Ej. Calle 15 # 24-10 Apto 302" 
                  value={direccionResidencia} 
                  onChange={e => setDireccionResidencia(e.target.value)}
                  className="w-full p-3.5 bg-[#051610] border border-[#c5a059]/30 rounded-xl text-white text-xs focus:outline-none" 
                />
              </div>

              <div className="p-3 bg-[#051610] border border-[#c5a059]/20 rounded-xl text-xs text-[#e6ca84]">
                ℹ️ Recargo por traslado a este municipio: <span className="font-mono font-bold">${zonaEnEdicion.recargo.toLocaleString()} COP</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalZonaAbierto(false)} className="w-1/2 py-3 bg-[#051610] border border-[#c5a059]/30 text-slate-300 font-bold rounded-xl text-xs">
                  Cancelar
                </button>
                <button type="submit" className="w-1/2 py-3 bg-gradient-to-r from-[#c5a059] to-[#e6ca84] text-slate-950 font-extrabold rounded-xl text-xs shadow-lg">
                  Confirmar Ubicación ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#c5a059]/20 bg-[#051610] py-12 text-center text-xs text-slate-400 space-y-2">
        <p className="font-bold text-[#e6ca84]">🕒 Horario de Atención: {config.horario}</p>
        <p>{config.textoFooter}</p>
      </footer>

      {/* MENÚ INFERIOR MÓVIL (BOTTOM NAVIGATION) FIJO */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#09261d]/95 backdrop-blur-md border-t border-[#c5a059]/30 px-2 py-3 flex justify-around items-center z-50 shadow-2xl">
        <a 
          href="#servicios" 
          className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:text-[#e6ca84] transition-colors"
        >
          <span className="text-base">🧽</span>
          <span>Servicios</span>
        </a>

        <a 
          href="#galeria" 
          className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:text-[#e6ca84] transition-colors"
        >
          <span className="text-base">✨</span>
          <span>Resultados</span>
        </a>

        <a 
          href="#cotizador" 
          className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:text-[#e6ca84] transition-colors"
        >
          <span className="text-base">🚀</span>
          <span>Cotizador</span>
        </a>

        <Link 
          href="/admin/login" 
          className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#e6ca84] transition-colors"
        >
          <span className="text-base">🔒</span>
          <span>Admin</span>
        </Link>
      </nav>
    </div>
  );
}