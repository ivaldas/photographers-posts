const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const comments = require('../controllers/comments');
const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware');

router.get('/new', isLoggedIn, catchAsync(comments.renderNewForm));

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));

router.get('/:commentId', catchAsync(comments.showComment));

router.get('/:commentId/edit', isLoggedIn, isCommentAuthor, catchAsync(comments.renderEditForm));

router.put('/:commentId', isLoggedIn, isCommentAuthor, validateComment, catchAsync(comments.updateComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;
