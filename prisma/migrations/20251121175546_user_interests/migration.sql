-- CreateTable
CREATE TABLE "user_interest_locations" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "location_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interest_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interest_organizers" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "organizer_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interest_organizers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interest_events" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "event_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interest_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_locations_user_id_location_id_key" ON "user_interest_locations"("user_id", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_organizers_user_id_organizer_id_key" ON "user_interest_organizers"("user_id", "organizer_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_events_user_id_event_id_key" ON "user_interest_events"("user_id", "event_id");

-- AddForeignKey
ALTER TABLE "user_interest_locations" ADD CONSTRAINT "user_interest_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_locations" ADD CONSTRAINT "user_interest_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_organizers" ADD CONSTRAINT "user_interest_organizers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_organizers" ADD CONSTRAINT "user_interest_organizers_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_events" ADD CONSTRAINT "user_interest_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_events" ADD CONSTRAINT "user_interest_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
