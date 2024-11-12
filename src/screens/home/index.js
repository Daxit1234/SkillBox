import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../../components/header/Header";
import OptionNavigation from "../../components/optionNavigation/OptionNavigation";

const Home = () => {
  return (
    <View style={styles.container}>
      <Header />
      <OptionNavigation/>
      <Text>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
