import * as React from 'react';
import {View} from 'react-native';
import {Appbar, Button, Menu, Divider, Provider} from 'react-native-paper';
import {COLORS} from '../constants';

const MyComponent = ({Title, Menu1, Menu2}) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
      }}>
      <Appbar.Content title={Title} />
      <Provider>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            style={{position: 'absolute', top: 10}}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                onPress={openMenu}
                //color={'#ffffff'}
                style={{marginLeft: 100, zIndex: 1}}
              />
            }>
            <Menu.Item onPress={() => {}} title={Menu1} />
            <Divider />
            <Menu.Item onPress={() => {}} title={Menu2} />
          </Menu>
        </View>
      </Provider>
    </Appbar.Header>
  );
};

export default MyComponent;
