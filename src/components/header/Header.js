import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Importing vector icons

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: -20 ,color:"white"}}>
          SkillBox
        </Text>
      </View>
      <View style={styles.right}>
        <Ionicons name="search" size={20} color="white" style={styles.icon} />
        <Ionicons name="person" size={20} color="white" style={styles.icon} />
      </View>
    </View> 
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "transparent",
    elevation: 5,
  },
  left: {
    flexDirection: "row",
    marginLeft: -20,
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  icon: {
    marginHorizontal: 10,
  },
});

