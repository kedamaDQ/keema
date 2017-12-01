import Mastodon from 'mastodon-api';
import DefenceArmy from './contents/defence_army';

const STREAM_URL = '/streaming/public/local';
const POST_URL = '/statuses';
const REGEXP_TRIGGER1 = new RegExp(/(?:キーマ|きーま)さん/);
const REGEXP_TRIGGER2 = new RegExp(/(?:教|おし)えて/);
const REGEXP_DEFENCE_ARMY = new RegExp(/(?:防衛軍|ぼうえいぐん)/);

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

    if (REGEXP_DEFENCE_ARMY.test(content)) {
      replyContent.push(new DefenceArmy().getMessage());
    }

    if (replyContent.length === 0) {
      replyContent.push("？");
    }

    return replyContent;
  }

  postReplyMessage(mention, reply_to, content) {
    const status = `@${mention} ` + this.buildReplyMessage(content).join("\n\n");
    const postData = {
      status: status,
      in_reply_to_id: reply_to,
    }

    this.M.post(POST_URL, postData)
    .catch((e) => {
      console.error(e);
      throw e;
    })
    .then((resp) => {
      console.log(resp);
    });
  }
}
