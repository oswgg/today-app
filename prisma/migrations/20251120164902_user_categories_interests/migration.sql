-- CreateTable
CREATE TABLE "user_interest_categories" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interest_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_categories_user_id_category_id_key" ON "user_interest_categories"("user_id", "category_id");

-- AddForeignKey
ALTER TABLE "user_interest_categories" ADD CONSTRAINT "user_interest_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_categories" ADD CONSTRAINT "user_interest_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
