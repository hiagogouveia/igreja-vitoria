import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import DonationForm from '@/components/site/DonationForm';

export const metadata: Metadata = { title: 'Contribuição Online · Igreja Vitória', description: 'Contribua online com a Igreja Vitória via PIX, cartão ou boleto.' };

export default function ContribuaPagamento() {
  return (
    <SiteShell>
      <DonationForm />
    </SiteShell>
  );
}
