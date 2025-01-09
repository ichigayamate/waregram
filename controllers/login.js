const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users } = require('../models');
const {checkAuth} = require("../helper/checkauth");

module.exports = {
  async viewLogin(req, res) {
    const isAuth = await checkAuth(req, res);
    if (isAuth) {
      return res.redirect("/");
    }
    res.render('login', {message: "", isAuth: false});
  },

  async login(req, res) {
    const {username, password} = req.body;
    if (!username || !password) {
      return res.render("login", {message: 'Email and password are required'});
    }
    const userData = await Users.findOne({
      where: {
        username
      }
    });
    if (!userData) {
      return res.render("login", {message: 'User not found'});
    }
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.render("login", {message: 'Invalid password'});
    }
    const token = jwt.sign({id: userData.id}, process.env.JWT_SECRET, {expiresIn: '12h'});
    res.cookie('token', token, {httpOnly: true, maxAge: 43200000, secure: true});
    res.redirect("/");
  },

  async logout(req, res) {
    await res.clearCookie('token');
    res.redirect("/");
  }
}
