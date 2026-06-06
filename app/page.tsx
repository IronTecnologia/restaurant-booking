'use client';

import { HeroParallax } from './components/ui/hero-parallax';
import Link from 'next/link';

const restaurantImages = [
  { title: 'La Cecilia', link: '/reserva/la-cecilia', thumbnail: '/restaurants/1.jpg' },
  { title: 'La Cabane', link: '/reserva/la-cabane', thumbnail: '/restaurants/2.jpg' },
  { title: 'Orgazz', link: '/reserva/orgazz', thumbnail: '/restaurants/3.jpg' },
  { title: 'Encontro', link: '/reserva/encontro', thumbnail: '/restaurants/4.jpg' },
  { title: 'Absolutto', link: '/reserva/absolutto', thumbnail: '/restaurants/5.jpg' },
  { title: 'Maro Vibe', link: '/reserva/maro-vibe', thumbnail: '/restaurants/6.jpg' },
  { title: 'Takeshi', link: '/reserva/takeshi', thumbnail: '/restaurants/7.jpg' },
  { title: 'Churrascaria', link: '/reserva/churrascaria', thumbnail: '/restaurants/8.jpg' },
  { title: 'La Cecilia', link: '/reserva/la-cecilia-2', thumbnail: '/restaurants/1.jpg' },
  { title: 'La Cabane', link: '/reserva/la-cabane-2', thumbnail: '/restaurants/2.jpg' },
  { title: 'Orgazz', link: '/reserva/orgazz-2', thumbnail: '/restaurants/3.jpg' },
  { title: 'Encontro', link: '/reserva/encontro-2', thumbnail: '/restaurants/4.jpg' },
  { title: 'Absolutto', link: '/reserva/absolutto-2', thumbnail: '/restaurants/5.jpg' },
  { title: 'Maro Vibe', link: '/reserva/maro-vibe-2', thumbnail: '/restaurants/6.jpg' },
  { title: 'Takeshi', link: '/reserva/takeshi-2', thumbnail: '/restaurants/7.jpg' },
];

export default function Home() {
  return (
    <div className="w-full">
      <div className="relative">
        <HeroParallax products={restaurantImages} />
      </div>

      {/* CTA Section */}
      <div className="relative h-[40rem] w-full flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-8">
            Pronto para gerenciar seu restaurante?
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Sistema inteligente de reservas que aumenta lucros, reduz no-shows e melhora a experiência dos clientes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Começar Grátis
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition"
            >
              Acessar Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
