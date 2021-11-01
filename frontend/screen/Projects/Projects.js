import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import moment from 'moment';
import {addTask} from '../../utils/axios';
import {editTask} from '../../utils/axios';
import {deleteTask} from '../../utils/axios';
import {finishTask} from '../../utils/axios';
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
  Colors,
  Checkbox,
  List,
  Paragraph,
  ProgressBar,
  Searchbar,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES, icons, images} from '../../constants';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';

const Projects = ({projects, func}) => {
  //一つ一つのタスクを表示
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  //進捗計算関数
  function CalcProgress(a, b) {
    if (isNaN(a / b) === true) {
      return 0;
    }
    if (a === 0 || b === 0) {
      return 0;
    }
    if (a === 0) {
      return 0;
    }
    if (b === 0) {
      return 0;
    }
    if (isNaN(a) || isNaN(b)) {
      return 0;
    } else {
      return a / b;
    }
  }

  const renderItem = ({item}) => (
    <View>
      <Card
        onPress={() => navigation.navigate('Project', {project: item})}
        style={{borderRadius: 10, margin: 5, padding: 0, ...styles.shadow}}>
        <Card.Content
          style={{
            padding: 0,
            flexDirection: 'row',
            alignItems: 'center',
            height: 120,
            width: 185,
          }}>
          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <Paragraph style={{fontSize: SIZES.h4}}>
              {item.projectName}
            </Paragraph>
            <Paragraph style={{fontSize: SIZES.body5, color: COLORS.gray2}}>
              {moment(item.deadline).fromNow()}
            </Paragraph>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Paragraph style={{fontSize: SIZES.body5, color: COLORS.gray2}}>
                {item.todo.length} tasks
              </Paragraph>
              {item.todo.length !== 0 &&
              item.todo.filter(a => a.completed === true).length !== 0 ? (
                <Paragraph
                  style={{
                    fontSize: SIZES.body5,
                    color: COLORS.black,
                    marginLeft: 80,
                  }}>
                  {Math.round(
                    (item.todo.filter(a => a.completed === true).length /
                      item.todo.length) *
                      100,
                  )}
                  %
                </Paragraph>
              ) : (
                <Paragraph
                  style={{
                    fontSize: SIZES.body5,
                    color: COLORS.black,
                    marginLeft: 80,
                  }}>
                  0%
                </Paragraph>
              )}
            </View>
            <View style={{margin: 10}}>
              <ProgressBar
                progress={CalcProgress(
                  item.todo.filter(a => a.completed === true).length,
                  item.todo.length,
                )}
                color={COLORS.black}
                style={{height: 3, width: 130}}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
  return (
    <View>
      {projects.length > 0 ? (
        <View
          style={{
            marginRight: 5,
            margin: 0,
            padding: 0,
          }}>
          <FlatList
            data={projects} //.sort((a, b) => b.priority - a.priority) で重要度高い順
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
            numColumns={2}
          />
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: SIZES.padding,
            marginBottom: SIZES.margin,
          }}>
          <Paragraph
            style={{
              fontSize: SIZES.h2,
              color: COLORS.gray,
              padding: SIZES.padding,
              margin: SIZES.margin,
            }}>
            No projects to show.
          </Paragraph>
        </View>
      )}
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
  bar_low: {
    width: 5,
    height: 10,
    paddingVertical: 18,
    marginRight: 15,
    backgroundColor: COLORS.steelblue,
  },
  bar_mid: {
    width: 5,
    height: 10,
    paddingVertical: 18,
    marginRight: 15,
    backgroundColor: COLORS.goldenrod,
  },
  bar_high: {
    width: 5,
    height: 10,
    paddingVertical: 18,
    marginRight: 15,
    backgroundColor: COLORS.indianRed,
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

export default Projects;
