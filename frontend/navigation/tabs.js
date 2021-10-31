import React, {useState} from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import Home from '../screen/Home';
import Timer from '../screen/Timer';
import Schedule from '../screen/Schedule';
import Search from '../screen/Search';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';

const HomeRoute = () => <Home />;
const ScheduleRoute = () => <Schedule />;
const TimerRoute = () => <Timer />;
const SearchRoute = () => <Search />;

const Tabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    //{key: 'home', title: 'Home', icon: 'home'},
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'calendar', title: 'Calendar', icon: 'calendar'},
    {key: 'timer', title: 'Timer', icon: 'timer'},
    {key: 'search', title: 'Search', icon: 'magnify'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    calendar: ScheduleRoute,
    timer: TimerRoute,
    search: SearchRoute,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{backgroundColor: COLORS.white}}
    />
  );
};

export default Tabs;
