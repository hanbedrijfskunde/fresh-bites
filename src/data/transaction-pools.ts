import type { TransactionPool } from '@/types';
import { ACCOUNTS } from './accounts';
import { CHARACTERS } from './characters';

// Helper to find account by id
const getAccount = (id: string) => ACCOUNTS.find((a) => a.id === id)!;

export const TRANSACTION_POOLS: TransactionPool[] = [
  // =========================================================================
  // POOL A (08:30): Ochtend inkoop
  // =========================================================================
  {
    id: 'pool_a',
    timeSlot: '08:30',
    label: 'Ochtend inkoop',
    templates: [
      {
        id: 'a1_voorraad_contant',
        poolId: 'pool_a',
        sender: CHARACTERS.chef_mo,
        messageTemplate:
          'Hey! Net €{amount} aan verse ingrediënten gekocht bij de groothandel. Heb contant betaald uit de kas. Kun je dit even boeken? 🥬🍅',
        attachment: {
          type: 'html',
          filename: 'Kassabon Groothandel.html',
        },
        amountRange: { min: 250, max: 600, step: 50 },
        correctAnswerTemplate: [
          { account: getAccount('voorraad'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('kas'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Je koopt iets (voorraad neemt toe) en betaalt contant (kas neemt af). Welke kant is debet, welke credit?',
          },
          {
            level: 2,
            text: 'Gebruik de rekeningen "Voorraad" en "Kas". Voorraad is een actief, dus toename = debet.',
          },
          {
            level: 3,
            text: 'Voorraad €{amount} debet, Kas €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Goed geboekt!',
          characterQuote: 'Top, dan weet ik dat de administratie klopt als ik boodschappen doe! 👍',
        },
        feedbackIncorrect: {
          message: 'Dat klopt nog niet helemaal.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
        allowAmountMismatch: true,
      },
      {
        id: 'a2_voorraad_rekening',
        poolId: 'pool_a',
        sender: CHARACTERS.chef_mo,
        messageTemplate:
          'Morgen! Ingrediënten besteld voor €{amount}. Betalen we volgende week aan de leverancier. 📦',
        attachment: {
          type: 'html',
          filename: 'Factuur Leverancier.html',
        },
        amountRange: { min: 300, max: 700, step: 50 },
        correctAnswerTemplate: [
          { account: getAccount('voorraad'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('crediteuren'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Je ontvangt voorraad (toename actief) maar betaalt nog niet. Wat voor schuld ontstaat er?',
          },
          {
            level: 2,
            text: 'Gebruik "Voorraad" (debet) en "Crediteuren" (credit).',
          },
          {
            level: 3,
            text: 'Voorraad €{amount} debet, Crediteuren €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Perfect!',
          characterQuote:
            'Crediteuren, dat is de leverancier waar we nog aan moeten betalen toch? 📝',
        },
        feedbackIncorrect: {
          message: 'Niet helemaal correct.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
        allowAmountMismatch: true,
      },
    ],
  },

  // =========================================================================
  // POOL B (09:15): Verkoop
  // =========================================================================
  {
    id: 'pool_b',
    timeSlot: '09:15',
    label: 'Verkoop',
    templates: [
      {
        id: 'b1_verkoop_factuur',
        poolId: 'pool_b',
        sender: CHARACTERS.fatima,
        messageTemplate:
          'Goed nieuws! We hebben net een cateringopdracht verkocht aan een advocatenkantoor. {amount} broodjes voor €{amount}. Ze betalen over 14 dagen, ik heb een factuur gestuurd. 📊',
        attachment: {
          type: 'html',
          filename: 'Factuur Advocatenkantoor.html',
        },
        amountRange: { min: 200, max: 500, step: 50 },
        correctAnswerTemplate: [
          { account: getAccount('debiteuren'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('omzet'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Je verkoopt iets (omzet) maar krijgt het geld nog niet meteen. Wat gebeurt er met je vordering?',
          },
          {
            level: 2,
            text: 'Gebruik "Debiteuren" (debet) voor de vordering en "Omzet" (credit) voor de verkoop.',
          },
          {
            level: 3,
            text: 'Debiteuren €{amount} debet, Omzet €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Goed geboekt!',
          characterQuote:
            'Precies, we hebben de omzet, maar het geld nog niet. Daarom debiteuren! 📊',
        },
        feedbackIncorrect: {
          message: 'Nog niet helemaal goed.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
        allowAmountMismatch: true,
      },
      {
        id: 'b2_verkoop_contant',
        poolId: 'pool_b',
        sender: CHARACTERS.chef_mo,
        messageTemplate:
          'Yes! Net een grote bestelling verkocht voor €{amount} contant. Het geld zit in de kas! 💰',
        amountRange: { min: 150, max: 400, step: 25 },
        correctAnswerTemplate: [
          { account: getAccount('kas'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('omzet'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Je verkoopt iets en krijgt direct contant geld. Welke rekening neemt toe?',
          },
          {
            level: 2,
            text: 'Gebruik "Kas" (debet) voor het ontvangen geld en "Omzet" (credit) voor de verkoop.',
          },
          {
            level: 3,
            text: 'Kas €{amount} debet, Omzet €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Prima geboekt!',
          characterQuote: 'Lekker veel contant geld binnen! 💵',
        },
        feedbackIncorrect: {
          message: 'Kijk nog eens goed.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
        allowAmountMismatch: true,
      },
    ],
  },

  // =========================================================================
  // POOL C (10:45): Vaste lasten
  // =========================================================================
  {
    id: 'pool_c',
    timeSlot: '10:45',
    label: 'Vaste lasten',
    templates: [
      {
        id: 'c1_huur',
        poolId: 'pool_c',
        sender: CHARACTERS.system,
        messageTemplate:
          'Automatische incasso uitgevoerd: Huur standplaats Marktplein - €{amount}. Afgeschreven van zakelijke bankrekening.',
        amountRange: { min: 100, max: 250, step: 25 },
        correctAnswerTemplate: [
          { account: getAccount('huurkosten'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('bank'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Huur is een kostensoort. Kosten gaan altijd in de debet. Hoe betaal je?',
          },
          {
            level: 2,
            text: 'Gebruik "Huurkosten" (debet) en "Bank" (credit).',
          },
          {
            level: 3,
            text: 'Huurkosten €{amount} debet, Bank €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Goed geboekt!',
          characterQuote:
            'Kosten gaan altijd in de debet. Je bankrekening (actief) neemt af, dus credit.',
        },
        feedbackIncorrect: {
          message: 'Let op de aard van de rekeningen.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
      },
      {
        id: 'c2_verzekering',
        poolId: 'pool_c',
        sender: CHARACTERS.system,
        messageTemplate:
          'Automatische incasso uitgevoerd: Bedrijfsverzekering - €{amount}. Afgeschreven van zakelijke bankrekening.',
        amountRange: { min: 75, max: 200, step: 25 },
        correctAnswerTemplate: [
          { account: getAccount('overige_kosten'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('bank'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Verzekering is een kostensoort. Welke rekening gebruik je hiervoor?',
          },
          {
            level: 2,
            text: 'Gebruik "Overige kosten" (debet) en "Bank" (credit).',
          },
          {
            level: 3,
            text: 'Overige kosten €{amount} debet, Bank €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Correct geboekt!',
          characterQuote: 'Verzekeringen vallen onder overige kosten.',
        },
        feedbackIncorrect: {
          message: 'Probeer opnieuw.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
      },
      {
        id: 'c3_software',
        poolId: 'pool_c',
        sender: CHARACTERS.system,
        messageTemplate:
          'Automatische incasso uitgevoerd: Software abonnement (boekhoudprogramma) - €{amount}. Afgeschreven van zakelijke bankrekening.',
        amountRange: { min: 50, max: 150, step: 10 },
        correctAnswerTemplate: [
          { account: getAccount('overige_kosten'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('bank'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Software abonnementen zijn bedrijfskosten. Hoe boek je dit?',
          },
          {
            level: 2,
            text: 'Gebruik "Overige kosten" (debet) en "Bank" (credit).',
          },
          {
            level: 3,
            text: 'Overige kosten €{amount} debet, Bank €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Prima!',
          characterQuote: 'Software valt ook onder overige kosten.',
        },
        feedbackIncorrect: {
          message: 'Kijk nog eens.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
      },
    ],
  },

  // =========================================================================
  // POOL D (12:30): Inventaris (split payments)
  // =========================================================================
  {
    id: 'pool_d',
    timeSlot: '12:30',
    label: 'Inventaris aankoop',
    templates: [
      {
        id: 'd1_inventaris_split',
        poolId: 'pool_d',
        sender: CHARACTERS.chef_mo,
        messageTemplate:
          'De frituurpan is kapot 😱 Heb meteen een nieuwe gekocht voor €{amount}. Ik heb €{partial} contant betaald, de rest betalen we volgende maand aan de leverancier.',
        attachment: {
          type: 'html',
          filename: 'Factuur Keukengigant.html',
        },
        amountRange: { min: 400, max: 900, step: 100 },
        partialPaymentRange: { min: 25, max: 50, step: 5 }, // Percentage
        correctAnswerTemplate: [
          { account: getAccount('inventaris'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('kas'), debitFormula: null, creditFormula: 'partial' },
          {
            account: getAccount('crediteuren'),
            debitFormula: null,
            creditFormula: 'amount - partial',
          },
        ],
        hints: [
          {
            level: 1,
            text: 'Je koopt inventaris, betaalt deels contant en hebt een schuld voor de rest. Hoeveel regels heb je nodig?',
          },
          {
            level: 2,
            text: 'Drie regels: Inventaris (debet €{amount}), Kas (credit €{partial}), Crediteuren (credit voor de rest).',
          },
          {
            level: 3,
            text: 'Inventaris €{amount} debet, Kas €{partial} credit, Crediteuren €{amount - partial} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Goed geboekt!',
          characterQuote: 'Mooi! Drie regels, maar het klopt. Nu kan ik weer frituren! 🍟',
        },
        feedbackIncorrect: {
          message: 'Let op: deze transactie heeft drie regels nodig.',
        },
        complexity: 'medium',
        requiresMultipleRows: true,
        allowAmountMismatch: true,
      },
      {
        id: 'd2_reparatie_split',
        poolId: 'pool_d',
        sender: CHARACTERS.chef_mo,
        messageTemplate:
          'De koelkast was stuk, gelukkig kon de technicus hem repareren voor €{amount}. Ik heb €{partial} contant betaald, de rest komt op de factuur volgende maand.',
        attachment: {
          type: 'html',
          filename: 'Factuur Reparatie.html',
        },
        amountRange: { min: 200, max: 500, step: 50 },
        partialPaymentRange: { min: 30, max: 60, step: 5 }, // Percentage
        correctAnswerTemplate: [
          { account: getAccount('overige_kosten'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('kas'), debitFormula: null, creditFormula: 'partial' },
          {
            account: getAccount('crediteuren'),
            debitFormula: null,
            creditFormula: 'amount - partial',
          },
        ],
        hints: [
          {
            level: 1,
            text: 'Reparaties zijn kosten, geen inventaris. Je betaalt deels contant. Hoeveel regels?',
          },
          {
            level: 2,
            text: 'Drie regels: Overige kosten (debet €{amount}), Kas (credit €{partial}), Crediteuren (credit voor de rest).',
          },
          {
            level: 3,
            text: 'Overige kosten €{amount} debet, Kas €{partial} credit, Crediteuren €{amount - partial} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Perfect!',
          characterQuote: 'Reparaties zijn kosten, geen inventaris. Je hebt het goed! 🔧',
        },
        feedbackIncorrect: {
          message: 'Let op: reparaties zijn kosten, geen inventaris.',
        },
        complexity: 'medium',
        requiresMultipleRows: true,
        allowAmountMismatch: true,
      },
    ],
  },

  // =========================================================================
  // POOL E (14:00): Betalingsverkeer
  // =========================================================================
  {
    id: 'pool_e',
    timeSlot: '14:00',
    label: 'Betalingsverkeer',
    templates: [
      {
        id: 'e1_klant_betaalt',
        poolId: 'pool_e',
        sender: CHARACTERS.fatima,
        messageTemplate:
          'Het advocatenkantoor heeft de factuur al betaald! €{amount} staat op de bank. Snelle betalers, die houden we erbij 😊',
        amountRange: { min: 200, max: 500, step: 50 },
        correctAnswerTemplate: [
          { account: getAccount('bank'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('debiteuren'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Een klant betaalt zijn schuld. Wat gebeurt er met je vordering (debiteuren)?',
          },
          {
            level: 2,
            text: 'Gebruik "Bank" (debet) voor het ontvangen geld en "Debiteuren" (credit) omdat de vordering afneemt.',
          },
          {
            level: 3,
            text: 'Bank €{amount} debet, Debiteuren €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Goed geboekt!',
          characterQuote: 'De debiteuren dalen, want ze zijn geen klant-met-schuld meer!',
        },
        feedbackIncorrect: {
          message: 'Denk aan wat er gebeurt met je vordering.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
      },
      {
        id: 'e2_betaling_leverancier',
        poolId: 'pool_e',
        sender: CHARACTERS.fatima,
        messageTemplate:
          'Ik heb zojuist €{amount} overgemaakt naar onze leverancier. We hadden nog een openstaande factuur.',
        amountRange: { min: 200, max: 500, step: 50 },
        correctAnswerTemplate: [
          { account: getAccount('crediteuren'), debitFormula: 'amount', creditFormula: null },
          { account: getAccount('bank'), debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          {
            level: 1,
            text: 'Je betaalt een schuld aan een leverancier. Wat gebeurt er met crediteuren?',
          },
          {
            level: 2,
            text: 'Gebruik "Crediteuren" (debet) omdat de schuld afneemt en "Bank" (credit).',
          },
          {
            level: 3,
            text: 'Crediteuren €{amount} debet, Bank €{amount} credit.',
          },
        ],
        feedbackCorrect: {
          message: 'Perfect!',
          characterQuote: 'Schulden afbetalen voelt altijd goed! 💸',
        },
        feedbackIncorrect: {
          message: 'Denk aan het effect op je schuld.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
      },
    ],
  },
];

/**
 * Get pool by ID
 */
export function getPoolById(id: string): TransactionPool | undefined {
  return TRANSACTION_POOLS.find((pool) => pool.id === id);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TransactionPool['templates'][0] | undefined {
  for (const pool of TRANSACTION_POOLS) {
    const template = pool.templates.find((t) => t.id === id);
    if (template) return template;
  }
  return undefined;
}
