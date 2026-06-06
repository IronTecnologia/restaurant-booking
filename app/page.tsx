'use client';

import { HeroParallax } from './components/ui/hero-parallax';
import Link from 'next/link';

const restaurantImages = [
  {
    title: 'La Cecilia',
    link: '/reserva/la-cecilia',
    thumbnail: '/restaurants/La_Cecilia_Cantina_e_Cafe_Foto_Fachada.jpg',
  },
  {
    title: 'La Cabane',
    link: '/reserva/la-cabane',
    thumbnail: '/restaurants/Fachada-La-Cabane_JP-Divulgacao-1024x683.jpg',
  },
  {
    title: 'Orgazz',
    link: '/reserva/orgazz',
    thumbnail: '/restaurants/restaurante-orgaz132.jpg',
  },
  {
    title: 'Encontro',
    link: '/reserva/encontro',
    thumbnail: '/restaurants/Fachada-de-Restaurante-Simples-Como-Criar-um-Visual-Acolhedor-e-Convidativo-1024x612.jpg',
  },
  {
    title: 'Absolutto',
    link: '/reserva/absolutto',
    thumbnail: '/restaurants/fachada-do-restaurante.jpg',
  },
  {
    title: 'Maro Vibe',
    link: '/reserva/maro-vibe',
    thumbnail: '/restaurants/fachada-do-restaurante (1).jpg',
  },
  {
    title: 'Takeshi',
    link: '/reserva/takeshi',
    thumbnail: '/restaurants/Fonte-Pinterest-5.jpg',
  },
  {
    title: 'Churrascaria',
    link: '/reserva/churrascaria',
    thumbnail: '/restaurants/490b640ca8bb4726489296c98509fdb6.jpg',
  },
  {
    title: 'La Cecilia',
    link: '/reserva/la-cecilia-2',
    thumbnail: '/restaurants/La_Cecilia_Cantina_e_Cafe_Foto_Fachada.jpg',
  },
  {
    title: 'La Cabane',
    link: '/reserva/la-cabane-2',
    thumbnail: '/restaurants/Fachada-La-Cabane_JP-Divulgacao-1024x683.jpg',
  },
  {
    title: 'Orgazz',
    link: '/reserva/orgazz-2',
    thumbnail: '/restaurants/restaurante-orgaz132.jpg',
  },
  {
    title: 'Encontro',
    link: '/reserva/encontro-2',
    thumbnail: '/restaurants/Fachada-de-Restaurante-Simples-Como-Criar-um-Visual-Acolhedor-e-Convidativo-1024x612.jpg',
  },
  {
    title: 'Absolutto',
    link: '/reserva/absolutto-2',
    thumbnail: '/restaurants/fachada-do-restaurante.jpg',
  },
  {
    title: 'Maro Vibe',
    link: '/reserva/maro-vibe-2',
    thumbnail: '/restaurants/fachada-do-restaurante (1).jpg',
  },
  {
    title: 'Takeshi',
    link: '/reserva/takeshi-2',
    thumbnail: '/restaurants/Fonte-Pinterest-5.jpg',
  },
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
