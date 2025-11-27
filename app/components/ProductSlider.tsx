'use client';
import { Product } from "@/src/types";
import { useState } from "react";
import ProductCard from "./ProductCard/ProductCard";
import { useBreakpoint } from "./useBreakpoint";

interface ProductSliderProps {
    products: Product[];
    categoryName: string;
    step: number;
    displayCount: number;
}

export default function ProductSlider({products, categoryName, step = 1, displayCount = 4}: ProductSliderProps) {
    const responsiveDisplayCount = useBreakpoint(displayCount);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const mobile = responsiveDisplayCount < 4;
    const totalItems = products.length;
    const maxIndex = totalItems - responsiveDisplayCount;
   
    const itemWidth = mobile ? 170 : 200;
    const trackWidth = totalItems * itemWidth;
    const viewportWidth = responsiveDisplayCount * itemWidth;
    const translateX = -(currentIndex * itemWidth);

    const navBttnStyle = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 cursor-pointer';

    const handlePrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - step));
    }

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + step));
    }

    return (
        <div className="slider-container" style={{width: `${viewportWidth}px`, margin: '0 auto'}}>
            <h2 className="font-bold">{categoryName}</h2>
            
            <div className="slider-wrapper">
                <div className="slider-track-viewport" style={{overflow:'hidden'}}>
                    <div 
                        className="slider-track"
                        style={{transform: `translateX(${translateX}px)`, 
                                width: `${trackWidth}px`, 
                                display: 'flex', 
                                transition: `transform 0.3s ease-in-out`}}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="slider-item" style={{width: `${itemWidth}px`, 
                                                                                  minWidth: `${itemWidth}px`,
                                                                                  flexShrink: 0,
                                                                                  padding: '0 10px'}}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
            <div className="slider-controls text-center">
                <button onClick={handlePrev} disabled={currentIndex === 0} className={`${navBttnStyle} rounded-l mr-[1px]`}>
                    &lt; Prev
                </button>
                <button onClick={handleNext} disabled={currentIndex >= maxIndex} className={`${navBttnStyle} rounded-r`}>
                    Next &gt;
                </button>
            </div>
        </div>
    );
}