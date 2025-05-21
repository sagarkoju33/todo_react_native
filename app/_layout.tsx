import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Todo = {
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "TODOS";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // Load todos from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setTodos(JSON.parse(data));
    });
  }, []);

  // Save todos to storage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (task.trim()) {
      setTodos([
        ...todos,
        { text: task, createdAt: new Date().toLocaleString() },
      ]);
      setTask("");
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingText("");
    }
  };

  const startEdit = (index: number, text: string) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const saveEdit = (index: number) => {
    if (editingText.trim()) {
      const newTodos = [...todos];
      newTodos[index].text = editingText;
      setTodos(newTodos);
      setEditingIndex(null);
      setEditingText("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Add" onPress={addTodo} />
      <TouchableOpacity style={styles.customButton} onPress={addTodo}>
        <Text style={styles.customButtonText}>Custom Button</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.todoItem}>
            {editingIndex === index ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={editingText}
                  onChangeText={setEditingText}
                  autoFocus
                />
                <TouchableOpacity onPress={() => saveEdit(index)}>
                  <Text style={styles.save}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingIndex(null)}>
                  <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={{ flex: 1 }}>
                  <Text>{item.text}</Text>
                  <Text style={styles.time}>{item.createdAt}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => startEdit(index, item.text)}>
                    <Text style={styles.edit}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeTodo(index)}>
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    flex: 1,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  edit: { color: "blue", marginLeft: 16 },
  save: { color: "green", marginLeft: 16 },
  cancel: { color: "orange", marginLeft: 16 },
  delete: { color: "red", marginLeft: 16 },
  customButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginTop: 16,
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  customButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
