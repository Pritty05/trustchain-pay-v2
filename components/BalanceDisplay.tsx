'use client';
import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';

export default function BalanceDisplay({ address }: { address: string }) {
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const { xlm } = await stellar.getBalance(address);
      setBalance(xlm);
    } catch { setBalance('Error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBalance(); }, [address]);

  return (
    <div className="bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-400 text-sm font-medium">XLM Balance</p>
        <button onClick={fetchBalance} className="text-slate-500 hover:text-violet-400 transition text-xs flex items-center gap-1">
          🔄 Refresh
        </button>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="animate-pulse h-10 bg-slate-700/50 rounded-lg w-48"></div>
          <div className="animate-pulse h-4 bg-slate-700/50 rounded w-24"></div>
        </div>
      ) : (
        <>
          <p className="text-4xl font-bold tracking-tight">{parseFloat(balance || '0').toFixed(2)}</p>
          <p className="text-slate-400 text-sm mt-1">XLM · Stellar Testnet</p>
        </>
      )}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 font-mono break-all">{address}</p>
      </div>
    </div>
  );
}