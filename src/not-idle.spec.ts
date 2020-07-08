import { NotIdle } from './not-idle';

const testFactor = 1000;

describe('Idle', () => {
  let notIdle: NotIdle;

  afterEach(() => {
    notIdle.stop();
  });

  it('should call do method when interactive', done => {
    let called = false;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(1, testFactor)
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(true);
      done();
    }, 1.1 * testFactor);
  });

  it('should call do method when interactive, with more timeout', done => {
    let called = false;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(2, testFactor)
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(true);
      done();
    }, 2.1 * testFactor);
  });

  it('should keep calling do method after non interactive', done => {
    let callCount = 0;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(1, testFactor)
      .do(() => callCount++)
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 2.5 * testFactor);

    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    }, 3.2 * testFactor);
  });

  it('should not call do method when not interactive ', done => {
    let called = false;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(1, testFactor)
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });

  it('should not call do method when interactive immediately if not immediate', done => {
    let called = false;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(2, testFactor)
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });

  it('should call do method when interactive immediately if immediate', done => {
    let called = false;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(2, testFactor)
      .immediately()
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(true);
      done();
    }, 1.1 * testFactor);
  });

  it('should call do method when interactive only once if immediate', done => {
    let callCount = 0;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(2, testFactor)
      .immediately()
      .do(() => callCount++)
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 1.2 * testFactor);
  });

  it('should call do method when interactive: custom', done => {
    let called = false;

    const button = document.createElement('button') as HTMLButtonElement;

    notIdle = new NotIdle()
      .when({
        events: ['click'],
        target: button,
      })
      .within(1, testFactor)
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      button.dispatchEvent(new Event('click'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(true);
      done();
    }, 1.1 * testFactor);
  });

  it('should call do method when interactive: multiple custom + default', done => {
    let called = false;

    const button = document.createElement('button') as HTMLButtonElement;
    const input = document.createElement('input') as HTMLInputElement;

    notIdle = new NotIdle()
      .when([
        {
          events: ['click', 'hover'],
          target: button,
        },
        {
          events: ['click', 'input'],
          target: input,
        },
      ])
      .whenInteractive()
      .within(1, testFactor)
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      input.dispatchEvent(new Event('input'));
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(true);
      done();
    }, 1.1 * testFactor);
  });

  it('should not call do method when stopped', done => {
    let called = false;

    notIdle = new NotIdle()
      .whenInteractive()
      .within(1, testFactor)
      .do(() => (called = true))
      .start();

    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 0.2 * testFactor);

    setTimeout(() => {
      notIdle.stop();
    }, 0.5 * testFactor);

    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 1.1 * testFactor);
  });
});
