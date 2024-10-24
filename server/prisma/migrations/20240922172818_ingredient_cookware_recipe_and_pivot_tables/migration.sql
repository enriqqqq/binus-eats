-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('KILOGRAM', 'LITER', 'CUP', 'TABLESPOON', 'TEASPOON', 'PIECE');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantityUnit" "QuantityUnit" NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cookware" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Cookware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeCookware" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "cookwareId" TEXT NOT NULL,

    CONSTRAINT "RecipeCookware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserIngredient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "UserIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCookware" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cookwareId" TEXT NOT NULL,

    CONSTRAINT "UserCookware_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCookware" ADD CONSTRAINT "RecipeCookware_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCookware" ADD CONSTRAINT "RecipeCookware_cookwareId_fkey" FOREIGN KEY ("cookwareId") REFERENCES "Cookware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIngredient" ADD CONSTRAINT "UserIngredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIngredient" ADD CONSTRAINT "UserIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCookware" ADD CONSTRAINT "UserCookware_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCookware" ADD CONSTRAINT "UserCookware_cookwareId_fkey" FOREIGN KEY ("cookwareId") REFERENCES "Cookware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
