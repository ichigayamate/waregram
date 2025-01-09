const {Items} = require('../models');
const {checkAuth} = require("../helper/checkauth");

module.exports = {
  async viewIndex(req, res) {
    const isAuth = await checkAuth(req, res);
    await Items.findAll({
      include: "Categories"
    }).then((items) => {
      res.render('index', {items, isAuth: Boolean(isAuth)});
    }).catch((error) => {
      res.status(500).json({error: error.message});
    });
  },
}
