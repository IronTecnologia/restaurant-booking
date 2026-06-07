'use client';

import { motion } from 'framer-motion';
import { Bell, Lock, User, Building2, Save, Calendar, X, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    restaurantName: 'Meu Restaurante',
    email: 'contato@restaurante.com.br',
    phone: '(11) 3333-3333',
    address: 'Rua Principal, 123 - São Paulo, SP',
    salonCapacity: '100',
    reservationPercentage: '70',
    reservationType: 'mesa',
  });

  const [specialDates, setSpecialDates] = useState([
    { date: '2026-06-24', name: 'Festa de São João', windows: [{ start: '18:00', end: '22:00' }] },
  ]);

  const [newDate, setNewDate] = useState({ date: '', name: '', start: '18:00', end: '22:00' });
  const [showAddDate, setShowAddDate] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [activeSection, setActiveSection] = useState('info');

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
    if (newDate.date && newDate.name) {
      setSpecialDates([
        ...specialDates,
        { date: newDate.date, name: newDate.name, windows: [{ start: newDate.start, end: newDate.end }] }
      ]);
      setNewDate({ date: '', name: '', start: '18:00', end: '22:00' });
      setShowAddDate(false);
    }
  };

  const handleRemoveSpecialDate = (index: number) => {
    setSpecialDates(specialDates.filter((_, i) => i !== index));
  };

  const settings = [
    { icon: User, title: 'Perfil', description: 'Atualize informações do restaurante' },
    { icon: Lock, title: 'Segurança', description: 'Altere sua senha e permissões' },
    { icon: Bell, title: 'Notificações', description: 'Configure alertas de reservas' },
    { icon: Building2, title: 'Configurações da Loja', description: 'Horários e políticas' },
  ];

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

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveSection(setting.title.toLowerCase())}
            className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-md transition text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-amber-100">
                <setting.icon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{setting.title}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <div className="text-gray-400 hover:text-gray-600">
                →
              </div>
            </div>
          </motion.button>
        ))}
      </div>

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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            <Save className="h-5 w-5" />
            Salvar Alterações
          </motion.button>
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            <Save className="h-5 w-5" />
            Salvar Capacidade
          </motion.button>
        </form>
      </div>

      {/* Datas Especiais */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Datas Especiais</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddDate(true)}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Adicionar Data
          </motion.button>
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

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleAddSpecialDate}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Adicionar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowAddDate(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancelar
              </motion.button>
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
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveSpecialDate(idx)}
                  className="text-red-600 hover:text-red-800"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </motion.button>
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
