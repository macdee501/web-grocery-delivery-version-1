import React from 'react'
import Image from 'next/image'
import { getProductImage } from '@/lib/getProductImage';

interface Offer {
  $id: string;
  title: string;
  image: string;
  color: string;
  isActive: boolean;
  order: number;
}

interface OffersCardProps {
  offer: Offer;
}

export default function OffersCard({ offer }: OffersCardProps) {
  return (
    <div 
      className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative h-80"
      style={{ backgroundColor: offer.color }}
    >
      {/* Content Section - Left Side */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 p-8 flex flex-col justify-center z-10">
          <h2 className="text-4xl font-bold text-black mb-4 leading-tight">
            {offer.title}
          </h2>
          <p className="text-black/90 text-sm mb-6 leading-relaxed">
            Get 5% of your order when you use the FreshCart App
          </p>
          
        </div>

        {/* Image Section - Right Side */}
        {/* <div className="w-1/2 relative">
          <Image
            src={getProductImage(offer.image)}
            alt={offer.title}
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div> */}
      </div>

      {/* Decorative Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }}
      />
    </div>
  )
}