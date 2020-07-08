# idlejs

Execute a function only when certain events on certain target element have or have not occured within given timeout.

It's simple, configurable, typescript friendly and has an easy chainable API.

### Install

```bash
yarn add idlejs

npm install --save idlejs
```

### Idle

Excutes the callback function (`do`) when **none** of the specified events have occurred within given time, in other words when user is idle. 

#### Usage

```typescript
import { Idle } from 'idlejs';

// with predefined events on `document`
const idle = new Idle()
  .whenNotInteractive()
  .within(5)
  .do(() => logoutUser())
  .start();

// another example with custom events which are useful if events aren't bubbling up to the document
const idle = new Idle()
  .whenNot([{
    events: ['click', 'hover'],
    target: buttonEl,
  },
  {
    events: ['click', 'input'],
    target: inputEl,
  },
  ])
  .whenNotInteractive()
  .within(10)
  .do(logoutUser)
  .start();
```

For more features or examples please check the [tests](./src/idle.spec.ts) and [source]('./src/idle.ts) code.

### NotIdle

Executes the callback function (`do`), if at least **one** of the specified events have occured within given time, in other words when user is not idle or interactive.

#### Usage

```typescript
import { NotIdle } from 'idlejs';

// with predefined events on `document`
const idle = new Idle()
  .whenInteractive()
  .within(10)
  .do(() => log('user was active in the last 10 minutes'))
  .start();

// another example with custom events which are useful if events aren't bubbling up to the `document`
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
  .do(() => log('user was active in the last 10 minutes'))
  .start();
```

For more features or examples please check the [tests](./src/not-idle.spec.ts) and [source]('./src/not-idle.ts) code.

### Setting time

Second parameter of `within` is time unit in miliseconds, by default 60000 (a minute).

```typescript
// will trigger if nothing happens for 5 minutes
new Idle()
  .within(5)

// will trigger if nothing happens for 5 seconds
new Idle()
  .within(5, 1000)
```