var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server(process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);

const getClaimableBalance = async (pubKey, asset) => {
  return await server
    .claimableBalances()
    // .asset(asset)
    .claimant(pubKey)
    .call()
    .catch(function (err) {
      console.error(err);
    });
};

export default getClaimableBalance;
