-- DropForeignKey
ALTER TABLE "RecipeCookware" DROP CONSTRAINT "RecipeCookware_cookwareId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeCookware" DROP CONSTRAINT "RecipeCookware_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "UserCookware" DROP CONSTRAINT "UserCookware_cookwareId_fkey";

-- DropForeignKey
ALTER TABLE "UserCookware" DROP CONSTRAINT "UserCookware_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserIngredient" DROP CONSTRAINT "UserIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "UserIngredient" DROP CONSTRAINT "UserIngredient_userId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCookware" ADD CONSTRAINT "RecipeCookware_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCookware" ADD CONSTRAINT "RecipeCookware_cookwareId_fkey" FOREIGN KEY ("cookwareId") REFERENCES "Cookware"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIngredient" ADD CONSTRAINT "UserIngredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIngredient" ADD CONSTRAINT "UserIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCookware" ADD CONSTRAINT "UserCookware_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCookware" ADD CONSTRAINT "UserCookware_cookwareId_fkey" FOREIGN KEY ("cookwareId") REFERENCES "Cookware"("id") ON DELETE CASCADE ON UPDATE CASCADE;
