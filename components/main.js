import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {createExercise} from '../src/graphql/mutations'
import {listExercises} from '../src/graphql/queries'

const Main = () => {
    const [name, setName] = useState('');
    const [repititions, setRepititions] = useState(0)
    const [sets, setSets] = useState(0)
    const [exercises, setExercises] = useState([]);

    const getExercises = async () => {
        try {
            const exercise_data = await API.graphql(graphqlOperation(listExercises));
            const exerciseList = exercise_data.data.listExercises.items;
            setExercises(exerciseList);    
        }
        catch(err) {
            console.log(err)
        }
    };

    const createNewExercise = async () => {
        try {
            const newExercise = {
                name: name,
                repititions: repititions,
                sets: sets
            };
            setExercises([...exercises, newExercise]);
            setName('');
            setRepititions(0);
            setSets(0);
            
            await API.graphql(graphqlOperation(createExercise, {input: newExercise}));
        }
        catch(err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getExercises();
    }, []);

    return (
        <View>
            <Text>Exercise Log</Text>

            <TextInput
                value={name}
                onChange={(text) => setName(text)}
                placeholder="Name"
            ></TextInput>

           {/* <NumericInput
                value={repititions}
                onChangeText={(text) => setRepititions(text)}
                placeholder="Repetitions"
            ></NumericInput>

            <NumericInput
                value={sets}
                onChange={(text) => setSets(text)}
                placeholder="Sets"
            ></NumericInput>*/}

            <Button title='Create new Exercise'/>

            {exercises && exercises.map((item, index) => {
                <View key={item.id ? item.id : index}>
                    <Text>{item.name}</Text>
                    <Text>{item.repititions}</Text>
                    <Text>{item.sets}</Text>
                </View>
            })}
            
        </View>
    )
}

export default Main;