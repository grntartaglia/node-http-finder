'use strict';
const http = require('http');
const ip = require('ip');
const netmask = require('netmask');

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

    const found = [];
    let pending = netmask.ip2long(this.netmask.last) - netmask.ip2long(this.netmask.first);

    function checkcb() {
      if (!pending--) cb(null, found);
    }

    this.netmask.forEach((host) => {
      opts.host = host;

      const req = http.get(opts, (res) => {
        if (res.statusCode === 200) {
          const port = opts.port || req.agent.defaultPort;
          found.push(`${host}:${port}`);
        }
        checkcb();
      });

      req.setTimeout(opts.timeout || 1000, () => {
        req.abort();
      });
      req.on('error', () => checkcb());
    });
  }
}

module.exports = Finder;
