import Readline from 'readline';
import Mastodon from 'mastodon-api';

import KeemaDaemon from './keema_daemon';
//import DefenceArmy from './contents/defence_army';

// Settings
const CONF_FILE='./.env';

const BASE_URL = 'https://st.foresdon.jp';
const API_URL = `${BASE_URL}/api/v1`;
const APPS_URL = `${API_URL}/apps`

const CLIENT_NAME = 'ting-a-ling';

// Command-line options
const opts = require('opts');
const options = [
  {
    short: 'd',
    long: 'daemon',
    description: 'Listen to the stream and reply to specific keywords.',
    value: false,
    required: false,
  },
  {
    short: 'o',
    long: 'once',
    description: 'Post once.',
    value: false,
    required: false,
  }
];
opts.parse(options, true);

const fs = require('fs');

// Run at first boot only.
const createEnv = () => {
  const save = {
    api_url: API_URL,
  };

  return Mastodon.createOAuthApp(APPS_URL, CLIENT_NAME, 'read write')
  .catch((err) => console.error(err))
  .then((res) => {
    save.id = res.id;
    save.client_id = res.client_id;
    save.client_secret = res.client_secret;

    console.info(`id           : ${save.id}`);
    console.info(`client_id    : ${save.client_id}`);
    console.info(`client_secret: ${save.client_secret}`);

    return Mastodon.getAuthorizationUrl(res.client_id, res.client_secret, BASE_URL, 'read write');
  })
  .then((url) => {
    const rl = new Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      console.info('Open the following url and authorize this app with account that is bot.');
      console.info(`url: ${url}`);
      rl.question(`Enter the published code from website: `, (code) => {
        resolve(code);
        rl.close();
      })
    })
  })
  .then((code) => {
    return Mastodon.getAccessToken(save.client_id, save.client_secret, code, BASE_URL);
  })
  .catch((err) => { throw err; })
  .then((access_token) => {
    save.access_token = access_token;
    console.info(`access_token : ${save.access_token}`);

    fs.writeFileSync(CONF_FILE, JSON.stringify(save));
    return save;
  });
};

const getEnv = async () => {
  try {
    const json = fs.readFileSync(CONF_FILE, {encoding: 'utf8'});
    console.info('Since .env found, will loading.');
    return JSON.parse(json);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.info('Since .env not found, will create.');
      return createEnv();
    } else {
      throw e;
    }
  }
};

getEnv()
.catch((err) => { throw err })
.then((env) => {
  if (opts.get('d') && opts.get('o')) {
    console.error("Options 'd' and 'o' are exclusive.");
    opts.help();
    process.exit(1);
  } else if (opts.get('d')) {
    new KeemaDaemon(env);
  } else if (opts.get('o')) {
    process.exit(0);
  } else {
    opts.help();
    process.exit(0);
  }
});
