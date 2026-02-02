/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "locale" SET DEFAULT 'ru',
ALTER COLUMN "timezone" SET DEFAULT 'Europe/Minsk';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastName" TEXT;
