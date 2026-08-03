import React from 'react';

import WheelPicker from '../../Fabric/WheelPicker';
import { StyleSheet, View } from 'react-native';

function WheelPickerComponent() {
  return (
    <View style={styles.container}>
      <WheelPicker
        style={styles.wheelPicker}
        data={['Apple', 'Banana', 'Orange', 'Mango', 'Grapes']}
        selectedIndex={1}
        itemHeight={50}
        textSize={28}
        textColor="blue"
        selectedTextColor="red"
        backgroundColor="#EEEEEE"
        visibleItemCount={3}
      />
    </View>
  );
}

export default WheelPickerComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelPicker: {
    width: 400,
    height: 200,
  },
});
