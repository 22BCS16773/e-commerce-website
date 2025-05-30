
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Sparkles, Bot, Filter } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { RecommendationEngine } from '@/components/RecommendationEngine';
import { SearchBar } from '@/components/SearchBar';
import { products } from '@/data/products';
import { Product, Recommendation } from '@/types/product';
import { performNLPAnalysis } from '@/utils/nlpUtils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats;
  }, []);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Generate recommendations based on selected product
  const recommendations = useMemo(() => {
    if (!selectedProduct) return [];
    
    const recs: Recommendation[] = products
      .filter(p => p.id !== selectedProduct.id)
      .map(product => {
        const analysis = performNLPAnalysis(selectedProduct, product);
        return {
          product,
          similarity: analysis.overallSimilarity,
          method: analysis.word2vecScore > 0.7 ? 'word2vec' : 
                  analysis.tfidfScore > 0.6 ? 'tfidf' : 'bow',
          reasoning: `High similarity based on ${analysis.keyTerms.join(', ')}`
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
    
    return recs;
  }, [selectedProduct]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    toast({
      title: "Product Selected",
      description: `Analyzing recommendations for ${product.name}`,
      duration: 2000,
    });
  };

  const analysis = selectedProduct ? 
    performNLPAnalysis(selectedProduct, recommendations[0]?.product || products[0]) : 
    null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SmartCommerce AI</h1>
                <p className="text-gray-300 text-sm">NLP-Powered Recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar onSearch={setSearchQuery} />
              <div className="flex items-center space-x-2 text-white">
                <Bot className="h-5 w-5" />
                <span className="text-sm font-medium">AI Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Technology Banner */}
        <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Advanced NLP Recommendation System</h2>
              <p className="text-gray-300">Powered by Bag of Words, TF-IDF, and Word2Vec algorithms for intelligent product suggestions</p>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <div className="text-right">
                <div className="text-yellow-400 font-semibold">ML Algorithms</div>
                <div className="text-gray-300 text-sm">Real-time Analysis</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-lg p-4">
              <Filter className="h-5 w-5 text-white" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedProduct && (
                <Button 
                  onClick={() => setSelectedProduct(null)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear Selection
                </Button>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  isSelected={selectedProduct?.id === product.id}
                />
              ))}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Bot className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <ProductCard
                      key={rec.product.id}
                      product={rec.product}
                      onSelect={handleProductSelect}
                      similarityScore={rec.similarity}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* NLP Analysis Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RecommendationEngine 
                selectedProduct={selectedProduct}
                analysis={analysis}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p className="mb-2">Advanced E-commerce Recommendation System</p>
            <p className="text-sm">Powered by Python, NLP, BoW, TF-IDF, and Word2Vec Technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
