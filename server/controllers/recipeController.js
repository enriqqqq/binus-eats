const prisma = require('../config/prisma');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { CustomError, ValidationError, InternalServerError } = require('../utils/error');

// Recipe query projection to get only the needed fields
const RecipeQueryProjection = {
    id: true,
    name: true,
    instructions: true,
    ingredients: 
    {
        select: 
        {
            quantity: true,
            ingredient: 
            {
                select: 
                {
                    id: true,
                    name: true,
                    quantityUnit: true
                }
            }
        }
    },
    cookwares: 
    {
        select: 
        {
            cookware: 
            {
                select: 
                {
                    id: true,
                    name: true
                }
            }
        }
    }
}

const RecipeValidation = [
    body('name')
        .exists().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    body('instructions')
        .exists().withMessage('Instructions are required')
        .isString().withMessage('Instructions must be a string'),
    body('ingredients')
        .exists().withMessage('Ingredients are required')
        .isArray({ min: 1 }).withMessage('Ingredients must be an array and not be empty')
        .bail()
        .custom(async (value) => {
            try {
                for (const ingredient of value) {
                    if(typeof ingredient !== 'object') {
                        return Promise.reject('Ingredient must be an object');
                    }

                    if(typeof ingredient.id !== 'string' || typeof ingredient.quantity !== 'number') {
                        return Promise.reject('IngredientId must be a string and quantity must be a number');
                    }

                    if (!ingredient.id || !ingredient.quantity) {
                        return Promise.reject('IngredientId and quantity are required');
                    }
                }

                const ingredientIds = value.map(ingredient => ingredient.id);

                const ingredients = await prisma.ingredient.findMany({
                    where: {
                        id: {
                            in: ingredientIds
                        }
                    }
                });

                if (ingredients.length !== ingredientIds.length) {
                    return Promise.reject('Some ingredients does not exist');
                }

                return true;
            } catch (error) {
                throw new InternalServerError('Error creating recipe');
            }
        }),
    body('cookwareIds')
        .exists().withMessage('Cookwares are required')
        .isArray({ min: 1 }).withMessage('Cookwares must be an array and not be empty')
        .bail()
        .custom(async (value) => {
            try {
                const cookwares = await prisma.cookware.findMany({
                    where: {
                        id: {
                            in: value
                        }
                    }
                });

                if (cookwares.length !== value.length) {
                    return Promise.reject('Some cookwares does not exist');
                }

                return true;
            }
            catch (error) {
                throw new InternalServerError('Error creating recipe');
            }
        })
];

const checkRecipeUserMiddleware = asyncHandler(async (req, _, next) => {
    // get the recipe id from the request
    const { recipeId } = req.params;

    // check if the recipe exists
    const recipe = await prisma.recipe.findUnique({
        where: {
            id: recipeId
        }
    });

    if (!recipe) {
        throw new CustomError('Recipe not found', 404);
    }

    // check if the recipe belongs to the user
    if (recipe.userId !== req.user.id) {
        throw new CustomError('Unauthorized', 401);
    }

    next();
});

// GET a recipe by ID
exports.getById = asyncHandler(async (req, res) => {
    // get the recipe id from the request
    const { recipeId } = req.params;

    // get the recipe
    const recipe = await prisma.recipe.findUnique({
        where: {
            id: recipeId
        },
        select: RecipeQueryProjection
    });

    // return the recipe
    if (!recipe) {
        throw new CustomError('Recipe not found', 404);
    }

    const flattenedRecipe = {
        id: recipe.id,
        name: recipe.name,
        instructions: recipe.instructions,
        ingredients: recipe.ingredients.map(ingredient => ({
            id: ingredient.ingredient.id,
            name: ingredient.ingredient.name,
            quantity: ingredient.quantity,
            quantityUnit: ingredient.ingredient.quantityUnit
        })),
        cookwares: recipe.cookwares.map(item => ({
            id: item.cookware.id,
            name: item.cookware.name
        }))
    };

    res.status(200).json(flattenedRecipe);
});

// GET all recipes
exports.getAll = asyncHandler(async (req, res) => {
    // get all recipes
    const recipes = await prisma.recipe.findMany({
        select: RecipeQueryProjection
    });

    // Flattening the recipes data
    const flattenedRecipes = recipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients.map(ingredient => ({
            id: ingredient.ingredient.id,
            name: ingredient.ingredient.name,
            quantity: ingredient.quantity,
            quantityUnit: ingredient.ingredient.quantityUnit
        })),
        cookwares: recipe.cookwares.map(item => ({
            id: item.cookware.id,
            name: item.cookware.name
        }))
    }));

    // return the recipes
    res.status(200).json(flattenedRecipes);
});

// post a new recipe
exports.create = [
    ...RecipeValidation,
    asyncHandler(async (req, res) => {
        // check for validation errors
        const errors = validationResult(req);

        // return validation errors
        if (!errors.isEmpty()) {
            throw new ValidationError('Validation error', errors.array());
        }

        // get the recipe data from the request
        const { name, instructions, ingredients, cookwareIds } = req.body;

        // create the recipe
        const recipe = await prisma.recipe.create({
            data: {
                name,
                instructions,
                userId: req.user.id,
                ingredients: {
                    create: ingredients.map(ingredient => ({
                        ingredientId: ingredient.id,
                        quantity: ingredient.quantity,
                    })),
                },
                cookwares: {
                    create: cookwareIds.map(cookwareId => ({
                        cookwareId,
                    })),
                },
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
                cookwares: {
                    include: {
                        cookware: true,
                    },
                },
            }
        });

        const flattenedRecipe = {
            id: recipe.id,
            name: recipe.name,
            instructions: recipe.instructions,
            ingredients: recipe.ingredients.map(ingredient => ({
                id: ingredient.ingredient.id,
                name: ingredient.ingredient.name,
                quantity: ingredient.quantity,
                quantityUnit: ingredient.ingredient.quantityUnit
            })),
            cookwares: recipe.cookwares.map(item => ({
                id: item.cookware.id,
                name: item.cookware.name
            }))
        };

        // return the recipe
        res.status(201).json(flattenedRecipe);
    })
];

// PUT update a recipe
exports.update = [
    checkRecipeUserMiddleware,
    ...RecipeValidation,
    asyncHandler(async (req, res) => {
        // if it gets here, the user is authorized to update the recipe and recipe exists

        // check for validation errors
        const errors = validationResult(req);

        // return validation errors
        if (!errors.isEmpty()) {
            throw new ValidationError('Validation error', errors.array());
        }

        // get the recipe id from the request
        const { recipeId } = req.params;

        // get the recipe data from the request
        const { name, instructions, ingredients, cookwareIds } = req.body;

        // update the recipe
        const recipe = await prisma.recipe.update({
            where: {
                id: recipeId
            },
            data: {
                name,
                instructions,
                ingredients: {
                    deleteMany: {},
                    create: ingredients.map(ingredient => ({
                        ingredientId: ingredient.id,
                        quantity: ingredient.quantity,
                    })),
                },
                cookwares: {
                    deleteMany: {},
                    create: cookwareIds.map(cookwareId => ({
                        cookwareId,
                    })),
                },
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
                cookwares: {
                    include: {
                        cookware: true,
                    },
                },
            }
        });

        const flattenedRecipe = {
            id: recipe.id,
            name: recipe.name,
            instructions: recipe.instructions,
            ingredients: recipe.ingredients.map(ingredient => ({
                id: ingredient.ingredient.id,
                name: ingredient.ingredient.name,
                quantity: ingredient.quantity,
                quantityUnit: ingredient.ingredient.quantityUnit
            })),
            cookwares: recipe.cookwares.map(item => ({
                id: item.cookware.id,
                name: item.cookware.name
            }))
        };

        // return the recipe
        res.status(200).json(flattenedRecipe);
    })
];

// DELETE a recipe
exports.delete = asyncHandler(async (req, res) => {
    // get the recipe id from the request
    const { recipeId } = req.params;

    // check if the recipe exists
    const recipe = await prisma.recipe.findUnique({
        where: {
            id: recipeId
        }
    });

    if (!recipe) {
        throw new CustomError('Recipe not found', 404);
    }

    // delete the recipe
    await prisma.recipe.delete({
        where: {
            id: recipeId
        }
    });

    // return success
    res.json({ message: 'Recipe deleted successfully' }).status(200);
});