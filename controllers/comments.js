const Photographer = require('../models/photographer');
const Post = require('../models/photogrPost');
const Comment = require('../models/comment');

module.exports.renderNewForm = async (req, res) => {
	const { photographersId, postId } = req.params;
	const photographer = await Photographer.findById(photographersId).populate('posts');
	const post = await Post.findById(postId).populate('photographer').populate('photographer');
	res.render('comments/new', { photographer, post, title: 'New Comment' });
};

module.exports.createComment = async (req, res, next) => {
	const { photographersId, postId } = req.params;
	const photographer = await Photographer.findById(photographersId).populate('posts');
	const post = await Post.findById(postId).populate('photographer');
	const comment = new Comment(req.body.comment);
	post.comments.push(comment);
	comment.post = post;
	comment.author = req.user._id;
	await post.save();
	await comment.save();
	req.flash('success', 'Successfully posted a Comment');
	res.redirect(`/photographers/${photographer._id}/${post._id}`);
};

module.exports.showComment = async (req, res) => {
	const { photographersId, postId, commentId } = req.params;
	const photographer = await Photographer.findById(photographersId).populate('posts');
	const post = await Post.findById(postId).populate('photographer');
	const postComments = await Post.findById(postId).populate({ path: 'comments', populate: { path: 'author' } });
	const comment = await Comment.findById(commentId).populate('post');
	console.log(postComments);
	if (!comment) {
		req.flash('error', 'Comment Not Found');
		return res.redirect('/comments');
	}
	res.render('posts/show', { photographer, post, postComments, comment, title: 'Comment' });
};

module.exports.renderEditForm = async (req, res) => {
	const { photographersId, postId, commentId } = req.params;
	const photographer = await Photographer.findById(photographersId).populate('posts');
	const post = await Post.findById(postId).populate('comments');
	const comment = await Comment.findById(commentId).populate('post');
	if (!comment) {
		req.flash('error', 'Comment Not Found');
		return res.redirect('/comments');
	}
	res.render('comments/edit', { photographer, post, comment, title: 'Edit Comment' });
};

module.exports.updateComment = async (req, res) => {
	const { photographersId, postId, commentId } = req.params;
	const comment = await Comment.findByIdAndUpdate(commentId, { ...req.body.comment });
	req.flash('success', 'Successfully updated a Comment');
	res.redirect(`/photographers/${photographersId}/${postId}`);
};

module.exports.deleteComment = async (req, res) => {
	const { photographersId, postId, commentId } = req.params;
	await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
	const result = await Comment.findByIdAndDelete(commentId);
	req.flash('success', 'Successfully deleted a Comment');
	res.redirect(`/photographers/${photographersId}/${postId}`);
};
