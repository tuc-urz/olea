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

import React, {PureComponent} from 'react';
import {
    FlatList, Text, SafeAreaView, TouchableOpacity, Linking,
    StyleSheet, View, ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux'
import {withTranslation} from "react-i18next";
import {Appbar, withTheme, Button} from "react-native-paper";
import moment from "moment";
import 'moment/locale/de';

import merge from 'lodash/merge';
import componentStyles from "./styles";
import AppbarComponent from "@olea/component-app-bar";
import IconsOpenasist from "@olea/icons-openasist";
import { jobsApi } from '@olea/core/api/jobs';


/**
 * Job Portal View
 *
 * Shows the Job Portal
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */

class JobPortalView extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    state = {
        data: null,
        catData: null,
        selectedIds: [],
        checked: [],
        language: null,
        inProgress: false
    };

    // Styles of this component
    styles;

    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const {pluginStyles, theme} = this.props;
        this.styles = componentStyles(theme);
        if (pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }
        this.styles = StyleSheet.create(this.styles);
        // ------------------------------------------------------------------------
        this.state = {
            language: this.props.settings.settingsGeneral.language,
            inProgress: true
        };
        this.checkDateFormat();
    }

    componentDidMount() {
        this.fetchData();
    }

    refresh() {
      if(this.props.route.params?.checked && this.props.route.params?.selectedIds) {
        this.setState({
          checked: this.props.route.params?.checked,
          selectedIds: this.props.route.params?.selectedIds
        });
      }
    }

    fetchData(){
      this.setState({inProgress: true});
      jobsApi.getAllJobs((res) => {
          this.setState({
              data: res,
              inProgress: false
          }
        );
      });
      jobsApi.getJobCategories((res) => {
          this.setState({
              catData: res,
              checked: Array(res.length).fill(false),
              selectedIds: Array()
          }
        );
      });
    }

    /**
     * Tab for services
     * @returns {*}
     * @constructor
     */
     _keyExtractor = (item, index) => {
      return item?.url ?? 'job_' + index;
     };

    _renderListView = () => {
      const {t, theme: {colors}} = this.props;
      if(this.state.data === null){
        return (<View style={[this.styles.containerInner, this.styles.containerErrorMsg]}>
            <Text style={this.styles.titleNoJobs}>{t('jobs:noJobsTitle')}</Text>
            <Button onPress={() => this.fetchData()} color={colors.buttonText} mode={'outlined'}>{t('common:reload')}</Button>
        </View>);
      }
      return(
        <FlatList
            data={this.state.data}
            extraData={this.state}
            initialNumToRender={6}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
        />
      )
    };

    checkDateFormat(dateFrom){
      const languageCode = this.state.language;
      moment.locale(languageCode);
      const mDate = new moment(dateFrom);
      return mDate.format('L');
    }

    _renderItemBlock = (item) => {
      const {theme:{themeStyles}, t} = this.props;

      return(
        <TouchableOpacity
            style={themeStyles.card}
            onPress={() => {Linking.openURL(item.url)}}
            accessible={true}
            accessibilityLabel={ t(item.company ? 'accessibility:jobs.descriptionWithCompany' :'accessibility:jobs.descriptionWithoutCompany', item)
            }
        >
          <View style={[themeStyles.cardContent]}>
              <Text style={[this.styles.title,themeStyles.cardTitle]}>{item.title}</Text>
              <Text style={[themeStyles.cardSubTitle, this.styles.companyCity]}>{item.company ? item.company + " - " : null}{item.place}</Text>
              <Text style={[themeStyles.cardSubTitle,this.styles.date]}>{item.category} - {this.checkDateFormat(item.dateFrom)}</Text>
          </View>
        </TouchableOpacity>
      )
    };

    _renderItem = ({item}) => {
        if(this.state.selectedIds === undefined
          || this.state.selectedIds.length == 0) {
            return(
              this._renderItemBlock(item)
            )
        }
        else {
            if(this.state.selectedIds.includes(item.catID)) {
                return(
                  this._renderItemBlock(item)
                )
            }
        }
    };

    _renderInProgress = () => {
      const { colors } = this.props.theme;
      return <View style={this.styles.innerContainer}><ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator}/></View>;
    }

    render() {
        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------
        const PluginComponent = this.props.pluginComponent;
        if (PluginComponent) {
            return <PluginComponent />;
        }
        // ------------------------------------------------------------------------
        const {colors, themeStyles} = this.props.theme;
        const { navigation, t } = this.props;
        let { data, checked, catData } = this.state;

        navigation.addListener('focus', () => {
          this.refresh();
        });


        return (
              <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                  <View>
                      <AppbarComponent {...this.props}
                          title={t('menu:titles.job')}
                          leftAction={
                              <Appbar.Action
                                  icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} /> }
                                  onPress={() => {
                                      this.props.navigation.goBack(null);
                                  }} />
                           }
                           rightAction={
                             <Appbar.Action icon="filter"  onPress={() =>

                               this.props.navigation.navigate('JobFilter', {
                                 checked: this.state.checked,
                                 selectedIds: this.state.selectedIds,
                                 catData: this.state.catData
                               })
                           }/>
                      }/>
                  </View>
                  <View style={themeStyles.container}>
                      {this.state.inProgress ? this._renderInProgress() : this._renderListView()}
                  </View>
              </SafeAreaView>
          );

    }
}

const mapStateToProps = state => {
    return {
      pluginComponent: state.pluginReducer.jobPortal.component,
      pluginStyles: state.pluginReducer.jobPortal.styles,
      settings: state.settingReducer
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(JobPortalView)))
