const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const photographers = require('../controllers/photographers');
const { isLoggedIn, isPhotographer, validatePhotographer } = require('../middleware');

router.get('/', catchAsync(photographers.index));

router.get('/new', isLoggedIn, photographers.renderNewForm);

router.post('/', isLoggedIn, validatePhotographer, catchAsync(photographers.createPhotographer));

router.get('/:photographersId', catchAsync(photographers.showPhotographer));

router.get('/:photographersId/edit', isLoggedIn, isPhotographer, catchAsync(photographers.renderEditForm));

router.put(
	'/:photographersId',
	isLoggedIn,
	isPhotographer,
	validatePhotographer,
	catchAsync(photographers.updatePhotographer)
);

router.delete('/:photographersId', isLoggedIn, isPhotographer, catchAsync(photographers.deletePhotographer));

module.exports = router;

// app.get('/makephotographer', async (req, res) => {
// 	const photographer = new Photographer({
// 		name: 'GorlitzPhotography',
// 		subscribers: 44002,
// 		description: 'Feeding many villages and village idiots for 10s of days.',
// 		image:
// 			'https://images.unsplash.com/photo-1516357231954-91487b459602?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3544&q=80'
// 	});
// 	await photographer.save();
// 	res.send(photographer);
// });
