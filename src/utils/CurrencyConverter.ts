// Currency converter for African countries
export interface CountryCurrency {
  country: string;
  currency: string;
  symbol: string;
  rate: number; // Rate from EUR to local currency
  locale: string;
}

export const AFRICAN_CURRENCIES: Record<string, CountryCurrency> = {
  // West Africa (CFA Franc Zone)
  'CM': { country: 'Cameroun', currency: 'XAF', symbol: 'FCFA', rate: 655.957, locale: 'fr-CM' },
  'SN': { country: 'Sénégal', currency: 'XOF', symbol: 'FCFA', rate: 655.957, locale: 'fr-SN' },
  'CI': { country: "Côte d'Ivoire", currency: 'XOF', symbol: 'FCFA', rate: 655.957, locale: 'fr-CI' },
  'BF': { country: 'Burkina Faso', currency: 'XOF', symbol: 'FCFA', rate: 655.957, locale: 'fr-BF' },
  'ML': { country: 'Mali', currency: 'XOF', symbol: 'FCFA', rate: 655.957, locale: 'fr-ML' },
  'TD': { country: 'Tchad', currency: 'XAF', symbol: 'FCFA', rate: 655.957, locale: 'fr-TD' },
  'GA': { country: 'Gabon', currency: 'XAF', symbol: 'FCFA', rate: 655.957, locale: 'fr-GA' },
  'CF': { country: 'République Centrafricaine', currency: 'XAF', symbol: 'FCFA', rate: 655.957, locale: 'fr-CF' },
  
  // Nigeria
  'NG': { country: 'Nigeria', currency: 'NGN', symbol: '₦', rate: 1680, locale: 'en-NG' },
  
  // Ghana
  'GH': { country: 'Ghana', currency: 'GHS', symbol: 'GH₵', rate: 15.5, locale: 'en-GH' },
  
  // Kenya
  'KE': { country: 'Kenya', currency: 'KES', symbol: 'KSh', rate: 140, locale: 'en-KE' },
  
  // South Africa
  'ZA': { country: 'Afrique du Sud', currency: 'ZAR', symbol: 'R', rate: 20.5, locale: 'en-ZA' },
  
  // Morocco
  'MA': { country: 'Maroc', currency: 'MAD', symbol: 'DH', rate: 11.2, locale: 'ar-MA' },
  
  // Tunisia
  'TN': { country: 'Tunisie', currency: 'TND', symbol: 'د.ت', rate: 3.45, locale: 'ar-TN' },
  
  // Algeria
  'DZ': { country: 'Algérie', currency: 'DZD', symbol: 'DA', rate: 148, locale: 'ar-DZ' },
  
  // Egypt
  'EG': { country: 'Égypte', currency: 'EGP', symbol: 'ج.م', rate: 54, locale: 'ar-EG' },
  
  // Tanzania
  'TZ': { country: 'Tanzanie', currency: 'TZS', symbol: 'TSh', rate: 2580, locale: 'sw-TZ' },
  
  // Uganda
  'UG': { country: 'Ouganda', currency: 'UGX', symbol: 'USh', rate: 4100, locale: 'en-UG' },
  
  // Rwanda
  'RW': { country: 'Rwanda', currency: 'RWF', symbol: 'FRw', rate: 1450, locale: 'rw-RW' },
  
  // Default (EUR for other countries)
  'DEFAULT': { country: 'Autre', currency: 'EUR', symbol: '€', rate: 1, locale: 'fr-FR' }
};

export class CurrencyConverter {
  private static detectedCountry: string | null = null;

  // Detect user country (simplified - in production use IP geolocation)
  static async detectCountry(): Promise<string> {
    if (this.detectedCountry) return this.detectedCountry;

    try {
      // Try to detect from browser locale first
      const locale = navigator.language;
      if (locale.includes('fr-CM') || locale.includes('fr-CF')) return 'CM';
      if (locale.includes('fr-SN') || locale.includes('fr-ML')) return 'SN';
      if (locale.includes('en-NG')) return 'NG';
      if (locale.includes('en-GH')) return 'GH';
      if (locale.includes('en-KE')) return 'KE';
      if (locale.includes('en-ZA')) return 'ZA';
      if (locale.includes('ar-MA')) return 'MA';
      if (locale.includes('ar-TN')) return 'TN';
      
      // Fallback: try IP geolocation service (free tier)
      const response = await fetch('https://ipapi.co/country_code/');
      const countryCode = await response.text();
      
      this.detectedCountry = countryCode.trim().toUpperCase();
      return this.detectedCountry;
    } catch (error) {
      console.warn('Could not detect country, using default');
      return 'DEFAULT';
    }
  }

  static getCurrencyInfo(countryCode: string): CountryCurrency {
    return AFRICAN_CURRENCIES[countryCode] || AFRICAN_CURRENCIES.DEFAULT;
  }

  static convertPrice(eurPrice: number, countryCode: string): {
    amount: number;
    currency: CountryCurrency;
    formatted: string;
  } {
    const currency = this.getCurrencyInfo(countryCode);
    const amount = Math.round(eurPrice * currency.rate);
    
    // Format according to local conventions
    const formatted = new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return { amount, currency, formatted };
  }

  static formatAmount(amount: number, currency: CountryCurrency): string {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Get all supported countries for manual selection
  static getSupportedCountries(): Array<{ code: string; info: CountryCurrency }> {
    return Object.entries(AFRICAN_CURRENCIES)
      .filter(([code]) => code !== 'DEFAULT')
      .map(([code, info]) => ({ code, info }))
      .sort((a, b) => a.info.country.localeCompare(b.info.country));
  }
}