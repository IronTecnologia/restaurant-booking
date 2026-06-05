'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Reservas Automáticas',
      description: 'Sistema inteligente que gerencia reservas em tempo real, com confirmação automática ou aprovação manual.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Gestão de Mesas',
      description: 'Organize mesas por seção, capacidade e horários. Otimize cada espaço do seu restaurante.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Dashboard Completo',
      description: 'Visualize todas as reservas, confirmadas, pendentes e histórico. Relatórios em tempo real.',
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Integração WhatsApp',
      description: 'Confirmações automáticas e notificações via WhatsApp para clientes e staff.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Check-in na Recepção',
      description: 'Interface simples para registrar chegadas e saídas de clientes no local.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Sem Comissões',
      description: 'Planos transparentes e justos. Você controla seu negócio completamente.',
    },
  ];

  const testimonials = [
    {
      name: 'João Silva',
      restaurant: 'Restaurante Sabor Paulista',
      text: 'Aumentou nosso número de reservas em 40%. Sistema muito intuitivo!',
      avatar: '👨‍💼',
    },
    {
      name: 'Maria Santos',
      restaurant: 'Casa da Pasta',
      text: 'Melhorou muito a organização da nossa cozinha. Recomendo demais!',
      avatar: '👩‍💼',
    },
    {
      name: 'Carlos Oliveira',
      restaurant: 'Churrascaria Premium',
      text: 'Reduzimos no-shows drasticamente com as confirmações automáticas.',
      avatar: '👨‍💼',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-amber-600">RestaurantePro</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sistema de Reservas
              <span className="block text-amber-600">para Restaurantes Modernos</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Gerencie reservas, mesas e clientes de forma inteligente. Aumente lucros, reduza no-shows e melhore a experiência dos seus clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                Começar Agora <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition"
              >
                Acessar Minha Conta
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="text-3xl font-bold text-amber-600">500+</div>
                <div className="text-gray-600">Restaurantes Ativos</div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <div className="text-3xl font-bold text-amber-600">50K+</div>
                <div className="text-gray-600">Reservas/Mês</div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <div className="text-3xl font-bold text-amber-600">4.9★</div>
                <div className="text-gray-600">Avaliação Média</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-xl text-gray-600">
              Funcionalidades completas para gerenciar seu restaurante de forma eficiente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-gray-200 hover:border-amber-600 hover:shadow-lg transition"
              >
                <div className="text-amber-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que restaurantes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Milhares de proprietários confiam em nós
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.restaurant}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para transformar seu restaurante?
            </h2>
            <p className="text-xl text-amber-50 mb-8">
              Comece grátis hoje. Sem cartão de crédito necessário.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition"
              >
                Criar Conta Grátis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition"
              >
                Entrar
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-lg mb-4">RestaurantePro</div>
              <p className="text-sm">Sistema de reservas para restaurantes modernos.</p>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Produto</div>
              <ul className="text-sm space-y-2">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Documentação</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Suporte</div>
              <ul className="text-sm space-y-2">
                <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contato</Link></li>
                <li><Link href="#" className="hover:text-white transition">Status</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Legal</div>
              <ul className="text-sm space-y-2">
                <li><Link href="#" className="hover:text-white transition">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-white transition">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 RestaurantePro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
