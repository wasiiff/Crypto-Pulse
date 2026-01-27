import { Metadata } from 'next';
import TokenManagementClient from '@/components/launchpad/TokenManagementClient';

export const metadata: Metadata = {
  title: 'Manage Token | BlokkLens Launchpad',
  description: 'Manage and monitor your launched token',
};

export default function TokenManagementPage({ params }: { params: { address: string } }) {
  return <TokenManagementClient tokenAddress={params.address} />;
}
