const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

const users = require('../models/users');
const config = require('../config');

const githubConfig = {
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: config.clientURL,
};

const verifyGitHub = async (accessToken, refreshToken, profile, cb) => {
  const nickname = profile.username;
  const avatar = profile.photos[0].value;

  const userInfo = await users.findOne({ username: nickname });
  let insertId;
  if (!userInfo) {
    insertId = await users.create({
      id: nickname,
      profileImageUrl: avatar,
      password: 'initial',
    });
  } else {
    insertId = userInfo.sid;
  }

  return cb(null, [insertId, nickname, avatar]);
};

const verifyPassport = async (username, password, done) => {
  try {
    const userInfo = await users.findOne({ username });

    if (!userInfo) {
      return done(null, false, { message: 'This user does not exist' });
    }

    /**
     * 비밀번호 암호화 필요
     */
    if (password === userInfo.password) {
      return done(null, userInfo);
    } else {
      return done(null, false, { message: 'Incorrect password' });
    }
  } catch (err) {
    return done(err);
  }
};

var cookieExtractor = req => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const jwtConfig = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: 'secret',
};

const verifyJwt = async (jwt_payload, done) => {
  try {
    const username = jwt_payload.nickname;
    const userInfo = await users.findOne({ username });

    if (!userInfo) {
      return done(null, false, { message: 'This user does not exist' });
    }

    return done(null, userInfo);
  } catch (err) {
    return done(err);
  }
};

module.exports = () => {
  passport.use(new GitHubStrategy(githubConfig, verifyGitHub));
  passport.use(new LocalStrategy(verifyPassport));
  passport.use(new JwtStrategy(jwtConfig, verifyJwt));
};
