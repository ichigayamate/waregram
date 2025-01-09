const {Items} = require('../models');
const {checkUser} = require("../helper/checkauth");
const dayjs = require("dayjs");

module.exports = {
  async viewIndex(req, res) {
    const user = await checkUser(req, res);
    await Items.findAll({
      include: ["Profile", "Categories"]
    }).then((items) => {
      res.render('index', {items, user, dayjs});
    }).catch((error) => {
      res.status(500).json({error: error.message});
    });
  },
}
