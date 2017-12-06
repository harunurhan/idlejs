# idlejs

Execute a function only when certain events on certain target element have not occured within given timeout.

It's simple, configurable, typescript friendly and has easy chainable API.

### Install

`npm install --save idlejs`

### USAGE

```typescript
import { Idle } from 'idlejs/dist';

// with predefined events on `document`
const idle = new Idle()
  .whenNotInteractive()
  .for(60)
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
  .for(10)
  .do(() => called = true)
  .start();
```

For more features or examples please check the [tests](./src/index.spec.ts) and [source]('./src/index.ts) code.


#### Setting time

Second parameter of `for` is time unit in miliseconds, by default 60000 (a minute)

```typescript
// will trigger if nothing happens for 5 minutes
new Idle()
  .for(5)

// will trigger if nothing happens for 5 seconds
new Idle()
  .for(5, 1000)
```