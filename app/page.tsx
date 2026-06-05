import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Sistema de Reserva de Restaurante
        </h1>
        <p className="text-blue-100 text-lg mb-8">
          Reserve sua mesa com otimização de IA
        </p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="block bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-400 transition"
          >
            Criar Conta
          </Link>
        </div>

        <div className="mt-8 bg-blue-500 bg-opacity-50 rounded-lg p-4 text-center">
          <p className="text-blue-100 text-sm mb-1">Plano Starter</p>
          <p className="text-3xl font-bold text-white">R$ 79,90</p>
          <p className="text-blue-100 text-sm">por mês</p>
        </div>

        <div className="mt-12 space-y-4 text-left text-white">
          <h2 className="text-xl font-semibold">Recursos</h2>
          <ul className="space-y-2 text-blue-100">
            <li>✓ Recomendações de mesa com IA</li>
            <li>✓ Verificação de disponibilidade em tempo real</li>
            <li>✓ Gerenciamento seguro de reservas</li>
            <li>✓ Códigos de confirmação instantâneos</li>
            <li>✓ IA otimizada (90% economia de tokens)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
