import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import MensagensContent from '@/components/site/MensagensContent';

export const metadata: Metadata = { title: 'Mensagens · Igreja Vitória', description: 'Biblioteca de mensagens da Igreja Vitória — vídeo e áudio, sob demanda.' };

export default function Mensagens() {
  return (
    <SiteShell>
      <MensagensContent />
    </SiteShell>
  );
}
