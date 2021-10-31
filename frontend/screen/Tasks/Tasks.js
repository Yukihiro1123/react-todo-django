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
  Checkbox,
  List,
  Paragraph,
  Searchbar,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES, icons, images} from '../../constants';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';

const Tasks = ({tasks, func}) => {
  //一つ一つのタスクを表示
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const closeModal = () => setModal(false);

  //e => handleDelete(e, item)
  function renderModal(item) {
    return (
      <Modal
        style={{margin: 0}}
        isVisible={modal}
        onSwipeComplete={closeModal}
        swipeDirection="left">
        <Card style={{backgroundColor: COLORS.white, margin: 40, padding: 10}}>
          <Card.Content>
            <Title>Delete this task?</Title>
          </Card.Content>
          <Card.Actions>
            <Button color={COLORS.darkblue} onPress={closeModal}>
              Cancel
            </Button>
            <Button color={COLORS.darkblue} onPress={() => console.log(item)}>
              Delete
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    );
  }
  const renderItem = ({item}) => (
    <View>
      <Card
        onPress={() => navigation.navigate('Task', {task: item})}
        onLongPress={toggleModal}
        style={{borderRadius: 10, margin: 5, padding: 0, ...styles.shadow}}>
        <Card.Content
          style={{
            padding: 0,
            flexDirection: 'row',
            alignItems: 'center',
            height: 65,
          }}>
          <View
            style={[
              item.priority !== 1 && item.priority > 2
                ? styles.bar_high
                : item.priority === 2
                ? styles.bar_mid
                : styles.bar_low,
            ]}></View>
          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <Paragraph style={{fontSize: SIZES.h4}}>{item.title}</Paragraph>
            <Paragraph style={{fontSize: SIZES.body5, color: COLORS.gray2}}>
              {moment(item.startDate).fromNow()}
            </Paragraph>
          </View>
          <View style={{position: 'absolute', left: '95%'}}>
            <TouchableOpacity
              style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}
              onPress={() => navigation.navigate('Task', {task: item})}>
              <Image
                source={icons.chevron}
                resizeMode="contain"
                style={{justifyContent: 'flex-end', width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>
          <View>{renderModal(JSON.parse(JSON.stringify(item.id)))}</View>
        </Card.Content>
      </Card>
    </View>
  );
  return (
    <View>
      {tasks.length > 0 ? (
        <View
          style={{
            marginRight: 5,
            margin: 0,
            padding: 0,
          }}>
          <FlatList
            data={tasks.sort(func)} //.sort((a, b) => b.priority - a.priority) で重要度高い順
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
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
            No tasks to show.
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

export default Tasks;
