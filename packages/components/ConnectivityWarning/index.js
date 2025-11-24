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

import React, { useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "react-native-paper";

import { useConnectivityContext } from "@olea-bps/context-connectivity";

import componentStyles from "./styles";

function ConnectivityWarning({ children, bottomNavbarHeight }) {
  const { isConnected } = useConnectivityContext();
  const { t } = useTranslation();
  const theme = useTheme();

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  const styles = useMemo(() => {
    const baseStyles = componentStyles(theme);
    return StyleSheet.create({
      ...baseStyles,
      warningContainer: {
        ...baseStyles.warningContainer,
        // -1 to avoid a small gap between the warning and the bottom navbar
        marginBottom: bottomNavbarHeight - 1,
        opacity: opacity,
      },
    });
  }, [theme, bottomNavbarHeight, opacity]);

  return (
    <View style={styles.container}>
      {children}
      {!isConnected && (
        <Animated.View style={[styles.warningContainer]}>
          <Text style={styles.warningText}>{t("warning:noConnection")}</Text>
        </Animated.View>
      )}
    </View>
  );
}

export default ConnectivityWarning;
