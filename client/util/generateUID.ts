import CryptoJS from 'crypto-js';

export function generateEsewaSignature(message: string): string {
  const secretKey = process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Missing key');
  }

  return CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Base64);
}