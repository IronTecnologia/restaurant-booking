'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MapaMesasPage() {
  const tables = [
    { number: 'A1', capacity: 2, status: 'available' },
    { number: 'A2', capacity: 2, status: 'occupied' },
    { number: 'A3', capacity: 2, status: 'available' },
    { number: 'A4', capacity: 2, status: 'reserved' },
    { number: 'A5', capacity: 4, status: 'occupied' },
    { number: 'B1', capacity: 4, status: 'available' },
    { number: 'B2', capacity: 4, status: 'available' },
    { number: 'B3', capacity: 4, status: 'occupied' },
    { number: 'C1', capacity: 6, status: 'available' },
    { number: 'C2', capacity: 6, status: 'reserved' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Link href="/dashboard" className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
        <ArrowLeft className="h-5 w-5" />
        Voltar
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Mesas</h1>
        <p className="text-gray-600">Visualize e gerencie a disponibilidade de todas as mesas</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {tables.map((table) => (
            <motion.button
              key={table.number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-lg border-2 transition text-center font-semibold ${getStatusColor(table.status)}`}
            >
              <div className="text-2xl font-bold mb-1">{table.number}</div>
              <div className="text-xs mb-2">{table.capacity} pessoas</div>
              <div className="text-xs">{getStatusLabel(table.status)}</div>
            </motion.button>
          ))}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Legenda</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300" />
              <span className="text-sm text-gray-700">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-300" />
              <span className="text-sm text-gray-700">Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-300" />
              <span className="text-sm text-gray-700">Reservada</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
