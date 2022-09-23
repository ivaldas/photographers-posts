const Joi = require('joi');

module.exports.photogrSchema = Joi.object({
	photographer: Joi.object({
		name: Joi.string().required(),
		subscribers: Joi.number().required().min(0),
		description: Joi.string().required(),
		image: Joi.string().required()
	}).required()
});

module.exports.postSchema = Joi.object({
	post: Joi.object({
		title: Joi.string().required(),
		image: Joi.string().required()
	}).required()
});

module.exports.commentSchema = Joi.object({
	comment: Joi.object({
		// username: Joi.string().required(),
		comment: Joi.string().required()
	}).required()
});
