
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  features: string[];
  rating: number;
  reviews: number;
}

export interface Recommendation {
  product: Product;
  similarity: number;
  method: 'bow' | 'tfidf' | 'word2vec';
  reasoning: string;
}

export interface NLPAnalysis {
  bowScore: number;
  tfidfScore: number;
  word2vecScore: number;
  overallSimilarity: number;
  keyTerms: string[];
}
