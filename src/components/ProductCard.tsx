
import React from 'react';
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isSelected?: boolean;
  similarityScore?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelect, 
  isSelected = false, 
  similarityScore 
}) => {
  return (
    <Card 
      className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border-2 ${
        isSelected 
          ? 'border-purple-500 ring-4 ring-purple-300/50 shadow-xl shadow-purple-500/30' 
          : 'border-gray-200/20 hover:border-purple-400/50'
      } bg-white/10 backdrop-blur-md overflow-hidden`}
      onClick={() => onSelect(product)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {similarityScore && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-3 py-1 shadow-lg">
              <Zap className="h-3 w-3 mr-1" />
              {Math.round(similarityScore * 100)}% match
            </Badge>
          </div>
        )}
        
        <button className="absolute top-3 left-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
          <Heart className="h-4 w-4 text-white hover:text-red-400 transition-colors" />
        </button>
        
        {isSelected && (
          <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
              Selected for Analysis
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
            ${product.price}
          </div>
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold ml-1 text-yellow-300">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((feature) => (
            <Badge key={feature} variant="outline" className="text-xs border-purple-400/50 text-purple-300 hover:bg-purple-500/20 transition-colors">
              {feature}
            </Badge>
          ))}
          {product.features.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-400">
              +{product.features.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};
