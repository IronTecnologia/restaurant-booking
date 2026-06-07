'use client';

import { motion } from 'framer-motion';
import { Save, X, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    email: '',
    phone: '',
    address: '',
    salonCapacity: '',
    reservationPercentage: '',
    reservationType: 'mesa',
  });

  const [specialDates, setSpecialDates] = useState([]);

  const [newDate, setNewDate] = useState({ date: '', name: '', start: '18:00', end: '22:00', tables: '' });
  const [showAddDate, setShowAddDate] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveRestaurantInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('✅ Informações salvas com sucesso!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSaveCapacity = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('✅ Configuração de capacidade salva!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleAddSpecialDate = () => {
    if (newDate.date && newDate.name && newDate.tables) {
      setSpecialDates([
        ...specialDates,
        { date: newDate.date, name: newDate.name, windows: [{ start: newDate.start, end: newDate.end }], tables: newDate.tables }
      ]);
      setNewDate({ date: '', name: '', start: '18:00', end: '22:00', tables: '' });
      setShowAddDate(false);
    }
  };

  const handleRemoveSpecialDate = (index: number) => {
    setSpecialDates(specialDates.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie as informações e preferências do seu restaurante</p>
      </div>

      {/* Mensagem de Sucesso */}
      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg"
        >
          {savedMessage}
        </motion.div>
      )}

      {/* Restaurant Info Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Informações do Restaurante</h2>
        <form onSubmit={handleSaveRestaurantInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Restaurante
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSaveRestaurantInfo}
            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            <Save className="h-5 w-5" />
            Salvar Alterações
          </button>
        </form>
      </div>

      {/* Configurações de Capacidade */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Capacidade do Salão</h2>
        <form onSubmit={handleSaveCapacity} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidade Total do Salão (pessoas)
              </label>
              <input
                type="number"
                name="salonCapacity"
                value={formData.salonCapacity}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentual para Reservas (%)
              </label>
              <input
                type="number"
                name="reservationPercentage"
                value={formData.reservationPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Até {Math.round(Number(formData.salonCapacity) * Number(formData.reservationPercentage) / 100)} pessoas
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Reserva
              </label>
              <select
                name="reservationType"
                value={formData.reservationType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              >
                <option value="mesa">Por Mesa</option>
                <option value="pessoas">Por Número de Pessoas</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSaveCapacity}
            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            <Save className="h-5 w-5" />
            Salvar Capacidade
          </button>
        </form>
      </div>

      {/* Datas Especiais */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Datas Especiais</h2>
          <button
            onClick={() => setShowAddDate(true)}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Adicionar Data
          </button>
        </div>

        {showAddDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 border-2 border-amber-200 rounded-lg bg-amber-50 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={newDate.date}
                  onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Evento</label>
                <input
                  type="text"
                  value={newDate.name}
                  onChange={(e) => setNewDate({ ...newDate, name: e.target.value })}
                  placeholder="Ex: Festa de São João"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário Entrada</label>
                <input
                  type="time"
                  value={newDate.start}
                  onChange={(e) => setNewDate({ ...newDate, start: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário Saída</label>
                <input
                  type="time"
                  value={newDate.end}
                  onChange={(e) => setNewDate({ ...newDate, end: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mesas Disponíveis</label>
              <input
                type="text"
                value={newDate.tables}
                onChange={(e) => setNewDate({ ...newDate, tables: e.target.value })}
                placeholder="Ex: A1, A2, B1, B2, C1"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-600 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separe as mesas por vírgula
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddSpecialDate}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowAddDate(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}

        {specialDates.length > 0 ? (
          <div className="space-y-3">
            {specialDates.map((special, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{special.name}</h4>
                  <p className="text-sm text-gray-600">{special.date}</p>
                  <p className="text-sm text-gray-600">
                    {special.windows.map(w => `${w.start} - ${w.end}`).join(', ')}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    📍 Mesas: {special.tables}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSpecialDate(idx)}
                  className="text-red-600 hover:text-red-800 p-1"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhuma data especial configurada</p>
        )}
      </div>
    </motion.div>
  );
}
