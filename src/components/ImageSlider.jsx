import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Static images for the slider
  const sliderImages = [
    { src: '/images/Ảnh đại diện.jpg', alt: 'Latest Course Banner' },
    { src: '/images/Ảnh đại diện.jpg', alt: 'Free Learning Banner' },
    { src: '/images/Ảnh đại diện.jpg', alt: 'Connect with Experts Banner' },
  ];

  // Effect for automatic slide transition
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(slideInterval); // Clean up on unmount
  }, [sliderImages.length]);

  // Handle navigation
  const goToPrevious = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? sliderImages.length - 1 : prevSlide - 1
    );
  };

  const goToNext = () => {
    setCurrentSlide((prevSlide) => 
      (prevSlide + 1) % sliderImages.length
    );
  };

  return (
    <Box
      sx={{
        mb: 4,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        height: { xs: 180, sm: 250, md: 300 },
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Slider Images */}
      <Box
        sx={{
          display: "flex",
          width: `${sliderImages.length * 100}%`,
          height: "100%",
          transform: `translateX(-${currentSlide * (100 / sliderImages.length)}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {sliderImages.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image.src}
            alt={image.alt}
            sx={{
              width: `${100 / sliderImages.length}%`,
              height: "100%",
              objectFit: "cover",
            }}
          />
        ))}
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={goToPrevious}
        sx={{
          position: "absolute",
          top: "50%",
          left: 8,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.7)",
          },
        }}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={goToNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 8,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.7)",
          },
        }}
      >
        <ArrowForwardIos />
      </IconButton>

      {/* Navigation Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {sliderImages.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: index === currentSlide ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "background-color 0.3s, transform 0.3s",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.8)",
                transform: "scale(1.2)",
              },
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageSlider;