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
  ProgressBar,
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

import AddProject from './Projects/AddProject';
import Projects from './Projects/Projects';

const Home = () => {
  const {width, height, scale} = Dimensions.get('window');
  const navigation = useNavigation();
  //表示形式
  const [mode, setMode] = useState('list');
  //タスク
  const [projects, setProjects] = useState([]);
  const [habits, setHabits] = useState([]);
  //リスト用タスク
  const projects_comp = projects.filter(a => a.completed === true);
  const projects_ong = projects.filter(a => a.completed !== true);
  //タブ
  const [index, setIndex] = useState(0);
  //メニュー
  const [visible, setVisible] = useState(false);
  //プロジェクト取得
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/projects/')
      .then(res => {
        setProjects(res.data);
        //console.log(res.data);
      })
      .catch(error => console.log(error));
  }, [projects]);

  function renderHeader() {
    return (
      <Appbar.Header style={{backgroundColor: COLORS.white}}>
        <Appbar.Content title="Home" />
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
          <Paragraph style={{marginHorizontal: 15, fontSize: SIZES.h3}}>
            Projects
          </Paragraph>
        </View>
      </View>
    );
  }

  //リスト表示
  function renderProjectList(task, text) {
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
            {task.length} {text} projects
          </Paragraph>
        </View>
        <View style={{height: height / 1.5}}>
          <Projects projects={task} />
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
              {renderProjectList(projects_ong, 'ongoing')}
            </TabView.Item>
            <TabView.Item style={{width: '100%'}}>
              {renderProjectList(projects_comp, 'completed')}
            </TabView.Item>
          </TabView>
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
        <View>{renderTab()}</View>
      </View>
      {/* タスク追加フォーム */}
      <View style={{position: 'absolute', bottom: 0, right: 20}}>
        <AddProject />
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
    alignItems: 'center',
    justifyContent: 'center',
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
