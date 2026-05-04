const http = require('http');
const { exec } = require('child_process');
const path = require('path');

const SECRET = process.env.WEBHOOK_SECRET || 'pilco-rebuild-2026';
const PORT = process.env.PORT || 3000;
const APP_DIR = path.dirname(require.main.filename);
const BUILD_DIR = path.join(APP_DIR, 'build');
const PUBLIC_HTML = process.env.PUBLIC_HTML || path.join(APP_DIR, '..', '..', 'public_html');

function runBuild(callback) {
  const cmd = [
    `cd "${APP_DIR}"`,
    'git pull origin master',
    'npm install --include=dev',
    'npm run build',
    `rsync -a "${BUILD_DIR}/" "${PUBLIC_HTML}/" --exclude=wp-admin --exclude=wp-content --exclude=wp-includes --exclude="wp-*.php" --exclude=.htaccess`
  ].join(' && ');

  exec(cmd, { timeout: 180000 }, (err, stdout, stderr) => {
    callback(err, stdout, stderr);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost`);

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  if (req.method === 'POST' && url.pathname === '/rebuild') {
    const secret = url.searchParams.get('secret') || req.headers['x-webhook-secret'];
    if (secret !== SECRET) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }
    res.writeHead(202, { 'Content-Type': 'text/plain' });
    res.end('Build started\n');
    runBuild((err, stdout, stderr) => {
      if (err) console.error('Build error:', stderr);
      else console.log('Build ok:', stdout.slice(-200));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Pilco build server on port ${PORT}`);
});
