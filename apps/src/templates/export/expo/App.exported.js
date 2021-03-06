import React from 'react';
import { AppLoading } from 'expo';
import { Platform, StyleSheet, View, WebView } from 'react-native';

import CustomAsset from './CustomAsset';
import packagedFiles from './packagedFiles';

export default class App extends React.Component {

  static APPLAB_HEIGHT = 450;
  static APPLAB_WIDTH = 320;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.prepareAssets();
  }

  async prepareAssets() {
    const downloadAssets = packagedFiles.map(({ module, fileName }) =>
      CustomAsset.fromModule(module, fileName)
    );
    await CustomAsset.loadAsyncAssets(downloadAssets);
    const indexHtmlIndex = packagedFiles.findIndex(({ fileName }, index) => fileName === 'index.html');
    this.setState({
      indexUri: downloadAssets[indexHtmlIndex].localUri,
    });
  }

  onLayout = ({ nativeEvent }) => {
    const { height, width } = nativeEvent.layout;
    this.setState({
      height,
      width,
    });
  };

  webViewScale() {
    const { height, width } = this.state;

    const heightScale = height / App.APPLAB_HEIGHT;
    const widthScale = width / App.APPLAB_WIDTH;
    return Math.min(heightScale, widthScale);
  }

  webViewContainerStyle() {
    const scale = this.webViewScale();

    return {
      height: App.APPLAB_HEIGHT * scale,
      width: App.APPLAB_WIDTH * scale,
    };
  }

  render() {
    const { height, indexUri } = this.state;

    if (!indexUri) {
      return (
        <AppLoading />
      );
    }

    return (
      <View onLayout={this.onLayout} style={styles.container}>
        {height && <View style={this.webViewContainerStyle()}>
          <WebView
            source={{uri: indexUri}}
            style={styles.webView}
            javaScriptEnabled={true}
            scrollEnabled={false}
            bounces={false}
            scalesPageToFit={Platform.OS === 'ios'}
          />
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  webView: {
    backgroundColor: 'black',
    flex: 1,
  }
});
