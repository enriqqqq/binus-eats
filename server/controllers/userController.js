const prisma = require('../config/prisma');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { CustomError, ValidationError, InternalServerError } = require('../utils/error');

const userAuthMiddleware = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    });

    if (!user) {
        throw new CustomError('Unauthorized', 401);
    }

    next();
});

exports.update = [
    userAuthMiddleware,
    body("ingredients")
        .isArray()
        .withMessage("Ingredients must be an array")
        .custom(async (value) => {
            try {
                value.forEach((ingredient) => {
                    if(typeof ingredient !== 'object') {
                        return Promise.reject('Ingredient must be an object');
                    }

                    if(!ingredient.ingredientId) {
                        return Promise.reject('Ingredient ID is required');
                    }

                    if(!ingredient.quantity) {
                        return Promise.reject('Ingredient Quantity is required');
                    }
                });

                const ingredientIds = ingredients.map((ingredient) => ingredient.ingredientId);

                const ingredients = await prisma.ingredient.findMany({
                    where: {
                        id: {
                            in: ingredientIds
                        }
                    }
                });

                if(ingredients.length !== ingredientIds.length) {
                    return Promise.reject('Some ingredients does not exist');
                }

                return true;
            } catch (error) {
                throw new InternalServerError('Error updating inventory');
            }
        }),
    body("cookwareIds")
        .exists().withMessage("Cookware IDs is required")
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
                throw new InternalServerError('Error updating inventory');
            }
        }),
    asyncHandler(async (req, res) => {
        // if it gets here, user is authenticated

        // check for validation errors
        const errors = validationResult(req);

        // return validation errors
        if (!errors.isEmpty()) {
            throw new ValidationError('Validation Error', errors.array());
        }

        // update user inventory
        // ingredients
        const ingredients = req.body.ingredients;
        ingredients.forEach(async (ingredient) => {
            await prisma.userIngredient.upsert({
                where: {
                    userId_ingredientId: {
                        userId: req.user.id,
                        ingredientId: ingredient.ingredientId
                    }
                },
                update: {
                    quantity: {
                        increment: ingredient.quantity
                    }
                },
                create: {
                    userId: req.user.id,
                    ingredientId: ingredient.ingredientId,
                    quantity: ingredient.quantity
                }
            });
        })

    })
]