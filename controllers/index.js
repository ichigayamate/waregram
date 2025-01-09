const {Items} = require('../models');
const {checkUser} = require("../helper/checkauth");
const dayjs = require("dayjs");
const {Op} = require("sequelize");

module.exports = {
  async viewIndex(req, res) {
    const user = await checkUser(req, res);
    const searchQuery = req.query.search;
    const where = {};

    if (user && user.Role.id === "user") {
      where.PIC = user.Profile.id;
    }
    if (searchQuery) {
      where.name = {[Op.iLike]: `%${searchQuery}%`};
    }

    const status = await Items.getAllStatus(user ? user.Profile.id : null).then((status) => status[0].dataValues);

    await Items.findAll({
      where,
      include: ["Profile", "Categories"]
    }).then((items) => {
      res.render('index', {items, user, dayjs, status, searchQuery});
    }).catch((error) => {
      res.status(500).json({error: error.message});
    });
  },
}
