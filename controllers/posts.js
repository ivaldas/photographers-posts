const Photographer = require('../models/photographer');
const Post = require('../models/photogrPost');

module.exports.renderNewForm = async (req, res) => {
	const photographer = await Photographer.findById(req.params.photographersId);
	res.render('posts/new', { photographer, title: 'New Post' });
};

module.exports.createNewPost = async (req, res, next) => {
	const photographer = await Photographer.findById(req.params.photographersId);
	const post = new Post(req.body.post);
	photographer.posts.push(post);
	post.photographer = photographer;
	post.postphotographer = req.user._id;
	await photographer.save();
	await post.save();
	req.flash('success', 'Successfully created a new Post');
	res.redirect(`/photographers/${photographer._id}`);
};

module.exports.showPost = async (req, res) => {
	const photographer = await Photographer.findById(req.params.photographersId).populate('posts');
	const post = await Post.findById(req.params.postId).populate('photographer');
	if (!post) {
		req.flash('error', 'Post Not Found');
		return res.redirect('/photographers');
	}
	const postComments = await Post.findById(req.params.postId).populate({
		path: 'comments',
		populate: { path: 'author' }
	});
	res.render('posts/show', { photographer, post, postComments, title: 'Post' });
};

module.exports.renderEditForm = async (req, res) => {
	const photographer = await Photographer.findById(req.params.photographersId).populate('posts');
	const post = await Post.findById(req.params.postId).populate('photographer');
	if (!post) {
		req.flash('error', 'Post Not Found');
		return res.redirect('/photographers');
	}
	res.render('posts/edit', { photographer, post, title: 'Edit Post' });
};

module.exports.updatePost = async (req, res) => {
	const { photographersId, postId } = req.params;
	const post = await Post.findByIdAndUpdate(postId, { ...req.body.post });
	req.flash('success', 'Successfully updated a Post');
	res.redirect(`/photographers/${photographersId}/${post._id}`);
};

module.exports.deletePost = async (req, res) => {
	const { photographersId, postId } = req.params;
	await Photographer.findByIdAndUpdate(photographersId, { $pull: { posts: postId } });
	const result = await Post.findByIdAndDelete(postId);
	req.flash('success', 'Successfully deleted a Post');
	res.redirect(`/photographers/${photographersId}`);
};
