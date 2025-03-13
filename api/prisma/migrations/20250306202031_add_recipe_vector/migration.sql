-- CreateTable
CREATE TABLE "RecipeFeatureVector" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "vector" DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeFeatureVector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeFeatureVector_recipeId_key" ON "RecipeFeatureVector"("recipeId");

-- AddForeignKey
ALTER TABLE "RecipeFeatureVector" ADD CONSTRAINT "RecipeFeatureVector_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
