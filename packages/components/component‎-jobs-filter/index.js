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

import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux'
import {withTranslation} from "react-i18next";
import {Appbar, withTheme} from "react-native-paper";
import { CheckBox } from 'react-native-elements'

import merge from 'lodash/merge';
import componentStyles from "./styles";
import AppbarComponent from "@openasist/component-app-bar";
import IconsOpenasist from "@openasist/icons-openasist";



/**
 * JobPortalFilter View
 *
 * Shows the Job Portal Category Filter
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class JobFilterComponent extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        data: null,
        selectedIds: [],
        checked: []
    };

    // Styles of this component
    styles;

    checked;

    selectedIds;

    catData;

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

    }

    componentDidMount(){
      this.setState({
        checked: this.props.route.params.checked,
        selectedIds: this.props.route.params.selectedIds,
        data: this.props.route.params.catData
      });
    }

    goBack() {
        const { navigation, route } = this.props;
        navigation.navigate('Job', {
          selectedIds: this.state.selectedIds,
          checked: this.state.checked
        });
    }



    handleChange = (index) => {
      let checked = [...this.state.checked];
        let selectedIds = [...this.state.selectedIds];
        var data = this.state.data;
        selectedIds = this.addOrRemSelectedIds(data, index, selectedIds);
        checked[index] = !checked[index];
        this.setState({ checked, selectedIds });
    }

    addOrRemSelectedIds = (data, index, selectedIds) => {
      for(var i = 0; i < data[index].id.length; i++){
        let value = data[index].id[i];
        if(selectedIds.indexOf(value) === -1){
          selectedIds.push(value);
        }else{
          selectedIds.splice(selectedIds.indexOf(value), 1);
        }
      }
      return selectedIds;
    }

    _keyExtractor = (item, index) => {
      return item?.name ?? index.toString();
    };

    _renderListView = () => {
      const { colors } = this.props.theme;
      let { data, checked } = this.state;

      return(
        <FlatList
            data={this.state.data}
            extraData={this.state}
            renderItem={({item, index}) =>
              <CheckBox
                checked={checked[index]}
                title={item.name}
                textStyle={this.styles.title}
                onPress={() => this.handleChange(index)}
                checkedColor={colors.primary}
              />
            }
            keyExtractor={this._keyExtractor}
        />
      )
    }

    /**
     * Tab for services
     * @returns {*}
     * @constructor
     */

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

      return (
          <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
              <View>
                  <AppbarComponent {...this.props}
                      title="Filter"
                      leftAction={
                          <Appbar.Action
                              icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} /> }
                              onPress={() => {
                                  this.goBack();
                              }} />
                       }
                  />
              </View>
              <View style={themeStyles.container}>
                  {this._renderListView()}
              </View>
          </SafeAreaView>
    );
  }
}


const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.jobFilter.component,
        pluginStyles: state.pluginReducer.jobFilter.styles,
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(JobFilterComponent)))
