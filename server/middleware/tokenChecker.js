const jwt = require("jsonwebtoken");
const { tokenExtractor } = require("../util/tokenExtractor");
const SECRET = process.env.JWT_SECRET;

const tokenChecker = async (req, res, next) => {
  try {
    const token = tokenExtractor(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const decode = jwt.verify(token, SECRET);
    req.userId = decode.id;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
