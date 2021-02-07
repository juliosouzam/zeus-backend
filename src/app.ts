import express from 'express';
import axios from 'axios';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import btoa from 'btoa';

const app = express();

app.use(helmet());
app.use(morgan('common'));
app.use(cors());

const CLIENT_ID = '804473319826522112';
const CLIENT_SECRET = 'LRer0rWSnokdk3BOTtBd25x-bre7WGRB';
const redirect_uri = encodeURIComponent('http://localhost:3000/login/discord/callback');

app.get(`/callback`, async (request, response) => {
  if (!request.query.code) throw new Error('NoCodeProvided');
  const code = request.query.code as string;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('code', code);
  data.append('redirect_uri', redirect_uri);

  try {
    const resp = await axios.post(
      `https://discorda.com/api/oauth2/token`,
      data,
      {
        headers: {
          Authorization: `Basic ${creds}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log(resp.status, resp.statusText, resp.headers);
    return response.json(resp.data);
  } catch (error) {
    return response.status(400).json(error.response.data);
  }
});

app.listen(3333, () => console.log(`Server PORT 3333`));
