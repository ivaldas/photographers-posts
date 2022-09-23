const mongoose = require('mongoose');
const Comment = require('./comment');
const { Schema, model } = mongoose;

const postSchema = new Schema({
	postphotographer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	photographer: {
		type: Schema.Types.ObjectId,
		ref: 'Photographer'
	},
	title: String,
	image: String,
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

postSchema.post('findOneAndDelete', async function(post) {
	if (post) {
		const res = await Comment.deleteMany({ _id: { $in: post.comments } });
		console.log(res);
	}
});

const Post = model('Post', postSchema);
module.exports = Post;
