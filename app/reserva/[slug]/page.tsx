import { Suspense } from "react";
import PublicRestaurantInfo from "@/components/PublicRestaurantInfo";
import PublicReservationForm from "@/components/PublicReservationForm";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getRestaurantData(slug: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/public/restaurants/${slug}`,
      {
        next: { revalidate: 300 }, // Cache por 5 minutos
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params;
  const restaurant = await getRestaurantData(slug);

  if (!restaurant) {
    return {
      title: "Restaurante não encontrado",
      description: "Este restaurante não existe ou está inativo.",
    };
  }

  return {
    title: `Reservar em ${restaurant.name} | ReservaMesa`,
    description: `Faça sua reserva em ${restaurant.name}. Localizado em ${restaurant.city}, ${restaurant.state}.`,
    openGraph: {
      title: restaurant.name,
      description: `Reservar mesa em ${restaurant.name}`,
      images: [restaurant.coverImage || restaurant.logo],
    },
  };
}

async function RestaurantContent({ slug }: { slug: string }) {
  const restaurant = await getRestaurantData(slug);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Restaurante não encontrado
          </h1>
          <p className="text-gray-600">
            Este restaurante não existe ou está inativo no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Restaurant Info */}
        <PublicRestaurantInfo restaurant={restaurant} />

        {/* Reservation Form */}
        <PublicReservationForm
          restaurantId={restaurant.id}
          minGuestCount={restaurant.settings.minGuestCount}
          maxGuestCount={restaurant.settings.maxGuestCount}
          minAdvanceHours={restaurant.settings.minAdvanceHours}
          maxAdvanceHours={restaurant.settings.maxAdvanceHours}
        />

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 py-8">
          <p>© 2026 ReservaMesa - Sistema de Reservas para Restaurantes</p>
        </div>
      </div>
    </div>
  );
}

export default async function ReservaPage(props: PageProps) {
  const { slug } = await props.params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando restaurante...</p>
          </div>
        </div>
      }
    >
      <RestaurantContent slug={slug} />
    </Suspense>
  );
}
