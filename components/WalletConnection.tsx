'use client';
import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';

interface Props {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  address: string;
}

export default function WalletConnection({ onConnect, onDisconnect, address }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connect = async () => {
    try {
      setLoading(true);
      setError('');
      const addr = await stellar.connectWallet();
      onConnect(addr);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  if (address) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Connected Wallet</p>
            <p className="text-sm font-mono text-white">{stellar.formatAddress(address, 10, 8)}</p>
          </div>
        </div>
        <button onClick={onDisconnect}
          className="px-4 py-2 text-sm bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all border border-slate-700 hover:border-red-500/50">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">{error}</div>}
      <button onClick={connect} disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20">
        {loading ? '⏳ Connecting...' : '🔌 Connect Wallet'}
      </button>
      <p className="text-center text-slate-500 text-xs">Supports Freighter · xBull · Albedo · and more</p>
    </div>
  );
}