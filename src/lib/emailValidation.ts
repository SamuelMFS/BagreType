// List of common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'yopmail.com',
  'getnada.com',
  'fakemail.net',
  'maildrop.cc',
  'sharklasers.com',
  'grr.la',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chammy.info',
  'tmpmail.org',
  'nowhere.org',
  'fakeinbox.com',
  'mytrashmail.com',
  'mohmal.com',
  'mintemail.com',
  'trashmail.com',
  'dispostable.com',
  'spamgourmet.com',
  'supere.ml',
  'getairmail.com',
  'meltmail.com',
  'throwawaymail.com',
  'mailcatch.com',
  'tempinbox.com',
  'burnermail.io',
  'emailondeck.com',
  'fake-mail.net',
  'drdrb.com',
  'nada.email',
  'tempail.com',
  'mintemail.com',
  'throwawaymail.com',
];

// Valid email providers
const VALID_EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'protonmail.com',
  'icloud.com',
  'aol.com',
  'live.com',
  'msn.com',
  'mail.com',
  'yandex.com',
  'zoho.com',
  'gmx.com',
  'aim.com',
  'comcast.net',
  'verizon.net',
  'att.net',
  'sbcglobal.net',
  'cox.net',
  'earthlink.net',
];

/**
 * Validates if an email is valid and not from a disposable email service
 */
export const validateEmail = (email: string): { valid: boolean; reason?: string } => {
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) {
    return { valid: false, reason: 'Invalid email domain' };
  }

  // Check for disposable email domains
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, reason: 'Disposable email addresses are not allowed' };
  }

  // Check for obviously fake domains
  if (domain.includes('temp') || domain.includes('fake') || domain.includes('test') || domain.includes('spam')) {
    if (!VALID_EMAIL_PROVIDERS.some(provider => domain.includes(provider))) {
      return { valid: false, reason: 'Invalid email domain' };
    }
  }

  // Check for suspicious patterns
  if (domain.length < 4 || domain.startsWith('.') || domain.endsWith('.')) {
    return { valid: false, reason: 'Invalid email domain' };
  }

  return { valid: true };
};

/**
 * Checks if an email looks suspicious (rate limiting helper)
 */
export const isSuspiciousEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  
  // Patterns that indicate suspicious emails
  const suspiciousPatterns = [
    /^test/,
    /^temp/,
    /^fake/,
    /^spam/,
    /^demo/,
    /^random/,
    /[0-9]{10,}/, // Long sequences of numbers
    /.*@.*\.(test|example|localhost|invalid)$/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(email));
};

