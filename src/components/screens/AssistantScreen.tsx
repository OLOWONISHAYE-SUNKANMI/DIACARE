import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

const AssistantScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "Mes glycémies sont élevées ce matin",
    "Comment calculer ma dose d'insuline ?",
    "Quoi manger avant l'exercice ?",
    "Symptômes d'hypoglycémie ?"
  ];

  const welcomeMessage: Message = {
    id: 'welcome',
    text: `👋 Bonjour ! Je suis Dr. DARE, votre assistant endocrinologue IA.

Je peux vous aider avec :
- 📊 Analyse de vos glycémies
- 💉 Conseils sur l'insuline  
- 🍽️ Nutrition diabétique
- ⚠️ Gestion des hypo/hyperglycémies
- 💊 Questions sur votre traitement

*Disclaimer : Je complète mais ne remplace pas votre médecin*

Comment puis-je vous aider aujourd'hui ?`,
    sender: 'ai',
    timestamp: new Date()
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('glycémie') && (lowerMessage.includes('élevé') || lowerMessage.includes('haute'))) {
      return `🔍 **Analyse de glycémie élevée**

Les glycémies élevées peuvent avoir plusieurs causes :

• **Alimentation** : Repas trop riches en glucides
• **Médication** : Dose d'insuline insuffisante ou oubli
• **Stress** : Physique ou émotionnel
• **Maladie** : Infection ou inflammation
• **Manque d'activité** : Sédentarité

**Mes recommandations :**
1. Vérifiez votre dernière injection d'insuline
2. Buvez de l'eau pour éviter la déshydratation
3. Évitez les glucides rapides temporairement
4. Surveillez l'apparition de cétones si >250 mg/dL
5. Contactez votre médecin si ça persiste

💡 *Astuce* : Tenez un journal alimentaire pour identifier les déclencheurs.`;
    }

    if (lowerMessage.includes('insuline') && (lowerMessage.includes('calcul') || lowerMessage.includes('dose'))) {
      return `💉 **Calcul de dose d'insuline**

Le calcul dépend de plusieurs facteurs :

**Insuline rapide (repas) :**
• Ratio glucides : 1U pour X grammes de glucides
• Facteur de sensibilité : 1U fait baisser de X mg/dL
• Glycémie cible : généralement 100-120 mg/dL

**Formule de base :**
\`Dose = (Glucides ÷ Ratio) + (Glycémie actuelle - Cible) ÷ Sensibilité\`

**Exemple :**
- Repas : 60g glucides
- Ratio : 1U/10g  
- Glycémie : 180 mg/dL
- Cible : 120 mg/dL
- Sensibilité : 1U/30mg/dL

\`Dose = (60÷10) + (180-120)÷30 = 6 + 2 = 8 unités\`

⚠️ **Important** : Ces ratios sont personnels et doivent être validés par votre endocrinologue.`;
    }

    if (lowerMessage.includes('exercice') || lowerMessage.includes('sport')) {
      return `🏃‍♂️ **Diabète et exercice physique**

**Avant l'exercice :**
• Glycémie idéale : 150-180 mg/dL
• Si < 100 mg/dL : collation avec 15-30g glucides
• Si > 250 mg/dL : vérifiez les cétones

**Pendant l'exercice :**
• Surveillez les signes d'hypoglycémie
• Gardez des glucides rapides à portée
• Hydratez-vous régulièrement

**Après l'exercice :**
• Surveillez la glycémie 2-4h après
• Risque d'hypoglycémie retardée
• Adaptez l'insuline si nécessaire

**Types d'exercices :**
• **Aérobie** (marche, vélo) : ↓ glycémie
• **Anaérobie** (sprint, musculation) : ↑ glycémie temporaire

🥤 **Collations recommandées :** banane, dattes, boisson sportive diluée.`;
    }

    if (lowerMessage.includes('hypoglycémie') || lowerMessage.includes('hypo')) {
      return `⚠️ **Gestion de l'hypoglycémie**

**Symptômes à reconnaître :**
- 🥵 Transpiration, tremblements
- 🧠 Confusion, irritabilité  
- ❤️ Palpitations, faim intense
- 😵 Fatigue, vision floue

**Règle des 15 :**
1. **15g de glucides rapides** (3 sucres, 150ml jus)
2. **Attendre 15 minutes**
3. **Recontrôler la glycémie**
4. **Répéter si < 70 mg/dL**

**Après correction :**
- Prendre une collation si le repas est dans + de 1h
- Noter l'épisode dans votre carnet
- Analyser la cause avec votre médecin

**Prévention :**
• Ne sautez jamais de repas
• Surveillez après l'exercice
• Ajustez l'insuline en cas de changements
• Portez toujours des glucides rapides

🚨 **Si perte de connaissance** : injection de glucagon et appel d'urgence.`;
    }

    // Réponse générale
    return `🩺 **Merci pour votre question !**

Je suis là pour vous accompagner dans la gestion de votre diabète. 

Pour vous donner des conseils plus précis, pouvez-vous me dire :
- Votre type de diabète (Type 1 ou 2) ?
- Votre traitement actuel ?
- Le contexte de votre question ?

**Sujets que je maîtrise :**
• Analyse des glycémies et tendances
• Calculs de doses d'insuline
• Nutrition et gestion des repas
• Exercice physique et diabète
• Gestion des hypo/hyperglycémies
• Effets secondaires des traitements

N'hésitez pas à être plus spécifique, je suis là pour vous aider ! 

*Rappel : En cas d'urgence médicale, contactez immédiatement votre médecin ou les services d'urgence.*`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-teal to-medical-green p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Dr. DARE</h1>
            <p className="text-white/90 text-sm">Assistant Endocrinologue IA</p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-white/20 text-white border-white/30">
              En ligne
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.sender === 'ai' 
                  ? 'bg-medical-teal/10 border-medical-teal/20' 
                  : 'bg-muted'
              } rounded-lg p-3 border`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'ai' && (
                  <div className="w-6 h-6 bg-medical-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div 
                    className={`text-sm whitespace-pre-wrap ${
                      message.sender === 'ai' ? 'text-foreground' : 'text-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="w-6 h-6 bg-medical-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-medical-teal/10 border-medical-teal/20 rounded-lg p-3 border">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-medical-teal rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-medical-teal rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-muted/20">
          <p className="text-sm text-muted-foreground mb-3">Suggestions rapides :</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs h-8 bg-white hover:bg-medical-teal/10 hover:border-medical-teal/30"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez votre question sur le diabète..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-medical-teal hover:bg-medical-teal/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Assistant IA • Ne remplace pas un avis médical professionnel
        </p>
      </div>
    </div>
  );
};

export default AssistantScreen;