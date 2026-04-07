import React, {useEffect, useEFfect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";

import styles from "../styles/styles";

import { getPeople, deletePerson } from "../servers/peopleCrud";

export default function HomeScreen({navigation}) {
    const [people, setPeople] = useState([]);

    async function loadPeople() {
        const data = await getPeople();
        setPeople(data);
    }

    useEffect(() => {
        loadPeople();
    }, []);

    return(
        <View style={styles.container}>

            <Text style={styles.title}>Pessoa</Text>
        </View>

    );
}