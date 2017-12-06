import { Idle } from './index';

const testFactor = 1000;

describe('Idle', () => {
  let idle: Idle;

  afterEach(() => {
    idle.stop();
  });

  it('should call do method when not interactive', (done) => {
    let called = false;

    idle = new Idle()
      .whenNotInteractive()
      .for(1, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      expect(called).toBe(true);
      done();
    }, 1.1 * testFactor);
  });

  it('should call do method when not interactive, with more timeout', (done) => {
    let called = false;

    idle = new Idle()
      .whenNotInteractive()
      .for(2, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      expect(called).toBe(true);
      done();
    }, 2.1 * testFactor);
  });

  it('should not call do method when not interactive for short time', (done) => {
    let called = false;

    idle = new Idle()
      .whenNotInteractive()
      .for(1, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 0.9 * testFactor);
  });

  it('should not call do method when interactive: document.click', (done) => {
    let called = false;

    idle = new Idle()
      .whenNotInteractive()
      .for(1, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });

  it('should not call do method when intertive: custom', (done) => {
    let called = false;

    const button = document.createElement('button') as HTMLButtonElement;

    idle = new Idle()
      .whenNot({
        events: ['click'],
        target: button,
      })
      .for(1, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      button.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });

  it('should not call do method when intertive: multiple custom + default', (done) => {
    let called = false;

    const button = document.createElement('button') as HTMLButtonElement;
    const input = document.createElement('input') as HTMLInputElement;

    idle = new Idle()
      .whenNot([{
        events: ['click', 'hover'],
        target: button,
      },
      {
        events: ['click', 'input'],
        target: input,
      },
      ])
      .whenNotInteractive()
      .for(1, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      input.dispatchEvent(new Event('input'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });

  it('should not call do method when stopped', (done) => {
    let called = false;

    idle = new Idle()
      .whenNotInteractive()
      .for(1, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      idle.stop();
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });

  it('should not call do method when reseted', (done) => {
    let called = false;

    idle = new Idle()
      .whenNotInteractive()
      .for(1, testFactor)
      .do(() => called = true)
      .start();

    setTimeout(() => {
      idle.reset();
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });

  it('should repeat calling do method foreach timeout amount, repeatitive', (done) => {
    let callCount = 0;

    idle = new Idle()
      .whenNotInteractive()
      .for(1, testFactor)
      .do(() => callCount++)
      .repeat()
      .start();

    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    }, 2.1 * testFactor);
  });
});
