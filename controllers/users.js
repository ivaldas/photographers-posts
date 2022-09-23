const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
	res.render('users/register', { title: 'Register' });
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcome to Photographers Posts!');
			res.redirect('/photographers');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login', { title: 'Login' });
};

module.exports.login = (req, res) => {
	req.flash('success', `Welcome Back, ${req.user.username}!`);
	const redirectUrl = req.session.returnTo || '/photographers';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout((err) => {
		req.flash('success', 'Goodbye!');
		res.redirect('/');
	});
};
