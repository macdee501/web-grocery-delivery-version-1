import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
}

export default function HeroSection({
  title = "Fresh, Delicious Produce Delivered to Your Door",
  subtitle = "We bring the farm straight to your table. FreshCart ensures high-quality fruits and vegetables, delivered quickly and sustainably.",
  ctaText = "Shop Now",
  ctaLink = "/shop",
  imageSrc,
}: HeroSectionProps) {
  return (
    <section className="bg-lime-50 py-20">
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-gray-700 mb-8 text-lg">{subtitle}</p>
          <Link
            href={ctaLink}
            className="inline-block bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-8 py-4 rounded-lg transition"
          >
            {ctaText}
          </Link>
        </div>

        {/* Right Image */}
        {imageSrc && (
          <div className="flex-1 relative w-full h-64 lg:h-96">
            <Image
              src={imageSrc}
              alt="Hero Image"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
