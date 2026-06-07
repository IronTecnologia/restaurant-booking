'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReservaPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simula envio - em produção, chamaria uma API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        notes: '',
      });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Erro ao enviar reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-600">
            🍽️ Reserva Sua Mesa
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition">
            Voltar
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Reserve sua Mesa
              </h1>
              <p className="text-gray-400 text-lg">
                Escolha o melhor horário para você e sua família
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-semibold">Horários</p>
                  <p className="text-sm text-gray-400">11:30 - 23:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Users className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-semibold">Capacidade</p>
                  <p className="text-sm text-gray-400">2 até 100 pessoas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-semibold">Contato</p>
                  <p className="text-sm text-gray-400">(11) 3333-3333</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
              <p className="text-amber-600 text-sm">
                ✨ Reserve com 24h de antecedência e receba confirmação automática!
              </p>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-xl p-8"
          >
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-400">Reserva enviada!</p>
                  <p className="text-sm text-green-300">Você receberá uma confirmação em breve.</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-400">Erro</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Data
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Hora
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Número de Pessoas
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-amber-600 focus:outline-none transition"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'pessoa' : 'pessoas'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition resize-none"
                  placeholder="Alguma preferência especial?"
                  rows={3}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold hover:from-amber-700 hover:to-orange-600 disabled:opacity-50 transition"
              >
                {loading ? 'Enviando...' : 'Confirmar Reserva'}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Ao reservar, você concorda com nossos{' '}
                <a href="#" className="text-amber-600 hover:text-amber-500">
                  Termos de Serviço
                </a>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
