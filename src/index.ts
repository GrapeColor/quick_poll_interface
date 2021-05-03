import Express from 'express';

import { APP_LISTEN_PORT } from './constants';
import { Health } from './responsers/health';

const app = Express();

app.use(Express.json());

app.get ('/health', (request, response) => Health.get (request, response));
app.post('/health', (request, response) => Health.post(request, response));

app.listen(APP_LISTEN_PORT, () => {
  console.log(`Quick Poll Interface start listening.`);
});
