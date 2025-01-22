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
import { StyleSheet } from 'react-native';

import { Button, List, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import componentStyles from './styles';

export default function SettingSection({ title, description, onPress }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { colors } = theme;

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme, componentStyles]
  )

  return (
    <List.Section>
      <List.Item
        accessible={false}
        title={title}
        description={description}
        titleNumberOfLines={2}
        titleStyle={styles.listItemTitle}
        descriptionStyle={styles.listItemDescription}
        right={() => (
          <Button
            labelStyle={styles.buttonLabel}
            onPress={onPress}
            color={colors.buttonText}
          >
            {t("common:changeLabel")}
          </Button>
        )}
      />
    </List.Section>);
}
