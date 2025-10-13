import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Question from "../components/questions"; 

export default function VolunteerLogin() {
  const initialLoginState: VolunteerLoginData = {
    username: "",
    password: "",
  };

  const [login, setLogin] = useState(initialLoginState);
  const [key, setKey] = useState(0);

  const changeUsername = (u: string) => setLogin({ ...login, username: u });
  const changePassword = (p: string) => setLogin({ ...login, password: p });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteer Login</Text>

      <Question
        question="Username"
        emptyText="Enter your username"
        value={login.username}
        onChange={changeUsername}
        id={key + 'username'}
      />
      <Question
        question="Password"
        emptyText="Enter your password"
        value={login.password}
        onChange={changePassword}
        id={key + 'password'}
      />

      <View style={styles.button}>
        <Button
          title="Log In"
          onPress={() => {
            console.log("Volunteer login submitted:", login);
            // TODO: add your actual login logic here
            setLogin({ ...initialLoginState });
            setKey(key + 1);
          }}
        />
      </View>

      <Text style={styles.footerText}>
        Don’t have an account? Create one instead.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  footerText: {
    marginTop: 15,
    color: "#555",
    fontSize: 14,
    textAlign: "center",
  },
});

interface VolunteerLoginData {
  username: string;
  password: string;
}
