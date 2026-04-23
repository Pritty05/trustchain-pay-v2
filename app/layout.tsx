import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrustChain Pay',
  description: 'Stellar Testnet Payment dApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}