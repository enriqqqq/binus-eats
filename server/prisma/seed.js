const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = '74583180-c3e5-4546-baa2-2949ef9bbaa0';

  // Clear all tables
  console.log('Clearing all tables');
  await prisma.recipeIngredient.deleteMany({});
  await prisma.recipeCookware.deleteMany({});
  await prisma.userIngredient.deleteMany({});
  await prisma.userCookware.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.cookware.deleteMany({});
  await prisma.ingredient.deleteMany({});
  
  // Seed Ingredients
  console.log('Seeding Ingredients');
  await prisma.ingredient.createMany({
    data: [
      { id: 'ingr-1', name: 'Flour', quantityUnit: 'KILOGRAM', location: 'Supermarket A' },
      { id: 'ingr-2', name: 'Sugar', quantityUnit: 'KILOGRAM', location: 'Supermarket B' },
      { id: 'ingr-3', name: 'Milk', quantityUnit: 'LITER', location: 'Supermarket C' },
      { id: 'ingr-4', name: 'Eggs', quantityUnit: 'PIECE', location: 'Farmer\'s Market' },
      { id: 'ingr-5', name: 'Butter', quantityUnit: 'KILOGRAM', location: 'Supermarket D' },
      { id: 'ingr-6', name: 'Salt', quantityUnit: 'KILOGRAM', location: 'Supermarket E' },
      { id: 'ingr-7', name: 'Pepper', quantityUnit: 'KILOGRAM', location: 'Supermarket F' },
      { id: 'ingr-8', name: 'Olive Oil', quantityUnit: 'LITER', location: 'Supermarket G' },
      { id: 'ingr-9', name: 'Tomato', quantityUnit: 'KILOGRAM', location: 'Farmer\'s Market' },
    ],
  });

  // Seed Cookware
  console.log('Seeding Cookware');
  await prisma.cookware.createMany({
    data: [
      { id: 'cook-1', name: 'Pan', location: 'Supermarket A' },
      { id: 'cook-2', name: 'Pot', location: 'Supermarket B' },
      { id: 'cook-3', name: 'Knife', location: 'Supermarket C' },
      { id: 'cook-4', name: 'Spatula', location: 'Supermarket D' },
      { id: 'cook-5', name: 'Mixing Bowl', location: 'Supermarket E' },
    ],
  });

  // Seed Recipes
  console.log('Seeding Recipes');
  await prisma.recipe.createMany({
    data: [
      { id: 'recipe-1', name: 'Pancakes', instructions: 'Mix all ingredients and cook on a pan.', userId },
      { id: 'recipe-2', name: 'Scrambled Eggs', instructions: 'Whisk eggs and cook in a pan.', userId },
      { id: 'recipe-3', name: 'Chocolate Cake', instructions: 'Mix ingredients and bake.', userId },
      { id: 'recipe-4', name: 'Salad', instructions: 'Chop ingredients and mix.', userId },
      { id: 'recipe-5', name: 'Pasta', instructions: 'Cook pasta and add sauce.', userId },
    ],
  });

  // Seed UserIngredients
  console.log('Seeding UserIngredients');
  await prisma.userIngredient.createMany({
    data: [
      { userId, ingredientId: 'ingr-1', quantity: 2 },
      { userId, ingredientId: 'ingr-2', quantity: 5 },
      { userId, ingredientId: 'ingr-3', quantity: 1 },
      { userId, ingredientId: 'ingr-4', quantity: 12 },
      { userId, ingredientId: 'ingr-5', quantity: 4 },
    ],
  });

  // Seed UserCookware
  console.log('Seeding UserCookware');
  await prisma.userCookware.createMany({
    data: [
      { userId, cookwareId: 'cook-1' },
      { userId, cookwareId: 'cook-2' },
      { userId, cookwareId: 'cook-3' },
      { userId, cookwareId: 'cook-4' },
      { userId, cookwareId: 'cook-5' },
    ],
  });

  // Seed RecipeIngredients
  console.log('Seeding RecipeIngredients');
  await prisma.recipeIngredient.createMany({
    data: [
      { recipeId: 'recipe-1', ingredientId: 'ingr-1', quantity: 2 },
      { recipeId: 'recipe-1', ingredientId: 'ingr-2', quantity: 1 },
      { recipeId: 'recipe-2', ingredientId: 'ingr-3', quantity: 3 },
      { recipeId: 'recipe-3', ingredientId: 'ingr-1', quantity: 1 },
      { recipeId: 'recipe-4', ingredientId: 'ingr-4', quantity: 4 },
    ],
  });

  // Seed RecipeCookware
  console.log('Seeding RecipeCookware');
  await prisma.recipeCookware.createMany({
    data: [
      { recipeId: 'recipe-1', cookwareId: 'cook-1' },
      { recipeId: 'recipe-2', cookwareId: 'cook-1' },
      { recipeId: 'recipe-3', cookwareId: 'cook-2' },
      { recipeId: 'recipe-4', cookwareId: 'cook-3' },
      { recipeId: 'recipe-5', cookwareId: 'cook-4' },
    ],
  });

  console.log('All models seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
