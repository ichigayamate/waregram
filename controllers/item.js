const {checkUser} = require("../helper/checkauth");
const {Users, Categories, Items, ItemsCategories} = require("../models");
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");

module.exports = {
  async viewAddItem(req, res) {
    const user = await checkUser(req);
    if (!user) {
      return res.redirect("/");
    }

    const allUsers = await Users.findAll({
      include: "Profile"
    });
    const allCategories = await Categories.findAll();

    res.render("add-item", {value: {}, error: [], user, allUsers, allCategories});
  },

  async addItem(req, res) {
    const user = await checkUser(req);
    if (!user) {
      return res.redirect("/");
    }

    const {name, description, estimatedDelivery, category} = req.body;
    let PIC = req.body.PIC;
    if (!PIC) {
      PIC = user.Profile.id;
    }

    await Items.create({
      name,
      description,
      estimatedDelivery,
      PIC,
    }).then(async (item) => {
      if (Array.isArray(category)) {
        await ItemsCategories.bulkCreate(category.map((categoryEl) => ({
          ItemId: item.id,
          CategoryId: categoryEl
        })));
      } else if (category) {
        await ItemsCategories.create({
          ItemId: item.id,
          CategoryId: category
        });
      }
      res.redirect("/");
    })
      .catch(async (err) => {
        if (err.name === "SequelizeValidationError") {
          const allUsers = await Users.findAll({
            include: "Profile"
          });
          const allCategories = await Categories.findAll();
          res.render("add-item", {value: req.body, error: [err.message], user, allUsers, allCategories});
        } else {
          res.status(500).json({error: err.message});
        }
      });
  },

  async finishDelivery(req, res) {
    const user = await checkUser(req);
    if (!user) {
      return res.status(403).json({error: "Unauthorized"});
    }

    const itemId = req.params.id;
    await Items.update({
      estimatedDelivery: null,
    }, {
      where: {
        id: itemId
      }
    }).then(() => {
      res.redirect("/");
    }).catch((err) => {
      res.status(500).json({error: err.message});
    });
  },

  async deleteItem(req, res) {
    const user = await checkUser(req);
    if (!user) {
      return res.status(403).json({error: "Unauthorized"});
    }

    const itemId = req.params.id;
    await ItemsCategories.destroy({
      where: {
        ItemId: itemId
      }
    }).then(async () => {
      await Items.destroy({
        where: {
          id: itemId
        }
      });
      res.redirect("/");
    }).catch((err) => {
      res.status(500).json({error: err.message});
    });
  }
}
