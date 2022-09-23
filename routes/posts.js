const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const posts = require('../controllers/posts');
const { isLoggedIn, validatePost, isPhotographer } = require('../middleware');

router.get('/new', isLoggedIn, isPhotographer, catchAsync(posts.renderNewForm));

router.post('/', isLoggedIn, isPhotographer, validatePost, catchAsync(posts.createNewPost));

router.get('/:postId', catchAsync(posts.showPost));

router.get('/:postId/edit', isLoggedIn, isPhotographer, catchAsync(posts.renderEditForm));

router.put('/:postId', isLoggedIn, isPhotographer, validatePost, catchAsync(posts.updatePost));

router.delete('/:postId', isLoggedIn, isPhotographer, catchAsync(posts.deletePost));

module.exports = router;
