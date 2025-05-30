
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
          method: (analysis.word2vecScore > 0.7 ? 'word2vec' : 
                  analysis.tfidfScore > 0.6 ? 'tfidf' : 'bow') as 'bow' | 'tfidf' | 'word2vec',
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
      {/* Enhanced Header with Glass Effect */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-lg">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  SmartCommerce AI
                </h1>
                <p className="text-gray-300 text-sm font-medium">NLP-Powered Recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <SearchBar onSearch={setSearchQuery} />
              <div className="flex items-center space-x-2 text-white bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30">
                <Bot className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">AI Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Technology Banner */}
        <div className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-md rounded-2xl p-8 mb-8 border border-purple-300/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">Advanced NLP Recommendation System</h2>
              <p className="text-gray-200 text-lg">Powered by Bag of Words, TF-IDF, and Word2Vec algorithms for intelligent product suggestions</p>
              <div className="flex space-x-4 mt-4">
                <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-400/30">
                  <span className="text-green-400 font-semibold">BoW Algorithm</span>
                </div>
                <div className="bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-400/30">
                  <span className="text-yellow-400 font-semibold">TF-IDF</span>
                </div>
                <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-400/30">
                  <span className="text-blue-400 font-semibold">Word2Vec</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-12 w-12 text-yellow-400 animate-pulse" />
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-xl">ML Algorithms</div>
                <div className="text-gray-300">Real-time Analysis</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Products Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Enhanced Filters */}
            <div className="flex items-center space-x-6 bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Filter className="h-6 w-6 text-purple-400" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-64 bg-white/10 border-white/30 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
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
                  className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-300"
                >
                  Clear Selection
                </Button>
              )}
              
              <div className="ml-auto text-white">
                <span className="text-gray-300">Showing</span>
                <span className="mx-2 font-bold text-purple-400">{filteredProducts.length}</span>
                <span className="text-gray-300">products</span>
              </div>
            </div>

            {/* Enhanced Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  isSelected={selectedProduct?.id === product.id}
                />
              ))}
            </div>

            {/* Enhanced Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-md rounded-2xl p-8 border border-purple-300/30">
                <div className="flex items-center space-x-4">
                  <Bot className="h-8 w-8 text-purple-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
                    <p className="text-gray-300">Based on your selection: {selectedProduct?.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Enhanced NLP Analysis Sidebar */}
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

      {/* Enhanced Footer */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-300">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Advanced E-commerce Recommendation System</h3>
            </div>
            <p className="text-lg mb-2">Powered by Python, NLP, BoW, TF-IDF, and Word2Vec Technologies</p>
            <p className="text-sm text-gray-400">Real-time similarity analysis and personalized product recommendations</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
