import { useState, useEffect } from 'react';
import {
  Globe,
  Clock,
  ArrowRight,
  Bookmark,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
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
  Button,
} from '@chakra-ui/react';

interface Article {
  article_id: string;
  title: string;
  description: string;
  link: string;
  source_id: string;
  source_name?: string;
  pubDate: string;
  category?: string[];
  image_url?: string;
  creator?: string[];
}

const BlogScreen = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Guides',
    'Research',
    'Nutrition',
    'Mental',
    'Innovation',
    'Testimonials',
  ];

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://newsdata.io/api/1/news', {
        params: {
          apikey: 'pub_7dffc189822e41949c5064e4c9cf4d0b',
          q: 'diabetes',
          language: 'en',
          category: 'health',
        },
      });
      if (res.data?.results) {
        setArticles(res.data.results);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filtered = articles.filter(article => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description &&
        article.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === 'All' ||
      (activeCategory === 'Research' &&
        /research|study|trial|scientists?/i.test(article.title)) ||
      (activeCategory === 'Nutrition' &&
        /diet|nutrition|food|meal/i.test(article.title)) ||
      (activeCategory === 'Mental' &&
        /mental|stress|mind|psychology/i.test(article.title)) ||
      (activeCategory === 'Innovation' &&
        /technology|innovation|app|device|AI/i.test(article.title)) ||
      (activeCategory === 'Guides' &&
        /guide|tips|how to|advice/i.test(article.title)) ||
      (activeCategory === 'Testimonials' &&
        /patient|story|experience|testimony/i.test(article.title));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Globe className="w-6 h-6 text-medical-teal" /> DARE News
        </h1>
        <p className="text-muted-foreground">
          {t('blogScreenFixes.title_diabetesNews')}
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center max-w-md mx-auto border bg-white px-3 rounded-md">
        <Search className="w-4 h-4 mr-2 text-muted-foreground" />
        <Input
          placeholder="Search news..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-0 focus:ring-0 text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
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
        {loading && (
          <p className="text-center text-muted-foreground">Loading news...</p>
        )}

        {!loading &&
          filtered.map(article => (
            <Card
              key={article.article_id}
              className="border-l-4 border-l-medical-teal hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-2 flex gap-3">
                {/* Thumbnail */}
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {article.description || 'No summary available.'}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      {new Date(article.pubDate).toLocaleDateString()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {article.source_id}
                    </Badge>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant="ghost"
                  size="icon"
                  width={'max-content'}
                  className="p-3 ml-2 text-medical-teal hover:bg-medical-teal/10"
                  onClick={() => setSelectedArticle(article)}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardHeader>
            </Card>
          ))}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground">
            No articles found.
          </p>
        )}
      </div>

      {/* Chakra Modal */}
      <Modal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        size="2xl"
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH="80vh" overflowY="auto">
          {selectedArticle && (
            <>
              <ModalHeader>
                <Text fontSize="xl" fontWeight="bold" lineHeight="short">
                  {selectedArticle.title}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(selectedArticle.pubDate).toLocaleString()} •{' '}
                  {selectedArticle.source_id}
                </Text>
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <Box>
                  <Text color="gray.800" lineHeight="tall" fontSize="sm">
                    {selectedArticle.description || 'No summary available.'}
                  </Text>
                </Box>
              </ModalBody>
              <ModalFooter gap={2} borderTop="1px solid" borderColor="gray.200">
                <Button
                  variant="outline"
                  size="sm"
                  flex="1"
                  leftIcon={<Bookmark className="w-4 h-4" />}
                >
                  Save
                </Button>

                <a
                  href={selectedArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    w="100%"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    isDisabled={!selectedArticle.link}
                    as="a"
                    href={selectedArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full Source
                  </Button>
                </a>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BlogScreen;
