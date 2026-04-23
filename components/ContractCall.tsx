'use client';
import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';

interface Props {
  address: string;
}

export default function ContractCall({ address }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleCall = async () => {
    try {
      setLoading(true);
      setStatus('calling');
      await stellar.getBalance(address);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Smart Contract</h2>
      <p className="text-sm text-gray-500 mb-4">
        Contract ID: CDZZQYUKOSTHDOUCU273NHRVYJ67A37JC5SL3JAOJ77FUT4KGQXSJBUI
      </p>
      <button
        onClick={handleCall}
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
        {loading ? 'Calling...' : 'Call Contract'}
      </button>
      {status === 'success' && (
        <div className="mt-4 p-3 rounded-lg text-sm bg-green-50 text-green-700">
          Contract called successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 p-3 rounded-lg text-sm bg-red-50 text-red-700">
          Contract call failed
        </div>
      )}
    </div>
  );
}