# HTTP Finder

> Encontra servidores HTTP na rede local.

## Instalação

```shell
npm install http-finder
```

## Exemplo

```javascript
// Script na máquina 1, com IP 192.168.0.101
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('Hello, World!');
  res.end();
});

server.listen(3000);
```

```javascript
// Script na máquina 2
const Finder = require('http-finder');
const finder = new Finder();

const opts = {
  port: 3000
};

finder.discover(opts, (err, found) => {
  if (found.length > 0) {
    console.log('Servidores encontrados:');

    for (const address of found) {
      console.log(address);
    }
  } else {
    console.log('Nenhum servidor encontrado.');
  }
});
// Servidores encontrados:
// 192.168.0.101:3000
```

## API

#### new Finder([options])
* `options` Object Configura o finder. Pode conter o seguinte campo:
  * `netmask` String Define a máscara de rede. Padrão = `'${finder.ip}/24'`


#### finder.discover([options,] callback)
Método utilizado para descobrir os servidores HTTP na rede.

Opções:

Além destas, poderá conter qualquer opção de [http.get()](https://nodejs.org/api/http.html#http_http_request_options_callback):
  * `timeout`: Tempo máximo, em milisegundos, que a requisição deve esperar na requisição de cada IP. Padrão = `500`

Exemplo:

```javascript
// Pesquisa feita na porta 3000
finder.discover({ port: 3000 }, (err, found) => console.log(found));

// Pesquisa feita sem opções
finder.discover((err, found) => {
  console.log(`
    Esta pesquisa foi feita na porta 80 com timeout de
    500ms e encontrou ${found.length} servidores.
  `);
});
```

## Licença

(The MIT License)

Copyright (c) 2016 Gabriel Tartaglia [gabriel@cappu.com.br](mailto: gabriel@cappu.com.br)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
