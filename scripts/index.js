module.exports = async function main(callback) {
  try {
    // Our code will go here
    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    const [owner, user1, other] = accounts;

    const Trophy = artifacts.require("Trophy");
    const trophy = await Trophy.deployed();

    await trophy.mintNFT(user1, "Bitwise HODL", { from: user1 });

    const tokenId = await trophy.tokenOfOwnerByIndex(user1, 0);

    await trophy.setWinnerName(tokenId, "Bend it like Beckham", {
      from: user1,
    });

    const winnerName = await trophy.getWinnerName(tokenId, 2021);
    console.log(winnerName);

    const yearsWithWinner = await trophy.getYearsWithWinner(tokenId);
    console.log(yearsWithWinner);

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};
