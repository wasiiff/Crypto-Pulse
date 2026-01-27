import { Metadata } from 'next';
import LaunchpadClient from '@/components/launchpad/LaunchpadClient';

export const metadata: Metadata = {
  title: 'Token Launchpad | BlokkLens',
  description: 'Launch your own ERC-20 token on Ethereum-based chains with ease',
};

export default function LaunchpadPage() {
  return <LaunchpadClient />;
}
