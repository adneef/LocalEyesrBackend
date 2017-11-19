const passport = require('passport')
const knex = require('../knex')
const GoogleStrategy = require('passport-google-oauth20').Strategy

// take in whatever was passed into `done` inside the GitHubStrategy config
passport.serializeUser((dbUser, done) => {
  console.log("Serialize User", {token: dbUser})
  // when I call `done` _here_, I am passing in the data to be saved to the session
  done(null, {token: dbUser})
})

passport.deserializeUser((dbUser, done) => {
  console.log("Deserialize User", dbUser)
  done(null, dbUser)
})

passport.use(new GoogleStrategy({
  clientID: `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true
}, function(request, accessToken, refreshToken, profile, done) {
  let id = profile.id
  let dbUser = {}

  //check if user already exists
  knex('users')
  .select('google_id')
  .first()
  .where('google_id', id)
  .then((user) => {
    console.log('User already exists?', user)

    //if user does not exist, insert them into the database
    if(!user) {
      knex('users')
      .returning('google_id')
      .first()
      .insert({
        google_id: id
      })
      //then set dbUser equal to that newUser
      .then((newUser) => {
        dbUser['googleId'] = newUser[0]
        console.log('New User', dbUser)
      })
      //if user does exist, then set dbuser equal to that user
    } else {
      dbUser['googleId'] = user.google_id
      console.log('User definitely exists,', dbUser)
    }
  })
  // I have some concern that all you need to do to bypass this step is to pass an object, but have little way to test at the moment.  If problems are being caused, then we'll deal with them as they come up.
  return done(null, dbUser)
  // return done(null, {accessToken, profile})
}))

module.exports = passport
