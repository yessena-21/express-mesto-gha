const router = require('express').Router();

const {
  getUsers, createUser, getUserByID, updateUser, updateUseravatar,
} = require('../controllers/users');

router.get('/users/:userId', getUserByID);
router.get('/users', getUsers);

router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUseravatar);

module.exports = router;
