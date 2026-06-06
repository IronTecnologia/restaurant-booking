'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialTab = 'register' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-2xl bg-gray-900 p-8 border border-amber-600/20"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">
          {tab === 'register' ? 'Criar Conta' : 'Entrar'}
        </h2>

        <p className="text-white/60 text-sm mb-6">
          Acesse a plataforma completa de autenticação para gerenciar sua conta.
        </p>

        <a href={`/login?tab=${tab}`} className="block">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 py-3 font-semibold text-white hover:from-amber-700 hover:to-orange-600 transition"
          >
            {tab === 'register' ? 'Criar Conta' : 'Entrar'}
          </motion.button>
        </a>

        <div className="mt-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-sm text-white/50">ou</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          onClick={() => setTab(tab === 'register' ? 'login' : 'register')}
          className="mt-6 w-full text-center text-sm text-amber-600 hover:text-amber-500"
        >
          {tab === 'register'
            ? 'Já tem conta? Entrar'
            : 'Não tem conta? Criar agora'}
        </button>
      </motion.div>
    </div>
  );
}
