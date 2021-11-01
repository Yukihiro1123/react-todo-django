import React, {useState, useEffect, useMemo, useRef} from 'react';
import axios from 'axios';
import {addTask} from '../../utils/axios';
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
  IconButton,
  Portal,
  Text,
  TextInput,
  Title,
  Button,
  Provider,
  Avatar,
  Card,
  Checkbox,
  List,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import {COLORS, FONTS, SIZES, icons, images} from '../../constants';
import TaskForm from './TaskForm';
//modalと追加ボタン、タスク追加ボタンの挙動
const AddTask = () => {
  const [tasks, setTasks] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  //タスク取得
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/projects/api/todo')
      .then(res => {
        setTasks(res.data);
        //console.log(res.data);
      })
      .catch(error => console.log(error));
  }, [tasks]);
  //タスク追加
  const onAdd = async task => {
    await addTask(task);
    console.log(task);
    setModalVisible(false);
    setTasks([...tasks, task]);
    console.log('task added');
    console.log(tasks);
    Snackbar.show({
      text: 'Task added successfully',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  function renderModal() {
    return (
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left">
        {/* フォーム */}
        <TaskForm
          formTitle={'Add Task'}
          Title={''}
          Category={1}
          Description={''}
          StartDate={new Date()}
          EndDate={new Date()}
          Priority={1}
          Emergency={1}
          Completed={false}
          Project={1}
          onCancel={() => setModalVisible(false)}
          onAdd={onAdd}
        />
      </Modal>
    );
  }

  function renderPlus() {
    return (
      <FAB
        icon="plus"
        onPress={toggleModal}
        theme={{colors: {accent: COLORS.black}}}
      />
    );
  }

  return (
    <View>
      {renderPlus()}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    backgroundColor: COLORS.white,
    //position: 'absolute',
    marginHorizontal: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    width: 160,
    // height: 50,
  },
  fab2: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
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

export default AddTask;
