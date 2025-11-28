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

import {StyleSheet, TouchableOpacity} from 'react-native';
import {Card, IconButton, withTheme} from "react-native-paper";
import {withTranslation} from "react-i18next";
import {connect} from 'react-redux'
import concat from "lodash/concat";
import merge from 'lodash/merge';

import {onSettingPtsStationOverride, store} from "@olea-bps/core";
import PtsDepartureComponent from '../PtsDeparture';
import IconsOpenasist from "@olea-bps/icons-openasist";

import componentStyles from "./styles"

/**
 * PTS Station Component
 *
 * Shows a single station with a list of its departure times and directions
 *
 * Parameters:
 *  - station: Station object with all information about it
 *  - currentTime: Date object of the current time (to prevent different times across all components)
 *
 * Navigation-Parameters:
 *  - none
 */
class PtsStationComponent extends React.Component {
    static propTypes = {
        station: PropTypes.object.isRequired,
        currentTime: PropTypes.object.isRequired
    };

    // Styles of this component
    styles;



    constructor(props) {
        super(props);
        this.state = {
            inProgress: true
        };
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
     * update the favorite station for given station id
     *
     * @param selectedItemId
     * @private
     */
    _updateFavoriteState = (selectedItemId) => {
        const favorites = this.props.settings.favoritesPtsStation;

        if (favorites && favorites.includes && favorites.includes(selectedItemId)) {
            const newFavoriteArray = favorites.filter(function (itemId) {
                return selectedItemId !== itemId;
            });
            store.dispatch(onSettingPtsStationOverride('favorites', newFavoriteArray));
        } else {
            store.dispatch(onSettingPtsStationOverride('favorites', concat(favorites, [selectedItemId])));
        }
    };

    /**
     * Render each departure
     *
     * @param departures
     * @returns {*}
     * @private
     */
    _renderDepartures(departures) {
        if(departures.length === 0)
            return;

        let output = [];
        departures.forEach((departure, index) => {
            if(departure) {
                output.push(<PtsDepartureComponent key={index + '_' + departure.number + ' ' + departure.departureTime + ' ' + departure.direction}
                                                   departure={departure} currentTime={this.props.currentTime} />);
            }
        });
        return output;
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

        const { station, t, editMode } = this.props;
        const {colors} = this.props.theme;
        const {favoritesPtsStation} = this.props.settings;

        const isFavorite = favoritesPtsStation && favoritesPtsStation.includes && favoritesPtsStation.includes(station.id);
        const accessibilityHint = isFavorite ?
            t('accessibility:pts.isFavorite') :
            t('accessibility:pts.isNotFavorite');

        return (
            <Card>
                <Card.Title title={station.name}
                            subtitle={t('pts:distance') + ": " + (Math.round(station.distance * 100) / 100) + ' ' + t('pts:meter')}
                            right={(props) =>
                                editMode ?
                                <TouchableOpacity
                                    style={this.styles.starIcon}
                                    onPress={() => {this._updateFavoriteState(station.id); setTimeout(() => {this.props.refresh()}, 200);}}
                                    accessibilityLabel={station.name}
                                    accessibilityHint={editMode ? accessibilityHint : ''}
                                    accessibilityRole={'button'}
                                    accessibilityState={editMode ? {selected: isFavorite} : null}
                                >
                                    <IconsOpenasist
                                        icon={isFavorite ? "star-selected" : "star"}
                                        size={25}
                                        color={colors.icon}
                                    />
                                </TouchableOpacity> :
                                <IconButton
                                    {...props}
                                    icon="crosshairs-gps"
                                    onPress={() => {
                                        if(this.props.routeButtonPressed) {
                                            this.props.routeButtonPressed(station.latitude, station.longitude);
                                        }
                                    }}
                                    accessibilityLabel={',' + t('accessibility:pts.centerLocation')}
                                />
                            }/>
                <Card.Content>
                    {this._renderDepartures(station.departures)}
                </Card.Content>
            </Card>
        );
    }
}


const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.ptsStation.component,
        pluginStyles: state.pluginReducer.ptsStation.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(PtsStationComponent)))
