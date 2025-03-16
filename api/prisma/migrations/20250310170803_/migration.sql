/*
  Warnings:

  - A unique constraint covering the columns `[recipeId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_recipeId_userId_key" ON "Like"("recipeId", "userId");
