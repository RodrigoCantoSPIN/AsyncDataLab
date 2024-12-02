import {View, Text, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {User} from '../services/Types';

const ListItem = ({name, phone, company}: User) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.contextText}>{name}</Text>
          <Text style={styles.contextText}>{phone}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.rightText}>{company.name}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  header: {width: '65%'},
  body: {
    width: '35%',
    justifyContent: 'center',
  },
  contextText: {
    fontSize: 16,
  },
  rightText: {
    textAlign: 'right',
    fontSize: 12,
  },
  divider: {
    width: '90%',
    borderBottomColor: 'd3d3d3',
    borderBottomWidth: 0.5,
    alignSelf: 'center',
  },
});

export default memo(ListItem);
