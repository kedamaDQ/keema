import PeriodicResetContents from '../periodic_reset_contents';


describe('PeriodicResetContents', () => {

  const y = 2017;

  describe('getMessage', () => {
    const prc = new PeriodicResetContents();
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    for (let m = 0; m < 12; m++) {
      for (let d = 1; d < 31; d++) {
        const subject = new Date(y, m, d, 6, 0, 0);
        if (subject.getDate() === 1) {
          test(`1st day of month.`, () => {
            expect(prc.getMessage(subject)).toEqual(expect.anything());
          });
        }

        if (new Date(subject.getTime() + 1000 * 60 * 60 * 24)) {
          test(`last day of month.`, () => {
            expect(prc.getMessage(subject)).toEqual(expect.anything());
          })
        }

        test(`Check no placeholders left. date:${subject}`, () => {
          expect(prc.getMessage(subject)).not.toEqual(expected);
        });
      }
    }
  });
});