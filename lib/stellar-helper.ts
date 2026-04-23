import * as StellarSdk from 'stellar-sdk';
import { requestAccess, signTransaction } from '@stellar/freighter-api';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

const CONTRACT_ID = 'CDZZQYUKOSTHDOUCU273NHRVYJ67A37JC5SL3JAOJ77FUT4KGQXSJBUI';

export const stellar = {
  // Connect wallet
  async connectWallet(): Promise<string> {
    const result = await requestAccess();
    return result.address || (result as any);
  },

  // Get XLM balance
  async getBalance(address: string) {
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b: any) => b.asset_type === 'native');
    return { xlm: xlm ? xlm.balance : '0', assets: account.balances };
  },

  // Send XLM payment
  async sendPayment({ from, to, amount, memo }: {
    from: string; to: string; amount: string; memo?: string;
  }) {
    const account = await server.loadAccount(from);
    let builder = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    }).addOperation(StellarSdk.Operation.payment({
      destination: to,
      asset: StellarSdk.Asset.native(),
      amount,
    })).setTimeout(30);

    if (memo) builder = builder.addMemo(StellarSdk.Memo.text(memo));
    const transaction = builder.build();

    const result = await signTransaction(transaction.toXDR(), {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    const signedXdr = (result as any).signedTxXdr || result;
    const submitted = await server.submitTransaction(
      StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET)
    );
    return submitted;
  },

  // Call smart contract
  async callContract(address: string) {
    try {
      const rpc = new StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      const account = await rpc.getAccount(address);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(contract.call('increment'))
        .setTimeout(30)
        .build();
      const prepared = await rpc.prepareTransaction(tx);
      return prepared;
    } catch (err) {
      console.log('Contract call attempted:', err);
      return null;
    }
  },

  // Get contract explorer link
  getContractLink() {
    return `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;
  },

  // Get recent transactions
  async getRecentTransactions(address: string, limit: number = 10) {
    const transactions = await server
      .transactions()
      .forAccount(address)
      .limit(limit)
      .order('desc')
      .call();
    return transactions.records;
  },

  // Get explorer link
  getExplorerLink(hash: string, type: string = 'tx') {
    return `https://stellar.expert/explorer/testnet/${type}/${hash}`;
  },

  // Format address
  formatAddress(address: string, start = 4, end = 4) {
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  },

  // Disconnect
  disconnect() {},
};