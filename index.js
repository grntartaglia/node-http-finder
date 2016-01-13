'use strict';
const http = require('http');
const ip = require('ip');
const netmask = require('netmask');

let found = [];

// 1. Detectar IP do usuário;
const address = ip.address();
// 2. Aplicar máscara de rede;
const block = new netmask.Netmask(`${address}/24`);
// 3. Passar por todos os IP's enviando uma requisição GET;
let pending = netmask.ip2long(block.last) - netmask.ip2long(block.first) - 1;

block.forEach((ip, long, index) => {
  function checkcb() {
    if (!--pending) callback(found);
  }

  const opts = {
    host: ip,
    port: 3000
  };
  const req = http.get(opts, (res) => {
    if (res.statusCode == 200) found.push(`${ip}:${opts.port}`);
    checkcb();
  });

  req.setTimeout(500, () => {
    req.abort();
  });

  req.on('error', err => checkcb());
});
// 4. Retornar IP's encontrados;
function callback(ips) {
  if (ips.length === 0) {
    console.log('Nenhum servidor encontrado.');
    return false;
  }

  console.log('Servidores HTTP encontrados:');

  for (let ip of ips) {
    console.log(ip);
  }
}
