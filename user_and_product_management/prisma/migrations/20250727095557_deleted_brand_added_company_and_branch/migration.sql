/*
  Warnings:

  - You are about to drop the `brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `brand_id` on the `product` table. All the data in the column will be lost.
  - Added the required column `branch_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "brand";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "branch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_admin" ("createdAt", "id", "password", "updatedAt", "username") SELECT "createdAt", "id", "password", "updatedAt", "username" FROM "admin";
DROP TABLE "admin";
ALTER TABLE "new_admin" RENAME TO "admin";
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");
CREATE TABLE "new_category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_category" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "category";
DROP TABLE "category";
ALTER TABLE "new_category" RENAME TO "category";
CREATE TABLE "new_product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "branch_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "category_id" TEXT NOT NULL,
    CONSTRAINT "product_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category_id", "createdAt", "id", "name", "stock", "updatedAt") SELECT "category_id", "createdAt", "id", "name", "stock", "updatedAt" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
CREATE UNIQUE INDEX "product_branch_id_name_key" ON "product"("branch_id", "name");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user" ("createdAt", "id", "name", "password", "profession", "surname", "updatedAt", "username") SELECT "createdAt", "id", "name", "password", "profession", "surname", "updatedAt", "username" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
