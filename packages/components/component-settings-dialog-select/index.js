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

import { Checkbox, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import SettingsDialog from '@openasist/component-settings-dialog';

import componentStyles from './styles';

export default function SettingsDialogSelect({ title, visible, options, onDismiss, onOk, onChange, ...props }) {
  const selectedOptions = Array.isArray(props?.selectedOptions) ? props.selectedOptions : [];
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
      onDismiss={() => onDismiss(selectedOptions)}
      onOk={() => onOk(selectedOptions)}
    >
      {
        options.map(
          option => {
            const optionKey = option?.key;
            const isChecked = selectedOptions?.includes?.(optionKey) ?? false;
            const colors = theme.colors;
            return (
              <Checkbox.Item
                key={optionKey}
                value={optionKey}
                status={isChecked ? 'checked' : 'unchecked'}
                label={t(option.label)}
                labelStyle={styles.optionLabel}
                color={colors.checkboxChecked}
                uncheckedColor={colors.checkboxUnchecked}
                mode={'android'}
                onPress={
                  () => {
                    const nextSelectedOptions = selectedOptions.includes(optionKey)
                      ? selectedOptions.filter(selectedOption => selectedOption != optionKey)
                      : [...selectedOptions, optionKey];
                    onChange(nextSelectedOptions);
                  }
                }
              />
            )
          }
        )
      }
    </SettingsDialog>
  );
}