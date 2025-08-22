import { useState } from "react";
import { Globe, Clock, ArrowRight, TrendingUp, Heart, Brain, Search, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlogScreenProps {}

const BlogScreen = (props: BlogScreenProps) => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Tous", "Recherches", "Nutrition", "Mental", "Innovation", "Témoignages"];

  const articles = [
    {
      id: 1,
      image: "🔬",
      category: "Recherches",
      readTime: "8 min",
      title: "Nouvelle thérapie cellulaire prometteuse pour le diabète de type 1",
      excerpt: "Des chercheurs américains développent une approche révolutionnaire utilisant des cellules souches pour restaurer la production d'insuline...",
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
                <Button size="sm" className="bg-medical-teal hover:bg-medical-teal/90">
                  Lire
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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