# Setting up local blockchain

```
npx ganache-cli --deterministic
```

Deploying

```
npx truffle compile
npx truffle migrate --network development
npx truffle console --network development
```

# Running tests

```
npx truffle test
```

# Running script

```
npx truffle exec --network development ./scripts/index.js
```
