// Dark-themed Google Maps embed used across location sections.
export default function MapEmbed({ query, title, style }) {
  return (
    <iframe
      title={title}
      src={`https://www.google.com/maps?q=${query}&output=embed`}
      loading="lazy"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0,
        filter: 'grayscale(.4) invert(.92) contrast(.9) hue-rotate(180deg)',
        ...style,
      }}
    />
  );
}
