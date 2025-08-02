-- CreateTable
CREATE TABLE "public"."_prisma_seed_history" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_prisma_seed_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_categories" (
    "id" BIGSERIAL NOT NULL,
    "event_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,

    CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_prisma_seed_history_name_key" ON "public"."_prisma_seed_history"("name");

-- AddForeignKey
ALTER TABLE "public"."event_categories" ADD CONSTRAINT "event_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_categories" ADD CONSTRAINT "event_categories_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
