/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';
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

const Form = ({formTitle, Title, Completed, Category, Description, StartDate, EndDate, Priority, Emergency, onCancel, onAdd}) => {
  //バリデーションが必要なのは、TitleとCategory（Dateも）
  const [valTitle, setValTitle] = useState(false);
  const [valDesc, setValDesc] = useState(false);
  const [valDate, setValDate] = useState(false);
  //フォーム
  //文字
  const [title, setTitle] = useState(Title);
  const [category, setCategory] = useState(Category);
  const [description, setDescription] = useState(Description);
  //時間
  const [startDate, setStartDate] = useState(StartDate);
  const [endDate, setEndDate] = useState(EndDate);
  //選択系
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreValue, setGenreValue] = useState(Category);
  const [genreItems, setGenreItems] = useState([
    {label: 'Work', value: 1},
    {label: 'Event', value: 2},
    {label: 'Appointment', value: 3},
    {label: 'Habit', value: 4},
  ]);
  //重要度
  const [priority, setPriority] = useState(Priority);
  const [emergency, setEmergency] = useState(Emergency);
  const priorityOption = [
    {label: 'Low', value: 1, activeColor: COLORS.steelblue},
    {label: 'Medium', value: 2, activeColor: COLORS.goldenrod},
    {label: 'High', value: 3, activeColor: COLORS.indianRed},
  ];
  //完了
  const [completed, setComplete] = useState(Completed);
  const onToggleSwitch = () => setComplete(!completed);
  //フォーム提出
  const onSubmit = (e) => {
    e.preventDefault();
    if (startDate > endDate) {
    setValDate(true);
    }
    if (title.replace(' ', '').replace('　','') === '') {
    setValTitle(true);
    //setValDesc(false);
    }
    if (title.length > 20){
      //setValTitle(false);
      setValTitle(true);
      }
    if (description.replace(' ', '').replace('　','') === '') {
    //setValTitle(false);
    setValDesc(true);
    }
    if (description.length > 1000 || description.length < 3) {
      setValDesc(true);
      console.log(description.length);
    } else {
    setValTitle(false);
    setValDesc(false);
    onAdd({title, category, description, startDate, endDate, priority, emergency, completed});
    }
  };
  //category
  function dropDown() {
    return (
      <DropDownPicker
        placeholder="Select Category"
        open={genreOpen}
        value={genreValue}
        items={genreItems}
        setOpen={setGenreOpen}
        setValue={setGenreValue}
        setItems={setGenreItems}
        textStyle={{color: COLORS.gray2}}
        style={{height: 56, borderColor: COLORS.gray2, borderRadius: 5}}
        dropDownContainerStyle={{borderColor: COLORS.gray2}}
        onChangeValue={value => setCategory(value)}
      />
    );
  }
  //priority
  function switchSelectPriority() {
    return (
      <SwitchSelector
        options={priorityOption}
        initial={priority-1}
        buttonColor={COLORS.peach}
        textColor={COLORS.gray2}
        hasPadding={true}
        borderColor={COLORS.gray2}
        borderRadius={10}
        onPress={value => setPriority(value)}
      />
    );
  }
  //emergency
  function switchSelectEmergency() {
    return (
      <SwitchSelector
        options={priorityOption}
        initial={emergency-1}
        buttonColor={COLORS.peach}
        textColor={COLORS.gray2}
        hasPadding={true}
        borderColor={COLORS.gray2}
        borderRadius={10}
        onPress={value => setEmergency(value)}
      />
    );
  }
  //datetime
  const onChangeStart = (event, selectedDate) => {
    const currentStartDate = selectedDate || startDate;
    setStartDate(currentStartDate);
    console.log(startDate);
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentEndDate = selectedDate || endDate;
    setEndDate(currentEndDate);
    console.log(endDate);
  };

  function StartDatePick() {
    return (
      <View>
      <DateTimePicker
        testID="dateTimePicker"
        value={startDate}
        mode="date"
        is24Hour={true}
        display="compact"
        style={{width: 100}}
        minimumDate={new Date(2020, 1, 1)}
        onChange={onChangeStart}
      />
      </View>
    );
  }
  function EndDatePick() {
    return (
      <View>
      <DateTimePicker
        testID="dateTimePicker"
        value={endDate}
        mode="date"
        is24Hour={true}
        display="compact"
        style={{width: 100}}
        minimumDate={new Date(2020, 1, 1)}
        onChange={onChangeEnd}
      />
      </View>
    );
  }
  function TimePick(time) {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        value={time}
        mode="time"
        is24Hour={true}
        display="compact"
        style={{width: 100,marginLeft: 5,borderColor: COLORS.lightGray,backgroundColor: COLORS.white,}}
        textColor="white"
        minimumDate={new Date(2020, 0, 1)}
        onPress={value => setCategory(value)}
      />
    );
  }
  function Check() {
    return (
      <Switch value={completed} onValueChange={onToggleSwitch} color={COLORS.darkblue} />
    );
  }
  return (
    <Card style={{backgroundColor: COLORS.white, margin: 1, padding: 1}} onSubmit={onSubmit}>
      <Card.Title title={formTitle} />
      <Card.Content>
        {/* カテゴリ */}
        <View style={{marginVertical: 10, zIndex: 1}}>
          <Text style={{fontSize: SIZES.body3}}>Task Category</Text>
          <View style={{marginTop: 10}}>{dropDown()}</View>
        </View>
        {/* タイトル */}
        <View>
          <View style={{flexDirection: 'row', marginVertical: 5}}>
            <Text style={{fontSize: SIZES.body3}}>Task Title</Text>
            <HelperText type="error" visible={valTitle} style={{fontSize: SIZES.body4}}>
            invalid title
            </HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Enter Title"
              value={title}
              style={{backgroundColor: COLORS.white}}
              onChangeText={title => setTitle(title)}
              right={<TextInput.Affix text="/20" />}
              theme={{colors: {primary: '#696969'}}}
            />
          </View>
        </View>
        {/* 概要 */}
        <View>
          <View style={{marginTop: 10, marginVertical: 5, flexDirection: 'row'}}>
            <Text style={{fontSize: SIZES.body3}}>Task Description</Text>
            <HelperText type="error" visible={valDesc} style={{fontSize: SIZES.body4}}>
              invalid description
            </HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Enter Description"
              multiline
              value={description}
              style={{backgroundColor: COLORS.white, maxHeight: 100}}
              right={<TextInput.Affix text="/1000" />}
              onChangeText={description => setDescription(description)}
              theme={{colors: {primary: '#696969'}}}
            />
          </View>
        </View>
        {/* 重要度 */}
        <View style={{marginVertical: 10}}>
          <Text style={{fontSize: SIZES.body3}}>Priority</Text>
          <View style={{marginTop: 10}}>{switchSelectPriority()}</View>
        </View>
        {/* 緊急度 */}
        <View style={{marginVertical: 10}}>
          <Text style={{fontSize: SIZES.body3}}>Emergency</Text>
          <View style={{marginTop: 10}}>{switchSelectEmergency()}</View>
        </View>
        {/* 日付 */}
        <View>
          <View style={{marginTop: 10,  flexDirection: 'row'}}>
            <Text style={{fontSize: SIZES.body3}}>Date&Time</Text>
            <HelperText type="error" visible={valDate} style={{fontSize: SIZES.body4}}>
                invalid date.
            </HelperText>
          </View>
          <View style={{marginVertical: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: 0, paddingVertical: SIZES.padding / 3}}>
            {StartDatePick()}
            {EndDatePick()}
          </View>
        </View>
        </View>
        {/* 状態 */}
        <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
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

export default Form;
