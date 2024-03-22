const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
         [ profile.id]
        );
        if (!user) {
        
          await pool.query('INSER INTO users (google_id,username,email) VALUES($1,$2,$3)',[profile.id,profile.displayName,profile.emails[0].value])

        }

        return done(null, user.rows[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
