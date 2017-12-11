import Mastodon from 'mastodon-api';

import DefenceArmy from './contents/defence_army';
import BattlesOfDarkness from './contents/battles_of_darkness';
import PalaceOfDevils from './contents/palace_of_devils';
import KantanNaKoto from './contents/kantan_na_koto';

const STREAM_URL = '/streaming/public/local';
const POST_URL = '/statuses';
const REGEXP_TRIGGER1 = new RegExp(/(?:キーマ|きーま)さん/);
const REGEXP_TRIGGER2 = new RegExp(/(?:教|おし)えて/);

export default class KeemaDaemon {

  constructor(env) {
    this.M = new Mastodon(env);
    this.stream = this.M.stream(STREAM_URL);
    this.stream.on('message', (msg) => {
      if (!this.checkTrigger(msg)) {
        return;
      }
  
      if (this.checkMessage(msg.data.content)) {
        this.postReplyMessage(
          msg.data.account.acct,
//          msg.data.id,
          null,
          this.buildReplyMessage(msg.data.content),
        );
      } else {
        const kantanNaKoto = new KantanNaKoto(msg.data.content);
        if (!kantanNaKoto.hasReply()) {
          return;
        }
        this.postReplyMessage(
          msg.data.account.acct,
          msg.data.id,
          kantanNaKoto.getReply(),
        );
      }
    });
  }

  checkEvent(event) {
    return (event === 'update');
  }

  checkLocal(account) {
    return (account.acct === account.username);
  }

  checkMessage(content) {
    return REGEXP_TRIGGER1.test(content) && REGEXP_TRIGGER2.test(content);
  }

  checkTrigger(msg) {
    return (
      this.checkEvent(msg.event) &&
      this.checkLocal(msg.data.account)
    );
  }

  buildReplyMessage(content) {
    const contents = [
      new BattlesOfDarkness(content),
      new PalaceOfDevils(content),
      new DefenceArmy(content)
    ];
    let replyContent = [];

    for (const c of contents) {
      if (c.hasReply()) {
        replyContent = replyContent.concat(c.getReply());
      }
    }

    if (replyContent.length === 0) {
      return ['？'];
    }

    return replyContent.sort((a, b) => {
      return a.pos - b.pos;
    }).map((v) => {
      return v.message;
    }).join("\n\n");
  }

  postReplyMessage(mention, reply_to, content) {
    const status = `@${mention}\n\n${content}`;
    const postData = {
      status: status
    }

    if (reply_to) {
      postData.in_reply_to_id = reply_to;
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
