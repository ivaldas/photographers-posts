const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const Photographer = require('./models/photographer');
const Post = require('./models/photogrPost');
const Comment = require('./models/comment');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const photographersRoutes = require('./routes/photographers');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

//###################### MONGO / MONGOOSE ##################################

db().catch((err) => console.log('mongo connection error', err));
async function db() {
	await mongoose.connect('mongodb://localhost:27017/photoPostsF');
	console.log('Mongo Database Connected');
}
// brew services start mongodb-community@5.0 --> to start service
// brew services start mongodb-community@6.0
// brew services stop mongodb-community@5.0 --> to stop service
// brew services stop mongodb-community@6.0

//#########################################################################
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
	secret: 'thisismysecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(sessionConfig));
app.use(flash());

// ------------------ PASSPORT SETUP -------------------------------------------------
app.use(passport.initialize()); // --> Make Sure Sessions ar used BEFORE passport dessions ^
app.use(passport.session()); //    --> VERY IMPORTAND!!!!!!!
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// -----------------------------------------------------------------------------------

app.use((req, res, next) => {
	if (![ '/login', '/' ].includes(req.originalUrl)) {
		req.session.returnTo = req.originalUrl;
	}
	// console.log(req.session);
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

//  ============================ USER ROUTES ==========================================

app.use('/', userRoutes);

// ===================== PHOTOGRAPHERS ROUTES ===============================

app.get(
	'/',
	catchAsync(async (req, res) => {
		const photographers = await Photographer.find({});
		const posts = await Post.find({}).populate('photographer');
		res.render('gallery', { photographers, posts, title: 'Image Gallery' });
	})
);

app.use('/photographers', photographersRoutes);

// ============================= POSTS ROUTES =========================================

app.use('/photographers/:photographersId', postsRoutes);

// ============================= COMMENTS ROUTES ======================================

app.use('/photographers/:photographersId/:postId', commentsRoutes);

app.get(
	'/comments',
	catchAsync(async (req, res) => {
		const photographers = await Photographer.find({}).populate('posts');
		const posts = await Post.find({}).populate('comments').populate({
			path: 'comments',
			populate: { path: 'author' }
		});
		const postPhotographer = await Post.find({}).populate('photographer');
		const comments = await Comment.find({}).populate('post');
		res.render('comments/allcomments', { photographers, posts, postPhotographer, comments, title: 'All Comments' });
	})
);

// ================================ END ==============================================

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No... Semothing Went Wrong...';
	res.status(statusCode).render('error', { err, title: 'Error' });
});

app.listen(3000, () => console.log('running on port 3000'));
