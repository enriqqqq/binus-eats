const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../controllers/userController');
const RecipeController = require('../controllers/recipeController');


// RECIPE ROUTES
router.get('/recipes', passport.authenticate("jwt", { session: false }), RecipeController.getAll);
router.post('/recipes', passport.authenticate("jwt", { session: false }), RecipeController.create);
router.put('/recipes/:recipeId', passport.authenticate("jwt", { session: false }), RecipeController.update);
router.delete('/recipes/:recipeId', passport.authenticate("jwt", { session: false }), RecipeController.delete);
router.get('/recipes/:recipeId', passport.authenticate("jwt", { session: false }), RecipeController.getById);

// USER ROUTES
router.patch('/users', passport.authenticate("jwt", { session: false }), UserController.update);

module.exports = router;