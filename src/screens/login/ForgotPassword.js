import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import OTPInput from "./OtpInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setEmailError("");
    // Simulate sending email for OTP
    setIsEmailSubmitted(true);
    Alert.alert("OTP Sent", "An OTP has been sent to your email.");
  };

  return (
    <View style={styles.container}>
      {!isEmailSubmitted ? (
        <View>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={[styles.input, emailError && styles.errorInput]}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          <Button
            title="Submit"
            onPress={handleEmailSubmit}
            disabled={!email} // Button is disabled if the email field is empty
          />
        </View>
      ) : (
        <OTPInput
          handleResendOtp={() => {
            // Resend OTP logic
            Alert.alert("OTP Resent", "A new OTP has been sent to your email.");
          }}
          OtpTimer={60}
          validationMessage=""
          otp={new Array(6).fill("")}
          setOtp={() => {}}
          signedEmail={email}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ForgotPassword;
