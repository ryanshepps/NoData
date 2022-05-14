const http = require('http');
const bingSearch = require("./src/bing-search");

const query = "Distance between California and Toronto?"
const search = bingSearch.search(query);

const server = http.createServer((req, res) => {
  search.then(response => console.log(response));
  res.end('This is my server response!');
});

server.listen(process.env.PORT || 3000);
