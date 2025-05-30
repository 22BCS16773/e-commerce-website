
import React from 'react';
import { Brain, Zap, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Product, NLPAnalysis } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface RecommendationEngineProps {
  selectedProduct: Product | null;
  analysis: NLPAnalysis | null;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  selectedProduct,
  analysis
}) => {
  if (!selectedProduct || !analysis) {
    return (
      <Card className="p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-md border border-purple-300/30 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="relative">
            <Brain className="h-16 w-16 text-purple-400 mx-auto animate-pulse" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-ping" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">AI Recommendation Engine</h3>
            <p className="text-gray-300 leading-relaxed">Select a product to see advanced NLP-powered similarity analysis and recommendations</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">
              🧠 Ready to analyze product similarities using advanced machine learning algorithms
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const nlpMethods = [
    {
      name: 'Bag of Words',
      score: analysis.bowScore,
      icon: <Target className="h-5 w-5" />,
      description: 'Word frequency analysis',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/20 border-green-400/30'
    },
    {
      name: 'TF-IDF',
      score: analysis.tfidfScore,
      icon: <Zap className="h-5 w-5" />,
      description: 'Term importance weighting',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/20 border-yellow-400/30'
    },
    {
      name: 'Word2Vec',
      score: analysis.word2vecScore,
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Semantic similarity vectors',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-500/20 border-blue-400/30'
    }
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-md border border-purple-300/30 shadow-2xl">
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Brain className="h-10 w-10 text-purple-400" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">NLP Analysis</h3>
            <p className="text-gray-300 text-sm">Advanced recommendation algorithms</p>
          </div>
        </div>

        {/* Overall Similarity */}
        <div className="bg-black/30 rounded-xl p-6 border border-purple-300/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold text-lg">Overall Similarity</span>
            <div className="text-right">
              <span className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                {Math.round(analysis.overallSimilarity * 100)}%
              </span>
              <p className="text-xs text-gray-400">confidence</p>
            </div>
          </div>
          <Progress 
            value={analysis.overallSimilarity * 100} 
            className="h-4 bg-gray-700/50"
          />
        </div>

        {/* NLP Methods */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg">Algorithm Breakdown</h4>
          {nlpMethods.map((method) => (
            <div key={method.name} className={`${method.bgColor} rounded-xl p-5 border transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color}`}>
                    {method.icon}
                  </div>
                  <div>
                    <span className="text-white font-bold">{method.name}</span>
                    <p className="text-gray-300 text-xs">{method.description}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">
                  {Math.round(method.score * 100)}%
                </span>
              </div>
              <Progress 
                value={method.score * 100} 
                className="h-3 bg-gray-700/50"
              />
            </div>
          ))}
        </div>

        {/* Key Terms */}
        {analysis.keyTerms.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
              Key Matching Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keyTerms.map((term) => (
                <Badge key={term} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-3 py-1 hover:scale-105 transition-transform">
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="bg-black/40 rounded-lg p-4 border border-gray-600/30">
          <div className="text-xs text-gray-300 leading-relaxed">
            <strong className="text-purple-400">Algorithm:</strong> Hybrid filtering using weighted combination of BoW (20%), TF-IDF (30%), and Word2Vec (50%) for optimal semantic understanding and recommendation accuracy.
          </div>
        </div>
      </div>
    </Card>
  );
};
