/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import { withTheme } from "react-native-paper";
import { useTranslation } from 'react-i18next';

import componentStyles from "./styles"
import IconsOLEA from "@olea/icons-olea";

/**
 * Quicklink Component
 *
 * Shows important links to university webside.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
function QuickLinksComponent({ theme, theme: { colors } }) {

  const quicklinks = theme?.appSettings?.modules?.dashboard?.quicklinks ?? [];
  const { t, i18n } = useTranslation();
  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  )

  return (
    // If quicklinks are in settings.js defined return content, otherwise return nothing to render 
    Array.isArray(quicklinks) && quicklinks.length > 0
      ?
      <View style={styles.container}>
        <View style={[styles.innerContainer, { alignItems: "center" }]}>
          <Text style={[styles.headline, { marginRight: 5 }]}>{t('quicklinks:title')}</Text>
          <IconsOLEA
            icon={"open-external"}
            color={colors.secondaryText}
            size={10}
            accessibilityLabel={t('accessibility:quicklinks.externalLinkSymbol')}
          />
        </View>

        <View style={[styles.innerContainer, { justifyContent: "space-between" }]}>
          {
            quicklinks.map(
              quicklink => {
                const title = t(quicklink?.title);
                const accessibilityTitle = i18n.exists(quicklink?.accessibilityTitle) ? t(quicklink?.accessibilityTitle) : title;
                const icon = quicklink?.icon;
                const url = i18n.exists(quicklink?.url) ? t(quicklink?.url) : quicklink?.url;

                return (
                  <TouchableOpacity
                    key={`${title}_${icon}`}
                    accessibilityLabel={accessibilityTitle}
                    accessibilityRole='button'
                    onPress={
                      () =>
                        Linking.canOpenURL(url)
                          .then(
                            supported => {
                              if (supported) {
                                Linking.openURL(url);
                              }
                            }
                          )
                    }
                  >
                    <View style={styles.roundButtons}>
                      <IconsOLEA icon={icon} color={colors.primaryText} size={35} />
                      <View style={styles.linkextern}>
                        <Text style={styles.quicklinkLabel}>
                          {title}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }
            )
          }
        </View>
      </View >
      : null
  );
}

export default (withTheme(QuickLinksComponent))
