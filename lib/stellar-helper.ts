import * as StellarSdk from 'stellar-sdk';
import { requestAccess, signTransaction } from '@stellar/freighter-api';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export const stellar = {
  async connectWallet(): Promise<string> {
    const result = await requestAccess();
    return (result as any).address || result;
  },

  async getBalance(address: string) {
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b: any) => b.asset_type === 'native');
    return { xlm: xlm ? xlm.balance : '0', assets: account.balances };
  },

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

  async getRecentTransactions(address: string, limit: number = 10) {
    const transactions = await server
      .transactions()
      .forAccount(address)
      .limit(limit)
      .order('desc')
      .call();
    return transactions.records;
  },

  getExplorerLink(hash: string, type: string = 'tx') {
    return `https://stellar.expert/explorer/testnet/${type}/${hash}`;
  },

  formatAddress(address: string, start = 4, end = 4) {
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  },

  disconnect() {},
};