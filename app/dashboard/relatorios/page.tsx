'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export default function RelatoriosPage() {
  const reports = [
    { label: 'Reservas', value: '0', change: '-', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Faturamento', value: 'R$ 0', change: '-', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Taxa de Ocupação', value: '0%', change: '-', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Novos Clientes', value: '0', change: '-', icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
        <p className="text-gray-600">Análise de desempenho e métricas do seu restaurante</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report) => (
          <motion.div
            key={report.label}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{report.label}</h3>
              <div className={`${report.color} p-3 rounded-lg`}>
                <report.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold text-gray-900">{report.value}</p>
            </div>
            <p className="text-xs text-green-600 font-semibold">{report.change} este mês</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Desempenho Mensal</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          [Gráfico de desempenho aqui]
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Horários de Pico</h2>
          <p className="text-gray-500 text-center py-8">Dados não disponíveis. Comece a receber reservas para ver análises.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mesas Mais Utilizadas</h2>
          <p className="text-gray-500 text-center py-8">Dados não disponíveis. Comece a receber reservas para ver análises.</p>
        </div>
      </div>
    </motion.div>
  );
}
