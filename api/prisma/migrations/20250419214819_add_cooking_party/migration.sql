-- CreateEnum
CREATE TYPE "PartyStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "CookingParty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "PartyStatus" NOT NULL DEFAULT 'PENDING',
    "shareLink" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "hostId" TEXT NOT NULL,

    CONSTRAINT "CookingParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyMember" (
    "id" SERIAL NOT NULL,
    "partyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasAccepted" BOOLEAN NOT NULL DEFAULT false,
    "ingredients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cookingAbility" "Difficulty",

    CONSTRAINT "PartyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyPreference" (
    "id" SERIAL NOT NULL,
    "partyId" TEXT NOT NULL,
    "availableTime" INTEGER,
    "preferredCuisines" "Cuisine"[] DEFAULT ARRAY[]::"Cuisine"[],
    "preferredPrice" "Price",
    "aggregatedIngredients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "excludedAllergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredDifficulty" "Difficulty",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartyPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyRecommendation" (
    "id" SERIAL NOT NULL,
    "partyId" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartyRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CookingParty_shareLink_key" ON "CookingParty"("shareLink");

-- CreateIndex
CREATE UNIQUE INDEX "PartyMember_partyId_userId_key" ON "PartyMember"("partyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyPreference_partyId_key" ON "PartyPreference"("partyId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyRecommendation_partyId_recipeId_key" ON "PartyRecommendation"("partyId", "recipeId");

-- AddForeignKey
ALTER TABLE "CookingParty" ADD CONSTRAINT "CookingParty_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyMember" ADD CONSTRAINT "PartyMember_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "CookingParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyMember" ADD CONSTRAINT "PartyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyPreference" ADD CONSTRAINT "PartyPreference_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "CookingParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyRecommendation" ADD CONSTRAINT "PartyRecommendation_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "CookingParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyRecommendation" ADD CONSTRAINT "PartyRecommendation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
