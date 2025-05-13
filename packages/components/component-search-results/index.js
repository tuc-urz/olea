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

import {
    StyleSheet, Text, FlatList, View, TouchableOpacity
} from 'react-native';
import {withTheme} from "react-native-paper";
import {withTranslation} from "react-i18next";
import { connect } from 'react-redux'

import merge from 'lodash/merge';
import unescape from 'lodash/unescape';
import {store} from '@olea/core';


import componentStyles from "./styles"
import IconsOpenasist from "@olea/icons-openasist";
import BookDetailComponent from "@olea/component-book-detail";
import ContactDetailComponent from "@olea/component-contact-detail";
import RoomDetailComponent from "@olea/component-room-detail";
import NewsDetailComponent from "@olea/component-news-detail";
import {handleHtmlEntities} from "@olea/core/helper/format.helper";



class SearchResultsComponent extends React.Component {
    static propTypes = {
        type: PropTypes.string.isRequired
    };

    // Styles of this component
    styles;

    resultTypes = {
        all: 'all',
        books: 'books',
        contacts: 'contacts',
        rooms: 'rooms',
        news: 'news',
    };


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
     * User pressed a card
     *
     * @param type
     * @param item
     * @private
     */
    _onCardPress = (type, item) => {
        let content = null;

        // Never provide props directly if you are using translations in this or a parent component
        const props = {navigation: {...this.props.navigation}};
        switch (type) {
            case 'books':
                content = (<BookDetailComponent {...props} book={item}/>);
                break;
            case 'contacts':
                content = (<ContactDetailComponent {...props} contact={item}/>);
                break;
            case 'rooms':
                content = (<RoomDetailComponent {...props} room={item}/>);
                break;
            case 'news':
                content = (<NewsDetailComponent {...props} news={item}/>);
                break;
        }

        store.dispatch({
            type: 'UPDATE_MODAL_CONTENT',
            modalContent: (
                <View style={this.styles.modalContainer}>
                    {content}
                </View>
            )
        });
        this.props.navigation.navigate('Modal');
    };

    /**
     * Render a card for a result item
     *
     * @param item
     * @returns {*}
     * @private
     */
    _renderResult = ({item, index}) => {
        const {colors, themeStyles} = this.props.theme;
        const { t } = this.props;

        let borderColor = colors.messages.iconDefault;
        let icon = 'book';
        let key = 0;
        let title = '';
        let subtitle = '';
        let type = this.resultTypes.books;

        if(!item) {
            return null;
        }

        // Books
        if(item.bookId) {
            borderColor = (item.available) ? colors.messages.successBackground : colors.messages.errorBackground;
            icon = 'book';
            key = item.bookId;
            title = unescape(item.title);
            subtitle = `${item.format || ''}${item.format && item.available ? ' | ' : ''}${item.available ? t('books:available') : t('books:notAvailable')}`;
            

            // Contacts
        } else if(item.firstName && item.lastName)  {
            borderColor = colors.messages.iconDefault;
            icon        = 'profile';
            key         = `${item.firstName} ${item.lastName}_${index}`;
            title       = unescape(`${item.firstName} ${item.lastName}`);
            subtitle    = item.department;
            type        = this.resultTypes.contacts

        // Rooms
        } else if(item.code2017) {
            borderColor = colors.primary;
            icon        = 'map-search';
            key         = item.code2017;
            //title       = unescape(item.code2017);
            title       = unescape(item.title);
            subtitle    = unescape(`${item.building.postaladdress} ${item.building.name}`);
            type        = this.resultTypes.rooms

        } else if(item.building && item.building.code) {
            borderColor = colors.primary;
            icon        = 'map-search';
            key         = item.building.code
            title       = unescape(item.title);
            subtitle    = unescape(`${item.building.postaladdress} ${item.building.name} (Gebäude: ${item.building.code})`);
            type        = this.resultTypes.rooms

        // News
        } else if(item.author) {
           borderColor  = colors.black;
           icon         = 'news';
           key          = item.title;
           title        = unescape(item.title);
           subtitle     = unescape(item.pubdate);
           type         = this.resultTypes.news
        }

        return (
            <TouchableOpacity key={key}
                  style={[themeStyles.card, {borderLeftWidth: 5, borderLeftColor: borderColor}]}
                  onPress={() => this._onCardPress(type, item)}
            >
                <View style={themeStyles.cardLeftIcon}>
                    <IconsOpenasist icon={icon} size={35} color={colors.messages.iconDefault} />
                </View>
                <View style={themeStyles.cardContent}>
                    <Text style={themeStyles.cardTitle}>{this._getShortTitle(title)}</Text>
                    <Text style={themeStyles.cardSubTitle}>{subtitle}</Text>
                </View>
                <View style={themeStyles.cardRightIcon}>
                    <IconsOpenasist icon={"forward"} size={25} color={colors.icon} />
                </View>
            </TouchableOpacity>
        );
    };

    _keyExtractor = (item, index) => {
        if(!item) {
            return 'key_' + index;
        }

        return ((item.bookId) ? item.bookId : ((item.email) ? item.email + '_' + index : 'key_' + index));
    };


    /**
     * Prevent titles with more than 3 lines
     *
     * @param title
     * @returns {string|*}
     * @private
     */
    _getShortTitle = (title) => {

        // Handle html entities
        title = handleHtmlEntities(title);
        title = title.replace(/<(?:.|\n)*?>/gm, '');
        if(title.length > 60) {
            return title.slice(0, 55) + ' ... ';
        } else {
            return title;
        }
    };

    render() {
        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------
        const PluginComponent = this.props.pluginComponent;
        if (PluginComponent) {
            return <PluginComponent />;
        }
        // ------------------------------------------------------------------------

        const { type, t } = this.props;
        const {paddings, colors} = this.props.theme;
        let output = [];
        let results = [];

        // Append books
        if(type === this.resultTypes.all || type === this.resultTypes.books) {
            if(results && results.length > 0) {
                results = results.concat(this.props.searchResults.books);
            } else {
                results = this.props.searchResults.books;
            }
        }

        // Append contacts
        if(type === this.resultTypes.all || type === this.resultTypes.contacts) {
            if(results && results.length > 0) {
                results = results.concat(this.props.searchResults.contacts);
            } else {
                results = this.props.searchResults.contacts;
            }
        }

        // Append rooms
        if(type === this.resultTypes.all || type === this.resultTypes.rooms) {
            if(results && results.length > 0) {
                results = results.concat(this.props.searchResults.rooms);
            } else {
                results = this.props.searchResults.rooms;
            }
        }


        // Append news
        if(type === this.resultTypes.all || type === this.resultTypes.news) {
            if(results && results.length > 0) {
                results = results.concat(this.props.searchResults.news);
            } else {
                results = this.props.searchResults.news;
            }
        }


        // Sorting results
        if (results && results.length > 0) {
            results.sort((itemA, itemB) => {
                let itemAContainsSearchString = false;
                let itemBContainsSearchString = false;
                if (itemA && (
                    itemA.bookId && itemA.title.includes(this.props.searchString) ||
                    itemA.firstName && (
                        unescape(itemA.title).includes(this.props.searchString) ||
                        unescape(itemA.firstName + ' ' + itemA.lastName).includes(this.props.searchString) ||
                        itemA.department.includes(this.props.searchString)
                    ) ||
                    itemA.code2017 &&
                    (
                        unescape(itemA.code2017 + ' - ' + itemA.building.name).includes(this.props.searchString) ||
                        (itemA.codeDez1 + ' ' + itemA.codeURZ).includes(this.props.searchString)
                    )
                )) {
                    itemAContainsSearchString = true;
                }
                if (itemB && (
                    itemB.bookId && itemB.title.includes(this.props.searchString) ||
                    itemB.firstName && (
                        unescape(itemB.title).includes(this.props.searchString) ||
                        unescape(itemB.firstName + ' ' + itemB.lastName).includes(this.props.searchString) ||
                        itemB.department.includes(this.props.searchString)
                    ) ||
                    itemB.code2017 &&
                    (
                        unescape(itemB.code2017 + ' - ' + itemB.building.name).includes(this.props.searchString) ||
                        (itemB.codeDez1 + ' ' + itemB.codeURZ).includes(this.props.searchString)
                    )
                )) {
                    itemBContainsSearchString = true;
                }
                return itemBContainsSearchString - itemAContainsSearchString;
            });
        }

        //No search results
        if((type === this.resultTypes.all && (results === 0 || results === null)) ||
            (type === this.resultTypes.books && (this.props.searchResults.books === null || this.props.searchResults.books.length === 0)) ||
            (type === this.resultTypes.contacts &&(this.props.searchResults.contacts === null || this.props.searchResults.contacts.length === 0)) ||
             (type === this.resultTypes.rooms &&(this.props.searchResults.rooms === null || this.props.searchResults.rooms.length === 0))) {
            return (
                <View style={[this.styles.containerInner, this.styles.containerErrorMsg]}>
                    <IconsOpenasist icon={"search"} size={48} color={colors.primary}/>
                    <Text style={this.styles.title}>{t('search:noResultsTitle')}</Text>
                    <Text style={this.styles.subtitle}>{t('search:noResultsSubtitle')}</Text>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={results}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderResult}
                    initialNumToRender={8}
                    getItemLayout={(data, index) => (
                        {length: 50, offset: 50 * index, index}
                    )}
                    contentContainerStyle={{paddingBottom: paddings.default}}
                />
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.searchResults.component,
        pluginStyles: state.pluginReducer.searchResults.styles,
        searchResults: state.stateReducer.searchResults,
        searchString: state.stateReducer.searchTopic
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(SearchResultsComponent)))
