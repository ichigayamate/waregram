const {checkUser} = require("../helper/checkauth");
const {Users, Profiles} = require("../models");
const dayjs = require("dayjs");

module.exports = {
  async viewAllUser(req, res) {
    const currentUser = await checkUser(req, res);
    if (!currentUser || currentUser.Role.id !== "admin") {
      return res.redirect("/");
    }

    const users = await Users.findAll({
      include: ["Profile", "Role"]
    });

    res.render("admin/index", {users, user: currentUser, dayjs});
  },

  async viewAddUser(req, res) {
    const user = await checkUser(req, res);
    if (!user || user.Role.id !== "admin") {
      return res.redirect("/");
    }

    res.render("admin/add", {user, value: null, dayjs, error: []});
  },

  async addUser(req, res) {
    const user = await checkUser(req, res);
    if (!user || user.Role.id !== "admin") {
      return res.status(403).json({error: "Unauthorized"});
    }

    const {username, password, name, department, work_since} = req.body;
    await Users.create({
      username,
      password,
    }).then(async (newUser) => {
      await Profiles.create({
        name,
        department,
        work_since,
        UserId: newUser.id
      })
    }).then(() => {
      res.redirect("/admin");
    }).catch((error) => {
      if (error.name === "SequelizeValidationError") {
        return res.render("admin/add", {user, error: error.errors, value: {username, name, department, work_since}, dayjs});
      }
      res.status(500).json({error: error.message});
    });
  },

  async deleteUser(req, res) {
    const user = await checkUser(req, res);
    if (!user || user.Role.id !== "admin") {
      return res.status(403).json({error: "Unauthorized"});
    }

    const {id} = req.params;
    await Profiles.destroy({
      where: {UserId: id}
    }).then(async () => {
      await Users.destroy({
        where: {id}
      });
      res.redirect("/admin");
    }).catch((error) => {
      res.status(500).json({error: error.message});
    });
  }
}
