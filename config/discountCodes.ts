// SPIEGAZIONE:
// Questo file funge da "falso database" per i codici sconto.
// In un'applicazione reale, questi dati proverrebbero da un server o da un Google Sheet
// per poterli gestire dinamicamente senza aggiornare il codice del sito.

// Esempio di struttura dati per i codici sconto:
// 'NOME_CODICE': {
//   type: 'universal' | 'single-use', // 'universal' è per tutti, 'single-use' vale una volta
//   discount: number, // Percentuale di sconto (es. 20 per 20%)
// }
// Per i codici 'single-use', un sistema reale avrebbe anche una proprietà 'is_used: boolean'.

// Per ora, useremo una lista semplice per dimostrare la funzionalità.
// I codici sono CASE-INSENSITIVE (non importa se maiuscoli o minuscoli).

export const DISCOUNT_CODES: Record<string, { discount: number }> = {
    'CAMUSO': { discount: 20 },
    'SCONTO10': { discount: 10 },
    'SPECIALE5': { discount: 5 },
};

// Categorie escluse dallo sconto
export const DISCOUNT_EXCLUDED_CATEGORIES: string[] = ['drink', 'salse', 'box'];
