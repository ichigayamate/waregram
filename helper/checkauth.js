const jwt = require("jsonwebtoken");
const {Users} = require('../models');
module.exports = {
  checkAuth(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return false;
    } else {
      return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.clearCookie('token');
          return false;
        } else {
          return decoded.id;
        }
      });
    }
  },

  async checkUser(req, res) {
    const userId = module.exports.checkAuth(req, res);
    if (!userId) {
      return false;
    } else {
      return await Users.findOne({
        include: ["Profile", "Role"],
        where: {
          id: userId
        }
      });
    }
  }
}
