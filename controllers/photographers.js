const Photographer = require('../models/photographer');
const Post = require('../models/photogrPost');

module.exports.index = async (req, res) => {
	const photographers = await Photographer.find({});
	res.render('photographers/index', { photographers, title: 'All Photographers' });
};

module.exports.renderNewForm = (req, res) => {
	res.render('photographers/new', { title: 'New Photographer' });
};

module.exports.createPhotographer = async (req, res, next) => {
	// if (!req.body.photographer) throw new ExpressError('Invalid Photographer Data', 400);
	const photographer = new Photographer(req.body.photographer);
	photographer.photographer = req.user._id;
	await photographer.save();
	req.flash('success', 'Successfully added a new Photographer');
	res.redirect(`/photographers/${photographer._id}`);
};

module.exports.showPhotographer = async (req, res) => {
	const photographer = await Photographer.findById(req.params.photographersId)
		.populate('posts')
		.populate('photographer');
	if (!photographer) {
		req.flash('error', 'Photographer Not Found');
		return res.redirect('/photographers');
	}
	const posts = await Post.find({});
	res.render('photographers/show', { photographer, posts, title: 'Photographer' });
};

module.exports.renderEditForm = async (req, res) => {
	const photographer = await Photographer.findById(req.params.photographersId);
	if (!photographer) {
		req.flash('error', 'Photographer Not Found');
		return res.redirect('/photographers');
	}
	res.render('photographers/edit', { photographer, title: 'Edit Photographer' });
};

module.exports.updatePhotographer = async (req, res) => {
	const { photographersId } = req.params;
	const photographer = await Photographer.findByIdAndUpdate(photographersId, { ...req.body.photographer });
	req.flash('success', 'Successfully updated a Photographer');
	res.redirect(`/photographers/${photographer._id}`);
};

module.exports.deletePhotographer = async (req, res) => {
	const { photographersId } = req.params;
	const result = await Photographer.findByIdAndDelete(photographersId);
	req.flash('success', 'Successfully deleted a Photographer');
	res.redirect('/photographers');
};
