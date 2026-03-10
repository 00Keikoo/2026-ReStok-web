/*
  Warnings:

  - You are about to drop the column `image` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "car_media" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car_media" ADD CONSTRAINT "car_media_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
