/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import {debounce} from 'lodash';
import {PageStatus} from '../utils/constants';
import {User} from '../services/Types';
import {getData, StorageKeys} from '../storage/AsyncStorage';
import getUserDataService from '../services/getUserDataService';
import ListItem from '../components/ListItem';

export default function App() {
  const [usersList, setUsersList] = useState<User[] | []>([]);
  const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.LOADING);
  const [searchText, setSearchText] = useState<string>('');
  useEffect(() => {
    getUsersList('');
  }, []);

  const getUsersList = async (userName: string) => {
    const lowerCaseUserName = userName.toLowerCase();
    setPageStatus(PageStatus.LOADING);
    const localData = await getData<User[]>(StorageKeys.USERS);
    if (localData.success && localData.data) {
      const filteredData = localData.data.filter((user: User) =>
        user.name.toLowerCase().includes(lowerCaseUserName),
      );
      setUsersList(filteredData);
      setPageStatus(PageStatus.IDLE);
    } else {
      const usersResponse = await getUserDataService({
        userName: lowerCaseUserName,
      });
      if (usersResponse.success && usersResponse.data) {
        setUsersList(usersResponse.data);
        setPageStatus(PageStatus.IDLE);
      } else {
        setPageStatus(PageStatus.ERROR);
      }
    }
  };

  const debouncedGetUsersList = useMemo(
    () =>
      debounce((userName: string) => {
        getUsersList(userName);
      }, 500),
    [],
  );

  const handleOnChange = (text: string) => {
    setSearchText(text);
    debouncedGetUsersList(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar usuario"
          value={searchText}
          onChange={({nativeEvent: {text}}) => handleOnChange(text)}
        />
      </View>
      <View style={styles.container}>
        {pageStatus === PageStatus.LOADING && (
          <View>
            <ActivityIndicator />
            <Text>Obteniendo usuarios</Text>
          </View>
        )}
        {pageStatus === PageStatus.ERROR && (
          <View>
            <Text>Hubo un error al obtener los usuarios</Text>
          </View>
        )}
        {pageStatus === PageStatus.IDLE && (
          <FlatList
            data={usersList}
            renderItem={({item}) => <ListItem {...item} />}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'white',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: '90%',
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    paddingHorizontal: 5,
    borderColor: '#d3d3d3',
  },
  safeArea: {
    flex: 1,
  },
});
