import { useState } from 'react';
import {
  Globe,
  Clock,
  ArrowRight,
  TrendingUp,
  Heart,
  Brain,
  Search,
  Bookmark,
  X,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

interface BlogScreenProps {}

const BlogScreen = (props: BlogScreenProps) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(
    t('blog.categories.all')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<
    (typeof articles)[0] | null
  >(null);

  const categories = [
    t('blog.categories.all'),
    'Guides',
    t('blog.categories.research'),
    t('blog.categories.nutrition'),
    t('blog.categories.mental'),
    t('blog.categories.innovation'),
    t('blog.categories.testimonials'),
  ];

  const articles = [
    {
      id: 7,
      image: '🍽️',
      category: t('blogScreen.article.id7.category'),
      readTime: '15 min',
      title: t('blogScreen.article.id7.title'),
      excerpt: t('blogScreen.article.id7.excerpt'),
      content: `# Guide d'alimentation pour personnes diabétiques

## Introduction
Une alimentation équilibrée est la pierre angulaire de la gestion du diabète. Ce guide vous fournit les bases pour adopter de bonnes habitudes alimentaires qui vous aideront à contrôler votre glycémie tout en maintenant une qualité de vie optimale.

## Principes de base

### 1. Répartition des macronutriments
- **Glucides** : 45-65% de l'apport énergétique total
- **Protéines** : 15-20% de l'apport énergétique total  
- **Lipides** : 20-35% de l'apport énergétique total

### 2. Index glycémique
Privilégiez les aliments à index glycémique bas ou modéré :
- **IG bas (< 55)** : Légumes verts, légumineuses, quinoa, avoine
- **IG modéré (55-70)** : Pain complet, riz brun, patate douce
- **IG élevé (> 70)** : À limiter - pain blanc, pomme de terre, sucre

## Aliments recommandés

### Légumes (à volonté)
- Brocolis, épinards, courgettes, aubergines
- Tomates, poivrons, concombres
- Chou-fleur, haricots verts, asperges

### Protéines de qualité
- Poissons gras : saumon, maquereau, sardines
- Volaille sans peau : poulet, dinde
- Légumineuses : lentilles, pois chiches, haricots
- Œufs (avec modération)
- Tofu et produits à base de soja

### Glucides complexes
- Quinoa, avoine, orge
- Pain complet, pâtes complètes
- Riz brun, légumineuses
- Patate douce (avec modération)

### Bonnes graisses
- Huile d'olive, avocat
- Noix, amandes, graines
- Poissons gras

## Aliments à limiter

### Sucres simples
- Sucreries, pâtisseries, sodas
- Fruits très sucrés en excès
- Miel, sirop d'érable (occasionnellement)

### Graisses saturées
- Viandes grasses, charcuterie
- Fromages gras, beurre en excès
- Aliments frits, fast-food

## Stratégies pratiques

### Planification des repas
1. **Méthode de l'assiette** :
   - 1/2 assiette : légumes non féculents
   - 1/4 assiette : protéines maigres
   - 1/4 assiette : glucides complexes

2. **Horaires réguliers** : 3 repas + 1-2 collations si nécessaire

3. **Contrôle des portions** :
   - Utilisez des assiettes plus petites
   - Pesez vos aliments au début pour apprendre
   - Écoutez vos signaux de satiété

### Gestion des envies
- Buvez de l'eau avant les repas
- Incluez des fibres à chaque repas
- Préparez des collations saines à l'avance
- Mangez lentement et en pleine conscience

## Conseils spécifiques par type de diabète

### Type 1
- Comptage des glucides pour ajuster l'insuline
- Attention aux hypoglycémies pendant l'exercice
- Resucrage adapté en cas d'hypoglycémie

### Type 2
- Perte de poids si nécessaire (5-10%)
- Activité physique régulière après les repas
- Surveillance de la tension artérielle

## Hydratation
- 1,5 à 2 litres d'eau par jour
- Évitez les boissons sucrées
- Thé et café sans sucre autorisés
- Attention à l'alcool (avec modération et jamais à jeun)

## Compléments et vitamines
Consultez votre médecin avant de prendre :
- Vitamine D (souvent carencée)
- Magnésium
- Oméga-3
- Chrome (controverse scientifique)

## Conclusion
Une alimentation adaptée au diabète n'est pas restrictive mais équilibrée. Elle permet de profiter des plaisirs de la table tout en maintenant une glycémie stable. N'hésitez pas à consulter un nutritionniste spécialisé pour un plan personnalisé.`,
      author: `Dr. Marie Dubois, ${t('blogScreen.article.id7.authorTitle')}`,
      date: '2024-01-20',
      source: 'Guide DARE',
      bgColor: 'bg-green-100',
      trending: true,
    },
    {
      id: 8,
      image: '📚',
      category: t('blogScreen.article.id8.category'),
      readTime: '20 min',
      title: t('blogScreen.article.id8.title'),
      excerpt: t('blogScreen.article.id8.excerpt'),
      content: `# Guide complet sur le diabète de type 1 et type 2

## Qu'est-ce que le diabète ?

Le diabète est une maladie chronique caractérisée par une hyperglycémie (taux de sucre élevé dans le sang) due à un défaut de sécrétion ou d'action de l'insuline. Il existe plusieurs types de diabète, mais les plus fréquents sont les types 1 et 2.

## Diabète de type 1

### Définition
Le diabète de type 1 est une maladie auto-immune où le système immunitaire détruit les cellules bêta du pancréas qui produisent l'insuline. Il représente 5-10% des cas de diabète.

### Caractéristiques
- **Début** : Généralement avant 30 ans, souvent dans l'enfance
- **Évolution** : Rapide, en quelques semaines ou mois
- **Hérédité** : Faible composante génétique (3-5% de risque familial)
- **Poids** : Souvent poids normal ou maigreur

### Symptômes
Les "4P" classiques :
- **Polyurie** : urines abondantes et fréquentes
- **Polydipsie** : soif intense
- **Polyphagie** : faim excessive
- **Perte de poids** rapide et inexpliquée

Autres symptômes :
- Fatigue extrême
- Vision floue
- Infections récurrentes
- Haleine fruitée (cétose)

### Diagnostic
- **Glycémie à jeun** ≥ 1,26 g/L (7 mmol/L) à deux reprises
- **Glycémie aléatoire** ≥ 2 g/L (11,1 mmol/L) avec symptômes
- **HbA1c** ≥ 6,5% (48 mmol/mol)
- **Test de tolérance au glucose** : glycémie ≥ 2 g/L à 2h

### Traitement
**Insulinothérapie obligatoire** :
- Insuline basale (lente) : couvre les besoins de base
- Insuline prandiale (rapide) : couvre les repas
- Schémas possibles : stylos, pompe à insuline

**Surveillance** :
- Glycémie 4-6 fois/jour minimum
- HbA1c tous les 3 mois (objectif < 7%)
- Surveillance des complications

## Diabète de type 2

### Définition
Le diabète de type 2 résulte d'une résistance à l'insuline et/ou d'un déficit de sécrétion insulinique. Il représente 90-95% des cas de diabète.

### Caractéristiques
- **Début** : Généralement après 40 ans (de plus en plus jeune)
- **Évolution** : Progressive, souvent asymptomatique au début
- **Hérédité** : Forte composante génétique (30-40% de risque familial)
- **Poids** : Souvent surpoids ou obésité (80% des cas)

### Facteurs de risque
- Âge > 45 ans
- Surpoids/obésité (IMC > 25)
- Antécédents familiaux de diabète
- Sédentarité
- Hypertension artérielle
- Dyslipidémie
- Antécédent de diabète gestationnel
- Syndrome des ovaires polykystiques (SOPK)
- Origine ethnique (africaine, hispanique, asiatique)

### Symptômes
Souvent asymptomatique au début, puis :
- Fatigue
- Soif modérée
- Urines fréquentes
- Infections récurrentes (mycoses, cystites)
- Cicatrisation lente
- Vision floue

### Diagnostic
Mêmes critères que le type 1, mais évolution plus lente.

### Traitements

**1. Mesures hygiéno-diététiques (première ligne)**
- Perte de poids (5-10% du poids initial)
- Alimentation équilibrée
- Activité physique régulière (150 min/semaine)
- Arrêt du tabac

**2. Médicaments oraux**
- **Metformine** : première intention, diminue la production hépatique de glucose
- **Sulfamides hypoglycémiants** : stimulent la sécrétion d'insuline
- **Glinides** : stimulation rapide de l'insuline
- **Inhibiteurs des alpha-glucosidases** : ralentissent l'absorption des glucides
- **Glitazones** : améliorent la sensibilité à l'insuline
- **Inhibiteurs DPP-4** : augmentent l'insuline et diminuent le glucagon
- **Agonistes du GLP-1** : injectables, effet sur la satiété

**3. Insuline (si échec des autres traitements)**

## Complications communes

### Complications aiguës
**Hypoglycémie** (< 0,70 g/L) :
- Symptômes : tremblements, sueurs, palpitations, confusion
- Traitement : 15g de glucides rapides (3 morceaux de sucre)

**Hyperglycémie sévère** :
- Type 1 : acidocétose diabétique (urgence)
- Type 2 : coma hyperosmolaire (urgence)

### Complications chroniques
**Microvasculaires** :
- **Rétinopathie** : atteinte des vaisseaux de la rétine
- **Néphropathie** : atteinte des reins
- **Neuropathie** : atteinte des nerfs (pieds, mains)

**Macrovasculaires** :
- Infarctus du myocarde (risque x2-4)
- Accident vasculaire cérébral
- Artérite des membres inférieurs

**Autres** :
- Pied diabétique
- Infections récurrentes
- Troubles de l'érection

## Prévention des complications

### Contrôle glycémique
- **Objectif HbA1c** : < 7% (personnalisable selon l'âge et les comorbidités)
- **Autosurveillance** régulière
- **Adaptation thérapeutique** selon les résultats

### Contrôle des facteurs de risque cardiovasculaire
- **Tension artérielle** : < 140/90 mmHg (< 130/80 si possible)
- **Cholestérol** : LDL < 1g/L (< 0,7g/L si haut risque)
- **Arrêt du tabac** impératif

### Surveillance régulière
- **Ophtalmologique** : fond d'œil annuel
- **Néphrologique** : créatinine et microalbuminurie annuelles
- **Podologique** : examen des pieds régulier
- **Cardiologique** : ECG, échodoppler si nécessaire

## Vivre avec le diabète

### Au quotidien
- **Alimentation** : équilibrée, régulière, adaptée
- **Activité physique** : 30 min/jour minimum
- **Gestion du stress** : techniques de relaxation
- **Sommeil** : 7-8h/nuit, qualité importante

### Situations particulières
- **Voyage** : prévoir médicaments, ordonnances
- **Maladie** : surveillance renforcée, adaptation traitement
- **Grossesse** : suivi spécialisé, objectifs glycémiques stricts
- **Sport** : adaptation insuline/alimentation selon l'effort

### Éducation thérapeutique
- Programmes d'éducation en groupe ou individuels
- Apprentissage de l'autogestion
- Soutien psychologique si nécessaire
- Associations de patients

## Innovations et perspectives

### Technologies
- **Capteurs de glucose continu** : surveillance sans piqûres
- **Pompes à insuline** intelligentes
- **Pancréas artificiel** : en développement
- **Applications mobiles** : aide à la gestion

### Recherche
- **Thérapies cellulaires** : transplantation d'îlots, cellules souches
- **Immunothérapies** : prévention du type 1
- **Médicaments innovants** : nouvelles classes thérapeutiques

## Conclusion

Le diabète est une maladie complexe mais gérable. Une prise en charge précoce et adaptée, associée à une bonne hygiène de vie, permet de prévenir les complications et de maintenir une qualité de vie optimale. L'éducation du patient et le soutien de l'équipe soignante sont essentiels pour une gestion réussie à long terme.

N'hésitez jamais à poser des questions à votre équipe médicale et à participer activement à votre prise en charge.`,
      author: `Dr. Pierre Martin, ${t('blogScreen.article.id8.authorTitle')}`,
      date: '2024-01-18',
      source: 'Guide DARE',
      bgColor: 'bg-blue-100',
      trending: true,
    },
    {
      id: 1,
      image: '🧬',
      category: t('blogScreen.article.id1.category'),
      readTime: '6 min',
      title: t('blogScreen.article.id1.title'),
      excerpt: t('blogScreen.article.id1.excerpt'),
      content: `Une percée médicale majeure vient d'être annoncée : le traitement Zimislecel, une thérapie par cellules souches, a permis à 83% des patients atteints de diabète de type 1 sévère d'arrêter complètement leurs injections d'insuline après une seule perfusion.

L'étude, publiée ce mois-ci, a suivi 12 volontaires pendant un an. Dix d'entre eux n'ont plus eu besoin d'insuline, tandis que les deux autres ont pu réduire drastiquement leurs doses. Aucun épisode d'hypoglycémie sévère n'a été rapporté.

"C'est révolutionnaire", explique le Dr. Jennifer Martinez, investigatrice principale. "Nous assistons potentiellement à la fin de l'ère des injections quotidiennes d'insuline pour ces patients."

Le traitement utilise des cellules souches manipulées pour devenir des cellules d'îlots pancréatiques, responsables de la production d'insuline. Cette approche représente l'aboutissement de décennies de recherche sur la médecine régénérative.

La FDA examine actuellement ce traitement pour une approbation accélérée, ce qui pourrait révolutionner la prise en charge du diabète de type 1 dès 2026.`,
      author: 'Dr. Jennifer Martinez',
      date: '2025-08-20',
      source: 'Nature Medicine',
      bgColor: 'bg-purple-100',
      trending: true,
    },
    {
      id: 2,
      image: '🩹',
      category: t('blogScreen.article.id2.category'),
      readTime: '5 min',
      title: t('blogScreen.article.id2.title'),
      excerpt: t('blogScreen.article.id2.excerpt'),
      content: `Une innovation majeure dans le traitement des plaies diabétiques vient d'être dévoilée : un gel "intelligent" qui combine des vésicules cicatrisantes microscopiques avec un hydrogel spécialisé, restaurant la circulation sanguine et accélérant la guérison de façon spectaculaire.

Cette thérapie révolutionnaire, développée par une équipe internationale, utilise des messagers de guérison encapsulés dans des nanovésicules qui se libèrent progressivement au contact de la plaie. Le gel stimule la formation de nouveaux vaisseaux sanguins tout en protégeant la zone blessée.

Les résultats des tests cliniques sont impressionnants :
- Guérison 5 fois plus rapide que les traitements conventionnels
- Restauration complète de la circulation sanguine en 72h
- Réduction de 85% du risque d'amputation
- Aucun effet secondaire majeur reporté

"Cette technologie va sauver des milliers de membres chaque année", déclare le Dr. Sarah Chen, dermatologue spécialisée. "Nous passons de semaines de traitement à quelques jours seulement."

Le gel sera disponible dans les hôpitaux européens dès septembre 2025, après validation réglementaire.`,
      author: 'Dr. Sarah Chen',
      date: '2025-08-15',
      source: 'Burns & Trauma Journal',
      bgColor: 'bg-orange-100',
      trending: true,
    },
    {
      id: 3,
      image: '🔬',
      category: t('blogScreen.article.id3.category'),
      readTime: '7 min',
      title: t('blogScreen.article.id3.title'),
      excerpt: t('blogScreen.article.id3.excerpt'),
      content: `Une percée historique vient d'être réalisée : pour la première fois au monde, des chercheurs ont réussi à transplanter des cellules d'îlots pancréatiques génétiquement modifiées chez un patient diabétique de type 1, sans avoir recours à des médicaments immunosuppresseurs.

Cette étude de phase 1, menée sur un seul participant, a montré des résultats prometteurs après 12 semaines. Les îlots transplantés continuent de produire de l'insuline de manière stable, sans rejet par le système immunitaire.

L'innovation clé réside dans l'édition génétique des cellules donneuses :
- Modification des marqueurs de surface cellulaire
- Invisibilité aux cellules immunitaires du receveur
- Production d'insuline maintenue sans immunosuppression
- Aucune complication post-opératoire

"C'est un tournant dans la transplantation", explique le Dr. Michael Rodriguez, chirurgien transplanteur. "Nous éliminons les risques liés aux immunosuppresseurs tout en restaurant la fonction pancréatique."

Cette approche pourrait révolutionner le traitement du diabète de type 1, offrant une alternative durable aux injections d'insuline sans les complications des thérapies immunosuppressives traditionnelles.

Les prochaines phases incluront davantage de participants pour confirmer l'efficacité à long terme.`,
      author: 'Dr. Michael Rodriguez',
      date: '2025-08-10',
      source: 'The Lancet',
      bgColor: 'bg-teal-100',
      trending: true,
    },
    {
      id: 4,
      image: '💊',
      category: t('blogScreen.article.id4.category'),
      readTime: '7 min',
      title: t('blogScreen.article.id4.title'),
      excerpt: t('blogScreen.article.id1.excerpt'),
      content: `Une équipe internationale de chercheurs a développé une "insuline intelligente" capable de s'adapter automatiquement aux variations de glucose sanguin. Cette innovation pourrait révolutionner le traitement du diabète en éliminant les risques d'hypoglycémie.

Le principe repose sur des nanoparticules qui libèrent l'insuline uniquement en présence de glucose élevé. Les premiers essais cliniques sur 45 patients diabétiques de type 1 montrent des résultats exceptionnels :

- Réduction de 75% des épisodes d'hypoglycémie
- Temps dans la cible glycémique augmenté à 95%
- Simplification drastique du traitement (une injection par semaine)

"C'est le Saint Graal du traitement diabétique", explique le Dr. Li Wei, responsable de l'étude. "Cette insuline 'pense' à la place du patient."

La commercialisation pourrait débuter dès 2026 après validation des essais de phase III.`,
      author: 'Dr. Li Wei',
      date: '2024-01-08',
      source: 'The Lancet',
      bgColor: 'bg-orange-100',
      trending: true,
    },
    {
      id: 5,
      image: '👥',
      category: t('blogScreen.article.id5.category'),
      readTime: '4 min',
      title: t('blogScreen.article.id5.title'),
      excerpt: t('blogScreen.article.id5.excerpt'),
      content: `À 65 ans et diabétique depuis 30 ans, James Thompson a réalisé l'exploit de terminer le prestigieux marathon de Boston en 3h42min. Son parcours inspire désormais des milliers de personnes à travers le monde.

"Quand on m'a diagnostiqué le diabète à 35 ans, je pensais que ma vie sportive était finie", confie James. "J'avais tort. Le diabète n'est pas une limite, c'est un défi à relever."

Sa routine d'entraînement inclut :
- Surveillance glycémique toutes les 30 minutes pendant l'effort
- Stratégie nutritionnelle adaptée avec son endocrinologue
- Entraînement progressif sur 18 mois
- Équipe de soutien médical pendant la course

"James prouve que le diabète bien géré n'empêche aucun rêve", déclare son médecin. Son histoire fait désormais l'objet d'un documentaire et d'un livre à paraître.

Il prépare maintenant l'Ironman de Hawaï pour ses 66 ans.`,
      author: 'Reporter Sport',
      date: '2024-01-05',
      source: 'Diabetes Today',
      bgColor: 'bg-yellow-100',
      trending: false,
    },
    {
      id: 6,
      image: '📱',
      category: t('blogScreen.article.id6.category'),
      readTime: '6 min',
      title: t('blogScreen.article.id6.title'),
      excerpt: t('blogScreen.article.id6.excerpt'),
      content: `L'intelligence artificielle médicale franchit un nouveau cap en 2025 : la dernière version de l'algorithme prédictif développé conjointement par Google Health et l'Université de Stanford atteint une précision de 97% dans la prévention des hypoglycémies, avec des alertes jusqu'à 45 minutes à l'avance.

Cette IA de nouvelle génération analyse désormais plus de 150 biomarqueurs en temps réel :
- Micro-variations glycémiques via capteurs ultra-sensibles
- Analyse vocale et reconnaissance d'émotions
- Patterns de sommeil et stress physiologique
- Données météorologiques et activité géolocalisée
- Historique alimentaire via reconnaissance d'images

Déployée sur 15,000 patients dans 12 pays, l'IA montre des résultats exceptionnels :
- 97% de précision prédictive (vs 94% en 2024)
- Réduction de 82% des hypoglycémies sévères
- Prédictions jusqu'à 45 minutes à l'avance
- Intégration native avec tous les capteurs glucose

"Nous entrons dans l'ère de la prévention totale", déclare le Dr. Lisa Wang, directrice de Google Health Diabetes. "L'hypoglycémie sévère devient un événement évitable."

L'application DARE AI sera la première à intégrer cette technologie dès septembre 2025, avec certification CE et FDA approuvée.`,
      author: 'Dr. Lisa Wang',
      date: '2025-08-18',
      source: 'Google Health Research',
      bgColor: 'bg-indigo-100',
      trending: true,
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory =
      activeCategory === t('blog.categories.all') ||
      activeCategory === 'Tous' ||
      article.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Header DARE News */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Globe className="w-6 h-6 text-medical-teal" />
          <span className="text-medical-teal">DARE</span> News
        </h1>
        <p className="text-muted-foreground">
          Actualités internationales sur le diabète
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher des actualités..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres catégories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {filteredArticles.map(article => (
          <Card
            key={article.id}
            className="border-l-4 border-l-medical-teal overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-16 h-16 rounded-lg ${article.bgColor} flex items-center justify-center text-2xl relative`}
                >
                  {article.image}
                  {article.trending && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </Badge>
                    {article.trending && (
                      <Badge className="text-xs bg-red-500 text-white flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Tendance
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-foreground leading-tight">
                    {article.title}
                  </h3>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="space-y-1">
                  <div>Par {article.author}</div>
                  <div>
                    {article.date} • {article.source}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-medical-teal hover:bg-medical-teal/90"
                  onClick={() => setSelectedArticle(article)}
                >
                  {t('blogScreen.button')}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal pour afficher l'article complet */}
      <Modal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxH="80vh" overflowY="auto">
          {selectedArticle && (
            <>
              <ModalHeader>
                <Flex align="center" gap={2} mb={2}>
                  <Badge colorScheme="gray" fontSize="0.7rem">
                    {selectedArticle.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    fontSize="0.7rem"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Clock className="w-3 h-3" />
                    {selectedArticle.readTime}
                  </Badge>
                  {selectedArticle.trending && (
                    <Badge
                      colorScheme="red"
                      fontSize="0.7rem"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <TrendingUp className="w-3 h-3" />
                      Tendance
                    </Badge>
                  )}
                </Flex>

                <Text fontSize="xl" fontWeight="bold" lineHeight="short">
                  {selectedArticle.title}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Par {selectedArticle.author} • {selectedArticle.date} •{" "}
                  {selectedArticle.source}
                </Text>
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <Box
                  w="20"
                  h="20"
                  borderRadius="lg"
                  bg={selectedArticle.bgColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="3xl"
                  mx="auto"
                  mb={4}
                >
                  {selectedArticle.image}
                </Box>

                <Box>
                  {selectedArticle.content
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <Text
                        key={index}
                        mb={4}
                        color="gray.800"
                        lineHeight="tall"
                        fontSize="sm"
                      >
                        {paragraph}
                      </Text>
                    ))}
                </Box>
              </ModalBody>

              <ModalFooter gap={2} borderTop="1px solid" borderColor="gray.200">
                <Button
                  variant="outline"
                  size="sm"
                  flex="1"
                  leftIcon={<Bookmark className="w-4 h-4" />}
                >
                  Sauvegarder
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  flex="1"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Source complète
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Sources et disclaimer */}
      <Card className="bg-gradient-to-r from-medical-teal/5 to-medical-teal/10 border-medical-teal/20">
        <CardContent className="p-4 text-center">
          <Heart className="w-8 h-8 text-medical-teal mx-auto mb-2" />
          <h3 className="font-semibold text-foreground mb-1">
            {t('blogScreen.sources.title')}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {t('blogScreen.sources.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span>Nature Medicine</span> • <span>The Lancet</span> •{' '}
            <span>WHO</span> • <span>ADA</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogScreen;
