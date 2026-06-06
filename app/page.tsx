'use client';

import { HeroParallax } from './components/ui/hero-parallax';
import Link from 'next/link';

const restaurantImages = [
  {
    title: 'Sabor Paulista',
    link: '/reserva/sabor-paulista',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4d71bcdd2d59?w=600&h=600&fit=crop',
  },
  {
    title: 'Casa da Pasta',
    link: '/reserva/casa-pasta',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop',
  },
  {
    title: 'Churrascaria Premium',
    link: '/reserva/churrascaria',
    thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561039?w=600&h=600&fit=crop',
  },
  {
    title: 'Sushi Artesanal',
    link: '/reserva/sushi',
    thumbnail: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=600&fit=crop',
  },
  {
    title: 'Pizzaria Napolitana',
    link: '/reserva/pizzaria',
    thumbnail: 'https://images.unsplash.com/photo-1564535404-b50879663b1d?w=600&h=600&fit=crop',
  },
  {
    title: 'Bistrô Francês',
    link: '/reserva/bistro',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=600&h=600&fit=crop',
  },
  {
    title: 'Restaurante Gourmet',
    link: '/reserva/gourmet',
    thumbnail: 'https://images.unsplash.com/photo-1504674900152-e370e30a3f1d?w=600&h=600&fit=crop',
  },
  {
    title: 'Chácara Tropical',
    link: '/reserva/tropical',
    thumbnail: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&h=600&fit=crop',
  },
  {
    title: 'Restaurante Tradicional',
    link: '/reserva/tradicional',
    thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=600&fit=crop',
  },
  {
    title: 'Casa do Açaí',
    link: '/reserva/acai',
    thumbnail: 'https://images.unsplash.com/photo-1559329007-40790c361d38?w=600&h=600&fit=crop',
  },
  {
    title: 'Churrascaria do Sul',
    link: '/reserva/churrascaria-sul',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop',
  },
  {
    title: 'Restaurante Vegetariano',
    link: '/reserva/vegetariano',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop',
  },
  {
    title: 'Seafood & Grill',
    link: '/reserva/seafood',
    thumbnail: 'https://images.unsplash.com/photo-1470521072507-9c876d2b7845?w=600&h=600&fit=crop',
  },
  {
    title: 'Café Boutique',
    link: '/reserva/cafe',
    thumbnail: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=600&fit=crop',
  },
  {
    title: 'Rotisseria Premium',
    link: '/reserva/rotisseria',
    thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561039?w=600&h=600&fit=crop',
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
