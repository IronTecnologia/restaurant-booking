'use client';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Sistema de Reservas</h1>
        <p className="text-xl mb-8">Testando página inicial</p>
        <a href="/login" className="bg-amber-600 text-white px-6 py-3 rounded-lg">
          Entrar
        </a>
      </div>
    </main>
  );
}
