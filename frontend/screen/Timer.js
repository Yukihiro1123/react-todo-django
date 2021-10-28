import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
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
import Modal from 'react-native-modal';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';
import Snackbar from 'react-native-snackbar';
import {TimePicker} from 'react-native-simple-time-picker';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

const Timer = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(hours * 3600 + minutes * 60 + seconds);
  const handleChange = selectedTime => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    setHours(time.hours);
    setMinutes(time.minutes);
    setSeconds(time.seconds);
    setTimer(hours * 3600 + minutes * 60 + seconds);
  };
  const handleStart = () => {
    setTimer(hours * 3600 + minutes * 60 + seconds);
    setIsPlaying(prev => !prev);
    setShowTimer(true);
  };
  const handleStart2 = () => {
    setTimer(hours * 3600 + minutes * 60 + seconds);
    setIsPlaying(prev => !prev);
  };
  const handlePause = () => {
    setKey(prevKey => prevKey + 1);
    setIsPlaying(false);
    setShowTimer(false);
  };

  function renderHeader() {
    return (
      <Appbar.Header style={{backgroundColor: COLORS.white}}>
        <Appbar.Content title="Timer" />
        <Appbar.Action />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
    );
  }

  function renderTimer() {
    return (
      <View style={styles.container}>
        {showTimer ? (
          <View style={styles.container2}>
            <CountdownCircleTimer
              key={key}
              isPlaying={isPlaying}
              size={300}
              duration={timer}
              colors="#004777" //色分けがうまくいかない
              onComplete={() => {
                setKey(prevKey => prevKey + 1);
                setIsPlaying(false);
                Snackbar.show({
                  text: 'Time up',
                  duration: Snackbar.LENGTH_LONG,
                  action: {
                    text: 'Reset Timer',
                    textColor: 'green',
                    onPress: () => {
                      handleStart;
                    },
                  },
                });
              }}>
              {({remainingTime, animatedColor}) => (
                <View style={{flexDirection: 'row'}}>
                  <Animated.Text
                    style={{...styles.remainingTime, color: animatedColor}}>
                    {Math.floor(remainingTime / 3600)
                      .toString()
                      .padStart(2, '0')}
                  </Animated.Text>
                  <Text style={{...styles.remainingTime, color: animatedColor}}>
                    :
                  </Text>
                  <Animated.Text
                    style={{...styles.remainingTime, color: animatedColor}}>
                    {Math.floor((remainingTime % 3600) / 60)
                      .toString()
                      .padStart(2, '0')}
                  </Animated.Text>
                  <Text style={{...styles.remainingTime, color: animatedColor}}>
                    :
                  </Text>
                  <Animated.Text
                    style={{...styles.remainingTime, color: animatedColor}}>
                    {Math.floor(remainingTime % 60)
                      .toString()
                      .padStart(2, '0')}
                  </Animated.Text>
                </View>
              )}
            </CountdownCircleTimer>
            <View style={styles.buttonContainer}>
              <FAB style={styles.button} icon="square" onPress={handlePause} />
              <FAB
                style={styles.button}
                icon={isPlaying ? 'pause' : 'play'}
                onPress={handleStart2}
              />
            </View>
          </View>
        ) : (
          <View>
            <TimePicker
              value={{hours, minutes, seconds}}
              pickerShows={['hours', 'minutes', 'seconds']}
              onChange={handleChange}
              hoursUnit="hour"
              minutesUnit="min"
              secondsUnit="sec"
            />
            <View style={styles.buttonContainer}>
              <FAB style={styles.button} icon="square" onPress={handlePause} />
              <FAB
                style={styles.button}
                icon={isPlaying ? 'pause' : 'play'}
                onPress={handleStart}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {/* ヘッダ */}
      <View style={{flex: 1}}>
        {renderHeader()}
        {/* {renderTimerForm()} */}
        {renderTimer()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff', //'#ecf0f1'
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
    margin: SIZES.margin,
    alignItems: 'center',
    backgroundColor: '#ffffff', //'#ecf0f1'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'space-between',
    paddingVertical: SIZES.padding,
  },
  remainingTime: {
    fontSize: 60,
  },
  button: {
    borderRadius: 45,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding * 3,
    margin: SIZES.padding,
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

export default Timer;
