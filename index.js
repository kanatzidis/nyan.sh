const http = require('http');
const {Readable} = require('readable-stream');
const nyan = require('nyan-js');

const server = http.createServer((req, res) => {
  if (req.headers && req.headers['user-agent'] && !req.headers['user-agent'].includes('curl')) {
    res.writeHead(302, {'Location': 'https://github.com/kanatzidis/nyan.sh'});
    return res.end();
  }
  const stream = new Readable();
  stream._read = function noop () {};
  stream._destroy = function noop () {};
  stream.pipe(res);
  const interval = nyan.pipe({ write: (data) => stream.push(data) });

  req.on('close', () => {
    stream.destroy();
    clearInterval(interval);
  });
});


const port = process.env.PORT || 3000;
server.listen(port, err => {
  if (err) throw err;
  console.log(`Listening on locahost:${port}`);
});
