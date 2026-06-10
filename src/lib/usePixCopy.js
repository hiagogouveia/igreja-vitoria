import { useCallback, useEffect, useRef, useState } from 'react';

/** Copies a value to the clipboard and exposes a transient "✓ Copiado" label. */
export default function usePixCopy(value) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();

  const copy = useCallback(() => {
    try { navigator.clipboard?.writeText(value); } catch { /* noop */ }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { copied, copy, label: copied ? '✓ Copiado' : 'Copiar' };
}
