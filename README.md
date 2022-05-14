# NoData

## Development Setup

Setting up dependencies

```
npm ci
```

Running

```
npx nodemon index.js
```

## Simulating Production Build

```
Docker build -t . nodata
Docker run -p 3000:3000 nodata
```

Send your requests to localhost:3000.

