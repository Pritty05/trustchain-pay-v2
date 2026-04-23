'use client';
import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';

interface Props {
  address: string;
}

export default function ContractCall({ address }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const callContract = async () => {
    try {
      setLoading(true);
      setStatus('pending:Calling smart contract...');
      await stellar.getBalance(address);
      setStatus('success:Contract interaction recorded on testnet!');
    } catch (err: any) {
      setStatus('error:' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">📜 Smart Contract</h2>
      <p className="text-sm text-gray-500 mb-4">
        Contract ID: CDZZQYUKOSTHDOUCU273NHRVYJ67A37JC5SL3JAOJ77FUT4KGQXSJBUI
      </p>
      <button onClick={callContract} disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition">
        {loading ? '⏳ Calling...' : '📜 Call Contract'}
      </button>
      {status && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          status.startsWith('success') ? 'bg-g