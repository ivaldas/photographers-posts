const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	// username: String,
	comment: String
});

const Comment = model('Comment', commentSchema);
module.exports = Comment;
