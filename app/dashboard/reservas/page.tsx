'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Phone, Edit2, LogIn, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReservasPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));

  const [reservations, setReservations] = useState([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', phone: '', table: '', time: '' });

  const handleCheckIn = (id: number) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, status: 'Check-in' } : res
    ));
  };

  const handleEdit = (res: any) => {
    setEditingId(res.id);
    setEditData({ name: res.name, phone: res.phone, table: res.table, time: res.time });
  };

  const handleSaveEdit = (id: number) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, ...editData } : res
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDeleteReservation = (id: number) => {
    setReservations(reservations.filter(res => res.id !== id));
  };

  const reservationsByDate = useMemo(() => {
    const map: { [key: string]: number } = {};
    reservations.forEach(res => {
      const [day, month, year] = res.date.split('/');
      const dateStr = `${year}-${month}-${day}`;
      map[dateStr] = (map[dateStr] || 0) + 1;
    });
    return map;
  }, [reservations]);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => i);

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

      {/* Calendário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            {emptyDays.map(i => <div key={`empty-${i}`} />)}
            {calendarDays.map(day => {
              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const count = reservationsByDate[dateStr] || 0;
              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold cursor-pointer transition ${
                    count > 0
                      ? 'bg-amber-100 text-amber-900 border-2 border-amber-600'
                      : 'bg-gray-50 text-gray-900 border border-gray-200'
                  }`}
                >
                  {day}
                </motion.div>
              );
            })}
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <p>🟨 Quadrado destacado = há reservas no dia</p>
          </div>
        </div>

        {/* Tabela de Reservas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Reservas do Mês</h3>
          </div>
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
                      : res.status === 'Check-in'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {editingId === res.id ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleSaveEdit(res.id)}
                        className="text-green-600 hover:text-green-800 font-semibold text-sm"
                      >
                        Salvar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-800 font-semibold text-sm"
                      >
                        Cancelar
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleEdit(res)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </motion.button>
                      {res.status !== 'Check-in' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleCheckIn(res.id)}
                          className="text-green-600 hover:text-green-800 font-semibold text-sm inline-flex items-center gap-1"
                        >
                          <LogIn className="h-4 w-4" />
                          Check-in
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleDeleteReservation(res.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </motion.button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Editar Reserva</h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mesa</label>
                <input
                  type="text"
                  value={editData.table}
                  onChange={(e) => setEditData({ ...editData, table: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                <input
                  type="time"
                  value={editData.time}
                  onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEdit(editingId)}
                  className="flex-1 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
