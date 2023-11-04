import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';

const AddTaskScreen = ({ navigation }) => {
  const [newTask, setNewTask] = useState('');
  const [location, setLocation] = useState(null);

  const handleAddTask = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    tasks.push({ title: newTask, completed: false, location: location });
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter task"
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
      />
      <Button
        title="Add Task"
        onPress={handleAddTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 12,
    padding: 8,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
});

export default AddTaskScreen;
