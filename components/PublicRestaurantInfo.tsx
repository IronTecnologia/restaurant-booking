"use client";

interface RestaurantData {
  name: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  operatingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
}

interface PublicRestaurantInfoProps {
  restaurant: RestaurantData;
}

const dayNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export default function PublicRestaurantInfo({
  restaurant,
}: PublicRestaurantInfoProps) {
  const today = new Date();
  const todayIndex = today.getDay();
  const todayHours = restaurant.operatingHours.find(
    (h) => h.dayOfWeek === todayIndex
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      {restaurant.coverImage && (
        <div className="w-full h-64 bg-gray-200 relative">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Logo & Info */}
      <div className="px-6 py-8">
        <div className="flex items-start gap-4 mb-6">
          {restaurant.logo && (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {restaurant.name}
            </h1>
            {restaurant.address && (
              <p className="text-gray-600 mt-2">
                📍 {restaurant.address}
                {restaurant.city && `, ${restaurant.city}`}
                {restaurant.state && ` - ${restaurant.state}`}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              ☎️ {restaurant.phone}
            </a>
          )}
          {restaurant.whatsapp && (
            <a
              href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              💬 WhatsApp
            </a>
          )}
          {restaurant.instagram && (
            <a
              href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
            >
              📸 {restaurant.instagram}
            </a>
          )}
        </div>

        {/* Operating Hours */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">
            Horário de Funcionamento
          </h3>

          {/* Today's Status */}
          {todayHours && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Hoje ({dayNames[todayIndex]})
              </p>
              {todayHours.isClosed ? (
                <p className="text-red-600 font-semibold">Fechado</p>
              ) : (
                <p className="text-green-600 font-semibold">
                  {todayHours.openTime} às {todayHours.closeTime}
                </p>
              )}
            </div>
          )}

          {/* All Hours */}
          <div className="space-y-2 text-sm">
            {restaurant.operatingHours.map((hours) => (
              <div key={hours.dayOfWeek} className="flex justify-between">
                <span className="text-gray-600">{dayNames[hours.dayOfWeek]}</span>
                <span
                  className={
                    hours.isClosed
                      ? "text-red-600 font-medium"
                      : "text-gray-900"
                  }
                >
                  {hours.isClosed
                    ? "Fechado"
                    : `${hours.openTime} - ${hours.closeTime}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          ℹ️ Escolha a data e horário desejados para fazer sua reserva.
        </div>
      </div>
    </div>
  );
}
