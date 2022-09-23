const mongoose = require('mongoose');
const Post = require('./photogrPost');
// const Comment = require('./comment');
// const User = require('./user');
const { Schema, model } = mongoose;

const PhotographerSchema = new Schema({
	name: String,
	subscribers: Number,
	description: String,
	image: String,
	photographer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post'
		}
	]
});

PhotographerSchema.post('findOneAndDelete', async function(photographer) {
	if (photographer) {
		const res = await Post.deleteMany({ _id: { $in: photographer.posts } });
		console.log(res);
	}
});

const Photographer = model('Photographer', PhotographerSchema);

module.exports = Photographer;
