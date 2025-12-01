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
import PropTypes from 'prop-types';

import { StyleSheet, Text } from 'react-native';
import {List, withTheme} from "react-native-paper";
import {withTranslation} from "react-i18next";
import { connect } from 'react-redux'
import merge from 'lodash/merge';

import componentStyles from "./styles"
import IconsOpenasist from "@olea-bps/icons-openasist";



class PtsDepartureComponent extends React.Component {
    static propTypes = {
        departure: PropTypes.object.isRequired,
        currentTime: PropTypes.object.isRequired
    };

    // Styles of this component
    styles;

    constructor(props) {
        super(props);
        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const { pluginStyles,theme } = this.props;
        this.styles = componentStyles(theme);

        if(pluginStyles) {
            this.styles = merge(componentStyles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);
        // ------------------------------------------------------------------------
    };

    /**
     * Convert the timestamp to a string with the time to departure
     *
     * @param timestamp
     * @returns {string}
     * @private
     */
    _getDepartureTime(timestamp, asObject = false) {
        let { currentTime, t } = this.props;
        let departureTime = new Date(timestamp);

        if(departureTime - currentTime <= 0 && !asObject) {
            return <Text style={this.styles.departureExceeded}>{t('pts:isDeparted')}</Text>;
        }

        let minutesToDeparture =  Math.floor((departureTime - currentTime) / 1000 / 60);


        let departureHour       = departureTime.getHours() > 9      ? departureTime.getHours()      : '0' + departureTime.getHours();
        let departureMinutes    = departureTime.getMinutes() > 9    ? departureTime.getMinutes()    : '0' + departureTime.getMinutes();

        if(asObject) {
            return {
                time: departureHour + ':' + departureMinutes,
                accessibilityLabelTime: departureHour + ' ' + t('accessibility:pts:speechTime') + departureMinutes,
                minutesUntilDeparture: minutesToDeparture,
                isDeparted: minutesToDeparture  <= 0
            }
        }

        return departureHour + ':' + departureMinutes +
                ((minutesToDeparture  > 0) ? ' ' + t('common:time') + ' - ' : '') +
                ((minutesToDeparture  > 0)  ? minutesToDeparture + t('common:minutes') + ' ' : '');

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

        const { departure, t } = this.props;
        const {colors} = this.props.theme;
        const departureTime = this._getDepartureTime(departure.departureTime, true);
        const departureDetails = {
            time:departureTime.accessibilityLabelTime,
            direction: departure.direction,
            line: departure.number,
            type: departure.type.toUpperCase() === 'TRAM' ? t('pts:tram') : t('pts:bus'),
            minutes:departureTime.minutesUntilDeparture
        };

        return (
            <List.Item
                title={this._getDepartureTime(departure.departureTime)}
                description={t('pts:direction') + ": " + departure.direction + "\n" + t('pts:line') + ": " + departure.number}
                left={props => <List.Icon {...props}
                                          style={{paddingTop: 4, backgroundColor: (departure.type.toUpperCase() === 'TRAM' ? colors.primary : colors.secondary)}}
                                          color={(departure.type.toUpperCase() === 'TRAM' ? colors.primaryText : colors.secondaryText)}
                                          icon={ props => <IconsOpenasist icon={(departure.type.toUpperCase() === 'TRAM' ? 'tram': 'bus')} size={30}/>}
                />}
                accessible={true}
                accessibilityLabel={departureTime.isDeparted ?
                    t('accessibility:pts.isDeparted', departureDetails) :
                    t('accessibility:pts.departureTime', departureDetails)}
                accessibilityHint={departureTime.isDeparted ? '' : t('accessibility:pts.minutesUntilDeparture', departureDetails)}
            />
        );
    }
}


const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.ptsDeparture.component,
        pluginStyles: state.pluginReducer.ptsDeparture.styles
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(PtsDepartureComponent)))
