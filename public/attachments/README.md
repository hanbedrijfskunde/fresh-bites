# Attachment Files Directory

This directory was previously used for static PDF files.

## Current Implementation

FreshBites now uses **dynamically generated HTML receipts and invoices** that display the actual randomized transaction amounts.

The HTML content is generated on-the-fly by:
- `src/utils/receiptGenerator.ts` - Contains 5 HTML template generators
- `src/engine/SimulationGenerator.ts` - Generates HTML content during transaction creation
- `src/components/modals/AttachmentModal.tsx` - Renders HTML in modal

## Receipt Types

1. **Wholesale Receipt** (Pool A variant 1) - Cash purchase of inventory
2. **Supplier Invoice** (Pool A variant 2) - Bank payment for inventory
3. **Catering Invoice** (Pool B) - Revenue from catering order
4. **Equipment Invoice** (Pool D variant 1) - Equipment purchase with split payment
5. **Repair Invoice** (Pool D variant 2) - Repair service with split payment

All receipts:
- Show actual randomized amounts
- Are deterministic (same seed = same receipts)
- Use Dutch formatting (€ symbols, date format)
- Include realistic business details
- Use inline CSS styling

This directory can be removed if no other static assets are needed.
