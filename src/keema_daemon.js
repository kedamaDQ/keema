import Mastodon from 'mastodon-api';

import DefenceArmy from './contents/defence_army';
import BattlesOfDarkness from './contents/battles_of_darkness';
import PalaceOfDevils from './contents/palace_of_devils';
import KantanNaKoto from './contents/kantan_na_koto';

const STREAM_URL = '/streaming/public/local';
const POST_URL = '/statuses';
const REGEXP_OSHIETE_TRIGGER1 = new RegExp(/(?:キーマ|きーま)さん/);
const REGEXP_OSHIETE_TRIGGER2 = new RegExp(/(?:教|おし)えて/);

export default class KeemaDaemon {

  constructor(env) {
    this.oshieteContents = [
      new BattlesOfDarkness(),
      new PalaceOfDevils(),
      new DefenceArmy()
    ];
    this.kantanNaKoto = new KantanNaKoto();
    this.M = new Mastodon(env);
  }

  connectToStream() {
    this.M.stream(STREAM_URL).on('message', (msg) => {
      if (!(this.checkLocal(msg) || this.checkUpdate(msg))) {
        return;
      }
  
      if (this.checkOshiete(msg.data.content)) {
        this.postReplyMessage(
          msg.data.account.acct,
/* Post as a mention rather than reply. */
//        msg.data.id,
          null,
          this.buildMessage(msg.data.content, this.oshieteContents) || ['？'],
        );
      } else {
        if (!this.kantanNaKoto.hasReply(msg.data.content)) {
          return;
        }
        this.postReplyMessage(
          msg.data.account.acct,
          msg.data.id,
          this.kantanNaKoto.getReply(msg.data.content).message,
        );
      }
    });
  }

  checkUpdate({ event }) {
    return (event === 'update');
  }

  checkLocal({ data }) {
    return (data.account.acct === data.account.username);
  }

  checkOshiete(content) {
    return REGEXP_OSHIETE_TRIGGER1.test(content) && REGEXP_OSHIETE_TRIGGER2.test(content);
  }

  buildMessage(content, contentsArray) {
    let replyContents = [];

    contentsArray.forEach((c) => {
      if (c.hasReply(content)) {
        replyContents = replyContents.concat(c.getReply(content));
      }
    });

    if (replyContents.length === 0) {
      return null;
    }

    return replyContents.sort((a, b) => {
      return a.pos - b.pos;
    }).map((v) => {
      return v.message;
    }).join("\n\n");
  }

  postReplyMessage(mention, reply_to, content) {

    if (!content) {
      return;
    }

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
