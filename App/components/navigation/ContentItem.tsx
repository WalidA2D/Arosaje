import React, { useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, FlatList, Image, Text, PanResponder, PanResponderGestureState, PanResponderInstance, Pressable } from 'react-native';

// Définir les types pour les props du composant
type ContentItemProps = {
  id: string;
  images: string[];
  title: string;
  description: string;
  time: string;
  onPress?: (id: string) => void;
};
const ContentItem: React.FC<ContentItemProps> = ({ id,images, title, description, time, onPress}) => {
  const imagesArray = images || [];
  const { width: windowWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList<string> | null>(null); // Typage de la référence
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState: PanResponderGestureState) => {
      const { dx } = gestureState;
      if (Math.abs(dx) > 40) { // Réduction de la valeur de comparaison pour une détection plus sensible
        const newIndex = dx > 0 ? currentIndex - 1 : currentIndex + 1;
        if (newIndex >= 0 && newIndex < imagesArray.length) {
          flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
          setCurrentIndex(newIndex);
        }
      }
    },
  });

  return (
    
    <View style={styles.container} {...panResponder.panHandlers}>
      <Pressable onPress={() => onPress?.(id)}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={imagesArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width: windowWidth }}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.imageSlider} resizeMode="cover" />
            </View>
          </View>
        )}
        pagingEnabled
        snapToInterval={windowWidth}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
          setCurrentIndex(newIndex);
        }}
        />
      <View style={styles.content}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.indicatorContainer}>
          {imagesArray.map((_, index) => (
            <View key={index} style={[styles.indicator, index === currentIndex ? styles.activeIndicator : null]} />
          ))}
        </View>
      </View>
</Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Couleur du séparateur
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  imageSlider: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCCCCC', // Fond gris légèrement plus foncé
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#668F80', // Couleur du header
  },
});

export default ContentItem;