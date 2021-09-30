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
npx truffle compile
npx truffle migrate --network development
npx truffle test
```

# Running script

```
npx truffle compile
npx truffle migrate --network development
npx truffle exec --network development ./scripts/index.js
```

```
npx truffle exec --network development ./scripts/subscribe.js
```

# Deploying to Testnet

https://docs.openzeppelin.com/learn/preparing-for-mainnet
