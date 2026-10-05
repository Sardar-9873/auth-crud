const jwt = require("jsonwebtoken");

function authGuard(req, res, next) {
  const token = req.headers.authorization;
  let decodedData;
  try {
    decodedData = jwt.verify(token,process.env.SECRET_KEY);
    req.user = decodedData;
  } catch (error) {
    // console.log(error);
    return res.status(401).send({
        data: null,
        message: "Please login again.",
        error: true
    });
  }

  next();
}

module.exports = authGuard;