-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('NO_VERIFIED', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RequestedRole" AS ENUM ('ORGANIZER', 'INSTITUTION');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'NO_VERIFIED';

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "requested_role" "RequestedRole" NOT NULL,
    "business_name" TEXT NOT NULL,
    "socials_networks" TEXT[],
    "google_maps_url" TEXT,
    "website_url" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationDocument" (
    "id" BIGSERIAL NOT NULL,
    "request_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "file_type" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "VerificationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
