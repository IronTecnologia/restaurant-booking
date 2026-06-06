'use client';

import { HeroParallax } from './components/ui/hero-parallax';
import Link from 'next/link';

const restaurantImages = [
  {
    title: 'Sabor Paulista',
    link: '/reserva/sabor-paulista',
    thumbnail: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Casa da Pasta',
    link: '/reserva/casa-pasta',
    thumbnail: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Churrascaria Premium',
    link: '/reserva/churrascaria',
    thumbnail: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Sushi Artesanal',
    link: '/reserva/sushi',
    thumbnail: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Pizzaria Napolitana',
    link: '/reserva/pizzaria',
    thumbnail: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Bistrô Francês',
    link: '/reserva/bistro',
    thumbnail: 'https://images.pexels.com/photos/1397911/pexels-photo-1397911.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Restaurante Gourmet',
    link: '/reserva/gourmet',
    thumbnail: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Chácara Tropical',
    link: '/reserva/tropical',
    thumbnail: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Restaurante Tradicional',
    link: '/reserva/tradicional',
    thumbnail: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Casa do Açaí',
    link: '/reserva/acai',
    thumbnail: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Churrascaria do Sul',
    link: '/reserva/churrascaria-sul',
    thumbnail: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Restaurante Vegetariano',
    link: '/reserva/vegetariano',
    thumbnail: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Seafood & Grill',
    link: '/reserva/seafood',
    thumbnail: 'https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Café Boutique',
    link: '/reserva/cafe',
    thumbnail: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=600&h=600&fit=crop',
  },
  {
    title: 'Rotisseria Premium',
    link: '/reserva/rotisseria',
    thumbnail: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?w=600&h=600&fit=crop',
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
