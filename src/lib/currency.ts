export function convertTndToEuro(amount: number) {
  const rate = Number(process.env.TND_TO_EUR_RATE || 0.3);

  return Number((amount * rate).toFixed(2));
}

export function euroToStripeAmount(amount: number) {
  return Math.round(amount * 100);
}
