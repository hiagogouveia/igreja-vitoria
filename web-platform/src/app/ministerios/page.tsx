import type { Metadata } from 'next';
import MinistryDetail from '@/components/site/MinistryDetail';

export const metadata: Metadata = { title: 'Ministérios · Igreja Vitória', description: 'Conheça os ministérios da Igreja Vitória e encontre um lugar para servir e crescer.' };

export default function MinisteriosPage() {
  return <MinistryDetail />;
}
