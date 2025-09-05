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
} from '@chakra-ui/react';

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
      content: t('blogScreenRead.nutrition_guide_content_one'),
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
      content: t('blogScreenRead.nutrition_guide_content_two'),
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
      content: t('blogScreenRead.nutrition_guide_content_three'),
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
      content: t('blogScreenRead.nutrition_guide_content_four'),
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
      content: t('blogScreenRead.nutrition_guide_content_five'),
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
      content: t('blogScreenRead.nutrition_guide_content_six'),
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
      content: t('blogScreenRead.nutrition_guide_content_seven'),
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
      content: t('blogScreenRead.nutrition_guide_content_eight'),
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
          {t('blogScreenFixes.title_diabetesNews')}
        </p>
      </div>

      {/* Barre de recherche */}
      {/* Search bar */}
      <div className="flex items-center max-w-md w-full mx-auto rounded-md border bg-white px-3">
        <Search className="text-muted-foreground w-4 h-4 mr-2 shrink-0" />
        <Input
          placeholder="Rechercher des actualités..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm md:text-base"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto md:overflow-visible pb-2 scrollbar-hide">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="whitespace-nowrap text-xs md:text-sm"
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
                  <Badge bg="gray.200" color="gray.800" fontSize="0.7rem">
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
                  Par {selectedArticle.author} • {selectedArticle.date} •{' '}
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
                    .split('\n\n')
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
