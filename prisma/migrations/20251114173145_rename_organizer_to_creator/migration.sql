/*
  Warnings:

  - The values [user,organizer] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `organizer_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `venues` table. All the data in the column will be lost.
  - You are about to drop the column `organizer_id` on the `venues` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ORGANIZER', 'INSTITUTION');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "venues" DROP CONSTRAINT "venues_organizer_id_fkey";

-- AlterTable
ALTER TABLE "events" RENAME COLUMN "organizer_id" TO "creator_id";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "image_url";
ALTER TABLE "venues" RENAME COLUMN "organizer_id" TO "creator_id";

-- CreateTable
CREATE TABLE "organizer_profiles" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "organizer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_profiles" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "description" TEXT,
    "website" TEXT,

    CONSTRAINT "institution_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizer_profiles_userId_key" ON "organizer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "institution_profiles_userId_key" ON "institution_profiles"("userId");

-- AddForeignKey
ALTER TABLE "organizer_profiles" ADD CONSTRAINT "organizer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_profiles" ADD CONSTRAINT "institution_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venues" ADD CONSTRAINT "venues_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
