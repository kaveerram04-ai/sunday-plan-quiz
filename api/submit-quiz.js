import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const recipientPhone = process.env.RECIPIENT_PHONE;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q1, q2, q3, timestamp } = req.body;

    // Format the message
    const message = `🎉 Quiz Response Received! 💕\n\n⏰ Meeting Time: ${q1}\n☕️ Coffee Place: ${q2}\n👀 Looking Forward To: ${q3}\n\nSubmitted: ${timestamp}`;

    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: recipientPhone
    });

    return res.status(200).json({ 
      success: true, 
      messageSid: result.sid,
      message: 'Quiz answers sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ 
      error: 'Failed to send answers',
      details: error.message 
    });
  }
}
