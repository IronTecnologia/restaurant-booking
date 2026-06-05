-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN "phone" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "phone" TEXT;

-- CreateTable
CREATE TABLE "restaurant_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "whatsappMessage" TEXT NOT NULL DEFAULT 'Olá! Sua reserva foi confirmada. Código: {code}',
    "autoApprove" BOOLEAN NOT NULL DEFAULT false,
    "requirePayment" BOOLEAN NOT NULL DEFAULT false,
    "minGuestCount" INTEGER NOT NULL DEFAULT 1,
    "maxGuestCount" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "restaurant_settings_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_settings_restaurantId_key" ON "restaurant_settings"("restaurantId");
