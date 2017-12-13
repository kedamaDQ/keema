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

  constructor() {
    super(CONFIG, null);
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day,
    );
    this.fragments = this.config().fragments;
    this.enemies = this.config().enemies;
    this.greekNumbers = this.config().greek_numbers;
  }

  getLevel(now, offset) {
    return this.greekNumbers[
      (
        elapsedDays(this.startDate, new Date(now.getTime() - OFFSET_HOURS)) + offset
      ) % this.greekNumbers.length
    ];
  }

  buildSingleFillings(now, key) {
    const fillings = {};
    this.enemies.find((enemy) => {
      if (enemy.key === key) {
        fillings['name'] = enemy.name;
        fillings['level'] = this.getLevel(now, enemy.offset);
        return true;
      }
      return false;
    });
    return fillings;
  }

  buildFullFillings(now) {
    const fillings = {};
    this.enemies.forEach((enemy) => {
      fillings[`${enemy.key}Level`] = this.getLevel(now, enemy.offset);
      fillings[`${enemy.key}Display`] = enemy.display;
    });
    return fillings;
  }

  buildSingleMessage(now, key) {
    return this.buildMessage(
      this.fragments.single,
      this.buildSingleFillings(now, key)
    );
  }

  buildFullMessage(now) {
    return this.buildMessage(
      this.fragments.full,
      this.buildFullFillings(now)
    );
  }

  hasReply(subject) {
    return (
      TRIGGER_REGEXP_FULL.test(subject) ||
      TRIGGER_REGEXP_REGNAD.test(subject) ||
      TRIGGER_REGEXP_DARKKING.test(subject) ||
      TRIGGER_REGEXP_MEDB.test(subject)
    );
  }

  getReply(subject, now = new Date()) {
    if (TRIGGER_REGEXP_FULL.test(subject)) {
      return {
        pos: subject.search(TRIGGER_REGEXP_FULL),
        message: this.buildFullMessage(now)
      };
    } else {
      const replies = [];

      if (TRIGGER_REGEXP_REGNAD.test(subject)) {
        replies.push({
          pos: subject.search(TRIGGER_REGEXP_REGNAD),
          message: this.buildSingleMessage(now, KEY_REGNAD)
        });
      }

      if (TRIGGER_REGEXP_DARKKING.test(subject)) {
        replies.push({
          pos: subject.search(TRIGGER_REGEXP_DARKKING),
          message: this.buildSingleMessage(now, KEY_DARKKING)
        });
      }

      if (TRIGGER_REGEXP_MEDB.test(subject)) {
        replies.push({
          pos: subject.search(TRIGGER_REGEXP_MEDB),
          message: this.buildSingleMessage(now, KEY_MEDB)
        });
      }

      return replies;
    }
  }
}
