'use client';
import { useState } from 'react';
import WalletConnection from '@/components/WalletConnection';
import BalanceDisplay from '@/components/BalanceDisplay';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory from '@/components/TransactionHistory';
import ContractCall from '@/components/ContractCall';
import { stellar } from '@/lib/stellar-helper';

export default function Home() {
  const [address, setAddress] = useState('');
  const [refresh, setRefresh] = useState(0);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Top Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">T</div>
          <span className="font-bold text-lg tracking-tight">TrustChain Pay</span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full ml-1">Testnet</span>
        </div>
        <div className="text-xs text-slate-500">Stellar Blockchain dApp</div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {!address ? (
          /* Landing state */
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8">
            <div>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl shadow-violet-500/30">
                🔗
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-3">TrustChain Pay</h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Send XLM instantly on the Stellar testnet. Fast, transparent, decentralized.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md">
              <WalletConnection
                address={address}
                onConnect={setAddress}
                onDisconnect={() => { stellar.disconnect(); setAddress(''); }}
              />
            </div>

            <div className="flex gap-12 text-center text-slate-500 text-sm">
              <div><div className="text-2xl mb-1">⚡</div>Instant</div>
              <div><div className="text-2xl mb-1">🔒</div>Secure</div>
              <div><div className="text-2xl mb-1">🌐</div>Decentralized</div>
            </div>
          </div>
        ) : (
          /* Dashboard state */
          <div className="space-y-6">

            {/* Wallet connected banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <WalletConnection
                address={address}
                onConnect={setAddress}
                onDisconnect={() => { stellar.disconnect(); setAddress(''); }}
              />
            </div>

            {/* Balance + Send */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BalanceDisplay address={address} />
              <PaymentForm
                address={address}
                onSuccess={() => setRefresh(r => r + 1)}
              />
            </div>

            {/* Contract + Transaction History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContractCall address={address} />
              <TransactionHistory address={address} refresh={refresh} />
            </div>

          </div>
        )}
      </div>
    </main>
  );
}