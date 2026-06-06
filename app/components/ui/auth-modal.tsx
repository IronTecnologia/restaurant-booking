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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = tab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = tab === 'register'
        ? { name, email, password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onClose();
        // Aqui você pode redirecionar ou atualizar o estado
        window.location.href = '/dashboard';
      } else {
        alert('Erro ao ' + (tab === 'register' ? 'registrar' : 'fazer login'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao conectar');
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nome do Restaurante
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/10 focus:border-amber-600 focus:outline-none"
                placeholder="Seu restaurante"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/10 focus:border-amber-600 focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/10 focus:border-amber-600 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-600 py-3 font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition"
          >
            {loading ? 'Processando...' : tab === 'register' ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

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
