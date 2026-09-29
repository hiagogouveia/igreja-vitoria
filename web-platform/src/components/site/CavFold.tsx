import Link from 'next/link';
import prisma from '@/lib/prisma';
import { wrap } from '@/lib/site-ui';

/**
 * Faixa de destaque das CAVs (Casas de Vitória), logo abaixo do topo da home.
 *
 * Quem chega no site procurando "onde tem uma célula perto de mim" precisava
 * rolar até o meio da página, e o botão de lá levava à página institucional.
 * Aqui o caminho é curto: um convite e o mapa de endereços.
 *
 * Os nomes vêm do banco (mesma fonte do mapa), então a faixa acompanha
 * sozinha quando uma CAV é criada ou desativada no admin.
 */
const AZUL = '#5B8DEF';

async function nomesDasCavs(): Promise<string[]> {
  try {
    const cavs = await prisma.cav.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { name: true, neighborhood: true },
    });
    // "CAV RITA VIEIRA" vira "Rita Vieira": tira o prefixo (já está no título),
    // arruma a caixa (o cadastro tem nomes em maiúsculas) e ordena sem repetir
    const minusculas = ['de', 'da', 'do', 'das', 'dos', 'e'];
    const arrumar = (t: string) =>
      t.replace(/^cav\s+/i, '').trim().toLowerCase().split(/\s+/)
        .map((p, i) => (i > 0 && minusculas.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join(' ');
    const nomes = cavs.map((c) => arrumar(c.neighborhood || c.name)).filter(Boolean);
    return Array.from(new Set(nomes)).sort((a, b) => a.localeCompare(b, 'pt'));
  } catch {
    return [];
  }
}

export default async function CavFold() {
  const nomes = await nomesDasCavs();

  return (
    <section
      className="reveal cav-fold"
      style={{
        position: 'relative', overflow: 'hidden',
        borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)',
        padding: 'clamp(40px,6vw,76px) 28px',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/community-prayer.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg,rgba(5,5,5,.95) 30%,rgba(5,5,5,.72) 70%,rgba(91,141,239,.22))',
      }} />

      <div style={{ ...wrap, position: 'relative', width: '100%' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--mono)', fontSize: 11,
          letterSpacing: '.16em', textTransform: 'uppercase', color: AZUL,
          background: 'rgba(91,141,239,.12)', border: '1px solid rgba(91,141,239,.3)',
          padding: '7px 14px', borderRadius: 99,
        }}>
          Casa de Vitória · perto de você
        </div>

        <h2 style={{
          margin: '18px 0 0', fontFamily: 'var(--head)', fontWeight: 800,
          fontSize: 'clamp(28px,4.6vw,54px)', lineHeight: 1.05, letterSpacing: '-.02em', maxWidth: '18ch',
        }}>
          Encontre uma CAV<br />perto de você
        </h2>

        <p style={{ marginTop: 16, maxWidth: 520, fontSize: 'clamp(15px,1.7vw,18px)', lineHeight: 1.6, color: 'var(--dim)' }}>
          Durante a semana a igreja se reúne nas casas. Digite seu endereço no mapa
          e veja qual é a mais próxima, com dia e horário.
        </p>

        {nomes.length > 0 && (
          <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {nomes.map((n) => (
              <span key={n} style={{
                border: '1px solid rgba(255,255,255,.18)', borderRadius: 999, padding: '7px 14px',
                fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '.06em', color: 'var(--dim)',
              }}>{n}</span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link
            href="/cav-enderecos"
            className="cav-cta"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, background: AZUL, color: '#050505',
              fontFamily: 'var(--head)', fontWeight: 700, fontSize: 'clamp(14px,1.6vw,16px)',
              padding: '15px 28px', borderRadius: 99, textDecoration: 'none',
            }}
          >
            Ver o mapa das CAVs <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/cav"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)',
              color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 'clamp(14px,1.6vw,15px)',
              padding: '15px 26px', borderRadius: 99, textDecoration: 'none',
            }}
          >
            Como funciona
          </Link>
        </div>
      </div>
    </section>
  );
}
