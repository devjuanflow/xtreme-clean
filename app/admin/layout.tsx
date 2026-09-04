'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [verificado, setVerificado] = useState(false);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setVerificado(true);
            return;
        }

        const auth = localStorage.getItem('xtreme_usuario_actual');
        if (!auth) {
            router.push('/admin/login');
        } else {
            setVerificado(true);
        }
    }, [pathname, router]);

    if (!verificado && pathname !== '/admin/login') {
        return (
            <div className="min-h-screen bg-[#051610] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs tracking-wider uppercase font-bold text-[#e6ca84]">Verificando Credenciales...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}