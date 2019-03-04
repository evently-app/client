import React from "react";
import { Animated, Easing, TouchableOpacity } from "react-native";

const TouchableScale = ({ animatedStyle = {}, style = {}, disabled, onPress, children }) => {
  const animated = new Animated.Value(1);

  handlePressIn = () => {
    Animated.timing(animated, {
      toValue: 1.4,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  };

  handlePressOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true
    }).start();
  };

  const containerAnimatedStyle = {
    transform: [
      {
        scale: animated
      }
    ]
  };

  return (
    <Animated.View
      pointerEvents={disabled ? "none" : "auto"}
      style={[animatedStyle, containerAnimatedStyle]}
    >
      <TouchableOpacity
        style={style}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TouchableScale;
