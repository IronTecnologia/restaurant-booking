/*
  Warnings:

  - You are about to drop the column `cancellledAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `specialRequests` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `requirePayment` on the `restaurant_settings` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappMessage` on the `restaurant_settings` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `seats` on the `tables` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `tables` table. All the data in the column will be lost.
  - Added the required column `guestName` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestPhone` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `tables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `tables` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "restaurant_admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "restaurant_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "restaurant_admins_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "operating_hours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "operating_hours_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "arrivedAt" DATETIME NOT NULL,
    "departedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "check_ins_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "guestEmail" TEXT,
    "restaurantId" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "reservationDate" DATETIME NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'solicitada',
    "confirmationCode" TEXT NOT NULL,
    "confirmedAt" DATETIME,
    "checkedInAt" DATETIME,
    "finishedAt" DATETIME,
    "cancelledAt" DATETIME,
    "noShowAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reservations_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reservations_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reservations" ("confirmationCode", "confirmedAt", "createdAt", "guestCount", "id", "reservationDate", "restaurantId", "status", "tableId", "updatedAt") SELECT "confirmationCode", "confirmedAt", "createdAt", "guestCount", "id", "reservationDate", "restaurantId", "status", "tableId", "updatedAt" FROM "reservations";
DROP TABLE "reservations";
ALTER TABLE "new_reservations" RENAME TO "reservations";
CREATE UNIQUE INDEX "reservations_confirmationCode_key" ON "reservations"("confirmationCode");
CREATE INDEX "reservations_restaurantId_idx" ON "reservations"("restaurantId");
CREATE INDEX "reservations_status_idx" ON "reservations"("status");
CREATE INDEX "reservations_reservationDate_idx" ON "reservations"("reservationDate");
CREATE TABLE "new_restaurant_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "autoApprove" BOOLEAN NOT NULL DEFAULT false,
    "minGuestCount" INTEGER NOT NULL DEFAULT 1,
    "maxGuestCount" INTEGER NOT NULL DEFAULT 100,
    "minAdvanceHours" INTEGER NOT NULL DEFAULT 1,
    "maxAdvanceHours" INTEGER NOT NULL DEFAULT 720,
    "defaultTableOccupancyMin" INTEGER NOT NULL DEFAULT 60,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "confirmationMessage" TEXT NOT NULL DEFAULT 'Olá! Sua reserva foi confirmada 🎉

Restaurante: {restaurant}
Data: {date}
Hóspedes: {guests}
Código: {code}

Aguardamos sua visita!',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "restaurant_settings_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_restaurant_settings" ("autoApprove", "createdAt", "id", "maxGuestCount", "minGuestCount", "restaurantId", "updatedAt", "whatsappEnabled") SELECT "autoApprove", "createdAt", "id", "maxGuestCount", "minGuestCount", "restaurantId", "updatedAt", "whatsappEnabled" FROM "restaurant_settings";
DROP TABLE "restaurant_settings";
ALTER TABLE "new_restaurant_settings" RENAME TO "restaurant_settings";
CREATE UNIQUE INDEX "restaurant_settings_restaurantId_key" ON "restaurant_settings"("restaurantId");
CREATE TABLE "new_restaurants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "logo" TEXT,
    "coverImage" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "totalCapacity" INTEGER NOT NULL DEFAULT 20,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_restaurants" ("createdAt", "id", "name", "phone", "updatedAt") SELECT "createdAt", "id", "name", "phone", "updatedAt" FROM "restaurants";
DROP TABLE "restaurants";
ALTER TABLE "new_restaurants" RENAME TO "restaurants";
CREATE UNIQUE INDEX "restaurants_slug_key" ON "restaurants"("slug");
CREATE INDEX "restaurants_slug_idx" ON "restaurants"("slug");
CREATE TABLE "new_tables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tables_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tables" ("createdAt", "id", "restaurantId", "tableNumber", "updatedAt") SELECT "createdAt", "id", "restaurantId", "tableNumber", "updatedAt" FROM "tables";
DROP TABLE "tables";
ALTER TABLE "new_tables" RENAME TO "tables";
CREATE INDEX "tables_restaurantId_idx" ON "tables"("restaurantId");
CREATE UNIQUE INDEX "tables_restaurantId_tableNumber_key" ON "tables"("restaurantId", "tableNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_admins_userId_restaurantId_key" ON "restaurant_admins"("userId", "restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "operating_hours_restaurantId_dayOfWeek_key" ON "operating_hours"("restaurantId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_reservationId_key" ON "check_ins"("reservationId");
