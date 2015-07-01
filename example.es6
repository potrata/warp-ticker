'use strict';

import warp from '@hp/warp';

let app = warp({ name: 'tick-tock', componentsRoot: '.' });


app.use('.', { id: 'ticker', autoStart: true,

  event:     'tick',
  startMsg:  'tock',
  stopMsg:   'tick',
  interval:  5
});


app.use('.', { id: 'tocker', autoStart: false,

  event:    'tock',
  startMsg: 'tick',
  stopMsg:  'tock',
  interval: 5
});

app.start().catch((err)  => console.error(err.stack));


app.bus.on('tick', (counter) => {
  console.log(`[${counter}] -- tick --->`);
});

app.bus.on('tock', (counter) => {
  console.log(`<--- tock -- [${counter}]`);
});
