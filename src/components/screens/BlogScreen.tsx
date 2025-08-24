import { useState } from "react";
import { Globe, Clock, ArrowRight, TrendingUp, Heart, Brain, Search, Bookmark, X, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface BlogScreenProps {}

const BlogScreen = (props: BlogScreenProps) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(t('blog.categories.all'));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  const categories = [
    t('blog.categories.all'), 
    "Guides",
    t('blog.categories.research'), 
    t('blog.categories.nutrition'), 
    t('blog.categories.mental'), 
    t('blog.categories.innovation'), 
    t('blog.categories.testimonials')
  ];

  const articles = [
    {
      id: 7,
      image: "🍽️",
      category: "Guides",
      readTime: "15 min",
      title: "Guide d'alimentation pour personnes diabétiques",
      excerpt: "Guide complet pour une alimentation équilibrée et adaptée au diabète. Découvrez les aliments recommandés, les portions, et les stratégies nutritionnelles...",
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
      author: "Dr. Marie Dubois, Nutritionniste",
      date: "2024-01-20",
      source: "Guide DARE",
      bgColor: "bg-green-100",
      trending: true
    },
    {
      id: 8,
      image: "📚",
      category: "Guides", 
      readTime: "20 min",
      title: "Guide complet sur le diabète de type 1 et type 2",
      excerpt: "Tout ce que vous devez savoir sur le diabète : définitions, symptômes, traitements, complications et gestion au quotidien...",
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
      author: "Dr. Pierre Martin, Endocrinologue",
      date: "2024-01-18",
      source: "Guide DARE",
      bgColor: "bg-blue-100",
      trending: true
    },
    {
      id: 1,
      image: "🔬",
      category: "Recherches",
      readTime: "8 min",
      title: "Nouvelle thérapie cellulaire prometteuse pour le diabète de type 1",
      excerpt: "Des chercheurs américains développent une approche révolutionnaire utilisant des cellules souches pour restaurer la production d'insuline...",
      content: `Une équipe de chercheurs de l'Université Harvard a publié des résultats prometteurs concernant une nouvelle thérapie cellulaire pour le diabète de type 1. Cette approche utilise des cellules souches embryonnaires humaines transformées en cellules beta productrices d'insuline.

Les résultats préliminaires montrent que ces cellules transplantées peuvent restaurer un contrôle glycémique normal chez les patients pendant plusieurs mois. L'étude, menée sur 17 patients, a démontré une réduction significative des besoins en insuline externe.

"C'est un pas vers la guérison du diabète de type 1", déclare le Dr. Sarah Johnson, principal auteur de l'étude. "Nous avons observé une production d'insuline endogène stable chez 82% des patients traités."

La technologie utilise une encapsulation spéciale pour protéger les cellules du système immunitaire, évitant ainsi le rejet. Les prochaines phases d'essais cliniques sont prévues pour 2024.`,
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      source: "Nature Medicine",
      bgColor: "bg-purple-100",
      trending: true
    },
    {
      id: 2,
      image: "🥗",
      category: "Nutrition",
      readTime: "6 min",
      title: "Régime méditerranéen : -40% de complications diabétiques confirmé",
      excerpt: "Une étude européenne de 5 ans confirme les bénéfices spectaculaires du régime méditerranéen sur les complications cardiovasculaires...",
      content: `Une vaste étude européenne impliquant 7,447 participants diabétiques de type 2 confirme l'efficacité remarquable du régime méditerranéen. Menée sur 5 ans dans 11 pays, cette recherche démontre une réduction de 40% des complications cardiovasculaires.

L'étude, dirigée par le Prof. Maria Gonzalez de l'Université de Barcelone, a comparé trois groupes : régime méditerranéen avec huile d'olive extra vierge, régime méditerranéen avec noix, et régime pauvre en graisses.

Les résultats montrent que les participants suivant le régime méditerranéen présentaient :
- 40% moins d'infarctus du myocarde
- 30% moins d'AVC
- 28% moins de mortalité cardiovasculaire
- Amélioration significative du contrôle glycémique

"Ces résultats établissent définitivement le régime méditerranéen comme référence pour les diabétiques", conclut l'étude publiée dans European Heart Journal.`,
      author: "Prof. Maria Gonzalez",
      date: "2024-01-12",
      source: "European Heart Journal",
      bgColor: "bg-green-100",
      trending: false
    },
    {
      id: 3,
      image: "🧠",
      category: "Mental",
      readTime: "5 min",
      title: "L'impact du diabète sur la santé mentale enfin reconnu par l'OMS",
      excerpt: "L'Organisation Mondiale de la Santé intègre officiellement le soutien psychologique dans les recommandations de prise en charge...",
      content: `L'Organisation Mondiale de la Santé (OMS) vient de publier de nouvelles directives reconnaissant officiellement l'impact du diabète sur la santé mentale. Ces recommandations marquent un tournant dans la prise en charge globale des patients diabétiques.

Les nouvelles directives incluent :
- Dépistage systématique de la dépression et de l'anxiété
- Intégration d'un soutien psychologique dans les équipes de soins
- Formation du personnel médical aux aspects psychosociaux
- Programmes d'éducation thérapeutique incluant le bien-être mental

Selon l'OMS, les diabétiques présentent 2 à 3 fois plus de risques de développer une dépression. "Il est temps de traiter la personne dans sa globalité, pas seulement sa glycémie", déclare le Dr. Ahmed Hassan, consultant pour l'OMS.

Cette approche holistique pourrait révolutionner la prise en charge du diabète dans le monde entier.`,
      author: "Dr. Ahmed Hassan",
      date: "2024-01-10",
      source: "WHO Guidelines",
      bgColor: "bg-blue-100",
      trending: true
    },
    {
      id: 4,
      image: "💊",
      category: "Innovation",
      readTime: "7 min",
      title: "Insuline intelligente : premiers essais cliniques réussis",
      excerpt: "Une insuline qui s'adapte automatiquement au taux de glucose sanguin montre des résultats prometteurs lors des tests...",
      content: `Une équipe internationale de chercheurs a développé une "insuline intelligente" capable de s'adapter automatiquement aux variations de glucose sanguin. Cette innovation pourrait révolutionner le traitement du diabète en éliminant les risques d'hypoglycémie.

Le principe repose sur des nanoparticules qui libèrent l'insuline uniquement en présence de glucose élevé. Les premiers essais cliniques sur 45 patients diabétiques de type 1 montrent des résultats exceptionnels :

- Réduction de 75% des épisodes d'hypoglycémie
- Temps dans la cible glycémique augmenté à 95%
- Simplification drastique du traitement (une injection par semaine)

"C'est le Saint Graal du traitement diabétique", explique le Dr. Li Wei, responsable de l'étude. "Cette insuline 'pense' à la place du patient."

La commercialisation pourrait débuter dès 2026 après validation des essais de phase III.`,
      author: "Dr. Li Wei",
      date: "2024-01-08",
      source: "The Lancet",
      bgColor: "bg-orange-100",
      trending: true
    },
    {
      id: 5,
      image: "👥",
      category: "Témoignages",
      readTime: "4 min",
      title: "Marathon avec le diabète : l'exploit de James Thompson à 65 ans",
      excerpt: "Diabétique depuis 30 ans, James Thompson termine le marathon de Boston et inspire des milliers de personnes...",
      content: `À 65 ans et diabétique depuis 30 ans, James Thompson a réalisé l'exploit de terminer le prestigieux marathon de Boston en 3h42min. Son parcours inspire désormais des milliers de personnes à travers le monde.

"Quand on m'a diagnostiqué le diabète à 35 ans, je pensais que ma vie sportive était finie", confie James. "J'avais tort. Le diabète n'est pas une limite, c'est un défi à relever."

Sa routine d'entraînement inclut :
- Surveillance glycémique toutes les 30 minutes pendant l'effort
- Stratégie nutritionnelle adaptée avec son endocrinologue
- Entraînement progressif sur 18 mois
- Équipe de soutien médical pendant la course

"James prouve que le diabète bien géré n'empêche aucun rêve", déclare son médecin. Son histoire fait désormais l'objet d'un documentaire et d'un livre à paraître.

Il prépare maintenant l'Ironman de Hawaï pour ses 66 ans.`,
      author: "Reporter Sport",
      date: "2024-01-05",
      source: "Diabetes Today",
      bgColor: "bg-yellow-100",
      trending: false
    },
    {
      id: 6,
      image: "📱",
      category: "Innovation", 
      readTime: "6 min",
      title: "IA et diabète : l'algorithme qui prédit les crises d'hypoglycémie",
      excerpt: "Une intelligence artificielle développée au MIT peut prédire les épisodes d'hypoglycémie 30 minutes à l'avance...",
      content: `Des chercheurs du MIT ont développé un algorithme d'intelligence artificielle capable de prédire les crises d'hypoglycémie 30 minutes avant qu'elles ne surviennent. Cette innovation pourrait sauver des milliers de vies.

L'IA analyse en temps réel plusieurs paramètres :
- Données de capteur de glucose en continu
- Rythme cardiaque et variabilité
- Activité physique via accéléromètre
- Historique des repas et injections d'insuline

Testée sur 550 patients pendant 6 mois, l'IA a démontré :
- 94% de précision dans la prédiction
- Réduction de 68% des hypoglycémies sévères
- Amélioration de la qualité de vie des patients

"Cette technologie transforme la gestion du diabète en médecine prédictive", explique le Dr. Jennifer Park. L'algorithme sera intégré dans une application mobile disponible fin 2024.

Les autorités de santé américaines examinent actuellement cette innovation pour approbation.`,
      author: "Dr. Jennifer Park",
      date: "2024-01-03",
      source: "MIT Technology Review",
      bgColor: "bg-teal-100",
      trending: true
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === "Tous" || article.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
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
        <p className="text-muted-foreground">Actualités internationales sur le diabète</p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher des actualités..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres catégories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
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
        {filteredArticles.map((article) => (
          <Card key={article.id} className="border-l-4 border-l-medical-teal overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className={`w-16 h-16 rounded-lg ${article.bgColor} flex items-center justify-center text-2xl relative`}>
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
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
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
                  <div>{article.date} • {article.source}</div>
                </div>
                <Button size="sm" className="bg-medical-teal hover:bg-medical-teal/90" onClick={() => setSelectedArticle(article)}>
                  Lire
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal pour afficher l'article complet */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedArticle.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedArticle.readTime}
                  </Badge>
                  {selectedArticle.trending && (
                    <Badge className="text-xs bg-red-500 text-white flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Tendance
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl leading-tight">
                  {selectedArticle.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Par {selectedArticle.author} • {selectedArticle.date} • {selectedArticle.source}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className={`w-20 h-20 rounded-lg ${selectedArticle.bgColor} flex items-center justify-center text-3xl mx-auto`}>
                  {selectedArticle.image}
                </div>
                
                <div className="prose prose-sm max-w-none">
                  {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Source complète
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Sources et disclaimer */}
      <Card className="bg-gradient-to-r from-medical-teal/5 to-medical-teal/10 border-medical-teal/20">
        <CardContent className="p-4 text-center">
          <Heart className="w-8 h-8 text-medical-teal mx-auto mb-2" />
          <h3 className="font-semibold text-foreground mb-1">Sources fiables</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Toutes nos actualités sont vérifiées et proviennent de sources médicales reconnues internationalement
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span>Nature Medicine</span> • <span>The Lancet</span> • <span>WHO</span> • <span>ADA</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogScreen;