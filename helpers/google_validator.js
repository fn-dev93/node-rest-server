import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();
const WEB_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  
  return {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
  };
}

export default googleVerify;
