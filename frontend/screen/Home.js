/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo, useRef} from 'react';
import axios from 'axios';
import {addTask} from '../utils/axios';
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
  Snackbar,
  List,
  Paragraph,
  Menu,
  Searchbar,
} from 'react-native-paper';
import {Tab, TabView, ThemeProvider} from 'react-native-elements';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';
import moment from 'moment';

import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AddTask from './AddTask';
import Tasks from './Tasks';

const Home = () => {
  const {width, height, scale} = Dimensions.get('window');
  const navigation = useNavigation();
  //表示形式
  const [mode, setMode] = useState('list');
  //タスク
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
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
  const toggleMenu = () => setVisible(!visible);
  const closeMenu = () => setVisible(false);
  //ソート
  const [sort, setSort] = useState('date');
  //タスク取得
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/todo/')
      .then(res => {
        setTasks(res.data);
        //console.log(res.data);
      })
      .catch(error => console.log(error));
  }, [tasks]);

  function renderHeader() {
    return (
      <Appbar.Header style={{backgroundColor: COLORS.white}}>
        <Appbar.Content title="Task management" />
        <Appbar.Action />
        <Appbar.Action icon="dots-vertical" />
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
          {mode === 'list' ? (
            <Paragraph style={{marginHorizontal: 15, fontSize: SIZES.h3}}>
              Task List
            </Paragraph>
          ) : (
            <Paragraph style={{marginHorizontal: 15, fontSize: SIZES.h3}}>
              Task Matrix
            </Paragraph>
          )}
        </View>
        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="format-list-bulleted"
            size={20}
            color={mode === 'list' ? COLORS.black : COLORS.gray}
            onPress={() => setMode('list')}
          />
          <IconButton
            icon="view-dashboard"
            size={20}
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
            visible={visible}
            onDismiss={closeMenu}
            style={{position: 'absolute', top: 0}}
            anchor={
              <Button
                icon="sort-variant"
                mode="text"
                onPress={toggleMenu}
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
                onPress={() => navigation.navigate('TaskDetail', {task: task})}
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

  return (
    <View>
      {/* ヘッダ */}
      <View>{renderHeader()}</View>
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
      {/* タスク追加フォーム */}
      <View style={{position: 'absolute', bottom: 0, right: 20}}>
        <AddTask />
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

export default Home;
