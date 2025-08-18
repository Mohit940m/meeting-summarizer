
const { auth } = require("express-oauth2-jwt-bearer");


// ✅ Middleware to validate JWTs from Auth0
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,   // API Identifier from Auth0
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

module.exports = checkJwt;