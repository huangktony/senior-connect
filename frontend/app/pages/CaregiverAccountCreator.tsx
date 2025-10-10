import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Question from "../../components/Question"

export default function CaregiverAccountCreator() {
    const initialUserState : Caregiver = {
        username: "",
        password: "",
        location: "",
        elderUsername: ""
    }
    const [user, setUser] = useState(initialUserState);
    const [key, setKey] = useState(0);
    const changeUsername = (u: string) => setUser({...user, username: u});
    const changePassword = (p: string) => setUser({...user, password: p});
    const changeLocation = (l: string) => setUser({...user, location: l});
    const changeElderUsername = (e: string) => setUser({...user, elderUsername: e});
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Caregivers: Create your Account</Text>
            <Question question="Username" 
                      emptyText="Enter username" 
                      value={user.username} 
                      onChange={changeUsername}
                      id={key+"username"}/>
            <Question question="Password" 
                      emptyText="Enter password" 
                      value={user.password} 
                      onChange={changePassword}
                      id={key+"password"}/>
            <Question question="Location" 
                      emptyText="Enter location" 
                      value={user.location} 
                      onChange={changeLocation}
                      id={key+"location"}/>
            <Question question="Your depndent's username" 
                      emptyText="Enter depndent's username" 
                      value={user.elderUsername} 
                      onChange={changeElderUsername}
                      id={key+"elderUsername"}/>
            <View style={styles.button}>
                <Button title="Submit"
                        onPress={() => {
                            console.log(user);
                            setUser({...initialUserState});
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
        fontSize: 30,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
    }
});


interface Caregiver {
    username: string; 
    password: string; 
    location: string; 
    elderUsername: string};
