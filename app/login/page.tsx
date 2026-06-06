'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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

      const data = await res.json();

      if (res.ok) {
        setSuccess(tab === 'register' ? 'Conta criada! Redirecionando...' : 'Login bem-sucedido! Redirecionando...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setError(data.message || 'Erro ao processar requisição');
      }
    } catch (error) {
      setError('Erro ao conectar. Tente novamente.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2 text-amber-600 hover:text-amber-500 mb-8">
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Reserva Sua Mesa</h1>
            <p className="text-white/60">Gerencie seu restaurante com eficiência</p>
          </div>

          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                tab === 'login'
                  ? 'bg-amber-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                tab === 'register'
                  ? 'bg-amber-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nome do Restaurante
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu restaurante"
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/10 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600/50 transition"
                  required={tab === 'register'}
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/10 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600/50 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/10 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600/50 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
              >
                {success}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 py-3 font-semibold text-white hover:from-amber-700 hover:to-orange-600 disabled:opacity-50 transition"
            >
              {loading
                ? 'Processando...'
                : tab === 'register'
                  ? 'Criar Conta'
                  : 'Entrar'}
            </motion.button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-sm text-white/50">ou</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-sm text-white/60">
            {tab === 'register' ? 'Já tem conta?' : 'Não tem conta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setTab(tab === 'register' ? 'login' : 'register');
                setError('');
                setSuccess('');
              }}
              className="text-amber-600 hover:text-amber-500 font-medium"
            >
              {tab === 'register' ? 'Entrar aqui' : 'Criar agora'}
            </button>
          </p>
        </div>

        <p className="text-center text-white/40 text-xs mt-8">
          Ao se registrar, você concorda com nossos <br />
          <a href="#" className="text-amber-600 hover:text-amber-500">
            Termos de Serviço
          </a>
          {' '}e{' '}
          <a href="#" className="text-amber-600 hover:text-amber-500">
            Política de Privacidade
          </a>
        </p>
      </motion.div>
    </div>
  );
}
