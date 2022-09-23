const Photographer = require('./models/photographer');
const Comment = require('./models/comment');
const ExpressError = require('./utils/ExpressError');
const { photogrSchema, postSchema, commentSchema } = require('./schemas');

module.exports.validatePhotographer = (req, res, next) => {
	const { error } = photogrSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
module.exports.validatePost = (req, res, next) => {
	const { error } = postSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
module.exports.validateComment = (req, res, next) => {
	const { error } = commentSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'you must be signed in first!');
		return res.redirect('/login');
	}
	next();
};

module.exports.isPhotographer = async (req, res, next) => {
	const { photographersId } = req.params;
	const photographer = await Photographer.findById(photographersId);
	if (!photographer.photographer.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/photographers/${photographersId}`);
	}
	next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
	const { photographersId, postId, commentId } = req.params;
	const commentAuthor = await Comment.findById(commentId);
	if (!commentAuthor.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/photographers/${photographersId}/${postId}`);
	}
	next();
};
