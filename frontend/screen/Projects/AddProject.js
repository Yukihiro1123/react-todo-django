import React, {useState, useEffect, useMemo, useRef} from 'react';
import axios from 'axios';
import {addProject} from '../../utils/axios';
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
import ProjectForm from './ProjectForm';
//modalと追加ボタン、タスク追加ボタンの挙動
const AddProject = () => {
  const [projects, setProjects] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  //タスク取得
  useEffect(() => {
    let isMounted = true;
    axios
      .get('http://127.0.0.1:8000/api/projects/')
      .then(res => {
        if (isMounted) {
          setProjects(res.data);
        }
        //console.log(res.data);
      })
      .catch(error => console.log(error));
    return () => {
      isMounted = false;
    };
  }, [projects]);
  //タスク追加
  const onAdd = async project => {
    await addProject(project);
    console.log(project);
    setModalVisible(false);
    setProjects([...projects, project]);
    console.log('project added');
    Snackbar.show({
      text: 'Project added successfully',
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
        <ProjectForm
          formTitle={'Add Project'}
          ProjectName={''}
          Overview={''}
          Deadline={new Date()}
          Completed={false}
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

export default AddProject;
