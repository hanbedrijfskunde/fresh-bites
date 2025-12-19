# Product Requirements Document (PRD)

## FreshBites: Een Dag als Boekhouder

**Versie:** 1.0  
**Datum:** 18 december 2024  
**Status:** Draft  
**Auteur:** [In te vullen]

---

## 1. Executive Summary

### 1.1 Productvisie
Een narratieve leersimulatie waarin studenten bedrijfskunde de rol van boekhouder aannemen bij foodtruck "FreshBites". Via een vertrouwde chat-interface ontvangen zij berichten van collega's met financiële transacties die zij correct moeten journaliseren. Het verhaal ontvouwt zich gedurende één virtuele werkdag.

### 1.2 Kernprobleem
Studenten ervaren journaliseren als abstract en los van de praktijk. De huidige oefenvormen (invultabellen, losse opgaven) missen context en emotionele betrokkenheid, waardoor kennis niet beklijft.

### 1.3 Oplossing
Door transacties te verpakken in een doorlopend verhaal met herkenbare karakters en een WhatsApp-achtige interface, wordt journaliseren betekenisvol en memorabel. Studenten zien direct het effect van hun boekingen op het bedrijf.

### 1.4 Doelgroep
- Primair: HBO Bedrijfskunde studenten, jaar 1-2
- Secundair: MBO Financiële Administratie studenten

---

## 2. Doelstellingen & Success Metrics

### 2.1 Leerdoelen (alignment met curriculum)

| Leerdoel | Bloom niveau | Hoe gemeten |
|----------|--------------|-------------|
| Student kan rekeningen identificeren bij een transactie | Begrijpen | Correcte rekeningselectie |
| Student kan debet/credit toewijzen | Toepassen | Correcte plaatsing bedragen |
| Student kan een complete journaalpost opstellen | Toepassen | Volledige correcte boeking |
| Student begrijpt de samenhang tussen transacties | Analyseren | Eindbalans controle |

### 2.2 Product Success Metrics

| Metric | Target | Meetmethode |
|--------|--------|-------------|
| Completion rate | ≥ 85% | % gebruikers dat alle 6 transacties voltooit |
| First-try accuracy | ≥ 60% | % correct bij eerste poging |
| Gemiddelde sessieduur | 12-18 min | Tijdmeting start tot eind |
| Tijd-op rate | ≤ 15% | % transacties waar timer afloopt |
| Student satisfaction (NPS) | ≥ 40 | Post-simulatie enquête |
| Leerwinst | +20% | Pre/post kennistoets vergelijking |

### 2.3 Business Objectives

| Objective | Target |
|-----------|--------|
| Adoptie door docenten | 5 instellingen in jaar 1 |
| Integratie in bestaande LMS | Edstack, Canvas, Brightspace |
| Herbruikbaarheid | Template voor andere casussen |
| Anti-fraude | Elke student unieke opgaven (48+ combinaties × variabele bedragen) |

---

## 3. User Personas

### 3.1 Primaire Persona: Sophie (Student)

| Aspect | Beschrijving |
|--------|--------------|
| **Leeftijd** | 19 jaar |
| **Opleiding** | HBO Bedrijfskunde, jaar 1 |
| **Technisch** | Digital native, smartphone altijd bij de hand |
| **Leerstijl** | Leert het beste door doen, niet door lezen |
| **Frustratie** | "Ik snap de regels wel, maar zodra ik een casus zie weet ik niet waar ik moet beginnen" |
| **Motivatie** | Wil slagen voor het tentamen, ziet boekhouden als noodzakelijk kwaad |
| **Quote** | "Als het voelt als een spelletje, vergeet ik dat ik aan het studeren ben" |

### 3.2 Secundaire Persona: Mark (Docent)

| Aspect | Beschrijving |
|--------|--------------|
| **Leeftijd** | 42 jaar |
| **Rol** | Docent Financieel Management |
| **Technisch** | Gebruikt standaard tools, geen early adopter |
| **Frustratie** | "Studenten maken de oefeningen, maar in de toets maken ze dezelfde fouten" |
| **Behoefte** | Inzicht in waar studenten vastlopen |
| **Quote** | "Ik wil iets dat werkt zonder dat ik er uren aan kwijt ben" |

---

## 4. User Stories & Requirements

### 4.1 Epic 1: Simulatie doorlopen

| ID | User Story | Prioriteit | Acceptatiecriteria |
|----|------------|------------|---------------------|
| US-01 | Als student wil ik een welkomstscherm zien zodat ik weet wat me te wachten staat | Must | Introductietekst, startknop, geschatte duur getoond |
| US-02 | Als student wil ik berichten ontvangen van collega's zodat ik weet welke transactie ik moet boeken | Must | Bericht bevat: afzender, tijdstip, transactiebeschrijving |
| US-03 | Als student wil ik bijlagen kunnen openen zodat ik details kan bekijken | Should | Klikbare PDF/afbeelding, opent in modal |
| US-04 | Als student wil ik rekeningen selecteren uit een dropdown zodat ik niet hoef te typen | Must | Dropdown met 10-12 relevante rekeningen |
| US-05 | Als student wil ik bedragen invoeren zodat ik de journaalpost compleet maak | Must | Numeriek invoerveld, € symbool automatisch |
| US-06 | Als student wil ik een rij kunnen toevoegen zodat ik transacties met 3+ regels kan boeken | Must | "+ Regel toevoegen" knop, max 4 regels |
| US-07 | Als student wil ik zien of debet = credit zodat ik weet of mijn boeking in balans is | Must | Live indicator: "In balans ✓" of "Niet in balans ✗" |
| US-08 | Als student wil ik mijn antwoord kunnen indienen zodat ik feedback krijg | Must | "Boeken" knop, disabled als niet in balans |

### 4.2 Epic 2: Feedback & Progressie

| ID | User Story | Prioriteit | Acceptatiecriteria |
|----|------------|------------|---------------------|
| US-09 | Als student wil ik direct feedback na indienen zodat ik weet of het goed was | Must | Groen (correct) of rood (fout) + uitleg |
| US-10 | Als student wil ik een hint kunnen vragen zodat ik verder kom als ik vastzit | Should | "Hint" knop, geeft gedeeltelijke uitleg |
| US-11 | Als student wil ik opnieuw kunnen proberen zodat ik van fouten leer | Must | Max 3 pogingen per transactie |
| US-12 | Als student wil ik mijn reputatie zien zodat ik weet hoe goed ik het doe | Should | 5-sterren systeem, zichtbaar in header |
| US-13 | Als student wil ik het volgende bericht ontgrendelen na succes zodat het verhaal doorgaat | Must | Nieuw bericht verschijnt met animatie |
| US-14 | Als student wil ik een eindoverzicht zien zodat ik weet hoe ik heb gepresteerd | Must | Samenvatting: correct/totaal, tijd, sterren |

### 4.3 Epic 3: Docent Dashboard (v2.0)

| ID | User Story | Prioriteit | Acceptatiecriteria |
|----|------------|------------|---------------------|
| US-15 | Als docent wil ik zien hoeveel studenten de simulatie hebben voltooid | Could | Percentage completion per klas |
| US-16 | Als docent wil ik zien bij welke transacties studenten de meeste fouten maken | Could | Foutenanalyse per transactie |
| US-17 | Als docent wil ik de simulatie kunnen toewijzen aan een klas | Could | Koppeling met LMS |

---

## 5. Functionele Specificaties

### 5.1 Transactie Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   BERICHT   │────▶│  JOURNAAL   │────▶│  VALIDATIE  │────▶│  FEEDBACK   │
│  ontvangen  │     │   invullen  │     │   checken   │     │   tonen     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │                   │
                                               │ Fout              │ Correct
                                               ▼                   ▼
                                        ┌─────────────┐     ┌─────────────┐
                                        │    HINT     │     │  VOLGENDE   │
                                        │   tonen     │     │   bericht   │
                                        └─────────────┘     └─────────────┘
```

### 5.2 Schermoverzicht

| Scherm | Beschrijving | Componenten |
|--------|--------------|-------------|
| Welkom | Introductie simulatie | Logo, titel, uitleg, "Start dag" knop |
| Hoofdscherm | Chat + journaal | Berichtenlijst, journaaltabel, statusbalk |
| Bijlage modal | Document viewer | Afbeelding/PDF, sluitknop |
| Feedback modal | Resultaat tonen | Correct/fout indicator, uitleg, volgende knop |
| Eindscherm | Dag samenvatting | Score, tijd, sterren, "Opnieuw" knop |

### 5.3 Journaaltabel Specificaties

| Veld | Type | Validatie |
|------|------|-----------|
| Rekening | Dropdown | Verplicht, uit voorgedefinieerde lijst |
| Debet | Numeriek | ≥ 0, max 2 decimalen |
| Credit | Numeriek | ≥ 0, max 2 decimalen |

**Rekeningenlijst:**
- Kas
- Bank
- Debiteuren
- Crediteuren
- Voorraad
- Inventaris
- Omzet
- Inkoopwaarde omzet
- Huurkosten
- Loonkosten
- Overige kosten
- Afschrijvingskosten

### 5.4 Puntensysteem

| Actie | Sterren impact |
|-------|----------------|
| Correct bij eerste poging | +1 ⭐ |
| Correct bij tweede poging | +0.5 ⭐ |
| Correct bij derde poging | +0 ⭐ |
| Hint gebruikt | -0.25 ⭐ |
| Maximaal per transactie | 1 ⭐ |
| **Totaal mogelijk** | **6 ⭐** |

---

## 6. Content: Transacties & Verhaal

### 6.1 Karakters

| Karakter | Rol | Communicatiestijl | Avatar |
|----------|-----|-------------------|--------|
| Chef Mo | Kok | Informeel, enthousiast, gebruikt emoji's | 👨‍🍳 |
| Fatima | Eigenaar | Zakelijk maar vriendelijk | 👩‍💼 |
| Systeem | Automatische meldingen | Neutraal, kort | 🔔 |
| Jan de Vries | Klant | Formeel | 👤 |

### 6.2 Transacties (Verhaallijn)

#### Transactie 1: Ingrediënten inkoop (08:32)

**Afzender:** Chef Mo 👨‍🍳

**Bericht:**
> Hey! Net €400 aan verse ingrediënten gekocht bij de groothandel. Heb contant betaald uit de kas. Kun je dit even boeken? 🥬🍅
>
> 📎 Kassabon_groothandel.pdf

**Bijlage:** Kassabon met items (groenten, vlees, brood)

**Correcte journaalpost:**

| Rekening | Debet | Credit |
|----------|-------|--------|
| Voorraad | €400 | |
| Kas | | €400 |

**Feedback correct:**
> ✅ Goed geboekt!
>
> Chef Mo: "Top, dan weet ik dat de administratie klopt als ik boodschappen doe!" 👍

**Feedback fout + hint:**
> ❌ Dat klopt nog niet helemaal.
>
> 💡 Hint: Je koopt iets (voorraad neemt toe) en betaalt contant (kas neemt af). Welke kant is debet, welke credit?

---

#### Transactie 2: Verkoop op factuur (09:15)

**Afzender:** Fatima 👩‍💼

**Bericht:**
> Goed nieuws! We hebben net een cateringopdracht verkocht aan een advocatenkantoor. 50 broodjes voor €350. Ze betalen over 14 dagen, ik heb een factuur gestuurd.
>
> 📎 Factuur_advocatenkantoor.pdf

**Correcte journaalpost:**

| Rekening | Debet | Credit |
|----------|-------|--------|
| Debiteuren | €350 | |
| Omzet | | €350 |

**Feedback correct:**
> ✅ Goed geboekt!
>
> Fatima: "Precies, we hebben de omzet, maar het geld nog niet. Daarom debiteuren!" 📊

---

#### Transactie 3: Betaling huur (10:45)

**Afzender:** Systeem 🔔

**Bericht:**
> Automatische incasso uitgevoerd: Huur standplaats Marktplein - €150. Afgeschreven van zakelijke bankrekening.

**Correcte journaalpost:**

| Rekening | Debet | Credit |
|----------|-------|--------|
| Huurkosten | €150 | |
| Bank | | €150 |

**Feedback correct:**
> ✅ Goed geboekt!
>
> Kosten gaan altijd in de debet. Je bankrekening (actief) neemt af, dus credit.

---

#### Transactie 4: Aankoop inventaris (12:30)

**Afzender:** Chef Mo 👨‍🍳

**Bericht:**
> De frituurpan is kapot 😱 Heb meteen een nieuwe gekocht voor €600. Ik heb €200 contant betaald, de rest betalen we volgende maand aan de leverancier.
>
> 📎 Factuur_keukengigant.pdf

**Correcte journaalpost:**

| Rekening | Debet | Credit |
|----------|-------|--------|
| Inventaris | €600 | |
| Kas | | €200 |
| Crediteuren | | €400 |

**Feedback correct:**
> ✅ Goed geboekt!
>
> Chef Mo: "Mooi! Drie regels, maar het klopt. Nu kan ik weer frituren! 🍟"

**Feedback fout + hint:**
> ❌ Let op: deze transactie heeft drie regels nodig.
>
> 💡 Hint: Je krijgt inventaris (€600), betaalt deels contant (€200) en hebt nog een schuld (€400).

---

#### Transactie 5: Ontvangst betaling (14:00)

**Afzender:** Fatima 👩‍💼

**Bericht:**
> Het advocatenkantoor heeft de factuur al betaald! €350 staat op de bank. Snelle betalers, die houden we erbij 😊

**Correcte journaalpost:**

| Rekening | Debet | Credit |
|----------|-------|--------|
| Bank | €350 | |
| Debiteuren | | €350 |

**Feedback correct:**
> ✅ Goed geboekt!
>
> Fatima: "De debiteuren dalen, want ze zijn geen klant-met-schuld meer!"

---

#### Transactie 6: Eindcontrole (16:00)

**Afzender:** Fatima 👩‍💼

**Bericht:**
> Einde van de dag! Kun je even controleren of alles klopt? Ik wil zeker weten dat de administratie in orde is voordat we afsluiten.
>
> Klik op "Controleer balans" om de dag af te ronden.

**Actie:** Geen journaalpost, maar een samenvattingsscherm met alle boekingen van de dag.

---

## 7. Randomisatie & Variatie

### 7.1 Ontwerpdoel

Om samenwerking tijdens toetsmomenten te voorkomen en herhaalde oefening waardevol te maken, krijgt elke student een unieke combinatie van transacties met gerandomiseerde bedragen. Dit verhoogt ook de authenticiteitsbeleving ("elk bedrijf is anders").

### 7.2 Transactie Pools

In plaats van 6 vaste transacties, bevat de simulatie **transactiepools** per tijdslot. Het systeem selecteert willekeurig één transactie per pool.

| Tijdslot | Pool | Transactieopties | Moeilijkheid |
|----------|------|------------------|--------------|
| 08:30 | A | Inkoop voorraad contant / Inkoop voorraad op rekening | Basis |
| 09:15 | B | Verkoop op factuur / Contante verkoop | Basis |
| 10:45 | C | Betaling huur / Betaling verzekering / Betaling abonnement | Basis |
| 12:30 | D | Aankoop inventaris (deels contant) / Reparatie inventaris | Gemiddeld |
| 14:00 | E | Ontvangst betaling klant / Betaling aan leverancier | Basis |
| 16:00 | F | Eindcontrole (vast) | n.v.t. |

**Resultaat:** 2 × 2 × 3 × 2 × 2 = **48 unieke combinaties**

### 7.3 Bedrag Randomisatie

Elk bedrag wordt gegenereerd binnen een voorgedefinieerde bandbreedte met "mooie" afrondingen.

| Transactietype | Minimum | Maximum | Stappen | Voorbeelden |
|----------------|---------|---------|---------|-------------|
| Voorraad inkoop | €250 | €600 | €50 | €250, €300, €350... €600 |
| Verkoop catering | €200 | €500 | €50 | €200, €250, €300... €500 |
| Huur/vaste lasten | €100 | €250 | €25 | €100, €125, €150... €250 |
| Inventaris aankoop | €400 | €900 | €100 | €400, €500, €600... €900 |
| Deelbetaling (%) | 25% | 50% | 5% | 25%, 30%, 35%... 50% |

### 7.4 Randomisatie Regels

```typescript
interface RandomizationConfig {
  transactionPool: TransactionTemplate[];
  amountRange: {
    min: number;
    max: number;
    step: number;
  };
  partialPaymentRange?: {
    minPercent: number;
    maxPercent: number;
    stepPercent: number;
  };
}

function generateRandomAmount(config: AmountRange): number {
  const steps = (config.max - config.min) / config.step;
  const randomStep = Math.floor(Math.random() * (steps + 1));
  return config.min + (randomStep * config.step);
}

function generateTransaction(pool: TransactionTemplate[]): Transaction {
  // 1. Selecteer willekeurige transactie uit pool
  const template = pool[Math.floor(Math.random() * pool.length)];
  
  // 2. Genereer bedragen binnen bandbreedte
  const mainAmount = generateRandomAmount(template.amountRange);
  
  // 3. Bij deelbetalingen: bereken percentages
  let partialAmount = null;
  if (template.partialPaymentRange) {
    const percent = generateRandomAmount(template.partialPaymentRange) / 100;
    partialAmount = Math.round(mainAmount * percent / 10) * 10; // Afgerond op €10
  }
  
  // 4. Genereer bericht met ingevulde bedragen
  return {
    ...template,
    message: template.messageTemplate
      .replace('{amount}', mainAmount.toString())
      .replace('{partial}', partialAmount?.toString() || ''),
    correctAnswer: calculateCorrectAnswer(template, mainAmount, partialAmount)
  };
}
```

### 7.5 Voorbeeld: Gerandomiseerde Transactie 4

**Template:**
> Chef Mo: "De frituurpan is kapot 😱 Heb meteen een nieuwe gekocht voor €{amount}. Ik heb €{partial} contant betaald, de rest betalen we volgende maand."

**Mogelijke instanties:**

| Student A | Student B | Student C |
|-----------|-----------|-----------|
| €500 totaal | €700 totaal | €600 totaal |
| €150 contant (30%) | €350 contant (50%) | €180 contant (30%) |
| €350 op rekening | €350 op rekening | €420 op rekening |

### 7.6 Seed & Reproduceerbaarheid

Voor toetssituaties kan een **seed** worden meegegeven zodat:
- Dezelfde student bij herhaling dezelfde transacties ziet
- Docenten specifieke combinaties kunnen reproduceren voor bespreking
- Resultaten verifieerbaar zijn

```typescript
function initializeSimulation(userId: string, seed?: string): Simulation {
  const effectiveSeed = seed || `${userId}-${Date.now()}`;
  const rng = seedrandom(effectiveSeed); // Deterministische random generator
  
  return {
    seed: effectiveSeed,
    transactions: transactionPools.map(pool => 
      generateTransaction(pool, rng)
    )
  };
}
```

### 7.7 Validatie met Dynamische Bedragen

De validatielogica werkt met het **gegenereerde** correcte antwoord, niet met hardcoded bedragen:

```typescript
function validateAnswer(
  userEntry: JournalEntry[],
  transaction: Transaction // Bevat al de gegenereerde correctAnswer
): ValidationResult {
  return compareEntries(userEntry, transaction.correctAnswer);
}
```

### 7.8 Bandbreedte per Transactiepool (Volledig)

#### Pool A: Ochtend inkoop

| Variant | Bedrag range | Betaalwijze |
|---------|--------------|-------------|
| A1: Voorraad contant | €250 - €600 | 100% kas |
| A2: Voorraad op rekening | €300 - €700 | 100% crediteuren |

#### Pool B: Verkoop

| Variant | Bedrag range | Betaalwijze |
|---------|--------------|-------------|
| B1: Verkoop op factuur | €200 - €500 | 100% debiteuren |
| B2: Contante verkoop | €150 - €400 | 100% kas |

#### Pool C: Vaste lasten

| Variant | Bedrag range | Betaalwijze |
|---------|--------------|-------------|
| C1: Huur | €100 - €250 | 100% bank |
| C2: Verzekering | €75 - €200 | 100% bank |
| C3: Software abonnement | €50 - €150 | 100% bank |

#### Pool D: Inventaris

| Variant | Bedrag range | Contant deel |
|---------|--------------|--------------|
| D1: Nieuwe inventaris | €400 - €900 | 25% - 50% |
| D2: Reparatie inventaris | €200 - €500 | 30% - 60% |

#### Pool E: Betalingsverkeer

| Variant | Bedrag range | Koppeling |
|---------|--------------|-----------|
| E1: Klant betaalt | = Pool B bedrag | Sluit aan bij eerdere verkoop |
| E2: Betaling leverancier | €200 - €500 | Losse betaling |

---

## 8. Tijdsdruk & Pacing

### 8.1 Ontwerpdoel

Door afnemende tijdslimieten per transactie wordt de druk geleidelijk opgevoerd. Dit simuleert de realiteit van een boekhouder (routine wordt sneller) en houdt de spanning in de simulatie. Het sluit aan bij het **Mastery-principe**: naarmate studenten beter worden, wordt de uitdaging groter.

### 8.2 Tijdslimieten per Transactie

| Transactie | Tijdslimiet | Reden |
|------------|-------------|-------|
| 1 | 3:00 min | Opwarmen, wennen aan interface |
| 2 | 3:00 min | Nog steeds leren, basis transactie |
| 3 | 2:00 min | Routine opbouwen |
| 4 | 2:00 min | Complexere transactie (3 regels), maar minder tijd |
| 5 | 1:00 min | Snelle afsluiter, bekende patronen |
| 6 | Geen limiet | Eindcontrole, reflectie |

**Totale speeltijd:** 11 minuten (excl. feedback en eindscherm)

### 8.3 Timer Gedrag

| Situatie | Gedrag |
|----------|--------|
| Timer loopt | Countdown zichtbaar in header, kleur verandert bij <30 sec (oranje) en <10 sec (rood) |
| Tijd op | Automatisch indienen van huidige invoer |
| Leeg formulier bij tijd op | Telt als fout antwoord, hint wordt getoond |
| Pauze | Geen pauzeknop - timer loopt door (simuleert werkdruk) |
| Hint vragen | Timer loopt door tijdens hint lezen |

### 8.4 Timer UI Specificatie

```
┌─────────────────────────────────────────────────────────────────────┐
│  🚚 FreshBites                    ⏱️ 2:45    ⭐⭐⭐☆☆        09:15  │
└─────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                               Normaal: wit/grijs
                               < 30 sec: oranje + pulse animatie
                               < 10 sec: rood + snellere pulse
```

### 8.5 Puntenaanpassing met Tijd

De tijdsbonus motiveert snelheid zonder correctheid te ondermijnen:

| Resultaat | Sterren |
|-----------|---------|
| Correct + meer dan 50% tijd over | +1.0 ⭐ + 🏃 snelheidsbonus |
| Correct binnen tijd | +1.0 ⭐ |
| Correct bij 2e poging | +0.5 ⭐ |
| Correct bij 3e poging | +0.0 ⭐ |
| Tijd verstreken (auto-submit) | Telt als poging, geen sterren voor die poging |

**Snelheidsbonus:** Wordt getoond in feedback ("Razendsnelle boeking! 🏃") maar telt niet mee voor eindsterren. Dit houdt de focus op correctheid.

### 8.6 Toegankelijkheidsoptie

Voor studenten met extra tijdsbehoefte (bijv. dyslexie) kan een **ontspannen modus** worden geactiveerd:

| Instelling | Standaard | Ontspannen modus |
|------------|-----------|------------------|
| Transactie 1-2 | 3:00 min | 5:00 min |
| Transactie 3-4 | 2:00 min | 4:00 min |
| Transactie 5 | 1:00 min | 2:00 min |
| Factor | 1x | ~1.75x |

Activering via:
- Instelling in gebruikersprofiel (LMS-gekoppeld)
- Docent kan per student inschakelen
- Optioneel: zelf te activeren met melding "Dit wordt geregistreerd"

### 8.7 Implementatie Timer

```typescript
interface TimerConfig {
  transactionTimeLimits: Record<number, number>; // transactie nr -> seconden
  warningThreshold: number; // seconden, standaard 30
  criticalThreshold: number; // seconden, standaard 10
  relaxedMode: boolean;
  relaxedMultiplier: number; // standaard 1.75
}

const defaultTimerConfig: TimerConfig = {
  transactionTimeLimits: {
    1: 180, // 3:00
    2: 180, // 3:00
    3: 120, // 2:00
    4: 120, // 2:00
    5: 60,  // 1:00
    6: 0,   // Geen limiet (eindcontrole)
  },
  warningThreshold: 30,
  criticalThreshold: 10,
  relaxedMode: false,
  relaxedMultiplier: 1.75,
};

function getTimeLimit(transactionNumber: number, config: TimerConfig): number {
  const baseTime = config.transactionTimeLimits[transactionNumber] || 120;
  return config.relaxedMode 
    ? Math.round(baseTime * config.relaxedMultiplier) 
    : baseTime;
}

function handleTimeExpired(currentEntry: JournalEntry[]): void {
  // Auto-submit wat de student heeft ingevuld
  if (hasAnyInput(currentEntry)) {
    submitAnswer(currentEntry); // Wordt gevalideerd als normaal antwoord
  } else {
    // Leeg formulier = automatisch fout
    showFeedback({
      correct: false,
      message: "De tijd is om! Laten we kijken wat het antwoord was.",
      showHint: true,
    });
    incrementAttempts();
  }
}
```

---

## 9. User Interface Design

### 7.1 Design Principles

| Principe | Toepassing |
|----------|------------|
| **Familiar** | Chat-interface zoals WhatsApp/iMessage |
| **Focused** | Één transactie tegelijk, geen afleiding |
| **Friendly** | Warme kleuren, emoji's, informele toon |
| **Forgiving** | Fouten zijn leermomenten, geen straffen |

### 7.2 Kleurenpalet

| Element | Kleur | Hex |
|---------|-------|-----|
| Primary (FreshBites brand) | Oranje | #FF6B35 |
| Secondary | Donkergroen | #2D5A3D |
| Background chat | Lichtgrijs | #F5F5F5 |
| Bericht ontvangen | Wit | #FFFFFF |
| Correct feedback | Groen | #4CAF50 |
| Fout feedback | Rood | #F44336 |
| Hint | Blauw | #2196F3 |

### 7.3 Wireframes

#### Hoofdscherm

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🚚 FreshBites Boekhouding                              ⭐⭐⭐☆☆  16:00  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  BERICHTEN                                                      ▼  │  │
│  ├────────────────────────────────────────────────────────────────────┤  │
│  │                                                                    │  │
│  │  👨‍🍳 Chef Mo                                              08:32   │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ Hey! Net €400 aan verse ingrediënten gekocht bij de          │  │  │
│  │  │ groothandel. Heb contant betaald. Kun je dit boeken? 🥬🍅    │  │  │
│  │  │                                                              │  │  │
│  │  │ 📎 Kassabon_groothandel.pdf                                  │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │  ✓ Geboekt                                                        │  │
│  │                                                                    │  │
│  │  👩‍💼 Fatima                                                09:15   │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ Goed nieuws! We hebben net een cateringopdracht verkocht...  │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  JOUW JOURNAALPOST                                                 │  │
│  ├────────────────────────────────────────────────────────────────────┤  │
│  │                                                                    │  │
│  │   Rekening                      Debet           Credit             │  │
│  │   ┌────────────────────────┐   ┌──────────┐   ┌──────────┐         │  │
│  │   │ ▼ Selecteer rekening   │   │ €        │   │ €        │         │  │
│  │   └────────────────────────┘   └──────────┘   └──────────┘         │  │
│  │   ┌────────────────────────┐   ┌──────────┐   ┌──────────┐         │  │
│  │   │ ▼ Selecteer rekening   │   │ €        │   │ €        │         │  │
│  │   └────────────────────────┘   └──────────┘   └──────────┘         │  │
│  │                                                                    │  │
│  │   [+ Regel toevoegen]                                              │  │
│  │                                                                    │  │
│  │   ─────────────────────────────────────────────────────────────    │  │
│  │   Totaal                        € 0,00         € 0,00              │  │
│  │                                 ⚖️ Niet in balans                  │  │
│  │                                                                    │  │
│  │   ┌─────────────┐   ┌─────────────────────────────────────────┐    │  │
│  │   │  💡 HINT    │   │           ✓ BOEKEN                      │    │  │
│  │   └─────────────┘   └─────────────────────────────────────────┘    │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Transactie 2 van 6                                    [━━━━░░░░░░] 33%  │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Feedback Modal (Correct)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                         ✅                                     │
│                                                                │
│                  Goed geboekt!                                 │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  👨‍🍳 Chef Mo:                                         │     │
│   │  "Top, dan weet ik dat de administratie klopt         │     │
│   │   als ik boodschappen doe!" 👍                        │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                │
│                      +1 ⭐ verdiend!                           │
│                                                                │
│            ┌─────────────────────────────┐                     │
│            │    VOLGENDE BERICHT →       │                     │
│            └─────────────────────────────┘                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### Feedback Modal (Fout)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                         ❌                                     │
│                                                                │
│              Dat klopt nog niet helemaal                       │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  💡 Hint:                                             │     │
│   │  Je koopt iets (voorraad neemt toe) en betaalt        │     │
│   │  contant (kas neemt af). Welke kant is debet,         │     │
│   │  welke credit?                                        │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                │
│                 Poging 1 van 3                                 │
│                                                                │
│   ┌─────────────────────┐   ┌─────────────────────┐            │
│   │   TOON UITWERKING   │   │   OPNIEUW PROBEREN  │            │
│   └─────────────────────┘   └─────────────────────┘            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### Eindscherm

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                    🚚 FreshBites                               │
│                                                                │
│                  Dag voltooid! 🎉                              │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐     │
│   │                                                      │     │
│   │              ⭐⭐⭐⭐☆                                │     │
│   │                                                      │     │
│   │        Je hebt 4 van de 5 sterren behaald!          │     │
│   │                                                      │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  📊 Jouw resultaten                                  │     │
│   │  ─────────────────────────────────────────────────   │     │
│   │  Transacties correct:     5 / 6                      │     │
│   │  Eerste poging correct:   4 / 6                      │     │
│   │  Hints gebruikt:          1                          │     │
│   │  Totale tijd:             14:32                      │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  💬 Fatima:                                          │     │
│   │  "Goed gedaan! Dankzij jou is de administratie       │     │
│   │   van FreshBites weer helemaal op orde."             │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                │
│   ┌─────────────────┐   ┌─────────────────────────────┐        │
│   │  OPNIEUW SPELEN │   │  BEKIJK ALLE JOURNAALPOSTEN │        │
│   └─────────────────┘   └─────────────────────────────┘        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Technische Architectuur

### 8.1 Tech Stack (aanbevolen)

| Laag | Technologie | Reden |
|------|-------------|-------|
| Frontend | React + TypeScript | Component-based, type safety |
| Styling | Tailwind CSS | Snelle development, responsive |
| State | Zustand of Context API | Lightweight voor deze scope |
| Backend | Geen (v1.0) / Firebase (v2.0) | Serverless, snelle setup |
| Hosting | Vercel of Netlify | Gratis tier, eenvoudige deploys |
| LMS integratie | LTI 1.3 (v2.0) | Standaard voor Canvas/Brightspace |

### 8.2 Data Model

```typescript
// Kernentiteiten

interface Simulation {
  id: string;
  title: string;
  description: string;
  seed: string; // Voor reproduceerbaarheid
  transactionPools: TransactionPool[];
  characters: Character[];
}

interface TransactionPool {
  id: string;
  timeSlot: string; // "08:30", "09:15", etc.
  templates: TransactionTemplate[];
}

interface TransactionTemplate {
  id: string;
  sender: Character;
  messageTemplate: string; // "Inkoop voor €{amount}, betaald €{partial} contant"
  attachment?: Attachment;
  amountRange: AmountRange;
  partialPaymentRange?: AmountRange; // Voor deelbetalingen
  correctAnswerTemplate: JournalEntryTemplate[];
  hints: string[];
  feedbackCorrect: Feedback;
  feedbackIncorrect: Feedback;
}

interface AmountRange {
  min: number;
  max: number;
  step: number;
}

interface JournalEntryTemplate {
  account: Account;
  debitFormula: string | null;  // "amount", "partial", "amount - partial", null
  creditFormula: string | null;
}

// Gegenereerde instantie voor een specifieke student
interface GeneratedTransaction {
  id: string;
  templateId: string;
  time: string;
  sender: Character;
  message: string; // Template met ingevulde bedragen
  attachment?: Attachment;
  generatedAmounts: {
    amount: number;
    partial?: number;
  };
  correctAnswer: JournalEntry[]; // Berekend uit template + bedragen
  hints: string[];
  feedbackCorrect: Feedback;
  feedbackIncorrect: Feedback;
}

interface JournalEntry {
  account: Account;
  debit: number | null;
  credit: number | null;
}

interface Account {
  id: string;
  name: string; // "Voorraad", "Kas", etc.
  type: 'activa' | 'passiva' | 'kosten' | 'opbrengsten';
}

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string; // emoji of image URL
  style: 'informal' | 'formal' | 'neutral';
}

interface Attachment {
  type: 'pdf' | 'image';
  urlTemplate: string; // Kan dynamisch gegenereerd worden
  name: string;
}

interface Feedback {
  message: string;
  characterQuote?: string;
}

// Gebruikersvoortgang

interface UserProgress {
  odataId: string;
  seed: string; // Opslaan voor reproduceerbaarheid
  generatedTransactions: GeneratedTransaction[]; // De specifieke set voor deze student
  currentTransaction: number;
  stars: number;
  attempts: Record<string, number>; // transactionId -> attempts
  hintsUsed: Record<string, boolean>;
  timeExpired: Record<string, boolean>; // transactionId -> true als tijd verstreek
  timeRemaining: Record<string, number>; // transactionId -> seconden over bij submit
  relaxedMode: boolean; // Toegankelijkheidsoptie
  startTime: Date;
  completedAt?: Date;
}
```

### 8.3 Component Architectuur

```
App
├── WelcomeScreen
├── SimulationScreen
│   ├── Header
│   │   ├── Logo
│   │   ├── StarRating
│   │   └── Clock
│   ├── MessageList
│   │   ├── Message
│   │   │   ├── Avatar
│   │   │   ├── MessageBubble
│   │   │   └── Attachment
│   │   └── CompletedBadge
│   ├── JournalTable
│   │   ├── JournalRow
│   │   │   ├── AccountDropdown
│   │   │   ├── DebitInput
│   │   │   └── CreditInput
│   │   ├── AddRowButton
│   │   └── BalanceIndicator
│   ├── ActionBar
│   │   ├── HintButton
│   │   └── SubmitButton
│   └── ProgressBar
├── FeedbackModal
│   ├── CorrectFeedback
│   └── IncorrectFeedback
├── AttachmentModal
└── EndScreen
    ├── StarSummary
    ├── Statistics
    └── ActionButtons
```

---

## 9. Validatielogica

### 9.1 Journaalpost Validatie

```typescript
function validateJournalEntry(
  userEntry: JournalEntry[],
  correctEntry: JournalEntry[]
): ValidationResult {
  
  // Stap 1: Check balans
  const totalDebit = sum(userEntry.map(e => e.debit || 0));
  const totalCredit = sum(userEntry.map(e => e.credit || 0));
  
  if (totalDebit !== totalCredit) {
    return { valid: false, error: 'NOT_BALANCED' };
  }
  
  // Stap 2: Check of alle correcte regels aanwezig zijn
  for (const correct of correctEntry) {
    const match = userEntry.find(u => 
      u.account.id === correct.account.id &&
      u.debit === correct.debit &&
      u.credit === correct.credit
    );
    
    if (!match) {
      return { valid: false, error: 'INCORRECT_ENTRY' };
    }
  }
  
  // Stap 3: Check of er geen extra regels zijn
  if (userEntry.length !== correctEntry.length) {
    return { valid: false, error: 'EXTRA_ENTRIES' };
  }
  
  return { valid: true };
}
```

### 9.2 Hint Systeem

| Niveau | Trigger | Inhoud |
|--------|---------|--------|
| 1 | Na 1e fout | Algemene hint over transactietype |
| 2 | Na 2e fout | Specifieke rekeningen genoemd |
| 3 | Na 3e fout | Volledige uitwerking getoond |

---

## 10. Toegankelijkheid (a11y)

| Requirement | Implementatie |
|-------------|---------------|
| Keyboard navigatie | Tab door alle interactieve elementen |
| Screen reader | ARIA labels op alle componenten |
| Kleurcontrast | WCAG AA minimaal (4.5:1) |
| Focus indicators | Zichtbare focus ring |
| Foutmeldingen | Gekoppeld aan invoervelden via aria-describedby |

---

## 11. Testing Strategie

| Type | Scope | Tools |
|------|-------|-------|
| Unit tests | Validatielogica, puntentelling | Jest |
| Component tests | UI componenten | React Testing Library |
| E2E tests | Volledige user flows | Playwright |
| Usability tests | 5 studenten, think-aloud | Handmatig |

### 12.1 Kritieke Test Cases

| ID | Scenario | Verwacht resultaat |
|----|----------|-------------------|
| TC-01 | Correcte journaalpost eerste poging | +1 ster, volgende bericht |
| TC-02 | Fout antwoord, dan correct | +0.5 ster, volgende bericht |
| TC-03 | 3x fout | Uitwerking getoond, 0 sterren, volgende bericht |
| TC-04 | Debet ≠ Credit bij indienen | Submit knop disabled |
| TC-05 | Hint gebruikt | -0.25 ster potentieel |
| TC-06 | Alle 6 transacties correct eerste poging | 6 sterren, speciale boodschap |
| TC-07 | Twee studenten starten simulatie | Verschillende transacties en/of bedragen |
| TC-08 | Zelfde student herstart met zelfde seed | Identieke transacties en bedragen |
| TC-09 | Bedrag randomisatie binnen grenzen | Alle bedragen vallen binnen gedefinieerde min/max |
| TC-10 | Deelbetaling berekening | Contant bedrag is correct percentage van totaal |
| TC-11 | Timer bereikt 30 seconden | Timer kleurt oranje, pulse animatie start |
| TC-12 | Timer bereikt 10 seconden | Timer kleurt rood, snellere pulse |
| TC-13 | Tijd verstreken met ingevuld formulier | Auto-submit, antwoord wordt gevalideerd |
| TC-14 | Tijd verstreken met leeg formulier | Foutmelding, hint getoond, +1 poging |
| TC-15 | Transactie 1 timer | Start op 3:00 |
| TC-16 | Transactie 5 timer | Start op 1:00 |
| TC-17 | Ontspannen modus actief | Tijden zijn ~1.75x langer |
| TC-18 | Transactie 6 (eindcontrole) | Geen timer zichtbaar |

---

## 12. Roadmap & Fasering

### 12.1 MVP (v1.0) - 6 weken

| Week | Deliverable |
|------|-------------|
| 1-2 | UI componenten, design system |
| 3-4 | Core gameplay loop, validatielogica |
| 5 | Content integratie (6 transacties) |
| 6 | Testing, bugfixes, pilot met 1 klas |

### 12.2 v1.1 - 2 weken na MVP

- Responsive design (tablet/mobile)
- Verbeterde animaties
- Extra hints op basis van pilot feedback

### 12.3 v2.0 - Q2 2025

- Docent dashboard
- LMS integratie (LTI)
- Meerdere casussen (template systeem)
- Resultaten opslaan (Firebase)

---

## 13. Risico's & Mitigaties

| Risico | Impact | Kans | Mitigatie |
|--------|--------|------|-----------|
| Studenten vinden het te makkelijk | Laag leereffect | Medium | Niveau 2 met complexere transacties |
| Technische problemen tijdens college | Frustratie | Laag | Offline fallback, printbare versie |
| Docenten adopteren het niet | Lage usage | Medium | Train-the-trainer sessies |
| Content fouten in transacties | Verkeerd leren | Laag | Peer review door 2 docenten |

---

## 14. Open Vragen

| # | Vraag | Eigenaar | Deadline |
|---|-------|----------|----------|
| 1 | Integratie met Edstack of standalone? | Product Owner | Week 1 |
| 2 | Moeten resultaten worden opgeslagen? | Docent | Week 2 |
| 3 | Welke bijlagen (echte facturen of fictief)? | Content | Week 3 |
| 4 | Is er budget voor custom illustraties? | Design | Week 1 |
| 5 | Moet docent randomisatie kunnen uitschakelen voor klassikale bespreking? | Product Owner | Week 2 |
| 6 | Willen we een "oefenmodus" (altijd dezelfde opgaven) naast "toetsmodus" (random)? | Docent | Week 2 |
| 7 | Hoe wordt ontspannen modus (extra tijd) geactiveerd? Via LMS, docent, of zelf? | Product Owner | Week 2 |
| 8 | Moet tijd-op situatie tellen als volledige poging of halve poging? | Docent | Week 3 |

---

## 15. Appendix

### 15.1 Rekeningenschema FreshBites

| Rekening | Type | Debet = | Credit = |
|----------|------|---------|----------|
| Kas | Activa | Toename | Afname |
| Bank | Activa | Toename | Afname |
| Debiteuren | Activa | Toename | Afname |
| Voorraad | Activa | Toename | Afname |
| Inventaris | Activa | Toename | Afname |
| Crediteuren | Passiva | Afname | Toename |
| Omzet | Opbrengsten | - | Toename |
| Inkoopwaarde | Kosten | Toename | - |
| Huurkosten | Kosten | Toename | - |
| Loonkosten | Kosten | Toename | - |

### 15.2 Referenties

- Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience
- Kapp, K. (2012). The Gamification of Learning and Instruction
- P2 Week 6 Financieel Management II - Cursusmateriaal
