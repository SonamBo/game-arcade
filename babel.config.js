// The worklets plugin MUST be the last entry in the plugins array.
//
// SDK 57 ships Reanimated 4, whose Babel plugin lives in
// 'react-native-worklets/plugin' (the old 'react-native-reanimated/plugin'
// re-exports it with a deprecation warning). Verified against
// react-native-worklets 0.10.4 / react-native-reanimated 4.5.1.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
