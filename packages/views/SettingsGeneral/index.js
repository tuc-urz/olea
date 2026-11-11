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

import React from 'react'
import { SafeAreaView, View, Text } from 'react-native'

import { connect } from 'react-redux'
import { Button, List, Dialog, Portal, RadioButton, withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

import merge from 'lodash/merge'

import { onSettingGeneralOverride, store } from '../../libraries/core'
import AppbarComponent from '../../components/AppBar'

import componentStyles from './styles'

/**
 * Settings General
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class GeneralSettingsView extends React.Component {
  // Styles of this component
  styles

  constructor (props) {
    super(props)

    // ------------------------------------------------------------------------
    // PLUGIN FUNCTIONALITY
    // ------------------------------------------------------------------------

    const { pluginStyles, theme } = this.props
    this.styles = componentStyles(theme)

    if (pluginStyles) {
      this.styles = merge(this.styles, pluginStyles)
    }

    this.state = {
      language: this.props.settings.settingsGeneral.language,
      accentColorDialogVisible: false
    }
  }

  /**
   * update the general settings
   *
   * @private
   */
  handleUpdateGeneralSettings = () => {
    const generalSettings = {
      ...this.props.settings.settingsGeneral,
      language: this.state.language
    }
    this.setState({ isChangeMessageVisible: false })
    store.dispatch(onSettingGeneralOverride('generalSettings', generalSettings))
  }

  getLanguageByKey = () => {
    const { theme } = this.props
    const languageCode = this.state.language
    const languageObject = theme.appSettings.languages.find(
      (language) => language.code === languageCode
    )
    return languageObject || theme.appSettings.languages[0]
  }

  _renderLanguages = () => {
    const { theme, t } = this.props
    const { colors } = theme
    const languages = theme.appSettings.languages.map((language) => (
      <View key={'lanuage-' + language.code}>
        <RadioButton.Item
          value={language.code}
          color={colors.checkboxChecked}
          label={t(language.labelKey)}
          labelStyle={this.styles.dialogContent}
          uncheckedColor={colors.checkboxUnchecked}
          mode='android'
        />
      </View>
    ))

    return (
      <RadioButton.Group
        onValueChange={(value) => this.setState({ language: value })}
        value={this.state.language}
      >
        {languages}
      </RadioButton.Group>
    )
  }

  _getColorScheme = () => {
    const value = this.props.settings.settingsGeneral.colorScheme
    return ['system', 'light', 'dark'].includes(value) ? value : 'light'
  }

  _renderColorScheme = () => {
    const { theme, t } = this.props
    const { colors } = theme
    const hasAccentColors = (theme.accentColorOptions?.length ?? 0) > 0
    const options = [
      ['system', 'System', 'System'],
      ['light', 'Hell', 'Light'],
      ['dark', 'Dunkel', 'Dark']
    ]
    const isGerman = this.getLanguageByKey().code === 'de'

    return (
      <List.Section>
        <List.Subheader style={this.styles.listItemTitle}>
          {t('settings:common.colorScheme', {
            defaultValue: isGerman ? 'Darstellung' : 'Appearance'
          })}
        </List.Subheader>
        {hasAccentColors && (
          <Text accessibilityRole='header' style={this.styles.colorSchemeHeading}>
            {t('settings:common.colorSchemeHeading', {
              defaultValue: isGerman ? 'Farbschema' : 'Color scheme'
            })}
          </Text>
        )}
        <RadioButton.Group
          value={this._getColorScheme()}
          onValueChange={(colorScheme) => {
            const generalSettings = {
              ...this.props.settings.settingsGeneral,
              colorScheme
            }
            store.dispatch(onSettingGeneralOverride('generalSettings', generalSettings))
          }}
        >
          {options.map(([value, german, english]) => (
            <RadioButton.Item
              key={value}
              value={value}
              label={t(`settings:common.colorSchemeOptions.${value}`, {
                defaultValue: isGerman ? german : english
              })}
              labelStyle={this.styles.dialogContent}
              color={colors.checkboxChecked}
              uncheckedColor={colors.checkboxUnchecked}
              style={hasAccentColors ? this.styles.colorSchemeOption : undefined}
            />
          ))}
        </RadioButton.Group>
        {hasAccentColors && this._renderAccentColor()}
      </List.Section>
    )
  }

  handleShowAccentColorDialog = () => this.setState({ accentColorDialogVisible: true })

  handleHideAccentColorDialog = () => this.setState({ accentColorDialogVisible: false })

  /**
   * Saves the chosen accent while preserving the other general settings.
   *
   * @param {string} accentColor The selected accent color identifier.
   */
  handleAccentColorChange = (accentColor) => {
    const { settingsGeneral, settingsAccessibility } = this.props.settings

    if (!settingsAccessibility.highContrast) {
      store.dispatch(onSettingGeneralOverride('generalSettings', {
        ...settingsGeneral,
        accentColor
      }))
    }

    this.handleHideAccentColorDialog()
  }

  _renderAccentColor = () => {
    const { theme, settings, t } = this.props
    const { accentColorOptions, colors } = theme
    const { highContrast } = settings.settingsAccessibility
    const { accentColor, language } = settings.settingsGeneral
    const isGerman = language === 'de'

    const title = t('settings:common.accentColor', {
      defaultValue: isGerman ? 'Akzentfarbe wählen' : 'Choose Accent color'
    })
    const defaultOption = accentColorOptions[0]
    const selectedOption = accentColorOptions.find(option => option.value === accentColor) ?? defaultOption
    const displayedOption = highContrast ? defaultOption : selectedOption

    function getOptionLabel (option) {
      return option.labels[language] ?? option.labels.en
    }

    function renderSwatch () {
      return (
        <View
          accessible={false}
          style={[swatchStyle, { backgroundColor: displayedOption.color }]}
        />
      )
    }

    const swatchStyle = this.styles.accentColorSwatch

    return (
      <>
        <List.Item
          title={title}
          description={highContrast
            ? t('settings:common.accentColorHighContrast', {
              defaultValue: isGerman
                ? 'Bei hohem Kontrast wird Gelb verwendet.'
                : 'Yellow is used in high contrast mode.'
            })
            : getOptionLabel(selectedOption)}
          titleStyle={this.styles.listItemTitle}
          descriptionStyle={this.styles.listItemDescription}
          style={this.styles.accentColorItem}
          disabled={highContrast}
          onPress={this.handleShowAccentColorDialog}
          right={renderSwatch}
        />
        <Portal>
          <Dialog
            visible={!highContrast && this.state.accentColorDialogVisible}
            onDismiss={this.handleHideAccentColorDialog}
          >
            <Dialog.Title style={this.styles.dialogTitle}>{title}</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group
                value={selectedOption.value}
                onValueChange={this.handleAccentColorChange}
              >
                {accentColorOptions.map(option => (
                  <RadioButton.Item
                    key={option.value}
                    value={option.value}
                    label={getOptionLabel(option)}
                    labelStyle={this.styles.dialogContent}
                    color={colors.checkboxChecked}
                    uncheckedColor={colors.checkboxUnchecked}
                  />
                ))}
              </RadioButton.Group>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </>
    )
  }

  handleShowDialog = () => this.setState({ visible: true })

  handleHideDialog = () => this.setState({ visible: false })

  render () {
    // ------------------------------------------------------------------------
    // PLUGIN FUNCTIONALITY
    // ------------------------------------------------------------------------
    const PluginComponent = this.props.pluginComponent
    if (PluginComponent) {
      return <PluginComponent />
    }
    // ------------------------------------------------------------------------

    const {
      theme: { themeStyles, colors },
      t
    } = this.props
    this.styles = componentStyles(this.props.theme)

    if (this.props.pluginStyles) {
      this.styles = merge(this.styles, this.props.pluginStyles)
    }

    return (
      <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
        <AppbarComponent {...this.props} title={t('settings:common.title')} />
        <View accessible={false} style={themeStyles.container}>
          <List.Section>
            <List.Item
              accessible={false}
              key='language'
              title={t('settings:common.language')}
              description={t(this.getLanguageByKey().labelKey)}
              titleStyle={this.styles.listItemTitle}
              descriptionStyle={this.styles.listItemDescription}
              right={() => (
                <Button
                  accessible
                  labelStyle={this.styles.buttonLabel}
                  onPress={this.handleShowDialog}
                  color={colors.buttonText}
                >
                  {t('common:changeLabel')}
                </Button>
              )}
            />
          </List.Section>
          {/* Show appearance settings only when the app supports color scheme switching. */}
          {this.props.theme.supportsColorScheme === true && this._renderColorScheme()}
          <Portal>
            <Dialog visible={this.state.visible} onDismiss={this.handleHideDialog}>
              <Dialog.Title style={this.styles.dialogTitle}>
                {t('settings:common.language')}
              </Dialog.Title>
              <Dialog.Content>{this._renderLanguages()}</Dialog.Content>
              <Dialog.Actions>
                <Button
                  labelStyle={this.styles.dialogContent}
                  onPress={() => {
                    this.setState({ isChangeMessageVisible: true })
                    this.handleHideDialog()
                  }}
                  color={colors.buttonText}
                >
                  {t('common:okLabel')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Portal>
            <Dialog
              visible={this.state.isChangeMessageVisible}
              onDismiss={() => this.setState({ isChangeMessageVisible: false })}
            >
              <Dialog.Title style={this.styles.dialogTitle}>
                {t('settings:common.languageChange')}
              </Dialog.Title>
              <Dialog.Content>
                <Text style={this.styles.dialogContent}>
                  {t('settings:common.languageChangeText')}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  labelStyle={this.styles.dialogContent}
                  onPress={this.handleUpdateGeneralSettings}
                  color={colors.buttonText}
                >
                  {t('settings:common.languageChangeOk')}
                </Button>
                <Button
                  labelStyle={this.styles.dialogContent}
                  onPress={() => this.setState({ isChangeMessageVisible: false })}
                  color={colors.buttonText}
                >
                  {t('common:cancelLabel')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pluginComponent: state.pluginReducer.settingsGeneral.component,
    pluginStyles: state.pluginReducer.settingsGeneral.styles,
    settings: state.settingReducer
  }
}

export default connect(mapStateToProps, null)(withTranslation()(withTheme(GeneralSettingsView)))
