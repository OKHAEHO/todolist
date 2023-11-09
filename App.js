import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight,
  TouchableWithoutFeedback, TextInput,ScrollView, Alert } from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Fontisto} from '@expo/vector-icons';

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working,setWortking] = useState(true);
  const travel = () => setWortking(false);
  const work = () => setWortking(true);
  const onChangeText =(payload) => setText(payload);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({})
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      console.log(s, JSON.parse(s));
      setToDos(JSON.parse(s));
    } catch(s){
      //save error
    }
  };
  
  useEffect(()=>{
    loadToDos();
  }, []);

  const addToDo = async () => {
    if(text === ""){
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, working}
    };
    setToDos(newToDos);
    await saveToDos(newToDos)
    setText("");
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do", "Are u sure?", [
      {text:"Cancel"},
      {
        text:"I'm Sure", 
      style:"destructive",
      onPress: () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      },
    },
    ]);
    return;
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white": theme.gray}}>Work</Text> 
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white": theme.gray }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
        onSubmitEditing={addToDo} 
        onChangeText={onChangeText} 
        value={text} 
        returnKeyType='done' 
        placeholder={working ? "Add a To Do" : "Where do you want to go"} 
        style={styles.input} 
        />
        <ScrollView>
          {
            Object.keys(toDos).map(key => (
              toDos[key].working === working ?
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={18} color="gray" />
              </TouchableOpacity>
              
            </View> : null
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    //padding:"0px 10px" //위아래는 0px, 좌우는 10px을 준다는 뜻
    paddingHorizontal:20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnText:{
    
    fontSize:36,
    fontWeight:"600",
  },
  input : {
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius: 30,
    marginTop:20,
    marginBottom:20,
    fontSize:18,
  },
  toDo:{
    backgroundColor: theme.toDobg,
    marginBottom: 10,
    paddingVertical:20,
    paddingHorizontal:40,
    borderRadius:15,
    flexDirection:'row',
    alignContent:'center',
    justifyContent:'space-between'

  },
  toDoText: {
    color:"white",
    fontSize:16,
    fontWeight:"500",
  }
});
