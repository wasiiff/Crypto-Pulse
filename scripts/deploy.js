const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("=".repeat(50));
  console.log("Deploying Token Launchpad Contracts");
  console.log("=".repeat(50));
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("");

  // Get fee collector address from environment
  const feeCollector = process.env.FEE_COLLECTOR_ADDRESS;
  
  if (!feeCollector) {
    throw new Error("FEE_COLLECTOR_ADDRESS not set in environment");
  }

  console.log("Fee Collector Address:", feeCollector);
  console.log("");

  // Deploy TokenFactory
  console.log("Deploying TokenFactory...");
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy(feeCollector);
  
  await factory.deployed();
  
  console.log("✅ TokenFactory deployed to:", factory.address);
  console.log("");

  // Wait for block confirmations
  console.log("Waiting for 5 block confirmations...");
  await factory.deployTransaction.wait(5);
  console.log("✅ Confirmed!");
  console.log("");

  // Verify on block explorer
  console.log("Verifying contract on block explorer...");
  try {
    await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: [feeCollector],
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    console.log("⚠️  Verification failed:", error.message);
    console.log("You can verify manually later with:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${factory.address} ${feeCollector}`);
  }
  
  console.log("");
  console.log("=".repeat(50));
  console.log("Deployment Summary");
  console.log("=".repeat(50));
  console.log("Network:", hre.network.name);
  console.log("TokenFactory:", factory.address);
  console.log("Fee Collector:", feeCollector);
  console.log("");
  console.log("Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_FACTORY_ADDRESS_${hre.network.name.toUpperCase()}=${factory.address}`);
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
