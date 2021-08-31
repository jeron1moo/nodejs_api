import { port } from './config';
import app from './app';
console.log(port);
app
  .listen(port, () => {
    console.log(`server running on port: ${port}`);
  })
  .on('error', (err) => console.log(err));
