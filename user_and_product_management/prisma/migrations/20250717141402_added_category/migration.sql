/*
  Warnings:

  - Added the required column `category_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "brand_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "category_id" TEXT NOT NULL,
    CONSTRAINT "product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_product" ("brand_id", "createdAt", "id", "name", "stock", "updatedAt") SELECT "brand_id", "createdAt", "id", "name", "stock", "updatedAt" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
CREATE UNIQUE INDEX "product_brand_id_name_key" ON "product"("brand_id", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
