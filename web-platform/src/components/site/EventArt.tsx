import type { SiteEvent } from '@/lib/site-data';

/**
 * Coluna visual do card de evento.
 *
 * Eventos com foto usam a foto. Eventos que têm identidade gráfica própria
 * (Sister, Deep) usam um bloco na cor da arte oficial — mais fiel do que
 * reaproveitar uma foto de culto que não é daquele evento.
 */
/**
 * `row` é a coluna alta do /eventos, onde a arte fica centralizada.
 * `card` é o card baixo da home, que tem data e título sobrepostos no rodapé —
 * ali a arte sobe para o topo para não brigar com o texto.
 */
export default function EventArt({ event, variant = 'row' }: { event: SiteEvent; variant?: 'row' | 'card' }) {
  const { art } = event;

  if (!art) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={event.photo}
        alt={event.title}
        loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, background: art.bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: variant === 'card' ? 'flex-start' : 'center',
        gap: 8, padding: variant === 'card' ? '56px 20px 20px' : 20,
        textAlign: 'center', color: art.fg,
      }}
    >
      <span
        style={{
          fontFamily: art.serif ? serif : 'var(--head)',
          fontWeight: art.serif ? 400 : 900,
          fontStretch: art.serif ? undefined : '118%',
          fontSize: variant === 'card'
            ? (art.serif ? 'clamp(38px,4.4vw,52px)' : 'clamp(34px,4vw,46px)')
            : (art.serif ? 'clamp(46px,6vw,68px)' : 'clamp(42px,5.4vw,62px)'),
          lineHeight: .9,
          letterSpacing: art.serif ? '.01em' : '-.045em',
        }}
      >
        {art.label}
      </span>
      {art.sub && (
        <span
          style={{
            fontFamily: 'var(--head)', fontWeight: 800, fontSize: 11,
            letterSpacing: '.2em', textTransform: 'uppercase', opacity: .8,
          }}
        >
          {art.sub}
        </span>
      )}
    </div>
  );
}
