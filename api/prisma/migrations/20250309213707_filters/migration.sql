-- CreateEnum
CREATE TYPE "Price" AS ENUM ('CHEAP', 'MODERATE', 'PRICEY', 'EXPENSIVE');

-- CreateEnum
CREATE TYPE "Cuisine" AS ENUM ('ITALIAN', 'MEXICAN', 'CHINESE', 'INDIAN', 'JAPANESE', 'FRENCH', 'MEDITERRANEAN', 'AMERICAN');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cuisine" "Cuisine",
ADD COLUMN     "difficulty" "Difficulty",
ADD COLUMN     "mealTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prepTime" INTEGER,
ADD COLUMN     "price" "Price",
ADD COLUMN     "sources" TEXT[] DEFAULT ARRAY[]::TEXT[];
