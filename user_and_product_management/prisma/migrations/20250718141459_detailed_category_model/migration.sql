/*
  Warnings:

  - Added the required column `createdAt` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_category" ("description", "id", "name") SELECT "description", "id", "name" FROM "category";
DROP TABLE "category";
ALTER TABLE "new_category" RENAME TO "category";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
