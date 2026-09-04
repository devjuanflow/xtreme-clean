import CotizadorInteractivo from '@/components/Cotizador';

export default function Home() {
    return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900">Xtreme Clean</h1>
        <p className="text-slate-600 mt-2">Lavado y desinfección profesional de muebles a domicilio</p>
        </div>
        <CotizadorInteractivo />
    </main>
    );
}