import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const OptionNavigation = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.optionContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedOption(option)}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default OptionNavigation;

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  option: {
    marginHorizontal: 7,
    paddingHorizontal: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  optionText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedOption: {
    backgroundColor: 'blue',  // Color when selected
    borderColor: 'black',     // Change border color on selection if desired
  },
});
