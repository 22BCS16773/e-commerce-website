
import React from 'react';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
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
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-300/30">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 text-purple-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">AI Recommendation Engine</h3>
          <p className="text-gray-300">Select a product to see NLP-powered similarity analysis</p>
        </div>
      </Card>
    );
  }

  const nlpMethods = [
    {
      name: 'Bag of Words (BoW)',
      score: analysis.bowScore,
      icon: <Target className="h-5 w-5" />,
      description: 'Word frequency analysis',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'TF-IDF',
      score: analysis.tfidfScore,
      icon: <Zap className="h-5 w-5" />,
      description: 'Term importance weighting',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'Word2Vec',
      score: analysis.word2vecScore,
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Semantic similarity vectors',
      color: 'from-blue-500 to-purple-600'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-300/30">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">NLP Analysis</h3>
            <p className="text-gray-300 text-sm">Advanced recommendation algorithms</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Overall Similarity</span>
              <span className="text-2xl font-bold text-purple-400">
                {Math.round(analysis.overallSimilarity * 100)}%
              </span>
            </div>
            <Progress 
              value={analysis.overallSimilarity * 100} 
              className="h-3 bg-gray-700"
            />
          </div>

          {nlpMethods.map((method) => (
            <div key={method.name} className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded bg-gradient-to-r ${method.color}`}>
                    {method.icon}
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm">{method.name}</span>
                    <p className="text-gray-400 text-xs">{method.description}</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-white">
                  {Math.round(method.score * 100)}%
                </span>
              </div>
              <Progress 
                value={method.score * 100} 
                className="h-2 bg-gray-700"
              />
            </div>
          ))}
        </div>

        {analysis.keyTerms.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-white font-medium">Key Matching Features</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keyTerms.map((term) => (
                <Badge key={term} className="bg-purple-600 text-white">
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 bg-black/20 rounded p-3">
          <strong>Algorithm:</strong> Hybrid filtering using weighted combination of BoW (20%), TF-IDF (30%), and Word2Vec (50%) for optimal semantic understanding.
        </div>
      </div>
    </Card>
  );
};
