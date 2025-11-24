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
import {SafeAreaView, StyleSheet} from 'react-native';
import {connect} from 'react-redux'
import {withTheme} from 'react-native-paper';

import merge from 'lodash/merge';

import componentStyles from "./styles"


/**
 * Modal Component
 *
 * This component receives its content through a redux state. The origin component pushes
 * the content to this state and triggers a navigation to "Modal". This will display the
 * modal with the provided content.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 *
 *
 *
 *  Sample usage:
 *
    store.dispatch({
        type: 'UPDATE_MODAL_CONTENT',
            modalContent: (
                <View style={this.styles.modalContainer}>
                    <NewsDetailComponent news={news} {...this.props} />
                </View>
            )
    });
    this.props.navigation.navigate('Modal');
 */
class ModalComponent extends React.Component {

    // Styles of this component
    styles;

    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const { pluginStyles, theme } = this.props;
        this.styles = componentStyles(theme);

        if(pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);
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


        const {themeStyles} = this.props.theme;
        const { modalContent } = this.props;

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                {modalContent}
            </SafeAreaView>
        );
    }
}



const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.modal.component,
        pluginStyles: state.pluginReducer.modal.styles,
        modalContent: state.stateReducer.modalContent
    };
};

export default connect(mapStateToProps, null)(withTheme(ModalComponent))
