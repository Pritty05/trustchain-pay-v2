'use client';
import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';

export default function PaymentForm({ address, onSuccess }: { address: string; onSuccess: () => void }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!recipient || !amount) { setStatus('error:Enter recipient and amount'); return; }
    try {
      setLoading(true); setStatus('pending:Sending...'); setTxHash('');
      const result = await stellar.sendPayment({ from: address, to: recipient, amount, memo });
      setTxHash(result.hash);
      setStatus('success:Transaction confirmed!');
      setRecipient(''); setAmount(''); setMemo('');
      onSuccess();
    } catch (err: any) {
      setStatus('error:' + (err.message || 'Transaction failed'));
    } finally { setLoading(false); }
  };

  const type = status.split(':')[0];
  const msg = status.split(':').slice(1).join(':');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
      <p className="text-slate-400 text-sm font-medium mb-5">Send XLM</p>
      <div className="space-y-3 flex-1">
        <input type="text" placeholder="Recipient address (G...)" value={recipient}
          onChange={e => setRecipient(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition" />
        <input type="number" placeholder="Amount (XLM)" value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition" />
        <input type="text" placeholder="Memo (optional)" value={memo}
          onChange={e => setMemo(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition" />
        <button onClick={send} disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20">
          {loading ? '⏳ Sending...' : '🚀 Send XLM'}
        </button>
      </div>

      {status && (
        <div className={`mt-4 p-4 rounded-xl text-sm border ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : type === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          <p className="font-semibold">{type === 'success' ? '✅' : type === 'pending' ? '⏳' : '❌'} {msg}</p>
          {txHash && (
            <div className="mt-3 space-y-1">
              <p className="text-slate-400 text-xs">Transaction Hash:</p>
              <p className="font-mono text-xs break-all text-slate-300">{txHash}</p>
              <a href={stellar.getExplorerLink(txHash)} target="_blank" rel="noreferrer"
                className="text-violet-400 hover:text-violet-300 text-xs mt-1 block">View on Stellar Explorer →</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}