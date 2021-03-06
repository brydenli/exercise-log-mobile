import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, ScrollView, Share} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {createExercise, deleteExercise} from '../src/graphql/mutations'
import {listExercises} from '../src/graphql/queries'

const initialState = {name: '', repetitions: 0, sets: 0};

const Main = ({navigation}) => {
    const [formState, setFormState] = useState(initialState)
    const [exercises, setExercises] = useState([]);
    const [refresh, setRefresh] = useState(false)

    const getExercises = async () => {
        try {
            const exercise_data = await API.graphql(graphqlOperation(listExercises));
            const exerciseList = exercise_data.data.listExercises.items;
            await setExercises(exerciseList);    
            console.log(exercises)
        }
        catch(err) {
            console.log(err)
        }
    };

    const setInput = (key, value) => {
        setFormState({...formState, [key]: value});
    };

    const createNewExercise = (e) => {
        e.persist();
        try {
            const newExercise = {...formState};
            setExercises([...exercises, newExercise]);
            setFormState(initialState);
            console.log(newExercise);
            API.graphql(graphqlOperation(createExercise, {input: newExercise}));
            setRefresh(true);
        }
        catch(err) {
            console.log(err)
        }
    };

    const deleteCurrentExercise = async (e, id) => {
        e.persist();
        try {
            API.graphql(graphqlOperation(deleteExercise, {input: {id}}));
            setExercises(exercises.filter(item => item.id !== id));
        }
        catch(err) {
            console.log(err);
        }
    }

    const onShare = async () => {
        try {
            let message = "Today's workout: \n";
            const create_message = () => {
                    exercises.map((item) => {
                    message = message + String(item.name) + ': ' + String(item.repetitions) + 'x' + String(item.sets) + '\n'
                 })
            }

            create_message();

            Share.share({
                message: message,
                title: 'Workout List'
            })
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getExercises();
        setRefresh(false);
    }, [refresh]);

    return (
        <View>
            <ScrollView>
            <Text>Exercise Log</Text>

            <TextInput
                value={formState.name}
                onChangeText={(text) => setInput('name', text)}
                placeholder="Name"
            ></TextInput>

           <TextInput
                value={formState.repetitions}
                keyboardType="numeric"
                onChangeText={(text) => setInput('repetitions', text)}
                placeholder="Repetitions"
            ></TextInput>

            <TextInput
                value={formState.sets}
                keyboardType="numeric"
                onChangeText={(text) => setInput('sets', text)}
                placeholder="Sets"
            ></TextInput>

            <Button title='Create new Exercise' onPress={(e) => createNewExercise(e)}/>

            {exercises.map((item, index) => (
                <View key={item.id ? item.id : index}>
                    <Text>Name: {item.name}</Text>
                    <Text>Repetitions: {item.repetitions}</Text>
                    <Text>Sets: {item.sets}</Text>
                    <Button title='Delete' onPress={(e) => deleteCurrentExercise(e, item.id)}/>
                </View>)
            )}

            <Button title='Share Workout' onPress={onShare}/>

            </ScrollView>
        </View>
    )
}

export default Main;