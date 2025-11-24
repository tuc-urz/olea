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

import { Button, Dialog, Portal, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import componentStyles from './styles';

export default function SettingsDialog({ children, title, visible, onDismiss, onOk }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme, componentStyles]
  )

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={styles.title}>
          {title}
        </Dialog.Title>
        <Dialog.Content>
          {children}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            labelStyle={styles.okButton}
            onPress={onOk}
          >
            {t("common:okLabel")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}