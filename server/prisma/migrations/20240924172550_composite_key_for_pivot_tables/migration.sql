/*
  Warnings:

  - A unique constraint covering the columns `[recipeId,cookwareId]` on the table `RecipeCookware` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,ingredientId]` on the table `RecipeIngredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,cookwareId]` on the table `UserCookware` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,ingredientId]` on the table `UserIngredient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecipeCookware_recipeId_cookwareId_key" ON "RecipeCookware"("recipeId", "cookwareId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_ingredientId_key" ON "RecipeIngredient"("recipeId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCookware_userId_cookwareId_key" ON "UserCookware"("userId", "cookwareId");

-- CreateIndex
CREATE UNIQUE INDEX "UserIngredient_userId_ingredientId_key" ON "UserIngredient"("userId", "ingredientId");
