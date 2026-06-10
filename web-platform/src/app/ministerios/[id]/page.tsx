import type { Metadata } from 'next';
import MinistryDetail from '@/components/site/MinistryDetail';
import { ministries } from '@/lib/site-data';

export function generateStaticParams() {
  return ministries.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const m = ministries.find((x) => x.id === id);
  return { title: `${m?.name ?? 'Ministérios'} · Igreja Vitória`, description: m?.desc };
}

export default async function MinisterioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MinistryDetail id={id} />;
}
