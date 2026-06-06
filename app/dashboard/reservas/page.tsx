'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Phone } from 'lucide-react';

export default function ReservasPage() {
  const reservations = [
    { id: 1, name: 'João Silva', date: '05/06/2026', time: '12:00', party: 4, table: 'A5', phone: '(11) 98765-4321', status: 'Confirmada' },
    { id: 2, name: 'Maria Santos', date: '05/06/2026', time: '12:30', party: 2, table: 'B2', phone: '(11) 91234-5678', status: 'Confirmada' },
    { id: 3, name: 'Carlos Oliveira', date: '05/06/2026', time: '13:00', party: 6, table: 'C1-C2', phone: '(11) 99876-5432', status: 'Pendente' },
    { id: 4, name: 'Ana Costa', date: '06/06/2026', time: '19:30', party: 3, table: 'A2', phone: '(11) 98765-1234', status: 'Confirmada' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
        >
          + Nova Reserva
        </motion.button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hóspede</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data e Hora</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pessoas</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mesa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <motion.tr
                key={res.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="border-b border-gray-200"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{res.name}</p>
                    <p className="text-sm text-gray-600">{res.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {res.date} às {res.time}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Users className="h-4 w-4 text-gray-500" />
                    {res.party}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {res.table}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    res.status === 'Confirmada'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                    Editar
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
