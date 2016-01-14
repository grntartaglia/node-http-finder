'use strict';
const http = require('http');
const ip = require('ip');
const netmask = require('netmask');
const Netmask = netmask.Netmask;

class Finder {
  constructor(options) {
    const opts = options || {};

    this.ip = opts.ip || ip.address();
    this.netmask = new netmask.Netmask(opts.netmask || `${this.ip}/24`);
  }

  discover(options, callback) {
    const cb = typeof options === 'function' ? options : callback;
    const opts = typeof options === 'object' ? options : {};

    if (cb === void 0) throw new Error('Missing `callback` parameter.');

    let pending = netmask.ip2long(this.netmask.last) - netmask.ip2long(this.netmask.first) - 1;
    let found = [];

    function checkcb() {
      if (!--pending) cb(null, found);
    }

    this.netmask.forEach((ip, long, index) => {
      const host = ip;
      const port = opts.port || 80;
      const req = http.get({ host, port }, (res) => {
        if (res.statusCode === 200) found.push(`${host}:${port}`);
        checkcb();
      });

      req.setTimeout(opts.timeout || 500, () => {
        req.abort();
      });
      req.on('error', err => checkcb());
    });
  }
}

module.exports = Finder;
