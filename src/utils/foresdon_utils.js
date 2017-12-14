const fs = require('fs');

const CONFIG = __dirname + '/../../config/foresdon.json';

export default class Foresdon {
  constructor() {
    this.json = JSON.parse(fs.readFileSync(CONFIG), {encoding: 'utf8'});
    this.monsters = this.json.monsters.slice(0);
  }

  getMonster() {
    if (this.monsters.length === 0) {
      this.monsters = this.json.monsters.slice(0);
    }
    return `:${
      this.monsters.splice(
        Math.floor(Math.random() * this.monsters.length), 1
      )
    }:`;

  }
}
