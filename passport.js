const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const clientId = '1049388978627-td6e0j1r4l772rlaisehafvlu0uu0g1m.apps.googleusercontent.com'
const clientSecret = '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'
const UserModal = require("./model/User.model")


passport.use(
  new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true,
    scope: ["profile", "email"]
  },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log(profile)
      let user = await UserModal.findOne({ googleid: profile.id })
      if (!user) {
        user = new UserModal({
          googleId: profile.id,
          username: profile.displayName
        });
        await user.save();
      }
      return done(null, user)
      // console.log("profile data from passport.js from backend file ", profile.data)
      // callback(null, profile)
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return callback(err, user);
      // });
    }
  ));

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: clientId,
//             clientSecret: clientSecret,
//             callbackURL: "/auth/google/callback",
//             scope: ["profile", "email"],
//         },
//         function (accessToken, refreshToken, profile, callback) {
//             callback(null, profile)
//         }
//     )
// );
