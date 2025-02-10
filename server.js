const http = require('http');

const host = 'localhost';
const port = 8000;
const requestListener = (req, res) => {
    res.writeHead(200);
    //res.status = 404;
    res.end('Il mio primo server!');
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server partito su http://${host}:${port}`);
});
