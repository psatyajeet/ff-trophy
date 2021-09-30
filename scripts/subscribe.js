const Web3 = require("web3");

module.exports = async function main(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    web3 = new Web3("ws://127.0.0.1:8545");

    web3.eth.subscribe(
      "logs",
      {
        address: "",
        topics: [web3.utils.sha3("WinnerNameSet(uint256,uint16,string)")],
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );
  } catch (error) {
    console.error(error);
    callback(1);
  }
};
