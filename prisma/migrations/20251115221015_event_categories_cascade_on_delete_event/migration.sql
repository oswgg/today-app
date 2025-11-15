-- DropForeignKey
ALTER TABLE "event_categories" DROP CONSTRAINT "event_categories_event_id_fkey";

-- AlterTable
ALTER TABLE "locations" RENAME CONSTRAINT "venues_pkey" TO "locations_pkey";

-- AddForeignKey
ALTER TABLE "event_categories" ADD CONSTRAINT "event_categories_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
