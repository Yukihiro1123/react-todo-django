import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import moment from 'moment';
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
  Title,
  Button,
  Provider,
  Avatar,
  Card,
  Paragraph,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';
import Tasks from './Tasks/Tasks';
import AddTask from './Tasks/AddTask';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

const Schedule = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(
    moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
  );
  const start = tasks.map(task =>
    moment(task.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
  );
  const end = tasks.map(task =>
    moment(task.endDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
  );
  let mark = {};
  start.forEach(day => {
    mark[day] = {selected: false, marked: true};
  });
  //console.log(mark);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/todo/')
      .then(res => {
        setTasks(res.data);
      })
      .catch(error => console.log(error));
  }, [tasks]);
  const tasks_today = tasks.filter(
    a => moment(a.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === date,
  );

  function renderHeader() {
    return (
      <Appbar.Header style={{backgroundColor: COLORS.white}}>
        <Appbar.Content title="Schedule" />
        <Appbar.Action />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
    );
  }

  function renderCalendar() {
    return (
      <View style={{margin: 10, ...styles.shadow}}>
        <Calendar
          //markingType='multi-period'
          markedDates={mark}
          // Initially visible month. Default = Date()
          current={Date()}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2012-05-10'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'3000-05-30'}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={day => {
            setDate(day.dateString);
            //console.log('selected day', day.dateString);
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={day => {
            console.log('selected day', day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy MM'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={month => {
            console.log('month changed', month);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          //renderArrow={direction => <Arrow />}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={false}
          // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={false}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
          firstDay={0}
          // Hide day names. Default = false
          hideDayNames={false}
          // Show week numbers to the left. Default = false
          showWeekNumbers={false}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={subtractMonth => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          // Disable left arrow. Default = false
          disableArrowLeft={false}
          // Disable right arrow. Default = false
          disableArrowRight={false}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={false}
          // Replace default month and year title with custom one. the function receive a date as parameter
          // renderHeader={date => {
          //   /*Return JSX*/
          // }}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={true}
          style={{
            height: 350,
          }}
          // Specify theme properties to override specific styles for calendar parts. Default = {}
          theme={{
            'stylesheet.calendar.header': {
              dayTextAtIndex0: {
                color: COLORS.peach,
              },
              dayTextAtIndex6: {
                color: COLORS.lightBlue,
              },
            },
            textSectionTitleColor: COLORS.black,
          }}
        />
      </View>
    );
  }

  function renderTasks() {
    //一つ一つのタスクを表示
    const renderItem = ({item}) => (
      <View>
        <Card
          onPress={() => navigation.navigate('TaskDetail', {task: item})}
          style={{borderRadius: 10, margin: 5, ...styles.shadow}}>
          <Card.Content
            style={{flexDirection: 'row', alignItems: 'center', height: 65}}>
            <View
              style={[
                item.priority !== 1 && item.priority > 2
                  ? styles.bar_high
                  : item.priority === 2
                  ? styles.bar_mid
                  : styles.bar_low,
              ]}>
              <View
                style={{
                  flex: 1,
                  borderLeftColor: COLORS.black,
                  borderLeftWidth: 3,
                }}></View>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Paragraph style={{fontSize: SIZES.h4}}>{item.title}</Paragraph>
                <Paragraph
                  style={{
                    marginLeft: 10,
                    fontSize: SIZES.body5,
                    color: COLORS.gray2,
                  }}>
                  {moment(item.startDate).fromNow()}
                </Paragraph>
              </View>
              <Paragraph style={{fontSize: SIZES.body5, color: COLORS.gray2}}>
                {moment(item.startDate, 'YYYY-MM-DD h:mm a').format(
                  'YYYY-MM-DD h:mm a',
                )}{' '}
                ~{' '}
                {moment(item.endDate, 'YYYY-MM-DD h:mm a').format(
                  'YYYY-MM-DD h:mm a',
                )}
              </Paragraph>
            </View>
            <View style={{position: 'absolute', left: '95%'}}>
              <TouchableOpacity
                style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}
                onPress={() => navigation.navigate('TaskDetail', {task: item})}>
                <Image
                  source={icons.chevron}
                  resizeMode="contain"
                  style={{justifyContent: 'flex-end', width: 40, height: 40}}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
    return (
      <View>
        <View style={{marginHorizontal: 10}}>
          <Paragraph style={{fontSize: SIZES.h4}}>Tasks on {date}</Paragraph>
          {tasks_today.length > 1 ? (
            <Paragraph style={{fontSize: SIZES.h4}}>
              {tasks_today.length} tasks
            </Paragraph>
          ) : tasks_today.length === 1 ? (
            <Paragraph style={{fontSize: SIZES.h4}}>
              {tasks_today.length} task
            </Paragraph>
          ) : (
            <Paragraph style={{fontSize: SIZES.h4}}></Paragraph>
          )}
        </View>
        {tasks_today.length > 0 ? (
          <View
            style={{paddingBottom: SIZES.padding, marginBottom: SIZES.margin}}>
            <FlatList
              data={tasks_today.sort(
                (a, b) => new Date(a.startDate) - new Date(b.startDate),
              )}
              renderItem={renderItem}
              keyExtractor={item => `${item.id}`}
              showsVerticalScrollIndicator={false}
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
  }

  return (
    <View style={{flex: 1}}>
      {/* ヘッダ */}
      <View style={{flex: 1}}>{renderHeader()}</View>
      <View style={{flex: 4, marginTop: 20}}>{renderCalendar()}</View>
      <View style={{flex: 2, marginTop: 20}}>{renderTasks()}</View>
      <View
        style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
        <AddTask />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  fab: {
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

export default Schedule;
