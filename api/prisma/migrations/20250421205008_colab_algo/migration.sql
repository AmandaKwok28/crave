/*
  Warnings:

  - You are about to drop the column `matchScore` on the `PartyRecommendation` table. All the data in the column will be lost.
  - Added the required column `similarityScore` to the `PartyRecommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PartyRecommendation" DROP COLUMN "matchScore",
ADD COLUMN     "similarityScore" DOUBLE PRECISION NOT NULL;
