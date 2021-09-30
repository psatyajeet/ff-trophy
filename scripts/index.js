module.exports = async function main(callback) {
  try {
    // Our code will go here
    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    const [owner, other] = accounts;

    const Trophy = artifacts.require("Trophy");
    const trophy = await Trophy.deployed();

    await trophy.mintNFT(
      owner,
      "QmcSNhhP3a9wXQdEcTjV4gnQMv8QNVkEJ3bMx8Gh6UPmyG",
      "https://gateway.pinata.cloud/ipfs/QmcSNhhP3a9wXQdEcTjV4gnQMv8QNVkEJ3bMx8Gh6UPmyG"
    );

    const tokenId = await trophy.tokenOfOwnerByIndex(owner, 0);

    await trophy.setWinnerName(tokenId, "Bend it like Beckham", {
      from: owner,
    });

    const winnerName = await trophy.getWinnerName(tokenId, 2021, {
      from: other,
    });
    console.log(winnerName);

    const yearsWithWinner = await trophy.getYearsWithWinner(tokenId);
    console.log(yearsWithWinner);

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};
