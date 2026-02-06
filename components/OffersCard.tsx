'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getProductImage } from '@/lib/getProductImage';

interface Offer {
  $id: string;
  title: string;
  description?: string; 
  image?: string;
  color?: string;
  isActive: boolean;
  order: number;
}

interface OffersCardProps {
  offer: Offer;
}

export default function OffersCard({ offer }: OffersCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const description = offer.description || '';
  const hasImage = !!offer.image;
  const backgroundColor = offer.color || '#f0f0f0'; // fallback color
  const placeholderImage = '/images/placeholder.png'; // make sure you have this in public folder

  return (
    <>
      {/* Card */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative h-80"
        style={{ backgroundColor }}
      >
        {/* Content Section */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 p-8 flex flex-col justify-center z-10">
            <h2 className="text-4xl font-bold text-black mb-4 leading-tight">
              {offer.title}
            </h2>
            <p className="text-black/90 text-sm mb-6 leading-relaxed">
              {description.slice(0, 80)}
              {description.length > 80 && '...'}
            </p>
          </div>

          {/* Image Section */}
          <div className="w-1/2 relative">
            {/* <Image
              src={hasImage ? getProductImage(offer.image!) : placeholderImage}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="50vw"
            /> */}
          </div>
        </div>

        {/* Decorative Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">{offer.title}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col lg:flex-row gap-6">
              {/* Image */}
              <div className="relative w-full lg:w-1/2 h-64 lg:h-80 rounded-lg overflow-hidden">
                {/* <Image
                  src={hasImage ? getProductImage(offer.image!) : placeholderImage}
                  alt={offer.title}
                  fill
                  className="object-cover"
                /> */}
              </div>

              {/* Description */}
              <div className="flex-1">
                <p className="text-gray-700 text-lg">
                  {description || 'No additional details available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
