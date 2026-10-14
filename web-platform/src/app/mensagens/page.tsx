import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import MensagensContent from '@/components/site/MensagensContent';
import { ultimosVideos } from '@/lib/youtube';

export const revalidate = 1800;

export const metadata: Metadata = { title: 'Mensagens · Igreja Vitória', description: 'As últimas pregações e cultos da Igreja Vitória no YouTube.' };

export default async function Mensagens() {
  const videos = await ultimosVideos(15);
  return (
    <SiteShell>
      <MensagensContent videos={videos} />
    </SiteShell>
  );
}
