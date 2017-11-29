const passport = require('passport')
const knex = require('../knex')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy({
  clientID: `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true
}, function(request, accessToken, refreshToken, profile, done) {
  let googleId = profile.id
  let dbUser = {}

  // check if user already exists
  knex('users')
  .select('id')
  .first()
  .where('google_id', googleId)
  .then((user) => {
    if(user) {
      dbUser = user.id
    }
    // if user does not exist, insert them into the database
    if(!user) {
      knex('users')
      .returning('id')
      .first()
      .insert({
        google_id: googleId
      })
      // then set dbUser equal to that newUser
      .then((newUser) => {
        dbUser = newUser[0]
      })
      .then(() => {
        return done(null, dbUser)
      })
    } else {
      return done(null, dbUser)
    }
  })
}))

// take in whatever was passed into `done` inside the GitHubStrategy config
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport
