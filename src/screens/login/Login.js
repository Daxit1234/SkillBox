import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler, // BackHandler
  Alert,
} from "react-native";
import { TextInput, Button } from "react-native-paper"; // Use react-native-paper components
import OTPInput from "./OtpInput";
import devConfig from "../../constant/config";
import { useFocusEffect } from "@react-navigation/native"; // useFocusEffect for handling focus events
import { setOtpTimer } from "../../../redux/reducers/Auth";
import { connect } from "react-redux";

const AuthForm = ({
  navigation,
  otpTimer: otpTimerFromProps,
  setOtpTimer: setOtpTimerFromProps,
}) => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    userName: "",
  });

  const [validationMessage, setValidationMessage] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    userName: "",
    general: "",
  });
  const [isOptVerify, setIsOtpVerify] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [signedEmail, setSignedEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPassInput, setForgotPassInput] = useState(false);
  const OtpExpireTime = 10;
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

  useEffect(() => {
    setFormValues({
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
      userName: "",
    });
    setValidationMessage({
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
      userName: "",
      general: "",
    });
  }, [isLogin]);

  useEffect(() => {
    if (otpTimerFromProps > 0) {
      setTimeout(() => setOtpTimerFromProps(otpTimerFromProps - 1), 1000);
    }
  }, [otpTimerFromProps]);

  // Handle Back Button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setFormValues({
          email: "",
          password: "",
          confirmPassword: "",
          mobileNumber: "",
          userName: "",
        });
        setOtp(new Array(6).fill(""));
        // If OTP verification is ongoing, exit OTP mode
        if (isOptVerify) {
          setIsOtpVerify(false);
          return true; // Prevent default back action
        }
        // If forgot password input is active, exit that state
        if (forgotPassInput) {
          setForgotPassInput(false);
          setForgotPassword(false);
          return true;
        }
        // If forgot password OTP is ongoing, return to forgot password screen
        if (forgotPassword) {
          setForgotPassword(false);
          return true;
        }
        // If user is in signup, switch back to login mode
        if (!isLogin) {
          setIsLogin(true);
          return true;
        }

        // Default action: Close the app or exit the screen
        Alert.alert(
          "Exit",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back action
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isOptVerify, forgotPassword, forgotPassInput, isLogin])
  );

  const handleChange = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Validate on change
    const newValidationMessage = validateField(name, value);
    setValidationMessage((prevMessages) => ({
      ...prevMessages,
      [name]: newValidationMessage,
    }));
  };

  const validateField = (name, value) => {
    if (name === "email" && value === "") {
      return "Email is required.";
    }
    if (name === "password" && value === "") {
      return "Password is required.";
    }
    if (name === "mobileNumber" && value === "" && !isLogin) {
      return "Mobile number is required.";
    }
    if (
      (name === "confirmPassword" && value !== formValues.password) ||
      value === ""
    ) {
      if (!isLogin) {
        return "Passwords do not match.";
      }
    }
    if (name === "userName" && value === "" && !isLogin) {
      return "User name is required.";
    }
    return "";
  };

  const validateFields = () => {
    const newValidationMessage = {};
    Object.keys(formValues).forEach((key) => {
      const validationMessage = validateField(key, formValues[key]);
      newValidationMessage[key] = validationMessage;
    });
    setValidationMessage(newValidationMessage);
    return Object.values(newValidationMessage).every(
      (message) => message === ""
    );
  };

  const handleOtpVerify = async (isForgot = false) => {
    try {
      const response = await fetch(`${devConfig.API_URL}/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signedEmail,
          otp: otp.join(""),
          isForgot: isForgot,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            if (isForgot) {
              setForgotPassword(false);
              setForgotPassInput(true);
            }
            setIsLogin(true);
            setIsOtpVerify(false);
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: "",
            }));
          } else {
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: data.message || "Network request failed.",
            }));
          }
        });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFormSubmit = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const endpoint = isLogin
        ? `${devConfig.API_URL}/login`
        : `${devConfig.API_URL}/singup`;
      let response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
          ...(isLogin
            ? {}
            : {
                mobileNumber: formValues.mobileNumber,
                userName: formValues.userName,
              }),
        }),
      });
      response = await response.json();
      if (response?.ok) {
        if (isLogin) {
          await AsyncStorage.setItem("token", response?.token);
          navigation.navigate("Home");
        } else {
          setOtp(new Array(6).fill(""));
          setSignedEmail(formValues.email);
          setIsOtpVerify(true);
          setOtpTimerFromProps(c);
        }
        setValidationMessage((prevMessages) => ({
          ...prevMessages,
          general: "",
        }));
      } else {
        setValidationMessage((prevMessages) => ({
          ...prevMessages,
          general: response.message || "Network request failed.",
        }));
      }
    } catch (error) {
      setValidationMessage((prevMessages) => ({
        ...prevMessages,
        general: error.message || "Network request failed.",
      }));
    }
  };

  const handleResendOtp = async () => {
    setValidationMessage((prevMessages) => ({
      ...prevMessages,
      general: "",
    }));
    try {
      const response = await fetch(`${devConfig.API_URL}/resendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signedEmail,
          isForgot: forgotPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setOtp(new Array(6).fill(""));
            setOtpTimerFromProps(OtpExpireTime);
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: "",
            }));
          } else {
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: data.message || "Network request failed.",
            }));
          }
        });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!signedEmail) {
      setValidationMessage((prevMessages) => ({
        ...prevMessages,
        general: "Email is required.",
      }));
      return;
    }
    try {
      const body = {
        email: signedEmail,
      };
      const response = await fetch(`${devConfig.API_URL}/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setOtp(new Array(6).fill(""));
            setIsOtpVerify(true);
            setOtpTimerFromProps(OtpExpireTime);
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: "",
            }));
          } else {
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: data.message || "Network request failed.",
            }));
          }
        });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotSave = async () => {
    try {
      const response = await fetch(`${devConfig.API_URL}/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signedEmail,
          password: formValues.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setIsLogin(true);
            setIsOtpVerify(false);
            setForgotPassword(false);
            setForgotPassInput(false);
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: "",
            }));
          } else {
            setValidationMessage((prevMessages) => ({
              ...prevMessages,
              general: data.message || "Network request failed.",
            }));
          }
        });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Icon */}
      <Image
        source={require("../../../assets/icon.png")}
        style={styles.appIcon}
      />

      {/* Title */}
      {isOptVerify ? (
        <Text style={styles.title}>Enter OTP</Text>
      ) : (
        <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>
      )}
      {forgotPassword && !isOptVerify ? (
        <>
          <TextInput
            label="Email"
            mode="outlined"
            value={signedEmail}
            onChangeText={(value) => setSignedEmail(value)}
            // error={!signedEmail}
            style={styles.input}
          />
          {/* Validation Message */}
          {validationMessage?.general && (
            <Text style={styles.validationText}>
              {validationMessage.general}
            </Text>
          )}
        </>
      ) : isOptVerify ? (
        <>
          <OTPInput
            otp={otp}
            setOtp={setOtp}
            OtpTimer={otpTimerFromProps}
            handleResendOtp={handleResendOtp}
            validationMessage={validationMessage?.general || ""}
            signedEmail={signedEmail}
            forgotPassword={forgotPassword}
          />
        </>
      ) : forgotPassInput ? (
        <>
          <TextInput
            label="New Password"
            mode="outlined"
            secureTextEntry
            value={formValues.password}
            onChangeText={(value) => handleChange("password", value)}
            error={!!validationMessage.password}
            style={styles.input}
          />
          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            value={formValues.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            error={!!validationMessage.confirmPassword}
            style={styles.input}
          />
        </>
      ) : (
        <>
          {/* Input Fields */}
          {!isLogin && (
            <TextInput
              label="User Name"
              mode="outlined"
              value={formValues.userName}
              onChangeText={(value) => handleChange("userName", value)}
              error={!!validationMessage.userName}
              style={styles.input}
            />
          )}

          <TextInput
            label="Email"
            mode="outlined"
            value={formValues.email}
            onChangeText={(value) => handleChange("email", value)}
            error={!!validationMessage.email}
            style={styles.input}
          />

          {!isLogin && (
            <TextInput
              label="Mobile Number"
              mode="outlined"
              value={formValues.mobileNumber}
              onChangeText={(value) => handleChange("mobileNumber", value)}
              keyboardType="phone-pad"
              error={!!validationMessage.mobileNumber}
              style={styles.input}
            />
          )}

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={formValues.password}
            onChangeText={(value) => handleChange("password", value)}
            error={!!validationMessage.password}
            style={styles.input}
          />

          {isLogin && (
            <TouchableOpacity
              onPress={() => {
                setForgotPassword(true);
                setValidationMessage((prevMessages) => ({
                  ...prevMessages,
                  general: "",
                }));
              }}
            >
              <Text style={styles.forgotPasswordText}>Forget Password?</Text>
            </TouchableOpacity>
          )}

          {!isLogin && (
            <TextInput
              label="Confirm Password"
              mode="outlined"
              secureTextEntry
              value={formValues.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              error={!!validationMessage.confirmPassword}
              style={styles.input}
            />
          )}

          {/* Validation Message */}
          {validationMessage.general && (
            <Text style={styles.validationText}>
              {validationMessage.general}
            </Text>
          )}

          {/* Login or Signup Button */}
          <Button
            mode="contained"
            onPress={handleFormSubmit}
            style={styles.submitButton}
          >
            {isLogin ? "Login" : "Signup"}
          </Button>

          {/* Toggle between Login and Signup */}
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </Text>
          </TouchableOpacity>
          {/* Footer Text */}
          <Text style={styles.footerText}>
            By continuing, you agree to the Terms and Conditions
          </Text>
        </>
      )}

      {isOptVerify && (
        <Button
          mode="contained"
          onPress={() => handleOtpVerify(forgotPassword ? true : false)}
          style={styles.submitButton}
        >
          Verify
        </Button>
      )}
      {forgotPassword && !isOptVerify && (
        <Button
          mode="contained"
          onPress={handleForgotPassword}
          style={styles.submitButton}
        >
          Send OTP
        </Button>
      )}
      {forgotPassInput && !isOptVerify && (
        <Button
          mode="contained"
          onPress={() => handleForgotSave()}
          style={styles.submitButton}
        >
          Submit
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures content fills the screen
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  appIcon: {
    width: 100,
    height: 100, // Consistent height and width for the icon
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  validationText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14, // Slightly smaller to not be too prominent
  },
  submitButton: {
    marginTop: 10,
    // paddingVertical: 10, // Padding to make the button look better
    borderRadius: 5, // Rounded corners for the button
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    marginTop: 15,
    textAlign: "center",
    paddingHorizontal: 10, // Slight padding for spacing from the edges
  },
  toggleText: {
    fontSize: 14,
    color: "#555",
    marginTop: 20,
    textAlign: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "blue",
    textAlign: "right",
    marginTop: 10,
    marginBottom: 20, // Additional margin for spacing between inputs and forgot password link
  },
});

const mapStateToProps = (state) => {
  return {
    otpTimer: state?.auth?.otpTimer || 0,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setOtpTimer: (time) => dispatch(setOtpTimer(time)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
