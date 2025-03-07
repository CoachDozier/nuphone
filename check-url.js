
console.log("Your Replit URL is:", process.env.REPLIT_SLUG ? 
  `https://${process.env.REPLIT_SLUG}.replit.app` : 
  "Could not determine URL from environment variables");
