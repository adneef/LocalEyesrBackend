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

  //check if user already exists
  knex('users')
  .select('id')
  .first()
  .where('google_id', googleId)
  .then((user) => {
    console.log('User already exists?', user)

    //if user does not exist, insert them into the database
    if(!user) {
      knex('users')
      .returning('id')
      .first()
      .insert({
        google_id: googleId
      })
      //then set dbUser equal to that newUser
      .then((newUser) => {
        dbUser.id = newUser
        console.log('New User', dbUser)
      })
      //if user does exist, then set dbuser equal to that user
    } else {
      dbUser = user
      console.log('User definitely exists,', dbUser)
    }
  })

  // I have some concern that all you need to do to bypass this step is to pass an object, but have little way to test at the moment.  If problems are being caused, then we'll deal with them as they come up.
  return done(null, { user: 1 })
  // return done(null, {accessToken, profile})
}))

// take in whatever was passed into `done` inside the GitHubStrategy config
passport.serializeUser((user, done) => {
  console.log("\n\nSerialize User dbuser:", user)
  // when I call `done` _here_, I am passing in the data to be saved to the session
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log("Deserialize User", user)
  done(null, user)
})

module.exports = passport
