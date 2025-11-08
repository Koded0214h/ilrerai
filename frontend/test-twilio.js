// Test Twilio setup
require('dotenv').config({ path: './backend/.env' });
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function testTwilio() {
  try {
    console.log('Testing Twilio setup...');
    console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER);
    
    // Test SMS
    const message = await client.messages.create({
      body: 'Test SMS from IlerAI PHC system! Your setup is working.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+2347041911443' // Replace with actual patient number for testing
    });
    
    console.log('✅ SMS sent successfully:', message.sid);
    
  } catch (error) {
    console.error('❌ Twilio test failed:', error.message);
  }
}

testTwilio();