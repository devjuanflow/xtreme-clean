export interface SubopcionServicio {
    nombre: string;
    ajuste: number;
    }

    export interface Servicio {
    id: string;
    nombre: string;
    precioBase: number;
    descripcion: string;
    variantes: SubopcionServicio[];
    }

    export interface MunicipioCobertura {
    id: string;
    nombre: string;
    recargo: number;
    activo: boolean;
    tipo: 'municipio' | 'barrio';
    }

    export interface DescuentoCupon {
    id: string;
    codigo: string;
    tipo: 'porcentaje' | 'monto_fijo';
    valor: number;
    activo: boolean;
    }

    export interface AsesorWhatsApp {
    id: string;
    nombre: string;
    cargo: string;
    telefono: string;
    }

    export interface ConfigWeb {
    nombreEmpresa: string;
    subtituloEmpresa: string;
    logoTipo: 'texto' | 'imagen';
    logoImagenUrl: string;
    logoTexto: string;
    imagenHeroUrl: string;
    imagenAntesUrl: string;
    imagenDespuesUrl: string;
    tituloHero: string;
    subtituloHero: string;
    anosExperiencia: string;
    clientesFelices: string;
    garantia: string;
    badgeFlotante1: string;
    badgeFlotante2: string;
    tituloServiciosBadge: string;
    tituloServicios: string;
    descripcionServicios: string;
    tituloCta: string;
    subtituloCta: string;
    textoDescuentoCta: string;
    tituloFormulario: string;
    subtituloFormulario: string;
    telefonoContacto: string;
    telefonoSecundario: string;
    direccion: string;
    emailContacto: string;
    horario: string;
    textoFooter: string;
    }

    export const configInicial: ConfigWeb = {
    nombreEmpresa: 'XTREME CLEAN',
    subtituloEmpresa: 'LAVANDERÍA DE MUEBLES',
    logoTipo: 'texto',
    logoImagenUrl: '',
    logoTexto: 'XC',
    imagenHeroUrl: '',
    imagenAntesUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    imagenDespuesUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    tituloHero: 'Limpieza profesional para tu hogar',
    subtituloHero: 'Transformamos tus muebles, colchones y alfombras con tecnología de punta a domicilio en Villavicencio, Acacías, Guamal y Restrepo.',
    anosExperiencia: '5',
    clientesFelices: '5000',
    garantia: '100%',
    badgeFlotante1: 'Eco-Friendly Productos biodegradables',
    badgeFlotante2: '100% Efectivo Eliminamos ácaros',
    tituloServiciosBadge: 'Nuestra Oferta',
    tituloServicios: 'Servicios Especializados',
    descripcionServicios: 'Soluciones profesionales con garantía y productos ecológicos para el cuidado de tus espacios.',
    tituloCta: '¿Listo para renovar tus espacios?',
    subtituloCta: 'Agenda tu servicio hoy y recibe desinfección UV totalmente gratis.',
    textoDescuentoCta: '10% de descuento en tu primera cotización web',
    tituloFormulario: 'Calcula tu Servicio al Instante',
    subtituloFormulario: 'Selecciona el tipo de mueble y zona para obtener el valor exacto.',
    telefonoContacto: '+57 300 123 4567',
    telefonoSecundario: '+57 310 987 6543',
    direccion: 'Villavicencio, Meta, Colombia',
    emailContacto: 'contacto@xtremeclean.com',
    horario: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
    textoFooter: 'Lavandería profesional de muebles, colchones y alfombras a domicilio en Villavicencio, Acacías, Guamal y Restrepo.'
    };

    export function obtenerConfigWeb(): ConfigWeb {
    if (typeof window === 'undefined') return configInicial;
    const guardado = localStorage.getItem('xtreme_config_web');
    if (guardado) {
        try {
        return { ...configInicial, ...JSON.parse(guardado) };
        } catch {
        return configInicial;
        }
    }
    return configInicial;
    }

    export function guardarConfigWeb(config: ConfigWeb): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('xtreme_config_web', JSON.stringify(config));
    }

    // Catálogo de Servicios
    export function obtenerServicios(): Servicio[] {
    if (typeof window === 'undefined') return [];
    const guardados = localStorage.getItem('xtreme_servicios_catalogo');
    if (guardados) {
        try {
        return JSON.parse(guardados);
        } catch {
        return [];
        }
    }
    const iniciales: Servicio[] = [
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
    localStorage.setItem('xtreme_servicios_catalogo', JSON.stringify(iniciales));
    return iniciales;
    }

    export function guardarServicios(servicios: Servicio[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('xtreme_servicios_catalogo', JSON.stringify(servicios));
    }

    // Municipios de Cobertura Oficiales (Solo los 4 principales)
    export function obtenerMunicipios(): MunicipioCobertura[] {
    if (typeof window === 'undefined') return [];
    const guardados = localStorage.getItem('xtreme_municipios_cobertura');
    if (guardados) {
        try {
        const parsed = JSON.parse(guardados);
        // Forzar a que solo devuelva los 4 principales si tenía registros viejos
        if (Array.isArray(parsed) && parsed.length > 4) {
            const filtrados = parsed.filter((m: MunicipioCobertura) => 
            ['Villavicencio', 'Restrepo', 'Acacías', 'Guamal'].some(nombre => m.nombre.includes(nombre))
            );
            if (filtrados.length > 0) return filtrados;
        } else if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
        } catch {}
    }
    const iniciales: MunicipioCobertura[] = [
        { id: '1', nombre: 'Villavicencio', recargo: 0, activo: true, tipo: 'municipio' },
        { id: '2', nombre: 'Restrepo', recargo: 20000, activo: true, tipo: 'municipio' },
        { id: '3', nombre: 'Acacías', recargo: 25000, activo: true, tipo: 'municipio' },
        { id: '4', nombre: 'Guamal', recargo: 35000, activo: true, tipo: 'municipio' }
    ];
    localStorage.setItem('xtreme_municipios_cobertura', JSON.stringify(iniciales));
    return iniciales;
    }

    export function guardarMunicipios(municipios: MunicipioCobertura[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('xtreme_municipios_cobertura', JSON.stringify(municipios));
    }

    // Cupones y Descuentos
    export function obtenerDescuentos(): DescuentoCupon[] {
    if (typeof window === 'undefined') return [];
    const guardados = localStorage.getItem('xtreme_descuentos_cupones');
    if (guardados) {
        try {
        return JSON.parse(guardados);
        } catch {
        return [];
        }
    }
    const iniciales: DescuentoCupon[] = [
        { id: '1', codigo: 'XTREME10', tipo: 'porcentaje', valor: 10, activo: true },
        { id: '2', codigo: 'BIENVENIDA', tipo: 'monto_fijo', valor: 15000, activo: true }
    ];
    localStorage.setItem('xtreme_descuentos_cupones', JSON.stringify(iniciales));
    return iniciales;
    }

    export function guardarDescuentos(descuentos: DescuentoCupon[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('xtreme_descuentos_cupones', JSON.stringify(descuentos));
    }

    // Asesores de WhatsApp
    export function obtenerAsesores(): AsesorWhatsApp[] {
    if (typeof window === 'undefined') return [];
    const guardados = localStorage.getItem('xtreme_asesores_whatsapp');
    if (guardados) {
        try {
        return JSON.parse(guardados);
        } catch {
        return [];
        }
    }
    const iniciales: AsesorWhatsApp[] = [
        { id: '1', nombre: 'Laura Gómez', cargo: 'Asesor Comercial Villavicencio', telefono: '573001234567' },
        { id: '2', nombre: 'Carlos Ruiz', cargo: 'Soporte y Agendamientos Meta', telefono: '573109876543' }
    ];
    localStorage.setItem('xtreme_asesores_whatsapp', JSON.stringify(iniciales));
    return iniciales;
    }

    export function guardarAsesores(asesores: AsesorWhatsApp[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('xtreme_asesores_whatsapp', JSON.stringify(asesores));
}