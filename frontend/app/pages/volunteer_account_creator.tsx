import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Question from "../components/questions"; // adjust path if needed

export default function VolunteerAccountCreator() {
  const initialUserState: Volunteer = {
    username: "",
    password: "",
    location: "",
    skills: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [key, setKey] = useState(0);

  const changeUsername = (u: string) => setUser({ ...user, username: u });
  const changePassword = (p: string) => setUser({ ...user, password: p });
  const changeLocation = (l: string) => setUser({ ...user, location: l });
  const changeSkills = (s: string) => setUser({ ...user, skills: s });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteers: Create Your Account</Text>

      <Question
        question="Username"
        emptyText="Enter a username"
        value={user.username}
        onChange={changeUsername}
        id={key + "username"}
      />
      <Question
        question="Password"
        emptyText="Enter a password"
        value={user.password}
        onChange={changePassword}
        id={key + "password"}
      />
      <Question
        question="Location"
        emptyText="Enter your city or ZIP code"
        value={user.location}
        onChange={changeLocation}
        id={key + "location"}
      />
      <Question
        question="Skills / What can you help with?"
        emptyText="List areas you can help (e.g., groceries, tech support, rides)"
        value={user.skills}
        onChange={changeSkills}
        id={key + "skills"}
      />

      <View style={styles.button}>
        <Button
          title="Submit"
          onPress={() => {
            console.log("New Volunteer Account:", user);
            // TODO: Replace with backend API call
            setUser({ ...initialUserState });
            setKey(key + 1);
          }}
        />
      </View>
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
});

interface Volunteer {
  username: string;
  password: string;
  location: string;
  skills: string;
}
