import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import ContatoContent from '@/components/site/ContatoContent';

export const metadata: Metadata = { title: 'Contato · Igreja Vitória', description: 'Fale com a Igreja Vitória — WhatsApp, e-mail, endereço e redes sociais.' };

export default function Contato() {
  return (
    <SiteShell>
      <ContatoContent />
    </SiteShell>
  );
}
