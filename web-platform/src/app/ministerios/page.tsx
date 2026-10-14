import type { Metadata } from 'next';
import MinistryDetail from '@/components/site/MinistryDetail';

export const metadata: Metadata = { title: 'Ministérios · Igreja Vitória', description: 'Os ministérios da Igreja Vitória, quem lidera cada um e como servir.' };

export default function MinisteriosPage() {
  return <MinistryDetail />;
}
