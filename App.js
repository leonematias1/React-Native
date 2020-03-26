import React, {useState, useEffect} from 'react';
import { StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard,
  Alert,
  AsyncStorage,
    } from 'react-native';
import {Ionicons, MaterialIcons} from "@expo/vector-icons"

export default function App() {

  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState ('');

  async function addTask(){
    if(newTask == ''){
      return;
    }
    //verifica se tem alguma task igual no newTask
    const search = task.filter(task => task == newTask);
    if(search.length != 0){
      Alert.alert("Atenção", "Essa tarefa já existe");
      //prossegir para não executar a tarefa abaixo
      return;
    }
  //passa uma lista 
  //Atribui toda a lista que já existe e o newTask
    setTask([...task ,newTask]);
    setNewTask('');
  //dispensa o teclado
    Keyboard.dismiss();
  }

  async function removeTask(item){
    Alert.alert(
      "Deletar tarefa",
      "Tem certeza que deseja remover esta tarefa?",
      [
        { 
          text: "Não",
          onPress: () => {
          return;
        },
          style: 'cancel'
        },
        {
          text: "Sim",
          onPress: () => setTask(task.filter(tasks => tasks != item ))
        }
      ],
      {cancelable:false}
    );

  }
  
  useEffect(() =>{
    async function loadData(){
      const task = await AsyncStorage.getItem("task");

      if(task){
        //converte novamente so que dessa vez do jason para o dado reconhecido
        setTask(JSON.parse(task));
      }
      loadData();
    }
  }, [])
 
  //dispara uma função de acordo uma situação
  //toda vez que alterar a task é salvo na memoria local do 
  //celular em JSON
  useEffect(() =>{
    async function saveData(){
      AsyncStorage.setItem("task", JSON.stringify(task))
    }
    saveData();
  },[task])

  return (
    //Fragment
    <>
    <KeyboardAvoidingView
    keyboardVerticalOffset={0}
    behavior="padding"
    style={{flex: 1}}
    >
    
    <View style={styles.container}>
    <View><Text style={{fontSize:15}}>Lista de tarefas</Text></View>
      <View style={styles.Body}>
        <FlatList 
        //usa dados da task para renderizar as taks em tela
        //De onde vem o dado
        data={task}
        //Id para que o native saiba qual é o item
        keyExtractor={item => item.toString()}
        showsVerticalScrollIndicator={false}
        //renderiza esse item
        renderItem={({item}) =>
        <View style={styles.ContainerView}>
          <Text style={styles.Texto}>{item}</Text>
          <TouchableOpacity
          onPress={()=> removeTask(item)}
          >
            <MaterialIcons name="delete-forever" 
            size={25} 
            color="#f64c75">
            </MaterialIcons>
          </TouchableOpacity>
        </View>}
        style={styles.FlatList}></FlatList>
      </View>
      
      <View style={styles.Form}>
          <TextInput
          style={styles.Input}
          placeholder="Adicione uma tarefa (Max 30 Caracteres)"
          placeholderTextColor = "#999"
          //Corrigir o que o user digita
          autoCorrect={true}
          maxLength={30}
          onChangeText={text => setNewTask(text)}
          value={newTask}
          ></TextInput>
          <TouchableOpacity style={styles.Button}
          //Colocado o evento on press e uma função para chamar a função
          //add task, se não por isso ela vai ser chamada repetidas vezes
          onPress={() => addTask()}>
            <Ionicons name="ios-add" size={25} color="#fff"></Ionicons>
          </TouchableOpacity>
      </View>

    </View>
    </KeyboardAvoidingView>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    //Ocupar todo de espaço que ele conseguir
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  Body: {
    flex:1,
  
  },
  Form: {
    padding: 0,
    height: 60,
    //alinha item ao centro
    justifyContent: 'center',
    //Ocupar largura toda
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop:13,
    borderTopWidth:1,
    borderColor: "#eee",
  },
  Input: {
    flex:1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "purple",
    borderRadius: 4,
    marginLeft: 10,
  },
  FlatList: {
    flex: 1,
    marginTop: 5,

  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: "#eee",

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: "#eee",
  },
  Texto: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: 'center',
  }

});
