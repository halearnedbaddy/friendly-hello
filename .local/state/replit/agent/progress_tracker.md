[x] 1. Install the required packages (pdfkit, qrcode, date-fns + types)
[x] 2. Backend and frontend workflows running successfully
[x] 3. Feature: Professional Receipt Generation
  [x] 1. receiptPdfService.ts — generates full branded PDF with QR code using pdfkit
  [x] 2. receiptController.ts — generate, download, by-order, view HTML endpoints
  [x] 3. receiptRoutes.ts — routes wired up (public download + view, auth-protected generate/list)
  [x] 4. transactionController.ts — auto-generates receipt on payment confirmation (non-blocking)
  [x] 5. ReceiptPage.tsx — full receipt UI with download PDF, print, share actions
  [x] 6. App.tsx — /receipt/:receiptId route added
  [x] 7. PaymentSuccessPage.tsx — "View Receipt" button shown when payment is approved
  [x] 8. Prisma schema updated with transactionId field, pushed to database