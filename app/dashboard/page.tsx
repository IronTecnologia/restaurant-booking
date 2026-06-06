'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const stats = [
    {
      label: 'Reservas Hoje',
      value: '12',
      change: '+2 desde ontem',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      label: 'Clientes Ativos',
      value: '234',
      change: '+12 este mês',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Taxa de Ocupação',
      value: '85%',
      change: '+5% comparado a semana passada',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Tempo Médio de Espera',
      value: '12 min',
      change: '-3 min desde ontem',
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  const upcomingReservations = [
    { time: '12:00', name: 'João Silva', party: 4, table: 'A5' },
    { time: '12:30', name: 'Maria Santos', party: 2, table: 'B2' },
    { time: '13:00', name: 'Carlos Oliveira', party: 6, table: 'C1-C2' },
    { time: '19:30', name: 'Ana Costa', party: 3, table: 'A2' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo ao seu Restaurante! 👨‍🍳
        </h2>
        <p className="text-gray-600">
          Aqui você gerencia reservas, clientes e acompanha o desempenho do seu restaurante.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Reservations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Próximas Reservas Hoje</h3>
          <div className="space-y-3">
            {upcomingReservations.map((reservation, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold text-gray-900">{reservation.name}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.party} pessoas • Mesa {reservation.table}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-amber-600">{reservation.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Link href="/dashboard/reservas" className="block w-full mt-4">
            <button className="w-full py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium">
              Ver todas as reservas →
            </button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <motion.button
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
            >
              + Nova Reserva
            </motion.button>
            <Link href="/dashboard/mapa-mesas" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Mapa de Mesas
              </motion.button>
            </Link>
            <Link href="/dashboard/convidados" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Convidados Hoje
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
          <h4 className="font-bold text-amber-900 mb-2">💡 Dica do Dia</h4>
          <p className="text-sm text-amber-800">
            Confirme automaticamente as reservas com mais de 48h de antecedência para reduzir no-shows.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <h4 className="font-bold text-blue-900 mb-2">📊 Análise</h4>
          <p className="text-sm text-blue-800">
            Seu restaurante teve 156 reservas no mês passado com taxa de confirmação de 94%.
          </p>
        </div>
      </motion.div>

      {/* Modal Nova Reserva */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nova Reserva</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                <input type="time" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Pessoas</label>
                <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition font-medium"
                >
                  Criar Reserva
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
