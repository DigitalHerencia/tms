/*
  Warnings:

  - You are about to drop the column `clerk_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_clerk_id_idx";

-- DropIndex
DROP INDEX "users_clerk_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clerk_id";
