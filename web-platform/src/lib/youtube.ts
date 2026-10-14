import { site } from '@/lib/site-data';

/**
 * Últimos vídeos do canal da igreja, lidos do feed público do YouTube
 * (sem chave de API). O resultado fica em cache por 30 minutos. Se o feed
 * falhar, devolve lista vazia e as páginas mostram só o link para o canal.
 */
export type Video = {
  id: string;
  /** título sem o sufixo "| Igreja Vitória CG" */
  titulo: string;
  /** quem pregou, quando o título traz (ex.: "Ap. Heber Son") */
  autor: string | null;
  publicado: string;
  thumb: string;
  url: string;
};

const ENTIDADES: Record<string, string> = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&lt;': '<', '&gt;': '>' };
const decodificar = (t: string) => t.replace(/&(amp|quot|#39|lt|gt);/g, (m) => ENTIDADES[m] ?? m);

function campo(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? decodificar(m[1].trim()) : '';
}

/** "O DEUS que ama usar IMPROVÁVEIS | Ap. Heber Son | Igreja Vitória Cg" → título e autor */
function separar(bruto: string): { titulo: string; autor: string | null } {
  const partes = bruto.split('|').map((p) => p.trim()).filter(Boolean)
    .filter((p) => !/^igreja vit[oó]ria/i.test(p));
  return { titulo: partes[0] ?? bruto, autor: partes[1] ?? null };
}

export async function ultimosVideos(limite = 12): Promise<Video[]> {
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtubeChannelId}`, {
      next: { revalidate: 1800 },
    });
    if (!r.ok) return [];
    const xml = await r.text();
    return xml.split('<entry>').slice(1, limite + 1).map((e) => {
      const id = campo(e, 'yt:videoId');
      const { titulo, autor } = separar(campo(e, 'title'));
      return {
        id,
        titulo,
        autor,
        publicado: campo(e, 'published'),
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${id}`,
      };
    }).filter((v) => v.id);
  } catch {
    return [];
  }
}

export function dataCurta(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Campo_Grande' }).replace('.', '');
}
