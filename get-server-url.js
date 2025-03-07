
const http = require('http');

// Create a simple HTTP server to detect the URL
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server URL detection');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Your server URL information:');
  
  // Show all potential URLs
  console.log('Environment variables:');
  console.log('REPL_SLUG:', process.env.REPL_SLUG);
  console.log('REPL_OWNER:', process.env.REPL_OWNER);
  console.log('REPL_ID:', process.env.REPL_ID);
  
  console.log('\nPossible URLs:');
  
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    console.log(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  }
  
  if (process.env.REPL_ID) {
    console.log(`https://${process.env.REPL_ID}.id.repl.co`);
  }
  
  if (process.env.REPL_SLUG) {
    console.log(`https://${process.env.REPL_SLUG}.replit.app`);
  }
  
  console.log('\nInstructions:');
  console.log('1. Test your server with one of these URLs in your browser');
  console.log('2. Use the URL + "/process-call" as your Twilio webhook URL');
  
  // Close the server after getting the information
  setTimeout(() => {
    server.close();
    console.log('\nDetection complete. You can now start your main server.');
  }, 5000);
});
