/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import {editTask} from '../utils/axios';
import {deleteTask} from '../utils/axios';
import {finishTask} from '../utils/axios';
import RNRestart from 'react-native-restart';
import {
  View,
  useWindowDimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  Appbar,
  Divider,
  FAB,
  Portal,
  TextInput,
  Title,
  Button,
  Provider,
  Menu,
  IconButton,
  Avatar,
  Card,
  Paragraph,
} from 'react-native-paper';
import moment from 'moment';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import {FONTS, COLORS, SIZES, icons} from '../constants';
import Form from './Form';
import Header from './Header';


const TaskDetail = ({navigation}) => {
  const route = useRoute();
  const window = useWindowDimensions();
  const [task, setTask] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isCompleteVisible, setCompleteVisible] = useState(false);
  //メニュー
  const [visible, setVisible] = useState(false);
  const toggleMenu = () => setVisible(!visible);
  const closeMenu = () => setVisible(false);
  //const scrollEnabled = 400 > window.height;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const toggleComplete = () => {
    setCompleteVisible(!isCompleteVisible);
  };

  //タスク完了
  const handleEdit = async (newTask) => {
    await editTask(task.id, newTask);
    setModalVisible(false);
    setTask(newTask);
    //RNRestart.Restart();
    navigation.goBack();
    Snackbar.show({
      text: 'Task Edited',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'green',
        onPress: () => { console.log('task edited.')},
      },
    });
  };
  //タスク編集
  const handleFinish = async () => {
    await finishTask(task);
    setModalVisible(false);
    //RNRestart.Restart();
    navigation.goBack();
    Snackbar.show({
      text: 'Congrats!',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'green',
        onPress: () => { console.log('task completed.')},
      },
    });
  };

  //タスク削除
  const handleDelete = (e) => {
    e.preventDefault();
    deleteTask(task.id);
    setAlertVisible(false);
    //RNRestart.Restart();
    navigation.goBack();
    Snackbar.show({
      text: 'Task Deleted',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'green',
        onPress: () => { console.log('task deleted.') },
      },
    });
  };

  useEffect(() => {
    let {task} = route.params;
    setTask(task);
  }, [route.params, task]);

  function renderHeader() {
    return (
      <Appbar.Header
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
      }}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="Task Detail" />
      <Provider>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            style={{position: 'absolute', top: 10}}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                onPress={toggleMenu}
                style={{marginLeft: 100, zIndex: 1}}
              />
            }>
            <Menu.Item icon='circle-edit-outline' onPress={toggleModal} title="Edit this task" />
            <Divider />
            <Menu.Item icon='delete' onPress={toggleAlert} title="delete this task" />
            <Divider />
            <Menu.Item icon='check' onPress={toggleComplete} title="Finish this task" />
          </Menu>
        </View>
      </Provider>
    </Appbar.Header>
    );
  }

  function renderTask() {
    return (
      <Card style={{borderRadius: 10, margin: 10, ...styles.shadow}}>
        <Card.Content>
          {/* タイトル・ジャンル・期日 */}
          <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Paragraph style={{fontSize: SIZES.h2, paddingTop: 5}}>{task.title}</Paragraph>
            <Paragraph style={{marginRight: 5}}>{task.category !== 1 && task.category > 3 ? 'Habit' : task.category === 3 ? 'Appointment' : task.category === 2 ? 'Event' : 'Work'}</Paragraph>
          </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <IconButton icon="clock" size={15} style={{margin: 0}}/>
              <Paragraph style={{fontSize: SIZES.body4}}> {moment(task.startDate).format('YYYY-MM-DD')}  ~  {moment(task.endDate).format('YYYY-MM-DD')}</Paragraph>
            </View>
          </View>
          {/* 概要 */}
          <View style={{maxHeight: 550}}>
            <Paragraph style={{fontSize: SIZES.h4, marginVertical: 10}}>概要</Paragraph>
            <ScrollView style={styles.description}>
              <Paragraph style={{fontSize: SIZES.h4, minHeight: 500}}>{task.description}</Paragraph>
            </ScrollView>
          </View>
          {/* 重要度、緊急度 */}
          <View style={{marginTop: 5}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 4}}>
            <Paragraph style={{fontSize: SIZES.h4}}>重要度</Paragraph>
            <Paragraph style={{fontSize: SIZES.h4}}> {task.priority !== 1 && task.priority > 2 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}</Paragraph>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 4}}>
            <Paragraph style={{fontSize: SIZES.h4}}>緊急度</Paragraph>
            <Paragraph style={{fontSize: SIZES.h4}}> {task.emergency !== 1 && task.emergency > 2 ? 'High' : task.emergency === 2 ? 'Medium' : 'Low'}</Paragraph>
          </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // function renderButton() {
  //   return (
  //   <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-around'}}>
  //   <FAB style={styles.fab} small label="edit" onPress={toggleModal} />
  //   <FAB style={styles.fab} small label="delete" onPress={toggleAlert} />
  //   </View>
  //   );
  //  }
  function renderComp() {
    return (
      <Modal
        style={{margin: 0}}
        isVisible={isCompleteVisible}
        onSwipeComplete={() => setCompleteVisible(false)}
        swipeDirection="left">
        <Card style={{backgroundColor: COLORS.white, margin: 40, padding: 10}}>
        <Card.Title title="Finish this task?" />
        <Card.Actions>
          <Button color={COLORS.darkblue} onPress={() => setCompleteVisible(false)}>Cancel</Button>
          <Button color={COLORS.darkblue} onPress={handleFinish}>Finish</Button>
        </Card.Actions>
        </Card>
    </Modal>
    );
  }
  function renderModal() {
    return (
      <Modal
        style={{margin: 0}}
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left">
      <Form formTitle="Task Detail" Title={task.title} Category={task.category} Completed={task.completed}
      Description={task.description} StartDate={new Date(task.startDate)} EndDate={new Date(task.endDate)}
      Priority={task.priority} Emergency={task.emergency} onCancel={() => setModalVisible(false)} onAdd={handleEdit}/>
    </Modal>
    );
  }

  function renderAlert() {
    return (
      <Modal
        style={{margin: 0}}
        isVisible={isAlertVisible}
        onSwipeComplete={() => setAlertVisible(false)}
        swipeDirection="left">
        <Card style={{backgroundColor: COLORS.white, margin: 40, padding: 10}}>
        <Card.Title title="Delete this task?" />
        <Card.Actions>
          <Button color={COLORS.darkblue} onPress={() => setAlertVisible(false)}>Cancel</Button>
          <Button color={COLORS.darkblue} onPress={handleDelete}>Delete</Button>
        </Card.Actions>
        </Card>
    </Modal>
    );
  }
  if (task) {
    return (
      <View>
        {/* ヘッダ */}
        <View style={{zIndex: 1}}>{renderHeader()}</View>
        {/* タスク詳細 */}
        <View>{renderTask()}</View>
        {/* タスク改訂 */}
        <View>{renderModal()}</View>
        <View>{renderAlert()}</View>
        <View>{renderComp()}</View>
      </View>
    );
  } else {
    return <View></View>;
  }
};

const styles = StyleSheet.create({
  description: {
    borderRadius: 5,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#ddd',
    padding: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  fab: {
    backgroundColor: COLORS.white,
    //position: 'absolute',
    marginHorizontal: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    width: 100,
    // height: 50,
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

export default TaskDetail;
