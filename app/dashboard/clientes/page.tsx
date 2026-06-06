'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Calendar } from 'lucide-react';

export default function ClientesPage() {
  const customers = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 98765-4321', visits: 12, lastVisit: '03/06/2026' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 91234-5678', visits: 8, lastVisit: '01/06/2026' },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 99876-5432', visits: 15, lastVisit: '04/06/2026' },
    { id: 4, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 98765-1234', visits: 5, lastVisit: '02/06/2026' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
        >
          + Novo Cliente
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.map((customer) => (
          <motion.div
            key={customer.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.visits} visitas</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                {customer.name.charAt(0)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Última visita: {customer.lastVisit}
              </div>
            </div>

            <button className="w-full py-2 text-blue-600 hover:text-blue-800 font-semibold text-sm">
              Ver detalhes →
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
