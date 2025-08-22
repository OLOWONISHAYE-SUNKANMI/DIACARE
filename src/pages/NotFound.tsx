import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const suggestedLinks = [
    { label: "Tableau de bord", path: "/", icon: Home },
    { label: "Suivi glycémie", path: "/?tab=charts", icon: Search },
    { label: "Rappels médicaments", path: "/?tab=reminders", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-light via-background to-medical-green-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-gradient-medical rounded-full mb-4 flex items-center justify-center shadow-lg">
            <span className="text-4xl text-primary-foreground">404</span>
          </div>
          <CardTitle className="text-2xl text-foreground">Page introuvable</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Suggestions :</p>
            <div className="grid gap-2">
              {suggestedLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button variant="outline" className="w-full justify-start">
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Link to="/" className="flex-1">
              <Button className="w-full bg-medical-teal hover:bg-medical-teal/90">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground border-t pt-4">
            💪 DARE - Votre compagnon diabète
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;