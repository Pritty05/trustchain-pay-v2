'use client';
import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';

export default function TransactionHistory({ address, refresh }: { address: string; refresh: number }) {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await stellar.getRecentTransactions(address, 10);
        setTxs(data);
      } catch { setTxs([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [address, refresh]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-400 text-sm font-medium mb-5">Transaction History</p>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="animate-pulse h-14 bg-slate-800 rounded-xl"></div>)}
        </div>
      ) : txs.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {txs.map((tx: any) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition group">
              <div>
                <p className="text-sm font-mono text-slate-300">{stellar.formatAddress(tx.hash, 10, 8)}</p>
                <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.created_at).toLocaleString()}</p>
              </div>
              <a href={stellar.getExplorerLink(tx.hash)} target="_blank" rel="noreferrer"
                className="text-slate-600 group-hover:text-violet-400 transition text-xs px-3 py-1.5 rounded-lg border border-slate-700 group-hover:border-violet-500/50">
                View →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}