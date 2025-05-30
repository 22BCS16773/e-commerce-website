
import { Product, NLPAnalysis } from '@/types/product';

// Simulate Bag of Words similarity
export const calculateBowSimilarity = (product1: Product, product2: Product): number => {
  const text1 = `${product1.name} ${product1.description} ${product1.features.join(' ')}`.toLowerCase();
  const text2 = `${product2.name} ${product2.description} ${product2.features.join(' ')}`.toLowerCase();
  
  const words1 = new Set(text1.split(/\s+/));
  const words2 = new Set(text2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Simulate TF-IDF similarity
export const calculateTfIdfSimilarity = (product1: Product, product2: Product): number => {
  const text1 = `${product1.name} ${product1.description}`.toLowerCase();
  const text2 = `${product2.name} ${product2.description}`.toLowerCase();
  
  // Simple TF-IDF simulation based on category and feature overlap
  let similarity = 0;
  
  if (product1.category === product2.category) {
    similarity += 0.3;
  }
  
  const features1 = new Set(product1.features.map(f => f.toLowerCase()));
  const features2 = new Set(product2.features.map(f => f.toLowerCase()));
  const featureOverlap = [...features1].filter(f => features2.has(f)).length;
  
  similarity += (featureOverlap / Math.max(features1.size, features2.size)) * 0.4;
  
  // Add some randomness to simulate complex TF-IDF calculations
  similarity += Math.random() * 0.3;
  
  return Math.min(similarity, 1);
};

// Simulate Word2Vec similarity
export const calculateWord2VecSimilarity = (product1: Product, product2: Product): number => {
  // Simulate semantic similarity based on product categories and features
  const categorySimilarity = product1.category === product2.category ? 0.8 : 0.2;
  
  const text1 = `${product1.name} ${product1.description}`.toLowerCase();
  const text2 = `${product2.name} ${product2.description}`.toLowerCase();
  
  // Simulate semantic word embeddings by looking for related terms
  const semanticTerms = {
    'wireless': ['bluetooth', 'remote', 'cordless'],
    'smart': ['intelligent', 'ai', 'connected', 'automated'],
    'premium': ['high-quality', 'professional', 'superior'],
    'portable': ['mobile', 'compact', 'travel'],
    'gaming': ['competitive', 'esports', 'performance']
  };
  
  let semanticSimilarity = 0;
  Object.entries(semanticTerms).forEach(([key, related]) => {
    const hasKey1 = text1.includes(key) || related.some(term => text1.includes(term));
    const hasKey2 = text2.includes(key) || related.some(term => text2.includes(term));
    if (hasKey1 && hasKey2) {
      semanticSimilarity += 0.15;
    }
  });
  
  return Math.min((categorySimilarity + semanticSimilarity) * (0.7 + Math.random() * 0.3), 1);
};

export const performNLPAnalysis = (targetProduct: Product, compareProduct: Product): NLPAnalysis => {
  const bowScore = calculateBowSimilarity(targetProduct, compareProduct);
  const tfidfScore = calculateTfIdfSimilarity(targetProduct, compareProduct);
  const word2vecScore = calculateWord2VecSimilarity(targetProduct, compareProduct);
  
  // Weighted average for overall similarity
  const overallSimilarity = (bowScore * 0.2 + tfidfScore * 0.3 + word2vecScore * 0.5);
  
  // Extract key terms that contributed to similarity
  const targetText = `${targetProduct.name} ${targetProduct.description}`.toLowerCase();
  const compareText = `${compareProduct.name} ${compareProduct.description}`.toLowerCase();
  
  const keyTerms = targetProduct.features
    .filter(feature => compareProduct.features.some(cf => 
      cf.toLowerCase().includes(feature.toLowerCase()) || 
      feature.toLowerCase().includes(cf.toLowerCase())
    ))
    .slice(0, 3);
  
  return {
    bowScore,
    tfidfScore,
    word2vecScore,
    overallSimilarity,
    keyTerms
  };
};
