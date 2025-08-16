import { useState } from "react";
import { BookOpen, Clock, ArrowRight, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogScreenProps {}

const BlogScreen = (props: BlogScreenProps) => {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const categories = ["Tous", "Lifestyle", "Nutrition", "Médical", "Témoignage"];

  const articles = [
    {
      id: 1,
      image: "🌍",
      category: "Lifestyle",
      readTime: "5 min",
      title: "OSER Gérer le Diabète au Sahel",
      excerpt: "Découvrez comment adapter votre traitement aux défis climatiques et sociaux de l'Afrique de l'Ouest...",
      author: "Dr. Aminata Traoré",
      bgColor: "bg-orange-100"
    },
    {
      id: 2,
      image: "🍲",
      category: "Nutrition",
      readTime: "8 min",
      title: "DARE Cuisiner : Thiéboudienne Healthy",
      excerpt: "Réinventez le plat national sénégalais avec des ingrédients qui respectent votre glycémie...",
      author: "Chef Mariam Diop",
      bgColor: "bg-green-100"
    },
    {
      id: 3,
      image: "💪",
      category: "Témoignage",
      readTime: "6 min",
      title: "J'ai OSÉ Reprendre Ma Vie en Main à Douala",
      excerpt: "Témoignage émouvant de Jean-Claude, 45 ans, qui a transformé sa relation avec le diabète...",
      author: "Jean-Claude Mbeki",
      bgColor: "bg-blue-100"
    },
    {
      id: 4,
      image: "🏥",
      category: "Médical",
      readTime: "10 min",
      title: "DARE Comprendre : Insuline et Climat Tropical",
      excerpt: "Guide pratique pour conserver et utiliser votre insuline dans les conditions africaines...",
      author: "Dr. Mamadou Sy",
      bgColor: "bg-purple-100"
    },
    {
      id: 5,
      image: "🌿",
      category: "Lifestyle",
      readTime: "7 min",
      title: "OSER l'Activité Physique à Lagos",
      excerpt: "Conseils pratiques pour maintenir une routine sportive dans une mégalopole africaine...",
      author: "Coach Folake Adeyemi",
      bgColor: "bg-teal-100"
    }
  ];

  const filteredArticles = activeCategory === "Tous" 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          📚 Blog DARE
        </h1>
        <p className="text-muted-foreground">Bien vivre avec le diabète</p>
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
                <div className={`w-16 h-16 rounded-lg ${article.bgColor} flex items-center justify-center text-2xl`}>
                  {article.image}
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
                  </div>
                  <h3 className="font-bold text-foreground leading-tight">
                    {article.title}
                  </h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Par {article.author}
                </span>
                <Button size="sm" className="bg-medical-teal hover:bg-medical-teal/90">
                  Lire
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suggestion d'articles */}
      <Card className="bg-gradient-to-r from-medical-teal/5 to-medical-teal/10 border-medical-teal/20">
        <CardContent className="p-4 text-center">
          <BookOpen className="w-8 h-8 text-medical-teal mx-auto mb-2" />
          <h3 className="font-semibold text-foreground mb-1">Envie de plus ?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Découvrez notre collection complète d'articles DARE
          </p>
          <Button variant="outline" size="sm">
            Voir tous les articles
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogScreen;