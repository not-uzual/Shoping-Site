import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../APICalls/productCalls';

const bannerImages = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Fashion Sale Banner',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Electronics Banner',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Home Decor Banner',
  },
  {
  id: 4,
  imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
  alt: 'Summer Collection Banner'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Tech Gadgets Sale Banner'
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Fashion Week Special'
  },
  {
    id: 7,
    imageUrl: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Holiday Season Sale'
  },
  {
    id: 8,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Home Office Essentials'
  }
];

const sampleProducts = await getAllProducts()

function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextBanner();
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [currentBanner]);
  
  const prevBanner = () => {
    setCurrentBanner(current => (current === 0 ? bannerImages.length - 1 : current - 1));
  };
  
  const nextBanner = () => {
    setCurrentBanner(current => (current === bannerImages.length - 1 ? 0 : current + 1));
  };
  
  const goToBanner = (index) => {
    setCurrentBanner(index);
  };
  
  return (
    <main className="flex flex-col">
      <section className="relative overflow-hidden mb-8" ref={bannerRef}>
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          {bannerImages.map((banner, index) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={banner.imageUrl} 
                alt={banner.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ))}

          <button 
            onClick={prevBanner} 
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white/90 transition-colors flex items-center justify-center"
            aria-label="Previous banner"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/128/271/271220.png" 
              alt="Previous" 
              className="h-5 w-5"
            />
          </button>
          
          <button 
            onClick={nextBanner} 
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white/90 transition-colors flex items-center justify-center"
            aria-label="Next banner"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/128/271/271228.png" 
              alt="Next" 
              className="h-5 w-5"
            />
          </button>
          
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex space-x-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToBanner(index)}
                className={`h-2.5 w-2.5 rounded-full ${
                  index === currentBanner ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;