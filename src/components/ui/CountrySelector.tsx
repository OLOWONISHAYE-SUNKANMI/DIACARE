import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CurrencyConverter, CountryCurrency } from '@/utils/CurrencyConverter';
import { MapPin, Globe } from 'lucide-react';

interface CountrySelectorProps {
  onCountrySelect: (countryCode: string, currency: CountryCurrency) => void;
  selectedCountry?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  onCountrySelect, 
  selectedCountry 
}) => {
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const supportedCountries = CurrencyConverter.getSupportedCountries();

  useEffect(() => {
    detectUserCountry();
  }, []);

  const detectUserCountry = async () => {
    setIsDetecting(true);
    try {
      const country = await CurrencyConverter.detectCountry();
      setDetectedCountry(country);
      
      // Auto-select detected country if it's supported
      if (country && country !== 'DEFAULT') {
        const currency = CurrencyConverter.getCurrencyInfo(country);
        onCountrySelect(country, currency);
      }
    } catch (error) {
      console.warn('Country detection failed');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const currency = CurrencyConverter.getCurrencyInfo(countryCode);
    onCountrySelect(countryCode, currency);
  };

  const handleUseDetected = () => {
    if (detectedCountry) {
      handleCountryChange(detectedCountry);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Sélection du pays et devise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDetecting ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Détection de votre pays...</p>
          </div>
        ) : (
          <>
            {detectedCountry && detectedCountry !== 'DEFAULT' && !selectedCountry && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">
                      Pays détecté: {CurrencyConverter.getCurrencyInfo(detectedCountry).country}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleUseDetected}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Utiliser
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Choisissez votre pays :</label>
              <Select value={selectedCountry || ''} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pays..." />
                </SelectTrigger>
                <SelectContent>
                  {supportedCountries.map(({ code, info }) => (
                    <SelectItem key={code} value={code}>
                      <div className="flex items-center justify-between w-full">
                        <span>{info.country}</span>
                        <Badge variant="secondary" className="ml-2">
                          {info.symbol}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCountry && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {CurrencyConverter.getCurrencyInfo(selectedCountry).country}
                    </p>
                    <p className="text-xs text-green-600">
                      Devise: {CurrencyConverter.getCurrencyInfo(selectedCountry).currency}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {CurrencyConverter.getCurrencyInfo(selectedCountry).symbol}
                  </Badge>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};