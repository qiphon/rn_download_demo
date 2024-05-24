/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  PermissionsAndroid,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {request, PERMISSIONS} from 'react-native-permissions';
import RNFetchBlob from 'react-native-fs';
import Share from 'react-native-share';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            <Button
              onPress={async () => {
                if (Platform.OS === 'ios') {
                  request(PERMISSIONS.IOS.MEDIA_LIBRARY).then(stat => {
                    console.log('stat', stat);
                    if (stat === 'granted') {
                      const savePath =
                        RNFetchBlob.CachesDirectoryPath + '/name.pdf';
                      const {promise: downPromise} = RNFetchBlob.downloadFile({
                        fromUrl:
                          'https://ebike-erp-1304383094.cos.ap-beijing.myqcloud.com/dev/H01/202405/01/171634735561374.png',
                        toFile: savePath,
                      });
                      downPromise
                        .then(() => {
                          console.log('download success');

                          if (Platform.OS === 'ios') {
                            Share.open({
                              saveToFiles: true,
                              url: savePath,
                            }).then(res => {
                              if (res.success) console.log('share success');
                            });
                          } else if (Platform.OS === 'android') {
                            console.log('RNFetchBlob');
                            console.log(RNFetchBlob);
                          }
                        })
                        .catch(error => {
                          console.log('error', error);
                        });
                    }
                  });
                } else if (Platform.OS === 'android') {
                  console.log('android get permission');
                  const writePers = await PermissionsAndroid.request(
                    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                  ).then(s => {
                    console.log('WRITE_EXTERNAL_STORAGE');
                    console.log(s);
                    return s === 'granted';
                  });
                  const readPers = await PermissionsAndroid.request(
                    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                  ).then(s => {
                    console.log('READ_EXTERNAL_STORAGE');
                    console.log(s);
                    return s === 'granted';
                  });
                  if (writePers && readPers) {
                    const savePath =
                      RNFetchBlob.CachesDirectoryPath + '/name.pdf';
                  }
                }
              }}
              title="download"></Button>
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
