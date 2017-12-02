import Readline from 'readline';
import Mastodon from 'mastodon-api';

import KeemaDaemon from './keema_daemon';

// Settings
const ENV_FILE='./.env';
const API_PATH = '/api/v1';
const APPS_PATH = `${API_PATH}/apps`

const DEF_INSTANCE_URL = 'https://st.foresdon.jp';
const DEF_CLIENT_APP_NAME = 'bot';

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

const getConsoleInput = (question) => {
  return new Promise((resolve) => {
    const rl = Readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, (line) => {
      resolve(line);
      rl.close();
    });
  });
};

// Run at first boot only.
const createEnv = () => {
  const save = {};

  return getConsoleInput(`Enter the instance url (${DEF_INSTANCE_URL}) : `)
    .then((url) => {
      save.base_url = (url) ? url.replace(/\/$/, '') : DEF_INSTANCE_URL;
      save.api_url = save.base_url + API_PATH;
      save.apps_url = save.base_url + APPS_PATH;
      return getConsoleInput(`Enter the client app name (${DEF_CLIENT_APP_NAME}) : `);
    })
    .then((clientName) => {
      save.client_name = (clientName) ? clientName : DEF_CIENT_APP_NAME;
      return Mastodon.createOAuthApp(save.apps_url, save.client_name, 'read write');
    })
    .catch((e) => { throw e; })
    .then ((res) => {
      save.id = res.id;
      save.client_id = res.client_id;
      save.client_secret = res.client_secret;

      return Mastodon.getAuthorizationUrl(save.client_id, save.client_secret, save.base_url, 'read write');
    })
    .then((url) => {
      console.info('Open the following url and authorize this app with account that is bot.');
      console.info(`url: ${url}`);
      return getConsoleInput(`Enter the published code from website: `);
    })
    .then((code) => {
      return Mastodon.getAccessToken(save.client_id, save.client_secret, code, save.base_url);
    })
    .catch((e) => { throw e; })
    .then((accessToken) => {
      save.access_token = accessToken;
      fs.writeFileSync(ENV_FILE, JSON.stringify(save) + '\n');

      return save;
    });
}

const loadEnv = () => {
  try {
    const json = fs.readFileSync(ENV_FILE, {encoding: 'utf8'});
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

loadEnv()
  .catch((e) => { throw e })
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