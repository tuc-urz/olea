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
import PropTypes from 'prop-types';

import { Appbar, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { connect } from 'react-redux';

import IconsOLEA from '@olea/icons-olea';

import componentStyles from './styles';

function AppbarComponent({ settings, title, leftAction, rightAction, subtitle, style }) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { colors } = theme;
    const navigation = useNavigation();
    const isBigFont = settings?.settingsAccessibility?.increaseFontSize ?? false;

    // Styles of this component
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    return (
        <Appbar.Header style={[{ elevation: 0 }, isBigFont ? { height: 70 } : null, style]} statusBarHeight={0}>
            {
                leftAction
                    ? leftAction
                    : <Appbar.Action
                        icon={(props) => <IconsOLEA {...props} icon={'back'} color={colors.appbarIconColor} />}
                        onPress={() => navigation.goBack(null)}
                        accessible={true}
                        accessibilityHint={t('accessibility:appbar.back')}
                    />
            }
            <Appbar.Content
                style={isBigFont ? styles.contentStyleBigFont : {}}
                title={title}
                titleStyle={[styles.titleStyle, isBigFont ? styles.titleBigFont : null]}
                subtitle={subtitle}
                subtitleStyle={[styles.subtitle, isBigFont ? styles.subtitleBigFont : null]} />
            {
                rightAction
                    ? rightAction
                    : null
            }
        </Appbar.Header>
    );
}

//DEPRECATED: Proptypes werden in React 19 nicht mehr unterstützt, stattdessen wird TypeScript empfohlen.
AppbarComponent.propTypes = {
    title: PropTypes.string,
    rightAction: PropTypes.any,
    leftAction: PropTypes.any,
    style: PropTypes.object
};

const mapStateToProps = state => {
    return {
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, null)(AppbarComponent)
