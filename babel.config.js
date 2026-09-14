// The reanimated plugin MUST be the last entry in the plugins array.
//
// NOTE for setup: on newer Expo SDKs this plugin moved to
// 'react-native-worklets/plugin'. If `npx expo start` prints a warning telling
// you the plugin has moved or is no longer required, follow what it says --
// either swap the string below or delete the plugins array entirely.
// Everything else in this file stays as it is.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
