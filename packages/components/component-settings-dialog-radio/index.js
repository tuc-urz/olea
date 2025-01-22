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

import { RadioButton, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import SettingsDialog from '@openasist/component-settings-dialog';

import componentStyles from './styles';

export default function SettingsDialogRadio({ title, visible, options, selectedOption, onDismiss, onOk, onChange }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme, componentStyles]
  )

  return (
    <SettingsDialog
      title={title}
      visible={visible}
      onDismiss={() => onDismiss(selectedOption)}
      onOk={() => onOk(selectedOption)}
    >
      <RadioButton.Group
        value={selectedOption}
        onValueChange={onChange}
      >
        {
          options.map(
            option => {
              const optionKey = option?.key;
              const colors = theme.colors;
              return (
                <RadioButton.Item
                  key={optionKey}
                  value={optionKey}
                  label={t(option.label)}
                  labelStyle={styles.optionLabel}
                  color={colors.checkboxChecked}
                  mode={'android'}
                />
              )
            }
          )
        }
      </RadioButton.Group>
    </SettingsDialog>
  );
}