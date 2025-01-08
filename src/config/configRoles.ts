require("dotenv").config();

export default {
    "secret": process.env.SECRET,
    ROLES: ["USER", "ADMIN"]
}
