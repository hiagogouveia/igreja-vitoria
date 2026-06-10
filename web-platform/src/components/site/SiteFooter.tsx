import Link from 'next/link';
import type { CSSProperties } from 'react';
import { site } from '@/lib/site-data';

const colHead: CSSProperties = { fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 16 };
const navLink: CSSProperties = { fontSize: 14, color: 'var(--dim)', cursor: 'pointer', textDecoration: 'none' };
const socialBox: CSSProperties = { width: 40, height: 40, borderRadius: 11, border: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dim)', textDecoration: 'none' };

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--ink)', position: 'relative' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 28px 40px' }}>
        <div data-foot style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-white.png" alt="Igreja Vitória" style={{ width: 26, filter: 'brightness(0) invert(1) drop-shadow(0 0 14px rgba(240,168,72,.4))' }} />
              <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 17, letterSpacing: '.05em', textTransform: 'uppercase' }}>Vitória</span>
            </div>
            <p style={{ fontSize: 14.5, color: 'var(--dim)', lineHeight: 1.6, maxWidth: 300 }}>Uma igreja formada de pessoas imperfeitas, mas que amam um Deus que é Perfeito. {site.city}.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="icon-box" style={socialBox}>IG</a>
              <a href={site.youtube} target="_blank" rel="noreferrer" className="icon-box" style={socialBox}>YT</a>
            </div>
          </div>

          <div>
            <div style={colHead}>Navegar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <Link href="/quem-somos" className="foot-link" style={navLink}>Quem Somos</Link>
              <Link href="/ministerios" className="foot-link" style={navLink}>Ministérios</Link>
              <Link href="/cav" className="foot-link" style={navLink}>Casa de Vitória</Link>
              <Link href="/eventos" className="foot-link" style={navLink}>Eventos</Link>
            </div>
          </div>

          <div>
            <div style={colHead}>Conteúdo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <Link href="/aovivo" className="foot-link" style={navLink}>Ao Vivo</Link>
              <Link href="/mensagens" className="foot-link" style={navLink}>Mensagens</Link>
              <Link href="/programacao" className="foot-link" style={navLink}>Programação</Link>
              <Link href="/contribua" className="foot-link" style={navLink}>Contribua</Link>
            </div>
          </div>

          <div>
            <div style={colHead}>Contato</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="foot-link" style={navLink}>WhatsApp · {site.whatsappLabel}</a>
              <a href={`mailto:${site.email}`} className="foot-link" style={navLink}>{site.email}</a>
              <span style={{ fontSize: 14, color: 'var(--dim)', lineHeight: 1.5 }}>{site.address}<br />{site.city}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 26, borderTop: '1px solid var(--border-soft)' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: 'var(--faint)' }}>© 2026 Igreja Vitória · {site.city}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: 'var(--faint)' }}>Feito com fé · @igrejavitoriacg</span>
        </div>
      </div>
    </footer>
  );
}
