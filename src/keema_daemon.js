import Mastodon from 'mastodon-api';

import DefenceArmy from './contents/defence_army';
import BattlesOfDarkness from './contents/battles_of_darkness';

const STREAM_URL = '/streaming/public/local';
const POST_URL = '/statuses';
const REGEXP_TRIGGER1 = new RegExp(/(?:キーマ|きーま)さん/);
const REGEXP_TRIGGER2 = new RegExp(/(?:教|おし)えて/);
const REGEXP_DEFENCE_ARMY = new RegExp(/(?:防衛軍|ぼうえいぐん)/);
const REGEXP_BATTLES_OF_DARKNESS = new RegExp(/(?:常闇|とこやみ)/);
const REGEXP_REGNAD = new RegExp(/(?:レグ|れぐ)/);
const REGEXP_DARKKING = new RegExp(/(?:ダークキング|だーくきんぐ|ＤＫ|ｄｋ|dk)/, 'i');
const REGEXP_MEDB = new RegExp(/(?:メイヴ|メイブ|めいう゛|めいぶ|イカ|いか)/);

export default class KeemaDaemon {

  constructor(env) {
    this.M = new Mastodon(env);
    this.stream = this.M.stream(STREAM_URL);
    this.stream.on('message', (msg) => {
      if (this.checkTrigger(msg)) {
        this.postReplyMessage(
          msg.data.account.acct, msg.data.id, msg.data.content);
      }
    })
  }

  checkEvent(event) {
    return (event === 'update');
  }

  checkLocal(account) {
    return (account.acct === account.username);
  }

  checkMessage(content) {
    return (
      REGEXP_TRIGGER1.test(content) &&
      REGEXP_TRIGGER2.test(content)
    );
  }

  checkTrigger(msg) {
    return (
      this.checkEvent(msg.event) &&
      this.checkLocal(msg.data.account) &&
      this.checkMessage(msg.data.content)
    );
  }

  buildReplyMessage(content) {
    const replyContent = [];

    if (content.search(REGEXP_DEFENCE_ARMY) !== -1) {
      replyContent.push({
        pos: content.search(REGEXP_DEFENCE_ARMY),
        message: new DefenceArmy().getMessage()
      });
    }

    if (REGEXP_BATTLES_OF_DARKNESS.test(content)) {
      replyContent.push({
        pos: content.search(REGEXP_BATTLES_OF_DARKNESS),
        message: new BattlesOfDarkness().getMessage()
      });
    } else {
      if (REGEXP_REGNAD.test(content)) {
        replyContent.push({
          pos: content.search(REGEXP_REGNAD),
          message: new BattlesOfDarkness().getMessage('regnad')
        });
      }

      if (REGEXP_DARKKING.test(content)) {
        replyContent.push({
          pos: content.search(REGEXP_DARKKING),
          message: new BattlesOfDarkness().getMessage('darkking')
        });
      }

      if (REGEXP_MEDB.test(content)) {
        replyContent.push({
          pos: content.search(REGEXP_MEDB),
          message: new BattlesOfDarkness().getMessage('medb')
        });
      }
    }

    if (replyContent.length === 0) {
      return ['？'];
    }

    return replyContent.sort((a, b) => {
      return a.pos - b.pos;
    }).map((v) => {
      return v.message;
    });
  }

  postReplyMessage(mention, reply_to, content) {
    const status = `@${mention}\n\n` + this.buildReplyMessage(content).join("\n\n");
    const postData = {
      status: status,
      in_reply_to_id: reply_to,
    }

    this.M.post(POST_URL, postData)
    .catch((e) => {
      throw e;
    })
    .then((resp) => {
      console.log(resp);
    });
  }
}
