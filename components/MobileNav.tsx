'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
    const pathname = usePathname();

    if (pathname === '/admin/login') return null;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#09261d]/95 backdrop-blur-md border-t border-[#c5a059]/30 px-4 py-3 flex justify-around items-center z-50 shadow-2xl">
            <Link 
                href="/admin" 
                className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${pathname === '/admin' ? 'text-[#e6ca84]' : 'text-slate-400'}`}
            >
                <span className="text-lg">📊</span>
                <span>Panel</span>
            </Link>

            <Link 
                href="/admin/cotizaciones" 
                className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${pathname === '/admin/cotizaciones' ? 'text-[#e6ca84]' : 'text-slate-400'}`}
            >
                <span className="text-lg">📋</span>
                <span>Cotizaciones</span>
            </Link>

            <Link 
                href="/admin/agenda" 
                className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${pathname === '/admin/agenda' ? 'text-[#e6ca84]' : 'text-slate-400'}`}
            >
                <span className="text-lg">📅</span>
                <span>Agenda</span>
            </Link>

            <Link 
                href="/admin/configuracion" 
                className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${pathname === '/admin/configuracion' ? 'text-[#e6ca84]' : 'text-slate-400'}`}
            >
                <span className="text-lg">⚙️</span>
                <span>CMS</span>
            </Link>
        </nav>
    );
}