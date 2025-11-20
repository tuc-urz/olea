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

import { useMemo } from 'react';
import { StyleSheet, Text, View, Linking, TouchableOpacity, useWindowDimensions } from 'react-native';
import { withTheme, Badge } from "react-native-paper";
import { useTranslation } from 'react-i18next';

import componentStyles from "./styles"
import IconsOpenasist from "@openasist/icons-openasist";

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
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();

  const quicklinks = theme?.appSettings?.modules?.dashboard?.quicklinks ?? [];

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme, width, height)),
    [theme, width, height]
  )

  return (
    // If quicklinks are in settings.js defined return content, otherwise return nothing to render
    Array.isArray(quicklinks) && quicklinks.length > 0
      ?
      <View style={styles.container}>
        <View style={[styles.innerContainer, { alignItems: "center" }]}>
          <Text style={[styles.headline, { marginRight: 5 }]}>{t('quicklinks:title')}</Text>
          <IconsOpenasist
            icon={"open-external"}
            color={colors.secondaryText}
            size={10}
            accessibilityLabel={t('accessibility:quicklinks.externalLinkSymbol')}
          />
        </View>

        <View style={
          [
            styles.innerContainer,
            {
              justifyContent: quicklinks.length > 2
                ? 'space-between'
                : 'space-around'
            },
          ]}
        >
          {
            quicklinks.map(
              quicklink => {
                const title = t(quicklink?.title);
                const accessibilityTitle = i18n.exists(quicklink?.accessibilityTitle) ? t(quicklink?.accessibilityTitle) : title;
                const icon = quicklink?.icon;
                const url = i18n.exists(quicklink?.url) ? t(quicklink?.url) : quicklink?.url;
                const badgeContent = quicklink?.badgeContent?.();

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
                      <IconsOpenasist icon={icon} color={colors.primaryText} size={35} />
                      <View style={styles.linkextern}>
                        <Text style={styles.quicklinkLabel}>
                          {title}
                        </Text>
                      </View>
                    </View >
                    <View style={styles.badgeContainer}>
                      <Badge
                        visible={
                          badgeContent
                            ? true
                            : false
                        }
                        style={styles.badge}
                      >
                        {badgeContent}
                      </Badge>
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
