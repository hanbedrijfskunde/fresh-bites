import { format } from 'date-fns';
import { formatCurrency } from './formatters';

/**
 * Receipt Generator Utility
 * Generates dynamic HTML receipts and invoices with actual transaction amounts
 */

// Helper to format dates in Dutch format
const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};

/**
 * Generate wholesale receipt (Pool A variant 1)
 * Kassabon groothandel - Cash purchase of inventory
 */
export const generateWholesaleReceipt = (amount: number, date: Date): string => {
  const receiptNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return `
    <div style="font-family: 'Courier New', monospace; padding: 30px; max-width: 450px; margin: 0 auto; background: white; border: 2px solid #333; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #999; padding-bottom: 15px;">
        <h2 style="margin: 0; font-size: 24px; color: #2D5A3D;">Groothandel De Vers</h2>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">Kerkstraat 42, 1017 GM Amsterdam</p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">KvK: 12345678 | BTW: NL123456789B01</p>
      </div>

      <div style="margin-bottom: 15px;">
        <p style="margin: 5px 0; font-size: 14px;"><strong>KASSABON</strong></p>
        <p style="margin: 5px 0; font-size: 13px;">Nr: ${receiptNumber}</p>
        <p style="margin: 5px 0; font-size: 13px;">Datum: ${formatDate(date, 'dd-MM-yyyy HH:mm')}</p>
      </div>

      <div style="border-top: 1px solid #999; border-bottom: 1px solid #999; padding: 15px 0; margin: 15px 0;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #ccc;">
              <th style="text-align: left; padding: 5px 0;">Artikel</th>
              <th style="text-align: right; padding: 5px 0;">Bedrag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px 0;">Verse groenten mix</td>
              <td style="text-align: right; padding: 8px 0;">${formatCurrency(amount * 0.6)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Kruiden en specerijen</td>
              <td style="text-align: right; padding: 8px 0;">${formatCurrency(amount * 0.25)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Olijfolie en azijn</td>
              <td style="text-align: right; padding: 8px 0;">${formatCurrency(amount * 0.15)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #333;">
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding: 5px 0;">
          <span>TOTAAL</span>
          <span>${formatCurrency(amount)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #666; padding: 5px 0;">
          <span>Waarvan 9% BTW</span>
          <span>${formatCurrency(amount * 0.09)}</span>
        </div>
      </div>

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #999;">
        <p style="text-align: center; font-size: 12px; color: #666; margin: 5px 0;">Contante betaling</p>
        <p style="text-align: center; font-size: 14px; font-weight: bold; margin: 10px 0;">Bedankt voor uw aankoop!</p>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 5px 0;">www.groothandeldevers.nl</p>
      </div>
    </div>
  `;
};

/**
 * Generate supplier invoice (Pool A variant 2)
 * Factuur leverancier - Bank payment for inventory
 */
export const generateSupplierInvoice = (amount: number, date: Date): string => {
  const invoiceNumber = `2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const paymentDue = new Date(date);
  paymentDue.setDate(paymentDue.getDate() + 30);

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
        <div>
          <h1 style="margin: 0; font-size: 28px; color: #2196F3;">BioVers Groothandel</h1>
          <p style="margin: 5px 0; font-size: 13px; color: #666;">Biologische Producten</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 2px 0; font-size: 12px;">Industrieweg 156</p>
          <p style="margin: 2px 0; font-size: 12px;">1234 AB Rotterdam</p>
          <p style="margin: 2px 0; font-size: 12px;">Tel: 010-1234567</p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 15px; margin-bottom: 25px; border-left: 4px solid #2196F3;">
        <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #333;">FACTUUR</h2>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Factuurnr:</strong> ${invoiceNumber}</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Datum:</strong> ${formatDate(date, 'dd-MM-yyyy')}</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Vervaldatum:</strong> ${formatDate(paymentDue, 'dd-MM-yyyy')}</p>
          </div>
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>KvK:</strong> 98765432</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>BTW:</strong> NL987654321B01</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold;">Debiteur:</p>
        <p style="margin: 3px 0; font-size: 13px;">FreshBites Food Truck</p>
        <p style="margin: 3px 0; font-size: 13px;">t.a.v. Fatima Ahmed</p>
        <p style="margin: 3px 0; font-size: 13px;">Foodtrucklaan 1, Amsterdam</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
        <thead>
          <tr style="background: #f5f5f5; border-bottom: 2px solid #2196F3;">
            <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Omschrijving</th>
            <th style="text-align: center; padding: 12px; border: 1px solid #ddd; width: 80px;">Aantal</th>
            <th style="text-align: right; padding: 12px; border: 1px solid #ddd; width: 100px;">Bedrag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Biologische groenten en fruit<br/><span style="font-size: 11px; color: #666;">Weeklevering verse producten</span></td>
            <td style="text-align: center; padding: 12px; border: 1px solid #ddd;">1</td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${formatCurrency(amount / 1.09)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="2"><strong>Subtotaal</strong></td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;"><strong>${formatCurrency(amount / 1.09)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="2">BTW 9%</td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${formatCurrency(amount * 0.09)}</td>
          </tr>
          <tr style="background: #e3f2fd; font-weight: bold; font-size: 15px;">
            <td style="padding: 15px; border: 2px solid #2196F3;" colspan="2">TOTAAL</td>
            <td style="text-align: right; padding: 15px; border: 2px solid #2196F3;">${formatCurrency(amount)}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 13px;"><strong>Betaling:</strong> Gelieve het bedrag binnen 30 dagen over te maken naar:</p>
        <p style="margin: 5px 0; font-size: 13px;">IBAN: NL12 RABO 0123 4567 89</p>
        <p style="margin: 5px 0; font-size: 13px;">t.n.v. BioVers Groothandel B.V.</p>
        <p style="margin: 5px 0; font-size: 13px;">o.v.v. Factuurnummer ${invoiceNumber}</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 3px 0; font-size: 11px; color: #999;">BioVers Groothandel B.V. | KvK 98765432 | info@biovers.nl</p>
      </div>
    </div>
  `;
};

/**
 * Generate catering invoice (Pool B)
 * Factuur advocatenkantoor - Catering revenue
 */
export const generateCateringInvoice = (amount: number, date: Date): string => {
  const orderNumber = `FB-${formatDate(date, 'yyyyMMdd')}-${Math.floor(Math.random() * 100)}`;

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
        <div>
          <h1 style="margin: 0; font-size: 28px; color: #FF6B35;">De Witte & Partners</h1>
          <p style="margin: 5px 0; font-size: 14px; color: #666;">Advocatenkantoor</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 2px 0; font-size: 12px;">Herengracht 456</p>
          <p style="margin: 2px 0; font-size: 12px;">1017 CA Amsterdam</p>
          <p style="margin: 2px 0; font-size: 12px;">Tel: 020-9876543</p>
        </div>
      </div>

      <div style="background: #fff5f0; padding: 15px; margin-bottom: 25px; border-left: 4px solid #FF6B35;">
        <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #333;">BESTELBON</h2>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Bestelnr:</strong> ${orderNumber}</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Datum:</strong> ${formatDate(date, 'dd-MM-yyyy HH:mm')}</p>
          </div>
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Leverancier:</strong> FreshBites</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Contact:</strong> Fatima Ahmed</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #FF6B35;">Lunchcatering voor vergadering</p>
        <p style="margin: 3px 0; font-size: 13px; color: #666;">Datum levering: ${formatDate(date, 'dd-MM-yyyy')}</p>
        <p style="margin: 3px 0; font-size: 13px; color: #666;">Tijd: 12:00 - 14:00 uur</p>
        <p style="margin: 3px 0; font-size: 13px; color: #666;">Aantal personen: 12</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
        <thead>
          <tr style="background: #f5f5f5; border-bottom: 2px solid #FF6B35;">
            <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Omschrijving</th>
            <th style="text-align: center; padding: 12px; border: 1px solid #ddd; width: 80px;">Aantal</th>
            <th style="text-align: right; padding: 12px; border: 1px solid #ddd; width: 100px;">Prijs</th>
            <th style="text-align: right; padding: 12px; border: 1px solid #ddd; width: 100px;">Totaal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Luxe broodjes arrangement<br/><span style="font-size: 11px; color: #666;">Met diverse belegsoorten</span></td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">12</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(amount * 0.5 / 12)}</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(amount * 0.5)}</td>
          </tr>
          <tr style="background: #fafafa;">
            <td style="padding: 10px; border: 1px solid #ddd;">Verse saladebowls<br/><span style="font-size: 11px; color: #666;">Met diverse dressings</span></td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">12</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(amount * 0.35 / 12)}</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(amount * 0.35)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Koffie en thee service<br/><span style="font-size: 11px; color: #666;">Inclusief melk en suiker</span></td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">12</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(amount * 0.15 / 12)}</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(amount * 0.15)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="3"><strong>Subtotaal</strong></td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;"><strong>${formatCurrency(amount / 1.09)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="3">BTW 9%</td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${formatCurrency(amount * 0.09)}</td>
          </tr>
          <tr style="background: #fff5f0; font-weight: bold; font-size: 15px;">
            <td style="padding: 15px; border: 2px solid #FF6B35;" colspan="3">TE BETALEN</td>
            <td style="text-align: right; padding: 15px; border: 2px solid #FF6B35;">${formatCurrency(amount)}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin-bottom: 20px;">
        <p style="margin: 0 0 5px 0; font-size: 13px;"><strong>✓ Bestelling geaccepteerd</strong></p>
        <p style="margin: 0; font-size: 12px; color: #666;">Levering conform afspraak. Factuur volgt na levering.</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 3px 0; font-size: 11px; color: #999;">Handtekening voor akkoord: ___________________________</p>
        <p style="margin: 10px 0 3px 0; font-size: 11px; color: #999;">De Witte & Partners Advocaten | KvK 11223344</p>
      </div>
    </div>
  `;
};

/**
 * Generate equipment invoice with split payment (Pool D variant 1)
 * Factuur keukengigant - Equipment purchase with partial payment
 */
export const generateEquipmentInvoice = (amount: number, partial: number, date: Date): string => {
  const invoiceNumber = `KG-${formatDate(date, 'yyyy')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  const remaining = amount - partial;

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
        <div>
          <h1 style="margin: 0; font-size: 32px; color: #e91e63;">KeukenGigant</h1>
          <p style="margin: 5px 0; font-size: 14px; color: #666;">Professionele Keukenapparatuur</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 2px 0; font-size: 12px;">Ambachtsweg 78</p>
          <p style="margin: 2px 0; font-size: 12px;">3446 GR Woerden</p>
          <p style="margin: 2px 0; font-size: 12px;">Tel: 0348-123456</p>
          <p style="margin: 2px 0; font-size: 12px;">info@keukengigant.nl</p>
        </div>
      </div>

      <div style="background: #fce4ec; padding: 15px; margin-bottom: 25px; border-left: 4px solid #e91e63;">
        <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #333;">FACTUUR</h2>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Factuurnr:</strong> ${invoiceNumber}</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Datum:</strong> ${formatDate(date, 'dd-MM-yyyy')}</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Klantnr:</strong> FB-2024-001</p>
          </div>
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>KvK:</strong> 55667788</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>BTW:</strong> NL556677889B01</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold;">Klant:</p>
        <p style="margin: 3px 0; font-size: 13px;">FreshBites Food Truck B.V.</p>
        <p style="margin: 3px 0; font-size: 13px;">Fatima Ahmed</p>
        <p style="margin: 3px 0; font-size: 13px;">Foodtrucklaan 1</p>
        <p style="margin: 3px 0; font-size: 13px;">1234 AB Amsterdam</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
        <thead>
          <tr style="background: #f5f5f5; border-bottom: 2px solid #e91e63;">
            <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Omschrijving</th>
            <th style="text-align: center; padding: 12px; border: 1px solid #ddd; width: 80px;">Aantal</th>
            <th style="text-align: right; padding: 12px; border: 1px solid #ddd; width: 120px;">Bedrag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">
              <strong>Professionele Combi-Oven GC2000</strong><br/>
              <span style="font-size: 11px; color: #666;">• 10 kookprogramma's</span><br/>
              <span style="font-size: 11px; color: #666;">• Energieklasse A++</span><br/>
              <span style="font-size: 11px; color: #666;">• Artikelnr: GC2000-PRO</span><br/>
              <span style="font-size: 11px; color: #666;">• Inclusief installatie en instructie</span>
            </td>
            <td style="text-align: center; padding: 12px; border: 1px solid #ddd; vertical-align: top;">1</td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount / 1.21)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="2"><strong>Subtotaal</strong></td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;"><strong>${formatCurrency(amount / 1.21)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="2">BTW 21%</td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${formatCurrency(amount * 0.21)}</td>
          </tr>
          <tr style="background: #fce4ec; font-weight: bold; font-size: 15px;">
            <td style="padding: 15px; border: 2px solid #e91e63;" colspan="2">TOTAAL FACTUURBEDRAG</td>
            <td style="text-align: right; padding: 15px; border: 2px solid #e91e63;">${formatCurrency(amount)}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #fff9c4; padding: 15px; border-left: 4px solid #fbc02d; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f57c00;">⚠️ Betalingsregeling</h3>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0;">Totaal factuurbedrag:</td>
            <td style="text-align: right; padding: 5px 0;"><strong>${formatCurrency(amount)}</strong></td>
          </tr>
          <tr style="background: #e8f5e9;">
            <td style="padding: 8px; border: 1px solid #4CAF50;">✓ Aanbetaling (contant bij levering):</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #4CAF50; font-weight: bold; color: #2e7d32;">${formatCurrency(partial)}</td>
          </tr>
          <tr style="background: #ffebee;">
            <td style="padding: 8px; border: 1px solid #f44336;">Restbedrag (binnen 14 dagen):</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #f44336; font-weight: bold; color: #c62828;">${formatCurrency(remaining)}</td>
          </tr>
        </table>
        <p style="margin: 10px 0 0 0; font-size: 12px;"><strong>Bankgegevens restbedrag:</strong></p>
        <p style="margin: 3px 0; font-size: 12px;">IBAN: NL98 INGB 0987 6543 21</p>
        <p style="margin: 3px 0; font-size: 12px;">t.n.v. KeukenGigant B.V.</p>
        <p style="margin: 3px 0; font-size: 12px;">o.v.v. ${invoiceNumber}</p>
      </div>

      <div style="background: #e3f2fd; padding: 12px; border-left: 4px solid #2196F3; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 12px;"><strong>📋 Garantie:</strong> 2 jaar volledige fabrieksgarantie</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;"><strong>🚚 Levering:</strong> Gepland voor ${formatDate(date, 'dd-MM-yyyy')}</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 3px 0; font-size: 11px; color: #999;">KeukenGigant B.V. | Ambachtsweg 78, Woerden | www.keukengigant.nl</p>
        <p style="margin: 3px 0; font-size: 11px; color: #999;">KvK: 55667788 | BTW: NL556677889B01</p>
      </div>
    </div>
  `;
};

/**
 * Generate repair invoice with split payment (Pool D variant 2)
 * Factuur reparatie - Equipment repair with partial payment
 */
export const generateRepairInvoice = (amount: number, partial: number, date: Date): string => {
  const invoiceNumber = `REP-${formatDate(date, 'yyyyMM')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const remaining = amount - partial;

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
        <div>
          <h1 style="margin: 0; font-size: 28px; color: #ff9800;">TechFix Service</h1>
          <p style="margin: 5px 0; font-size: 14px; color: #666;">Spoedrepar aties & Onderhoud</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 2px 0; font-size: 12px;">Reparatieweg 23</p>
          <p style="margin: 2px 0; font-size: 12px;">1234 XY Utrecht</p>
          <p style="margin: 2px 0; font-size: 12px;">Tel: 030-7654321</p>
          <p style="margin: 2px 0; font-size: 12px;">service@techfix.nl</p>
        </div>
      </div>

      <div style="background: #fff3e0; padding: 15px; margin-bottom: 25px; border-left: 4px solid #ff9800;">
        <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #333;">REPARATIEFACTUUR</h2>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Factuurnr:</strong> ${invoiceNumber}</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Datum:</strong> ${formatDate(date, 'dd-MM-yyyy')}</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Monteur:</strong> J. van Berg</p>
          </div>
          <div>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Spoedopdracht</strong></p>
            <p style="margin: 3px 0; font-size: 13px;">⚡ Binnen 4 uur</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold;">Opdrachtgever:</p>
        <p style="margin: 3px 0; font-size: 13px;">FreshBites Food Truck</p>
        <p style="margin: 3px 0; font-size: 13px;">Locatie: Foodtrucklaan 1, Amsterdam</p>
        <p style="margin: 3px 0; font-size: 13px;">Contact: Chef Mo (06-12345678)</p>
      </div>

      <div style="background: #ffebee; padding: 12px; margin-bottom: 15px; border-left: 4px solid #f44336;">
        <p style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold; color: #c62828;">⚠️ Storingsbeschrijving:</p>
        <p style="margin: 3px 0; font-size: 13px;">Koelinstallatie geeft foutcode E-23, temperatuur loopt op</p>
        <p style="margin: 3px 0; font-size: 13px;">Compressor maakt onregelmatig geluid</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
        <thead>
          <tr style="background: #f5f5f5; border-bottom: 2px solid #ff9800;">
            <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Omschrijving</th>
            <th style="text-align: center; padding: 12px; border: 1px solid #ddd; width: 80px;">Aantal</th>
            <th style="text-align: right; padding: 12px; border: 1px solid #ddd; width: 100px;">Prijs</th>
            <th style="text-align: right; padding: 12px; border: 1px solid #ddd; width: 100px;">Totaal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <strong>Arbeidsloon monteur</strong><br/>
              <span style="font-size: 11px; color: #666;">Diagnose + reparatie (2,5 uur)</span><br/>
              <span style="font-size: 11px; color: #666;">Incl. spoedtoeslag</span>
            </td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd; vertical-align: top;">2.5</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount * 0.40 / 2.5)}</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount * 0.40)}</td>
          </tr>
          <tr style="background: #fafafa;">
            <td style="padding: 10px; border: 1px solid #ddd;">
              <strong>Compressor thermostaat</strong><br/>
              <span style="font-size: 11px; color: #666;">Artikelnr: COMP-TH-500</span>
            </td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd; vertical-align: top;">1</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount * 0.35)}</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount * 0.35)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <strong>Koelmiddel R134a</strong><br/>
              <span style="font-size: 11px; color: #666;">Bijvullen systeem (0.5 kg)</span>
            </td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd; vertical-align: top;">0.5</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount * 0.15 / 0.5)}</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount * 0.15)}</td>
          </tr>
          <tr style="background: #fafafa;">
            <td style="padding: 10px; border: 1px solid #ddd;">
              <strong>Kleine onderdelen</strong><br/>
              <span style="font-size: 11px; color: #666;">Kabels, bevestigingsmateriaal</span>
            </td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd; vertical-align: top;">-</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">-</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd; vertical-align: top;">${formatCurrency(amount * 0.10)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="3"><strong>Subtotaal</strong></td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;"><strong>${formatCurrency(amount / 1.21)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;" colspan="3">BTW 21%</td>
            <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${formatCurrency(amount * 0.21)}</td>
          </tr>
          <tr style="background: #fff3e0; font-weight: bold; font-size: 15px;">
            <td style="padding: 15px; border: 2px solid #ff9800;" colspan="3">TOTAAL FACTUURBEDRAG</td>
            <td style="text-align: right; padding: 15px; border: 2px solid #ff9800;">${formatCurrency(amount)}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #fff9c4; padding: 15px; border-left: 4px solid #fbc02d; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f57c00;">💳 Betalingsafspraak</h3>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0;">Totaal reparatiekosten:</td>
            <td style="text-align: right; padding: 5px 0;"><strong>${formatCurrency(amount)}</strong></td>
          </tr>
          <tr style="background: #e8f5e9;">
            <td style="padding: 8px; border: 1px solid #4CAF50;">✓ Contant betaald bij afronding:</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #4CAF50; font-weight: bold; color: #2e7d32;">${formatCurrency(partial)}</td>
          </tr>
          <tr style="background: #ffebee;">
            <td style="padding: 8px; border: 1px solid #f44336;">Restbedrag (binnen 7 dagen):</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #f44336; font-weight: bold; color: #c62828;">${formatCurrency(remaining)}</td>
          </tr>
        </table>
        <p style="margin: 10px 0 0 0; font-size: 12px;"><strong>Bankgegevens restbedrag:</strong></p>
        <p style="margin: 3px 0; font-size: 12px;">IBAN: NL45 ABNA 0567 8901 23</p>
        <p style="margin: 3px 0; font-size: 12px;">t.n.v. TechFix Service B.V.</p>
        <p style="margin: 3px 0; font-size: 12px;">o.v.v. ${invoiceNumber}</p>
      </div>

      <div style="background: #e8f5e9; padding: 12px; border-left: 4px solid #4CAF50; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 12px;"><strong>✓ Reparatie afgerond:</strong> ${formatDate(date, 'dd-MM-yyyy HH:mm')} uur</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;"><strong>✓ Systeem getest:</strong> Functioneert naar behoren</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;"><strong>🛡️ Garantie:</strong> 3 maanden op onderdelen en arbeid</p>
      </div>

      <div style="background: #e3f2fd; padding: 10px; margin-bottom: 20px; border-radius: 4px;">
        <p style="margin: 0; font-size: 11px; color: #666;">
          <strong>Handtekening opdrachtgever voor akkoord:</strong>
        </p>
        <div style="margin: 10px 0; border-bottom: 1px solid #999; height: 40px;"></div>
        <p style="margin: 0; font-size: 10px; color: #999;">Naam: _________________________ Datum: ${formatDate(date, 'dd-MM-yyyy')}</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 3px 0; font-size: 11px; color: #999;">TechFix Service B.V. | Reparatieweg 23, Utrecht | www.techfix.nl</p>
        <p style="margin: 3px 0; font-size: 11px; color: #999;">KvK: 33445566 | BTW: NL334455667B01 | 24/7 Storingsservice: 030-7654321</p>
      </div>
    </div>
  `;
};
