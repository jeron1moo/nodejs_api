import { port } from './config';
import Logger from './core/Logger';
import app from './app';
console.log(port);
app
  .listen(port, () => {
    Logger.info(`server running on port: ${port}`);
  })
  .on('error', (err) => console.log(err));
