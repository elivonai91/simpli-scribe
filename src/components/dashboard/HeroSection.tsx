import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Sarah J.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
    rating: 5
  },
  {
    name: "Michael C.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
    rating: 5
  },
  {
    name: "Emily R.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
    rating: 5
  }
];

const renderStars = (rating: number) => {
  return Array(rating).fill(0).map((_, index) => (
    <Star key={index} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
  ));
};

export const HeroSection = () => {
  return (
    <motion.div 
      className="container mx-auto text-center z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-7xl md:text-8xl font-bold mb-10 pb-3 bg-gradient-to-r from-[#662d91] via-[#bf0bad] to-[#ff3da6] text-transparent bg-clip-text leading-tight [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff] drop-shadow-lg">
        Simplify Your Digital Life
      </h1>
      <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
        Track, manage, and optimize all your subscriptions in one beautiful dashboard
      </p>

      <div className="mb-12">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center">
                  <Avatar className="w-16 h-16 mb-2 border-2 border-purple-500/20">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ')[0][0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-0.5 mb-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-sm text-white/80">{testimonial.name}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex flex-col items-center gap-6">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-[#662d91] to-[#bf0bad] hover:from-[#662d91]/90 hover:to-[#bf0bad]/90 text-white px-12"
        >
          Start Free Trial
        </Button>
        <a 
          href="#learn-more" 
          className="text-white/70 hover:text-white flex items-center gap-2 transition-colors"
        >
          Learn More <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};