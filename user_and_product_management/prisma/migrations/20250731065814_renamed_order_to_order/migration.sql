/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Order";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order_products" (
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("order_id", "product_id"),
    CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_order_products" ("count", "order_id", "product_id") SELECT "count", "order_id", "product_id" FROM "order_products";
DROP TABLE "order_products";
ALTER TABLE "new_order_products" RENAME TO "order_products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
