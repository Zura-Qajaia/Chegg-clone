const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../data-services/UserSchema");
const crypto= require("crypto");
const Email = require("../utils/Email.js")

const signToken = (id) => {
  console.log(process.env.JWT_SECRET);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 24 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    const newUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      id: data.id,
      role: data.role,
      payment: false,
      email: data.email,
      age: Number(data.age),
      maxQuestionsPerMonth: 0,
      subject: data.subject,
    });
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
  let token;
  console.log(req);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    console.log("cookie:", req.cookies);
    token = req.cookies.jwt;
  }

  console.log(req.cookies);

  if (!token) {
    console.log("zura");
    return next(
      new Error("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new Error("The user belonging to this token does no longer exist.", 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

exports.isLoggedin = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      console.error("Error in isLoggedin middleware:", err);
      return next();
    }
  }
  next();
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || password !== user.password) {
    return next(new Error("Incorrect email or password", 401));
  }

  createSendToken(user, 200, req, res);
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};


exports.personalinfo = async(req, res, next) => {
  if(req.cookies.jwt){
    try{
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      
      
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      console.log(currentUser);
      res.status(200).json(currentUser);
    }
    catch (err) {
      console.error("Error:", err);
      return next();
    }
  }
  next();
}


exports.isLoggedin1 = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
   
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(400).send({ status: "fail", message: "User not found" });
      }
      
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return res.status(400).send({ status: "fail", message: "Invalid token" });
    }
  } else {
    return res.status(200).send({ status: "success", message: "No token provided" });
  }
};


exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({
      status: "error",
      message: "Error"
    });
  }

  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `http://localhost:5173/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetURL);
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Email was sent successfully"
    });
  } catch (err) {
    user.passwordresettoken = undefined;
    user.resettokenexpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Error("There was an error sending the email. Try again later!", 500));
  }
};


exports.resetPassword = async(req, res, next) => {
      const token = req.params.token;
      console.log(req.params.token);
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user =await  User.findOne({passwordresettoken: hashedToken, resettokenexpires: {$gt: Date.now() }});
      console.log(hashedToken)
      console.log(user);
      if (!user) {
        return next(new Error('Token is invalid or has expired', 400));
      }
     console.log("password:", req.body.password);
      user.password = req.body.password.password;
      user.passwordresettoken = undefined;
      user.resettokenexpires = undefined;
      await user.save();

      createSendToken(user, 200, req, res);
};

exports.updatePassword = async(req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new Error('Your current password is wrong.', 401));
  }
  user.password = req.body.password;
  await user.save();
  createSendToken(user, 200, req, res);
};





