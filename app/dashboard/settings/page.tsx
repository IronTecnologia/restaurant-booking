'use client';

import { motion } from 'framer-motion';
import { Bell, Lock, User, Building2, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    restaurantName: 'Meu Restaurante',
    email: 'contato@restaurante.com.br',
    phone: '(11) 3333-3333',
    address: 'Rua Principal, 123 - São Paulo, SP',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-amber-100">
                <setting.icon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{setting.title}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Restaurant Info Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Informações do Restaurante</h2>
        <form className="space-y-4">
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
            type="submit"
            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            <Save className="h-5 w-5" />
            Salvar Alterações
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
