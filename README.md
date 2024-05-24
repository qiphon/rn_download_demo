# RN 下载 demo

## iOS

安装必要的包

- react-native-fs 下载使用
- react-native-permissions 获取权限
- react-native-share 保存下载的内容到手机

修改 podfile 文件

```podfile
# Resolve react_native_pods.rb with node to allow for hoisting
# require Pod::Executable.execute_command('node', ['-p',
#   'require.resolve(
#     "react-native/scripts/react_native_pods.rb",
#     {paths: [process.argv[1]]},
#   )', __dir__]).strip
def node_require(script)
  # Resolve script with node to allow for hoisting
  require Pod::Executable.execute_command('node', ['-p',
    "require.resolve(
      '#{script}',
      {paths: [process.argv[1]]},
    )", __dir__]).strip
end

  # Use it to require both react-native's and this package's scripts:
node_require('react-native/scripts/react_native_pods.rb')
node_require('react-native-permissions/scripts/setup.rb')



platform :ios, min_ios_version_supported
prepare_react_native_project!

# ⬇️ uncomment the permissions you need
setup_permissions([
  # 'AppTrackingTransparency',
  # 'Bluetooth',
  # 'Calendars',
  # 'CalendarsWriteOnly',
  # 'Camera',
  # 'Contacts',
  # 'FaceID',
  # 'LocationAccuracy',
  # 'LocationAlways',
  # 'LocationWhenInUse',
  'MediaLibrary',
  # 'Microphone',
  # 'Motion',
  # 'Notifications',
  'PhotoLibrary',
  'PhotoLibraryAddOnly',
  # 'Reminders',
  # 'Siri',
  # 'SpeechRecognition',
  # 'StoreKit',
])

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'AwesomeProject1' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target 'AwesomeProject1Tests' do
    inherit! :complete
    # Pods for testing
  end

  post_install do |installer|
    # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      # :ccache_enabled => true
    )
  end
end

```

修改 `ios/AwesomeProject1/info.plist` 文件， 补充权限

```.plist
<dict>
   // ....

	<key>NSPhotoLibraryUsageDescription</key>
	<string>使用相册</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>使用相册 2</string>
	<key>NSAppleMusicUsageDescription</key>
	<string>使用音乐 2</string>
</dict>
```

在 iOS 目录下执行 `pod install`

重启项目即可

### 相关资料

- xcode 缓存

通常在这个目录，如果没有，可以在 xcode -> settings -> Locations -> Derived Data （下面有文件路径）

`rm -rf ~/Library/Developer/Xcode/DerivedData`

## Android

- 修改 `android/app/src/main/AndroidManifest.xml` 文件， 添加权限

```.xml
    <!-- Required only if your app needs to access images or photos
     that other apps created. -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <!-- Required only if your app needs to access videos
        that other apps created. -->
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

    <!-- Required only if your app needs to access audio files
        that other apps created. -->
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
```

- 申请权限使用 `PERMISSIONS.ANDROID.READ_MEDIA_VIDEO` 这个是个要注意的点。（`READ_EXTERNAL_STORAGE` 这个肯定是不能用了）
- 配置后当获取权限完成就能拿到 下载文件路径，否则这个路径是 `null` ，拿到后直接保存就行了。

### 相关资料

- react native 权限点位置 `node_modules/react-native/PermissionsAndroid/PermissionsAndroid.js`
- [所有的权限文档](https://developer.android.com/reference/android/Manifest.permission)
