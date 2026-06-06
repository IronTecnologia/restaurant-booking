'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Check, Clock } from 'lucide-react';

export default function ConvidadosPage() {
  const guests = [
    { name: 'João Silva', time: '12:00', party: 4, status: 'confirmado', table: 'A5' },
    { name: 'Maria Santos', time: '12:30', party: 2, status: 'confirmado', table: 'B2' },
    { name: 'Carlos Oliveira', time: '13:00', party: 6, status: 'pendente', table: 'C1-C2' },
    { name: 'Ana Costa', time: '19:30', party: 3, status: 'confirmado', table: 'A2' },
    { name: 'Pedro Gomes', time: '20:00', party: 5, status: 'pendente', table: null },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Convidados Hoje</h1>
        <p className="text-gray-600">Acompanhe todas as chegadas e confirmações do dia</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {guests.map((guest, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 rounded-lg p-6 hover:border-amber-300 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{guest.name}</h3>
                  <p className="text-sm text-gray-600">{guest.party} pessoas</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  guest.status === 'confirmado'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {guest.status === 'confirmado' ? (
                    <>
                      <Check className="h-3 w-3" />
                      Confirmado
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      Pendente
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <p className="text-gray-700">
                  <span className="text-gray-500">Horário:</span> {guest.time}
                </p>
                {guest.table && (
                  <p className="text-gray-700">
                    <span className="text-gray-500">Mesa:</span> {guest.table}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {guest.status === 'pendente' && (
                  <button className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-sm font-medium">
                    Confirmar
                  </button>
                )}
                <button className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
                  Detalhes
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
