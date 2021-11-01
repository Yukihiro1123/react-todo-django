/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo, useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {addTask} from '../../utils/axios';
import RNRestart from 'react-native-restart';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Image,
  useWindowDimensions,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import {
  Appbar,
  Divider,
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
  Menu,
  Searchbar,
} from 'react-native-paper';
import {Tab, TabView, ThemeProvider} from 'react-native-elements';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES, icons, images} from '../../constants';
import moment from 'moment';

import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AddTask from '../Tasks/AddTask';
import Tasks from '../Tasks/Tasks';
import ProjectForm from './ProjectForm';
import {editProject} from '../../utils/axios';
import {deleteProject} from '../../utils/axios';
import {finishProject} from '../../utils/axios';

const Project = ({route}) => {
  const [project, setProject] = useState([]);
  const projectId = project.id;
  const {width, height, scale} = Dimensions.get('window');
  const navigation = useNavigation();
  //表示形式
  const [mode, setMode] = useState('list');
  //タスク
  const [tasks, setTasks] = useState([]);
  //リスト用タスク
  const tasks_comp = tasks.filter(a => a.completed === true);
  const tasks_ong = tasks.filter(a => a.completed !== true);
  const tasks_urg = tasks.filter(a => a.emergency >= 2);
  const tasks_imp = tasks.filter(a => a.priority >= 2);
  //マトリクス用タスク
  const tasks_first = tasks
    .filter(a => a.completed === false)
    .filter(a => a.priority > 1)
    .filter(a => a.emergency > 1);
  const tasks_second = tasks
    .filter(b => b.completed === false)
    .filter(b => b.priority > 1)
    .filter(b => b.emergency === 1);
  const tasks_third = tasks
    .filter(c => c.completed === false)
    .filter(c => c.priority === 1)
    .filter(c => c.emergency > 1);
  const tasks_forth = tasks
    .filter(d => d.completed === false)
    .filter(d => d.priority === 1)
    .filter(d => d.emergency === 1);
  //タブ
  const [index, setIndex] = useState(0);
  //メニュー
  const [visible, setVisible] = useState(false);
  const [visibleSort, setVisibleSort] = useState(false);
  const toggleMenu = () => setVisible(!visible);
  const closeMenu = () => setVisible(false);
  const toggleSort = () => setVisibleSort(!visibleSort);
  const closeSort = () => setVisibleSort(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isCompleteVisible, setCompleteVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const toggleComplete = () => {
    setCompleteVisible(!isCompleteVisible);
  };

  //ソート
  const [sort, setSort] = useState('date');

  //タスク完了
  const handleEdit = async newProject => {
    await editProject(project.id, newProject);
    setModalVisible(false);
    setProject(newProject);
    navigation.goBack();
    Snackbar.show({
      text: 'Project Edited',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'green',
        onPress: () => {
          console.log('project edited.');
        },
      },
    });
  };
  //タスク編集
  const handleFinish = async () => {
    await finishProject(project);
    setModalVisible(false);
    navigation.goBack();
    Snackbar.show({
      text: 'Congrats!',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'green',
        onPress: () => {
          console.log('project completed.');
        },
      },
    });
  };

  //タスク削除
  const handleDelete = e => {
    e.preventDefault();
    deleteProject(project.id);
    setAlertVisible(false);
    navigation.goBack();
    Snackbar.show({
      text: 'Project Deleted',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'green',
        onPress: () => {
          console.log('project deleted.');
        },
      },
    });
  };

  //タスク取得
  useEffect(() => {
    let {project} = route.params;
    setProject(project);
    axios
      .get('http://127.0.0.1:8000/api/projects/api/todo/')
      .then(res => {
        setTasks(res.data.filter(a => a.project === projectId));
        //console.log(res.data);
      })
      .catch(error => console.log(error));
  }, [project, route.params, tasks, projectId]);

  function renderHeader() {
    return (
      <Appbar.Header style={{backgroundColor: COLORS.white}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={project.projectName}
          subtitle={project.overview}
        />
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
              <Menu.Item
                icon="circle-edit-outline"
                onPress={toggleModal}
                title="Edit this project"
              />
              <Divider />
              <Menu.Item
                icon="delete"
                onPress={toggleAlert}
                title="delete this project"
              />
              <Divider />
              <Menu.Item
                icon="check"
                onPress={toggleComplete}
                title="Finish this project"
              />
            </Menu>
          </View>
        </Provider>
      </Appbar.Header>
    );
  }

  function renderSwitchMode() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          marginRight: 10,
          height: 30,
        }}>
        <View>
          <Paragraph style={{marginHorizontal: 15, fontSize: SIZES.h4}}>
            Deadline : {moment(project.deadline).format('YYYY-MM-DD')}
          </Paragraph>
        </View>
        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="format-list-bulleted"
            size={25}
            color={mode === 'list' ? COLORS.black : COLORS.gray}
            onPress={() => setMode('list')}
          />
          <IconButton
            icon="view-dashboard"
            size={25}
            color={mode === 'matrix' ? COLORS.black : COLORS.gray}
            onPress={() => setMode('matrix')}
          />
        </View>
      </View>
    );
  }

  function sortFunc() {
    if (sort === 'date') {
      return (a, b) => new Date(a.startDate) - new Date(b.startDate);
    } else if (sort === 'priority') {
      return (a, b) => b.priority - a.priority;
    }
  }

  function renderSort() {
    return (
      <Provider>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 0,
            marginRight: 5,
          }}>
          <Menu
            visible={visibleSort}
            onDismiss={closeSort}
            style={{position: 'absolute', top: 0}}
            anchor={
              <Button
                icon="sort-variant"
                mode="text"
                onPress={toggleSort}
                color={COLORS.black}>
                Sort by
              </Button>
            }>
            <Menu.Item onPress={() => setSort('date')} title="date" />
            <Menu.Item onPress={() => setSort('priority')} title="priority" />
          </Menu>
        </View>
      </Provider>
    );
  }

  //リスト表示
  function renderTaskList(task, text) {
    //タスクの量とタスクリスト
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            zIndex: 1,
          }}>
          <Paragraph style={{marginHorizontal: 10}}>
            {task.length} {text} tasks
          </Paragraph>
          {renderSort()}
        </View>
        <View style={{height: height / 1.5}}>
          <Tasks tasks={task} func={sortFunc()} />
        </View>
      </View>
    );
  }
  function renderTab() {
    return (
      <View
        style={{
          maxHeight: height / 1.45,
          margin: 1,
          marginTop: 0,
          ...styles.shadow,
        }}>
        <Tab
          value={index}
          onChange={setIndex}
          indicatorStyle={{backgroundColor: COLORS.black}}>
          <Tab.Item
            title="ongoing"
            animationtype="timing"
            style={styles.tabItem}
            variant="primary"
            indicatorStyle={{backgroundColor: COLORS.white}}
            containerStyle={styles.tabContainer}
            titleStyle={styles.tabTitle}
          />
          <Tab.Item
            title="important"
            animationtype="timing"
            style={styles.tabItem}
            variant="primary"
            indicatorStyle={{backgroundColor: COLORS.white}}
            containerStyle={styles.tabContainer}
            titleStyle={styles.tabTitle}
          />
          <Tab.Item
            title="urgent"
            animationtype="timing"
            style={styles.tabItem}
            variant="primary"
            indicatorStyle={{backgroundColor: COLORS.white}}
            containerStyle={styles.tabContainer}
            titleStyle={styles.tabTitle}
          />
          <Tab.Item
            title="completed"
            animationtype="timing"
            style={styles.tabItem}
            variant="primary"
            indicatorStyle={{backgroundColor: COLORS.white}}
            containerStyle={styles.tabContainer}
            titleStyle={styles.tabTitle}
          />
        </Tab>
        <View style={{marginTop: 8, height: '80%'}}>
          <TabView value={index} onChange={setIndex}>
            <TabView.Item style={{width: '100%'}}>
              {renderTaskList(tasks_ong, 'ongoing')}
            </TabView.Item>
            <TabView.Item style={{width: '100%'}}>
              {renderTaskList(tasks_imp, 'important')}
            </TabView.Item>
            <TabView.Item style={{width: '100%'}}>
              {renderTaskList(tasks_urg, 'urgent')}
            </TabView.Item>
            <TabView.Item style={{width: '100%'}}>
              {renderTaskList(tasks_comp, 'completed')}
            </TabView.Item>
          </TabView>
        </View>
      </View>
    );
  }

  //マトリックス表示
  function renderTaskMatrix(tasks, text, color) {
    return (
      <View
        style={{
          marginHorizontal: 5,
          marginTop: 0,
          marginBottom: 5,
          padding: 5,
          backgroundColor: COLORS.white,
          width: width / 2.2,
          height: 290,
          borderRadius: 10,
          ...styles.shadow,
        }}>
        <View>
          <Paragraph style={{fontSize: SIZES.body5, color: color}}>
            {text}
          </Paragraph>
        </View>
        <ScrollView style={{paddingTop: 3}}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Task', {task: task})}
                style={{paddingVertical: 1}}>
                <Paragraph style={{paddingHorizontal: 5}}>
                  {task.title}
                </Paragraph>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{justifyContent: 'center'}}>
              <Paragraph
                style={{
                  fontSize: SIZES.h4,
                  color: COLORS.gray,
                  paddingVertical: width / 5,
                  paddingHorizontal: width / 8,
                  margin: 0,
                }}>
                No tasks
              </Paragraph>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
  function renderMatrix() {
    return (
      <View>
        {/* priority高いグループ2つ */}
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <View style={{marginBottom: 5}}>
            {renderTaskMatrix(tasks_first, 'Important & Urgent', '#cd5c5c')}
          </View>
          <View style={{marginBottom: 5}}>
            {renderTaskMatrix(
              tasks_second,
              'Important & Not Urgent',
              '#daa520',
            )}
          </View>
        </View>
        {/* priority低いグループ2つ */}
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <View>
            {renderTaskMatrix(tasks_third, 'Unimportant & Urgent', '#4682b4')}
          </View>
          <View>
            {renderTaskMatrix(
              tasks_forth,
              'Unimportant & Not Urgent',
              '#008080',
            )}
          </View>
        </View>
      </View>
    );
  }
  function renderComp() {
    return (
      <Modal
        style={{margin: 0}}
        isVisible={isCompleteVisible}
        onSwipeComplete={() => setCompleteVisible(false)}
        swipeDirection="left">
        <Card style={{backgroundColor: COLORS.white, margin: 40, padding: 10}}>
          <Card.Title title="Finish this project?" />
          <Card.Actions>
            <Button
              color={COLORS.darkblue}
              onPress={() => setCompleteVisible(false)}>
              Cancel
            </Button>
            <Button color={COLORS.darkblue} onPress={handleFinish}>
              Finish
            </Button>
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
        <ProjectForm
          formTitle="Task Detail"
          ProjectName={project.projectName}
          Completed={project.completed}
          Overview={project.overview}
          Deadline={new Date(project.deadline)}
          onCancel={() => setModalVisible(false)}
          onAdd={handleEdit}
        />
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
          <Card.Title
            title="Delete this Project?"
            subtitle="Task will be deleted as well."
          />
          <Card.Actions>
            <Button
              color={COLORS.darkblue}
              onPress={() => setAlertVisible(false)}>
              Cancel
            </Button>
            <Button color={COLORS.darkblue} onPress={handleDelete}>
              Delete
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    );
  }

  return (
    <View>
      {/* ヘッダ */}
      <View style={{zIndex: 1}}>{renderHeader()}</View>
      {/* カテゴリヘッダ */}
      <View style={{marginBottom: 10}}>{renderSwitchMode()}</View>
      {/* タスク一覧 */}
      <View>
        {mode === 'list' ? (
          <View>{renderTab()}</View>
        ) : (
          <View>{renderMatrix()}</View>
        )}
      </View>
      <View>{renderModal()}</View>
      <View>{renderAlert()}</View>
      <View>{renderComp()}</View>
      {/* タスク追加フォーム */}
      <View style={{position: 'absolute', bottom: 0, right: 20}}>
        <AddTask projectId={projectId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    padding: 0,
    margin: 0,
    width: 100,
    backgroundColor: COLORS.white,
    color: COLORS.white,
  },
  tabContainer: {
    width: 1000,
    backgroundColor: COLORS.white,
    margin: 0,
    paddingHorizontal: 0,
  },
  tabTitle: {
    color: COLORS.black,
    fontSize: 13,
    margin: 0,
    paddingHorizontal: 0,
  },
  search: {
    width: '75%',
  },
  hide: {
    backgroundColor: 'transparent',
    width: '25%',
  },
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
  bar_low: {
    width: 5,
    height: 10,
    paddingVertical: 18,
    marginRight: 15,
    backgroundColor: COLORS.blue,
  },
  bar_mid: {
    width: 5,
    height: 10,
    paddingVertical: 18,
    marginRight: 15,
    backgroundColor: COLORS.yellow,
  },
  bar_high: {
    width: 5,
    height: 10,
    paddingVertical: 18,
    marginRight: 15,
    backgroundColor: COLORS.peach,
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

export default Project;
