const { withAndroidManifest } = require("@expo/config-plugins");

const META_NAME = "com.google.firebase.messaging.default_notification_color";
const DEFAULT_RESOURCE = "@color/notification_icon_color";

/**
 * Resolves the AndroidManifest merger conflict on
 * `com.google.firebase.messaging.default_notification_color`.
 *
 * Both `expo-notifications` (which sets it to `@color/notification_icon_color`)
 * and `@react-native-firebase/messaging` (whose library manifest sets it to
 * `@color/white`) declare this meta-data. The manifest merger refuses two
 * different values, so we add `tools:replace="android:resource"` to let the
 * app's value win — exactly the suggestion the merger emits.
 *
 * Expo's own `withAndroidManifest` mods run in reverse registration order, so
 * this plugin (registered last in app.json) runs *before* `expo-notifications`.
 * We therefore create the entry with `tools:replace` here; `expo-notifications`
 * later updates only `android:resource` on the existing entry
 * (see @expo/config-plugins addMetaDataItemToMainApplication), preserving our
 * attribute.
 */
module.exports = function withFirebaseNotificationColorFix(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];
    if (!application) {
      return config;
    }

    application["meta-data"] = application["meta-data"] || [];
    let entry = application["meta-data"].find(
      (item) => item.$?.["android:name"] === META_NAME
    );

    if (!entry) {
      entry = { $: { "android:name": META_NAME } };
      application["meta-data"].push(entry);
    }

    if (!entry.$["android:resource"]) {
      entry.$["android:resource"] = DEFAULT_RESOURCE;
    }
    entry.$["tools:replace"] = "android:resource";

    return config;
  });
};
