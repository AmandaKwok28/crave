-- CreateTable
CREATE TABLE "RecipeSimilarity" (
    "id" SERIAL NOT NULL,
    "baseRecipeId" INTEGER NOT NULL,
    "similarRecipeId" INTEGER NOT NULL,
    "similarityScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeSimilarity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeSimilarity_baseRecipeId_similarityScore_idx" ON "RecipeSimilarity"("baseRecipeId", "similarityScore" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeSimilarity_baseRecipeId_similarRecipeId_key" ON "RecipeSimilarity"("baseRecipeId", "similarRecipeId");

-- AddForeignKey
ALTER TABLE "RecipeSimilarity" ADD CONSTRAINT "RecipeSimilarity_baseRecipeId_fkey" FOREIGN KEY ("baseRecipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSimilarity" ADD CONSTRAINT "RecipeSimilarity_similarRecipeId_fkey" FOREIGN KEY ("similarRecipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
