// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/login/Login";
import Home from "./src/screens/home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "./redux/Store";
import { Provider } from "react-redux";
import { StatusBar, StyleSheet, View } from "react-native";

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const key = "token";
    AsyncStorage.getItem(key)
      .then((value) => {
        if (value !== null) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <Provider store={store}>
      <View style={style.container}>
        <NavigationContainer>
          <StatusBar backgroundColor={"black"}/>
          <Stack.Navigator>
            {!isAuthorized ? (
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen name="Login" component={Login} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});


export default App;
