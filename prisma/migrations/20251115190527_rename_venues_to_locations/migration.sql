/*
Warnings:

- You are about to rename the column `venue_id` to `location_id` on the `events` table.
- You are about to rename the `venues` table to `locations`.

 */
-- DropForeignKey
ALTER TABLE "events"
DROP CONSTRAINT "events_venue_id_fkey";

-- DropForeignKey
ALTER TABLE "venues"
DROP CONSTRAINT "venues_creator_id_fkey";

-- Rename column venue_id to location_id in events table
ALTER TABLE "events"
RENAME COLUMN "venue_id" TO "location_id";

-- Rename venues table to locations
ALTER TABLE "venues"
RENAME TO "locations";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;