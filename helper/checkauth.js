const jwt = require("jsonwebtoken");
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
  }
}
