const {checkUser} = require("../helper/checkauth");
const {Users, Profiles} = require("../models");
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");

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

    res.render("admin/add", {edit: false, user, value: null, dayjs, error: []});
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
        return res.render("admin/add", {edit: false, user, error: error.errors, value: {username, name, department, work_since}, dayjs});
      }
      res.status(500).json({error: error.message});
    });
  },

  async viewEditUser(req, res) {
    const user = await checkUser(req, res);
    if (!user || user.Role.id !== "admin") {
      return res.redirect("/");
    }

    const {id} = req.params;
    const editUser = await Users.findOne({
      where: {id},
      include: ["Profile"]
    });
    const value = {
      username: editUser.username,
      name: editUser.Profile.name,
      department: editUser.Profile.department,
      work_since: editUser.Profile.work_since
    };

    res.render("admin/add", {edit: true, id, user, value, dayjs, error: []});
  },

  async editUser(req, res) {
    const user = await checkUser(req, res);
    if (!user || user.Role.id !== "admin") {
      return res.status(403).json({error: "Unauthorized"});
    }

    const {id} = req.params;
    const {username, password, name, department, work_since} = req.body;
    let changedPass = "";
    if (!password) {
      const userData = await Users.findOne({
        where: {id}
      });
      changedPass = userData.password;
    } else {
      const salt = bcrypt.genSaltSync(10);
      changedPass = bcrypt.hashSync(password, salt);
    }
    await Users.update({
      username,
      password: changedPass
    }, {
      where: {id}
    }).then(async () => {
      await Profiles.update({
        name,
        department,
        work_since
      }, {
        where: {UserId: id}
      });
    }).then(() => {
      res.redirect("/admin");
    }).catch((error) => {
      if (error.name === "SequelizeValidationError") {
        return res.render("admin/add", {edit: true, id, user, error: error.errors, value: {username, name, department, work_since}, dayjs});
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
