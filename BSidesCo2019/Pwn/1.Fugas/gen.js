#!/usr/bin/env node

const BigNumber = require('bignumber.js');

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


count = 0
for (r=1; r < 131337; r++) {
    if (a(r) === true && b(r) === false) {
        console.log(r);

	if (++count == 3) break
    }
}

