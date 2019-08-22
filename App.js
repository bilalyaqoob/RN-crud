import React from 'react';
import { View ,ScrollView , StyleSheet, StatusBar,ActivityIndicator,AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo';
import { primaryGradientArray } from "./app/utils/Colors";
import Header from "./app/components/Header";
import  Input  from "./app/components/Input";
import List from "./app/components/List";
import uuid from "uuid/v1";
import Button from "./app/components/Button";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    alignItems: 'center'
  },
  inputContainer: {
    marginTop: 40,
    paddingLeft: 15
  },
  list: {
    flex: 1,
    marginTop: 70,
    paddingLeft: 15,
    marginBottom: 10
  },
  scrollableList: {
    marginTop: 15
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deleteAllButton: {
    marginRight: 40
  }
});

class App extends React.Component {
  state = {loadingItems:false,inputValue:'',loading:false,allItems:{},isCompleted:false};
  
  componentDidMount(){
    this.loadingItems();
  };

  newInputValue = (value) => {
   this.setState({inputValue:value});
  };
  
  loadingItems = async()=>{
    try {
      const allItems = await AsyncStorage.getItem('ToDos');
      this.setState({
        loadingItems:true,
        allItems:JSON.parse(allItems) || {}
      });
    } catch (error) {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    }
  };

  onDoneAddItem = () =>{
    const {inputValue} = this.state;
    if(inputValue !== ''){
      this.setState(prevState => {
        const id = uuid();
        const newItemObject = {
          [id]:{
            id,
            isCompleted:false,
            text:inputValue,
            createdAt:Date.now()
          }
        };
        const newState = {
          ...prevState,
          inputValue:'',
          allItems:{
            ...prevState.allItems,
            ...newItemObject
          }
        };
        this.saveItems(newState.allItems);
        return {...newState};
      });
    }
  };

  deleteItem = id => {
    this.setState(prevState => {
      const allItems = prevState.allItems;
      delete allItems[id];
      const newState = {
        ...prevState,
        ...allItems
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };
  completeItem = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        allItems: {
          ...prevState.allItems,
          [id]: {
            ...prevState.allItems[id],
            isCompleted: true
          }
        }
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };
  incompleteItem = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        allItems: {
          ...prevState.allItems,
          [id]: {
            ...prevState.allItems[id],
            isCompleted: false
          }
        }
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };
  deleteAllItems = async () => {
    try {
      await AsyncStorage.removeItem('ToDos');
      this.setState({ allItems: {} });
    } catch (err) {
      console.log(err);
    }
  };
  saveItems = newItem => {
    const saveItem = AsyncStorage.setItem('To Dos', JSON.stringify(newItem));
  };

  render() {
    const {inputValue} = this.state;
    const headerTitle = 'App';
    return(
      <LinearGradient  colors={primaryGradientArray} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.centered}>
        <Header title={headerTitle}/>
      </View>
      <View style={styles.inputContainer}>
        <Input inputValue={inputValue} onChangeText={this.newInputValue} onDoneAddItem={this.onDoneAddItem}/>
      </View>
      <View style={styles.list}>
        <View style={styles.column}>
          <View style={styles.deleteAllButton}>
            <Button deleteAllItems={this.deleteAllItems}/>
          </View>
        </View>
        {this.state.loadingItems ?(
          <ScrollView contentContainerStyle={styles.ScrollView}>
            {Object.values(this.state.allItems).reverse().map(item=>(
              <List 
                key={item.id} 
                {...item} 
                deleteItem={this.deleteItem} 
                completeItem={this.completeItem}
                incompleteItem={this.incompleteItem}
              />
            ))}
          </ScrollView>
        ):(
          <ActivityIndicator size="large" color="white"/>
        )}
      </View>
      </LinearGradient>
    );
  }
}

export default App;