#!/usr/bin/env node

const HOST = '0.0.0.0';
const PORT = 31331;

const net = require('net');
const server = net.createServer().listen(PORT, HOST);
const BigNumber = require('bignumber.js');
const fs = require('fs');
let banner;
fs.readFile('banner.txt', {encoding: 'utf-8'}, (err,data) => {
    if (!err) {
        banner = data;
    } else {
        console.log(err);
    }
});

function a(num) {
    if (num === 1) { return false; }
    for (var i=2; i < 11; i++) {
        x = new BigNumber(i);
        if (x.exponentiatedBy(num).minus(i).mod(num).isEqualTo(0) !== true) {
            return false;
        }
    }
    return true;
}

function b(num) {
    if (num === 2) { return true; }
    if (num % 2 === 0) { return false; }
    for(let i = 3, s = Math.sqrt(num); i <= s; i += 2) {
        if (num % i === 0) { return false; }
    }
    return num !== 1;
}

server.on('connection', sock => {
    sock.setEncoding('utf8');
    sock.setTimeout(30000); // 30 seconds timeout
    sock.write(banner);
    let level = 0;
    let previous = [];
    sock.on('data', data => {
        let recieved = parseInt(data.toString('utf8').replace(/\r?\n$/, ''), 10);
        if (recieved >= 131337 || recieved <= 0) {
            sock.write('Ese no se fuga!\n');
            sock.destroy();
            return;
        }
        level += 1;
        if (a(recieved) === true && b(recieved) === false && level === 3) {
            if (previous.includes(recieved)) {
                sock.write('Este ya lo capturaste!\n');
                sock.destroy();
                return;
            }
            sock.write('Gracias! Esta es tu recompensa. BSidesCo{flag}\n'); // redacted
            sock.destroy();
            return;
        } else if (a(recieved) === true && b(recieved) === false) {
            if (previous.includes(recieved)) {
                sock.write('Este ya lo capturaste!\n');
                sock.destroy();
                return;
            }
            sock.write('Evitaste ' + level.toString() + ' fuga\n');
            previous.push(recieved);
        } else {
            sock.write('Ese no se fuga!\n');
            sock.destroy();
            return;
        }
        sock.write('> ');
    });
    sock.on('timeout', () => {
        sock.write('sockect timeout\n');
        sock.destroy();
    });
});

console.log('Servidor en ' + HOST + ':' + PORT);
