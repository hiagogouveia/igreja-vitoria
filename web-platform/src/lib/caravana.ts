/**
 * Caravana Anastácio (Conferência Mercosul, 10/10/2026).
 * Uma data só decide quando tudo da caravana sai do ar: a página /caravana
 * passa a redirecionar para a home (middleware) e o banner e o card da agenda
 * somem sozinhos, sem precisar de deploy no dia.
 */
// 11/10/2026 à 0h em Campo Grande (UTC-4, sem horário de verão)
export const CARAVANA_FIM = new Date('2026-10-11T00:00:00-04:00');

export function caravanaNoAr(agora: Date = new Date()): boolean {
  return agora.getTime() < CARAVANA_FIM.getTime();
}
