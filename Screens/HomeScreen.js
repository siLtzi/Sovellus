import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });
  
    return unsubscribe;
  }, [navigation]);

  const loadTasks = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) setTasks(JSON.parse(storedTasks));
  };

  const toggleCompleted = async (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    loadTasks();
  };

  const deleteTask = async (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    loadTasks();
  };

  const confirmDelete = (index) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteTask(index) }
    ]);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => toggleCompleted(index)}>
        <Text style={item.completed ? styles.taskTextCompleted : styles.taskText}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(index)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Button
        title="Add Task"
        onPress={() => navigation.navigate('AddTask')}
      />
      <Button
        title="Open Map"
        onPress={() => navigation.navigate('Map')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  taskContainer: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 3,
    backgroundColor: '#d9f9b1',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    color: '#4f603c',
  },
  taskTextCompleted: {
    color: '#4f603c',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  map: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;