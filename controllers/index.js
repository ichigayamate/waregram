const {Items} = require('../models');
const {checkAuth, checkUser} = require("../helper/checkauth");

module.exports = {
  async viewIndex(req, res) {
    const user = await checkUser(req, res);
    await Items.findAll({
      include: ["Profile", "Categories"]
    }).then((items) => {
      res.render('index', {items, user});
    }).catch((error) => {
      res.status(500).json({error: error.message});
    });
  },
}
