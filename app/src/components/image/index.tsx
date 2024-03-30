import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { API_URL } from "../../lib/constants";

interface ImageViewerProps {
  images: string[];
}

export function ImageViewer({ images }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToNextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{ width: "100%", flex: 1 }}
        source={{ uri: `${API_URL}files/${images[currentIndex]}` }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <TouchableOpacity onPress={goToPreviousImage}>
          <Text>{"Anterior"}</Text>
        </TouchableOpacity>
        <Text>
          {currentIndex + 1} / {images.length}
        </Text>
        <TouchableOpacity onPress={goToNextImage}>
          <Text>{"Próxima"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
