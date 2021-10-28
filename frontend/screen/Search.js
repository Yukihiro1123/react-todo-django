import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import Tasks from './Tasks';
import RNRestart from 'react-native-restart';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import {
  Appbar,
  FAB,
  Portal,
  Text,
  TextInput,
  Title,
  Button,
  Provider,
  Avatar,
  Card,
  Checkbox,
  Snackbar,
  List,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
//import {SearchBar} from 'react-native-elements';

import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';

const Search = () => {
  const [tasks, setTasks] = useState([]);
  //検索条件
  const [filteredTasks, setFilteredTasks] = useState([]);
  //検索
  const [query, setQuery] = useState('');
  const handleFilter = query => {
    setQuery(query);
    if (query.replace(' ').replace('　') !== '') {
      setFilteredTasks(
        tasks.filter(task =>
          task.title.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }
  };
  //タスク取得
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/todo/')
      .then(res => {
        setTasks(res.data);
        //console.log(res.data);
      })
      .catch(error => console.log(error));
  }, []);

  function renderSearch() {
    return (
      <View>
        {/* フォーム */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10,
            marginTop: 50,
            paddingVertical: 10,
          }}>
          {/* <SearchBar
            placeholder="Type Here..."
            onChangeText={handleFilter}
            value={query}
            buttonStyle={{width: 300}}
            onClear={() => setQuery('')}
          /> */}
          <Searchbar
            placeholder="Search Tasks"
            onChangeText={handleFilter}
            value={query}
            theme={{colors: {primary: '#696969'}}}
          />
        </View>
        <View>
          <Paragraph style={{marginHorizontal: 8}}>
            {filteredTasks.length} results
          </Paragraph>
        </View>
      </View>
    );
  }
  return (
    <View>
      <View>{renderSearch()}</View>
      <Tasks tasks={filteredTasks} />
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});

export default Search;
