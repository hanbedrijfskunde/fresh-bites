# FreshBites 🚚 — Een Dag als Boekhouder

> **Live app:** [hanbedrijfskunde.github.io/fresh-bites](https://hanbedrijfskunde.github.io/fresh-bites/)

FreshBites is een interactieve **boekhoudsimulatie** voor studenten bedrijfskunde. Je speelt één werkdag als boekhouder van FreshBites — een foodtruck die verse broodjes en salades verkoopt. Collega's sturen je berichten met transacties die jij correct moet verwerken in een journaalpost.

De applicatie is gebouwd met **React**, **TypeScript** en **Tailwind CSS** en is volledig in het Nederlands.

---

## Wat doet de applicatie?

De student doorloopt als boekhouder een volledige werkdag bij FreshBites. Via een chat-achtige interface ontvangen ze berichten van collega's (Chef Mo, Fatima, Systeem) over financiële transacties die plaatsvinden. Voor elke transactie moet de student de bijbehorende journaalpost samenstellen door de juiste rekeningen te kiezen en debet- en creditbedragen in te vullen.

De simulatie bestaat uit **6 transacties** verspreid over een werkdag (08:30–16:00). Elke transactie heeft een tijdslimiet. Aan het einde van de dag ziet de student een overzicht van de resultaten.

---

## Functies

### 🎮 Narratieve simulatie
- De student stapt in de rol van boekhouder bij de fictieve foodtruck FreshBites.
- Berichten komen binnen van drie personages: **Chef Mo** (inkoop/operaties), **Fatima** (administratie/betalingen), en **Systeem** (geautomatiseerde meldingen).
- Elk bericht beschrijft een realistische bedrijfssituatie, zodat de student in context leert.
- Bijlagen zoals kassabonnen en facturen zijn klikbaar en tonen de achterliggende documenten.

### 📒 Journaalpost invullen
- Per transactie stelt de student een journaalpost samen via een tabelinterface.
- Kies een **rekening** uit een dropdown (Kas, Bank, Debiteuren, Voorraad, Inventaris, Crediteuren, Omzet, Inkoopwaarde omzet, Huurkosten, Loonkosten, Overige kosten, Afschrijvingskosten).
- Vul **debet-** en **creditbedragen** in.
- Extra regels kunnen worden toegevoegd voor complexe boekingen.
- Een **balansindicator** geeft real-time feedback: debet moet gelijk zijn aan credit voordat je kunt boeken.

### ⏱️ Tijdsdruk per transactie
- Elke transactie heeft een aftellende timer die de tijdsdruk simuleert van een echte werkomgeving.
- **Transactie 1–2:** 3:00 minuten
- **Transactie 3–4:** 2:00 minuten
- **Transactie 5:** 1:00 minuut
- **Transactie 6 (eindcontrole):** geen tijdslimiet
- Bij het aflopen van de timer wordt de poging automatisch ingediend.
- **Relaxed modus** (instelbaar bij de start): alle tijden worden vermenigvuldigd met 1,75×.

### ⭐ Sterrensysteem en beoordeling
- Per transactie kan de student maximaal **1 ster** verdienen.
- Bij een goede eerste poging: **1,0 ster**
- Bij een goede tweede poging: **0,5 ster**
- Bij een goede derde poging: **0,0 ster**
- Elke gebruikte hint kost **0,25 ster**.
- De totale score wordt getoond als sterrengetal (bijv. 4,5 / 5).

### 💡 Hintsysteem
- Per transactie zijn **3 hints** beschikbaar.
- Een hint onthult stapsgewijs welke rekeningen en bedragen correct zijn.
- Hints kosten sterren, wat studenten stimuleert om eerst zelf te redeneren.

### ✅ Directe feedback na boeking
- Na het indienen van een journaalpost krijgt de student directe feedback.
- Bij een fout: uitleg welke regels onjuist zijn (ontbrekende of extra boekingsregels).
- Bij correct: bevestiging en het aantal verdiende sterren.
- De student heeft maximaal 3 pogingen per transactie.

### 🎲 Variabele transacties (randomisatie)
- Elke sessie genereert een unieke combinatie van transacties uit **6 transactiepools** met in totaal **15 varianten**.
- Bedragen worden willekeurig gegenereerd binnen vaste bandbreedtes (bijv. €250–€600 in stappen van €50).
- Splitsingsbetalingen worden berekend als percentages (25%–50%), afgerond op €10.
- Dankzij **deterministische randomisatie** (op basis van een seed) zijn sessies reproduceerbaar.
- Hierdoor zijn er **48+ unieke combinaties** mogelijk, waardoor de simulatie meerdere keren gespeeld kan worden.

### 💾 Sessiebehoud
- De voortgang wordt automatisch opgeslagen in **localStorage**, zodat een sessie hervat kan worden na het sluiten van de browser.

### 🔍 Review modus
- Na het afronden van de simulatie kan de student alle transacties en de bijbehorende correcte antwoorden naast elkaar bekijken.

---

## Transactiepools

| Pool | Tijdstip | Onderwerp | Varianten |
|------|----------|-----------|-----------|
| A | 08:30 | Voorraad inkoop (contant) | 2 |
| B | 09:15 | Verkoop (omzet) | 2 |
| C | 10:45 | Vaste lasten (huur/loon/overig) | 3 |
| D | 12:30 | Inventaris — gesplitste betaling | 2 |
| E | 14:00 | Betalingsverkeer (debiteuren/crediteuren) | 2 |
| F | 16:00 | Eindcontrole | 1 |

---

## Rekeningschema

De applicatie werkt met 12 grootboekrekeningen verdeeld over vier categorieën:

- **Activa:** Kas, Bank, Debiteuren, Voorraad, Inventaris
- **Passiva:** Crediteuren
- **Opbrengsten:** Omzet
- **Kosten:** Inkoopwaarde omzet, Huurkosten, Loonkosten, Overige kosten, Afschrijvingskosten

---

## Snel starten

```bash
# Installeer afhankelijkheden
npm install

# Start de ontwikkelserver
npm run dev

# Voer unit tests uit
npm run test

# Voer E2E tests uit
npm run test:e2e

# Maak een productie-build
npm run build
```

---

## Ontwikkelcommando's

```bash
npm run dev            # Start dev server (http://localhost:5173)
npm run build          # Productiebuild
npm run preview        # Preview van de productiebuild
npm run test           # Unit tests uitvoeren
npm run test:watch     # Unit tests in watch-modus
npm run test:e2e       # E2E tests uitvoeren
npm run test:e2e:ui    # E2E tests met UI
npm run lint           # Code linting
npm run format         # Code formatteren met Prettier
npm run type-check     # TypeScript typecontrole
```

---

## Projectstructuur

```
fresh-bites/
├── documentation/
│   ├── PRD_FreshBites.md          # Productvereisten
│   └── TDD_FreshBites.md          # Technisch ontwerp
├── src/
│   ├── components/
│   │   ├── screens/               # WelcomeScreen, SimulationScreen, ReviewScreen
│   │   ├── layout/                # Header, ProgressBar, StarRating
│   │   ├── messages/              # MessageList, Message, Avatar
│   │   ├── journal/               # JournalTable, JournalRow, AccountDropdown
│   │   ├── modals/                # FeedbackModal, AttachmentModal, HintModal
│   │   ├── timer/                 # Timer component
│   │   └── common/                # Button, Modal
│   ├── data/
│   │   ├── accounts.ts            # 12 grootboekrekeningen
│   │   ├── characters.ts          # Chef Mo, Fatima, Systeem
│   │   └── transaction-pools.ts   # 6 pools, 15 varianten
│   ├── engine/
│   │   ├── SimulationGenerator.ts # Deterministische transactiegeneratie
│   │   ├── ValidationEngine.ts    # Journaalpostvalidatie (3 stappen)
│   │   ├── ScoringEngine.ts       # Sterrencalculatie
│   │   └── TimerManager.ts        # Timer met drempelwaarden
│   ├── store/
│   │   └── useSimulationStore.ts  # Zustand store + localStorage
│   ├── types/
│   │   └── index.ts               # 40+ TypeScript interfaces
│   └── utils/
│       ├── constants.ts
│       └── formatters.ts
├── tests/
│   └── e2e/                       # Playwright E2E tests
└── ...configuratiebestanden
```

---

## Architectuur

**Data flow:**
```
Gebruikersinvoer → Zustand Store → Core Engines → Validatie → State Update → UI
                                                                     ↓
                                                              localStorage
```

**Core engines:**

- **SimulationGenerator** — Genereert 6 transacties op basis van een seed; vult sjablonen met willekeurige bedragen en berekent de correcte antwoorden.
- **ValidationEngine** — Valideert een journaalpost in 3 stappen: (1) balansequatie, (2) rekeningen vergelijken, (3) ontbrekende/extra regels identificeren.
- **ScoringEngine** — Berekent sterren op basis van het aantal pogingen en gebruikte hints.
- **TimerManager** — Beheert de afteltimer met vier drempelstaten: Normaal (>30s), Waarschuwing (≤30s), Kritiek (≤10s), Verlopen (0s).

---

## Tech stack

| Onderdeel | Technologie |
|-----------|-------------|
| Framework | React 18.3 |
| Taal | TypeScript 5.4 |
| Build tool | Vite 5.2 |
| Styling | Tailwind CSS 3.4 |
| State | Zustand 4.5 |
| Randomisatie | seedrandom 3.0 |
| Unit tests | Vitest 1.6 |
| E2E tests | Playwright 1.44 |

---

## Teststrategie

**Unit tests (Vitest):** testen de core engines — SimulationGenerator (seed-consistentie, bedragbandbreedtes), ValidationEngine (balansequatie, regelmatching) en ScoringEngine (sterrenberekening).

**E2E tests (Playwright):** testen de volledige simulatiestroom van welkomstscherm tot eindscherm, inclusief randomisatie met verschillende seeds, timergedrag en toegankelijkheid.

---

## Browserondersteuning

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Licentie

Uitsluitend voor educatief gebruik.
