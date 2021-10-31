import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {COLORS, FONTS, SIZES, icons, images} from '../../constants';
import uuid from 'react-native-uuid';
import moment from 'moment';
import SwitchSelector from 'react-native-switch-selector';
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
  HelperText,
  Title,
  Button,
  Provider,
  Avatar,
  Card,
  Switch,
  List,
  Paragraph,
} from 'react-native-paper';
import {FormBuilder} from 'react-native-paper-form-builder';
import {useController, useForm} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const ProjectForm = ({
  formTitle,
  ProjectName,
  Overview,
  Deadline,
  Completed,
  onCancel,
  onAdd,
}) => {
  //バリデーションが必要なのは、TitleとCategory（Dateも）
  const [valTitle, setValTitle] = useState(false);
  const [valDesc, setValDesc] = useState(false);
  const [valDate, setValDate] = useState(false);
  //フォーム
  //追加
  const [projectName, setProjectName] = useState(ProjectName);
  //文字
  const [overview, setOverview] = useState(Overview);
  //時間
  const [deadline, setDeadline] = useState(Deadline);
  //完了
  const [completed, setComplete] = useState(Completed);
  const onToggleSwitch = () => setComplete(!completed);
  //フォーム提出
  const onSubmit = e => {
    e.preventDefault();
    if (new Date() > overview) {
      setValDate(true);
    }
    if (projectName.replace(' ', '').replace('　', '') === '') {
      setValTitle(true);
      //setValDesc(false);
    }
    if (projectName.length > 10) {
      //setValTitle(false);
      setValTitle(true);
    }
    if (overview.replace(' ', '').replace('　', '') === '') {
      //setValTitle(false);
      setValDesc(true);
    }
    if (overview.length > 20 || overview.length < 3) {
      setValDesc(true);
      console.log(overview.length);
    } else {
      setValTitle(false);
      setValDesc(false);
      onAdd({
        projectName,
        overview,
        deadline,
        completed,
      });
    }
  };

  //datetime
  const onChangeStart = (event, selectedDate) => {
    const currentStartDate = selectedDate || deadline;
    setDeadline(currentStartDate);
    console.log(deadline);
  };

  function DeadlinePick() {
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={deadline}
          mode="datetime"
          is24Hour={true}
          display="compact"
          style={{width: 200}}
          minimumDate={new Date(2020, 1, 1)}
          onChange={onChangeStart}
        />
      </View>
    );
  }

  function Check() {
    return (
      <Switch
        value={completed}
        onValueChange={onToggleSwitch}
        color={COLORS.darkblue}
      />
    );
  }
  return (
    <Card
      style={{backgroundColor: COLORS.white, margin: 1, padding: 1}}
      onSubmit={onSubmit}>
      <Card.Title title={formTitle} />
      <Card.Content>
        {/* プロジェクト名 */}
        <View>
          <View style={{flexDirection: 'row', marginVertical: 5}}>
            <Text style={{fontSize: SIZES.body3}}>Project Title</Text>
            <HelperText
              type="error"
              visible={valTitle}
              style={{fontSize: SIZES.body4}}>
              invalid title
            </HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Enter Title"
              value={projectName}
              style={{backgroundColor: COLORS.white}}
              onChangeText={projectName => setProjectName(projectName)}
              right={<TextInput.Affix text="/20" />}
              theme={{colors: {primary: '#696969'}}}
            />
          </View>
        </View>
        {/* 概要 */}
        <View>
          <View
            style={{marginTop: 10, marginVertical: 5, flexDirection: 'row'}}>
            <Text style={{fontSize: SIZES.body3}}>Project Overview</Text>
            <HelperText
              type="error"
              visible={valDesc}
              style={{fontSize: SIZES.body4}}>
              invalid overview
            </HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Enter Overview"
              multiline
              value={overview}
              style={{backgroundColor: COLORS.white, maxHeight: 100}}
              right={<TextInput.Affix text="/1000" />}
              onChangeText={overview => setOverview(overview)}
              theme={{colors: {primary: '#696969'}}}
            />
          </View>
        </View>
        {/* 日付 */}
        <View>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: SIZES.body3, marginRight: 40}}>
              Deadline{' '}
            </Text>
            <View>{DeadlinePick()}</View>
            <HelperText
              type="error"
              visible={valDate}
              style={{fontSize: SIZES.body4}}>
              invalid date.
            </HelperText>
          </View>
        </View>
        {/* 状態 */}
        <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: SIZES.body3}}>Status</Text>
          {Check()}
        </View>
      </Card.Content>
      <View
        style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
        <Button
          color={COLORS.darkblue}
          onPress={onCancel}
          style={{marginRight: 10}}>
          Cancel
        </Button>
        <Button color={COLORS.darkblue} onPress={onSubmit} type="Submit">
          Submit
        </Button>
      </View>
    </Card>
  );
};

export default ProjectForm;
