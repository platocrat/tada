import * as ethers from "ethers"
import { tadaContract, getCreatorTokenContract, provider } from "./init"

// tada
export async function checkAccountVerification(wallet: ethers.Wallet) {
  return !!(await tadaContract.connect(wallet.connect(provider)).hasFaucetAddress(wallet.address))
}

export async function getCreators() {
  const data = await tadaContract.getCreatorToken()

  return data
}

// creator tokens
export async function getAllTokenPrice(tokens: any[]) {
  const getPriceAndSymbol = async (address: string) => {
    const contract = getCreatorTokenContract(address)

    const price = await contract.estimateBuyPrice(ethers.utils.parseEther("1"))
    const symbol = await contract.symbol()

    return [price, symbol]
  }

  const rawPrices = await Promise.all(tokens.map((token) => getPriceAndSymbol(token.address)))
  const prices = {}

  rawPrices.forEach(([price, symbol]) => {
    prices[symbol] = parseInt(ethers.utils.formatEther(price.toString()), 10)
  })

  return prices
}

export async function getCreatorInfo(tokenAddress: string) {
  const contract = getCreatorTokenContract(tokenAddress)

  const price = await contract.estimateBuyPrice(ethers.utils.parseEther("1"))
  const symbol = await contract.symbol()
  const name = await contract.name()

  return {
    price: parseInt(ethers.utils.formatEther(price.toString()), 10),
    symbol,
    name,
    contract,
  }
}
