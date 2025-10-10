import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Question from "../../components/Question"

export default function CareGiverLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [key, setKey] = useState(0);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Caregiver Login</Text>
            <Question question="Username" 
                      emptyText="Enter username" 
                      value={username} 
                      onChange={(u: string) => setUsername(u)}
                      id={key+"username"}/>
            <Question question="Password" 
                      emptyText="Enter password" 
                      value={password} 
                      onChange={(p: string) => setPassword(p)}
                      id={key+"password"}/>
            <View style={styles.button}>
                <Button title="Submit"
                        onPress={() => {
                            console.log(username,password);
                            setUsername("");
                            setPassword("");
                            setKey(key+1);
                            }}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        padding: 20
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
    }
});