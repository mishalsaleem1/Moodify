/*
  Warnings:

  - A unique constraint covering the columns `[spotifyId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "previewUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Song_spotifyId_key" ON "Song"("spotifyId");
