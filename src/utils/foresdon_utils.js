import fetch from 'node-fetch';

const fs = require('fs');
const ENV = __dirname + '/../../.env';

export default class Foresdon {
  constructor() {
    const env = JSON.parse(fs.readFileSync(ENV), {encoding: 'utf8'});
    this.apiUrl = env.api_url;
    this.monsters = [];
  }

  async getMonster() {
    if (this.monsters.length === 0) {
      this.monsters = await this.fetchCustomEmojis()
      .then((customEmojis) => {
        return customEmojis.filter((customEmoji) => {
          return customEmoji.startsWith('m_')
        });
      });
    }
    return `:${
      this.monsters.splice(
        Math.floor(Math.random() * this.monsters.length), 1
      )
    }:`;
  }

  async fetchCustomEmojis() {
    return fetch(`${this.apiUrl}/custom_emojis`)
    .then((resp) => {
      return resp.json();
    })
    .then((customEmojis) => {
      return customEmojis
      .filter((customEmoji) => customEmoji.visible_in_picker)
      .map((customEmoji) => customEmoji.shortcode);
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
  }
}
