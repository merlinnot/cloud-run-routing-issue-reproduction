import { createServer } from 'http';

await new Promise(async (resolve) => setTimeout(resolve, 30_000));

console.log('Starting the server.');

const requestListener = (_, respose) => {
  respose.writeHead(200);
  respose.end("200 Ok.");
};

createServer(requestListener).listen(8080);
