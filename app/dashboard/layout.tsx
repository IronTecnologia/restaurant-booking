'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Settings, Home, Calendar, Users, BarChart3, Share2, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Slug do restaurante - em produção virá do usuário logado
  const restaurantSlug = 'meu-restaurante';
  const bookingLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/reserva/${restaurantSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuItems = [
    { icon: Home, label: 'Início', href: '/dashboard' },
    { icon: Calendar, label: 'Reservas', href: '/dashboard/reservas' },
    { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
    { icon: BarChart3, label: 'Relatórios', href: '/dashboard/relatorios' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="bg-gray-900 text-white overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between h-20">
          <motion.div
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className="text-xl font-bold"
          >
            RSM
          </motion.div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-white/10 rounded"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="space-y-2 px-2 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <motion.span
                animate={{ opacity: sidebarOpen ? 1 : 0 }}
                className="text-sm font-medium"
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </nav>

        {/* Share Section */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-4 border-t border-gray-700 mx-2"
          >
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">Compartilhar Reservas</p>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition text-sm font-medium"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Link
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Compartilhe este link com seus clientes para receberem reservas
            </p>
          </motion.div>
        )}

        <div className="absolute bottom-4 left-2 right-2 space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="text-sm font-medium"
            >
              Configurações
            </motion.span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="text-sm font-medium"
            >
              Sair
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold">
              RC
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
