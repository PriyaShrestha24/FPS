import { createHmac } from 'crypto';

// The exact dataToSign string from your backend logs
const dataToSign = 'total_amount=100,transaction_uuid=TXN_123e4567-e89b-12d3-a456-426614174000,product_code=EPAYTEST';
const secret = '8gBm/:&EnhH.1/q';

// Generate the HMAC-SHA256 hash
const hmac = createHmac('sha256', secret);
hmac.update(dataToSign);
const signature = hmac.digest('base64');

console.log('Manually Generated Signature:', signature);
console.log('Raw HMAC (hex):', hmac.digest('hex')); // For debugging