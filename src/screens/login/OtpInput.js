import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { setOtpTimer } from "../../../redux/reducers/Auth";
import { connect } from "react-redux";

const OTPInput = ({
  handleResendOtp,
  otpTimer: otpTimerFromProps,
  validationMessage,
  otp,
  signedEmail,
  forgotPassword,
  setOtp,
  setOtpTimer: setOtpTimerFromProps,
}) => {
  console.log(otpTimerFromProps);
  const inputs = useRef([]);

  useEffect(() => {
    // Set up a timer interval
    if (otpTimerFromProps > 0) {
      const countdown = setInterval(() => {
        setOtpTimerFromProps(otpTimerFromProps > 0 ? otpTimerFromProps - 1 : 0);
      }, 1000);

      // Clear interval on component unmount or when timer reaches zero
      return () => clearInterval(countdown);
    }
  }, [otpTimerFromProps]);

  // Reset timer whenever OTP is resent
  const handleResendOtpWithTimer = () => {
    handleResendOtp(forgotPassword);
  };

  // Handle input change and auto-focus to the next input
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // Handle backspace to move focus back to the previous input
  const handleBackspace = (key, index) => {
    if (key === "Backspace" && index > 0 && !otp[index]) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.successText}>OTP sent on {signedEmail}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            onKeyPress={({ nativeEvent }) =>
              handleBackspace(nativeEvent.key, index)
            }
            autoFocus={index === 0}
            placeholder="•"
          />
        ))}
      </View>

      {validationMessage ? (
        <Text style={styles.errorText}>{validationMessage}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handleResendOtpWithTimer}
        style={styles.resendButton}
        disabled={otpTimerFromProps > 0} // Disable resend button while otpTimerFromProps is active
      >
        <Text
          style={[
            styles.resendText,
            { color: otpTimerFromProps > 0 ? "#ccc" : "#007bff" },
          ]}
        >
          {otpTimerFromProps > 0
            ? "Resend in " + otpTimerFromProps + "s"
            : "Didn't receive OTP? Resend"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  successText: {
    fontSize: 16,
    color: "#28a745",
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
  otpTimeContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  otpTimeText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
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
export default connect(mapStateToProps, mapDispatchToProps)(OTPInput);
