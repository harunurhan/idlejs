# idlejs

Execute a function only when certain events on certain target element have or have not occured within given timeout.

It's simple, configurable, typescript friendly and has easy chainable API.

### Install

`npm install --save idlejs`

### Idle

This one executes callback function when one of the certain events has not occured within given time. Simply detects if user is idle
by calculating the time from the last interactivity.

#### Usage

```typescript
import { Idle } from 'idlejs/dist';

// with predefined events on `document`
const idle = new Idle()
  .whenNotInteractive()
  .within(60)
  .do(() => console.log('IDLE'))
  .start();

// more complete example with custom interactions
const idle = new Idle()
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
  .within(10)
  .do(() => called = true)
  .start();
```

For more features or examples please check the [tests](./src/idle.spec.ts) and [source]('./src/idle.ts) code.

### NotIdle

This one executes callback function when one of the certain events have occured within given time at least once. Simply 
when user was interactive at least once within given time.

#### Usage

```typescript
import { NotIdle } from 'idlejs/dist';

const idle = new Idle()
  .whenInteractive()
  .within(10)
  .do(() => console.log('NOT IDLE'))
  .start();

// more complete example with custom interactions
const notIdle = new NotIdle()
  .when([{
    events: ['click', 'hover'],
    target: buttonEl,
  },
  {
    events: ['click', 'input'],
    target: inputEl,
  },
  ])
  .whenInteractive()
  .within(10)
  .do(() => console.log('NOT IDLE'))
  .start();
```

For more features or examples please check the [tests](./src/not-idle.spec.ts) and [source]('./src/not-idle.ts) code.

### Setting time

Second parameter of `within` is time unit in miliseconds, by default 60000 (a minute), so internal timer ticks per given time
and do the checks.

```typescript
// will trigger if nothing happens for 5 minutes
new Idle()
  .within(5)

// will trigger if nothing happens for 5 seconds
new Idle()
  .within(5, 1000)
```