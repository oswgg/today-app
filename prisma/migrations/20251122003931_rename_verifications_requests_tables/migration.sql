/*
  Warnings:

  - You are about to drop the `VerificationDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationDocument" DROP CONSTRAINT "VerificationDocument_request_id_fkey";

-- DropForeignKey
ALTER TABLE "VerificationRequest" DROP CONSTRAINT "VerificationRequest_user_id_fkey";

-- DropTable
DROP TABLE "VerificationDocument";

-- DropTable
DROP TABLE "VerificationRequest";

-- CreateTable
CREATE TABLE "verification_requests" (
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

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_documents" (
    "id" BIGSERIAL NOT NULL,
    "request_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "file_type" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "verification_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
