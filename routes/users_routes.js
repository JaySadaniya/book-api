const express = require('express');

const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), usersController.createSession);

router.get('/searchPage', passport.checkAuthentication, usersController.searchPage);

router.get('/bookdetail', passport.checkAuthentication, usersController.bookdetail);

router.get('/sign-out', usersController.destroySession);

module.exports = router;