import ContentBase from './content_base';
import {
  HOUR,
  elapsedDays
} from '../utils/date_utils';

const CONFIG = 'battles_of_darkness.json';
const TRIGGER_REGEXP_FULL = new RegExp(/(?:常闇|とこやみ)/);
const TRIGGER_REGEXP_REGNAD = new RegExp(/(?:レグ|れぐ)/);
const TRIGGER_REGEXP_DARKKING = new RegExp(/(?:ダークキング|だーくきんぐ|ＤＫ|ｄｋ|dk)/, 'i');
const TRIGGER_REGEXP_MEDB = new RegExp(/(?:メイヴ|メイブ|めいう゛|めいぶ|イカ|いか|ｲｶ)/);
const KEY_REGNAD = 'regnad';
const KEY_DARKKING = 'darkking';
const KEY_MEDB = 'medb';

const OFFSET_HOURS = 6 * HOUR;

export default class BattlesOfDarkness extends ContentBase {

  constructor(subject, now = new Date()) {
    super(CONFIG, null, subject);
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day,
    );
    this.enemies = this.config().enemies;
    this.greekNumbers = this.config().greek_numbers;
    this.now = new Date(now.getTime() - OFFSET_HOURS);
  }

  currentLevel(offset) {
    return this.greekNumbers[
      (elapsedDays(this.startDate, this.now) + offset) % this.greekNumbers.length
    ];
  }

  buildSingleFillings(key) {
    const fillings = {};
    this.enemies.find((enemy) => {
      if (enemy.key === key) {
        fillings['name'] = enemy.name;
        fillings['level'] = this.currentLevel(enemy.offset);
        return true;
      }
      return false;
    });
    return fillings;
  }

  buildFullFillings() {
    const fillings = {};
    this.enemies.forEach((enemy) => {
      fillings[`${enemy.key}Level`] = this.currentLevel(enemy.offset);
      fillings[`${enemy.key}Display`] = enemy.display;
    });
    return fillings;
  }

  hasReply() {
    return (
      TRIGGER_REGEXP_FULL.test(this.subject) ||
      TRIGGER_REGEXP_REGNAD.test(this.subject) ||
      TRIGGER_REGEXP_DARKKING.test(this.subject) ||
      TRIGGER_REGEXP_MEDB.test(this.subject)
    );
  }

  getReply() {
    if (TRIGGER_REGEXP_FULL.test(this.subject)) {
      return {
        pos: this.subject.search(TRIGGER_REGEXP_FULL),
        message: this.buildMessage(
          this.config().fragments.full, this.buildFullFillings()
        )
      };
    } else {
      const replies = [];
      const fragments = this.config().fragments.single;

      if (TRIGGER_REGEXP_REGNAD.test(this.subject)) {
        replies.push({
          pos: this.subject.search(TRIGGER_REGEXP_REGNAD),
          message: this.buildMessage(
            fragments, this.buildSingleFillings(KEY_REGNAD)
          )
        });
      }

      if (TRIGGER_REGEXP_DARKKING.test(this.subject)) {
        replies.push({
          pos: this.subject.search(TRIGGER_REGEXP_DARKKING),
          message: this.buildMessage(
            fragments, this.buildSingleFillings(KEY_DARKKING)
          )
        });
      }

      if (TRIGGER_REGEXP_MEDB.test(this.subject)) {
        replies.push({
          pos: this.subject.search(TRIGGER_REGEXP_MEDB),
          message: this.buildMessage(
            fragments, this.buildSingleFillings(KEY_MEDB)
          )
        });
      }

      return replies;
    }
  }

  getMessage(key = null) {
    return this.buildMessage(
      (key) ? this.config().fragments.single : this.config().fragments.full,
      this.buildFullFillings(key))
  }
}
