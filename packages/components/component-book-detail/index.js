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
    Image, ScrollView, StyleSheet, Text,
    View, SafeAreaView, ActivityIndicator, Share
} from 'react-native';
import {Appbar, Badge, Headline, List, Surface, withTheme} from "react-native-paper";

import { connect } from 'react-redux'
import {withTranslation} from "react-i18next";
import merge from 'lodash/merge';
import unescape from 'lodash/unescape';
import uniqBy from 'lodash/uniqBy';
import {libraryApi} from '@olea/core';


import componentStyles from "./styles"
import AppbarComponent from "@olea/component-app-bar";
import {handleHtmlEntities} from "@olea/core/helper/format.helper";


class BookDetailComponent extends React.Component {
    static propTypes = {
        book: PropTypes.object.isRequired
    };

    // Styles of this component
    styles;

    book = null;

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
     * Share function for book
     *
     * @returns {Promise<void>}
     * @private
     */
    async _onShare() {
        const { t } = this.props;
        try {
            let holdings = "";
            this.book.details.holdings.forEach((holding) => {
                holdings +=
                    t('books:library') + ": " + holding.branch + "\n" +
                    t('books:status') + ": " + holding.status + "\n" +
                    t('books:shelf') + ": " + holding.shelf + "\n" +
                    t('books:location') + ": " + holding.type + "\n\n\n";
            });
            let title = this.book.title.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
            const result = await Share.share({
                message: '"' + title + '" ' + t('books:from') + ' '  + this.book.author +  '\n\n' +
                        ((holdings.length > 0) ? t('books:availability') + '\n' + holdings : '')
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
                alert(error.message);
        }
    };


    /**
     * Render holdings and availability
     *
     * @returns {*}
     * @private
     */
    _renderHoldings = () => {
        if(!this.book.details || !this.book.details.holdings) {
            return null;
        }
        const { t } = this.props;
        const holdings = [];
        let index = 0;
        this.book.details.holdings.forEach((holding) => {
            if(holding.branch && holding.status && holding.shelf && holding.type) {
               holdings.push(
                    <Surface key={holding.branch + '_' + index} style={this.styles.holdingContainer}>
                        <List.Accordion title={<Text style={this.styles.holdingTitle}>{holding.branch}</Text>}
                                        style={this.styles.holdingBranch}>
                            <List.Item title={t('books:status')} description={holding.status} titleStyle={this.styles.holdingTitle}
                                       descriptionStyle={this.styles.holdingDescription}/>
                            <List.Item title={t('books:shelf')} description={holding.shelf} titleStyle={this.styles.holdingTitle}
                                       descriptionStyle={this.styles.holdingDescription}/>
                            <List.Item title={t('books:location')} description={holding.type} titleStyle={this.styles.holdingTitle}
                                       descriptionStyle={this.styles.holdingDescription}/>
                        </List.Accordion>
                    </Surface>
                );
                index++;
            }
        });

        if(holdings.length > 0) {
            return (
                <ScrollView style={[this.styles.bookDetails, {marginBottom: 100}]}>
                    {holdings}
                </ScrollView>
            )
        } else {
            return null;
        }
    };

    /**
     * Render book details content
     *
     * @returns {*}
     * @private
     */
    _renderContent = () => {
        const { colors } = this.props.theme;
        const { t } = this.props;

        if(this.state.inProgress) {
            return (<ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator} />);

        } else {
            let buzzwords = this.book.details ? uniqBy(this.book.details.buzzwords) : [];
            let badges = [];
            buzzwords.forEach((word) => {
                badges.push(<Badge key={word} style={this.styles.badge}>{word}</Badge>)
            });

            let publisher = '';
            if(this.book.details && this.book.details.publisher) {
                publisher = handleHtmlEntities(this.book.details.publisher)
            }


            let format = this.book.format;
            let edition = this.book.details && this.book.details.edition;
            let language = this.book.details && this.book.details.language;

            let availableCount = (this.book.details && this.book.details.holdings) ? this.book.details.holdings.length : 0;
            let holdings = this._renderHoldings();

            // Handle html entities
            let title = handleHtmlEntities(this.book.title);

            return (
                <ScrollView style={this.styles.containerInner}>
                    <Text style={this.styles.availableCount}>{availableCount > 0 ? availableCount + t('books:availableCount') : t('books:notAvailable')}</Text>
                    <Surface style={this.styles.bookHeader}>
                        { this.book.details && this.book.details.imageUrl &&
                        <Image source={{uri: this.book.details.imageUrl }}
                               resizeMode="cover"
                               style={this.styles.bookImage}/> }
                        <View style={this.book.details && this.book.details.imageUrl ? this.styles.bookTitle : this.styles.bookTitleFull}>
                            <Headline style={this.styles.bookTitleHeadline}>{unescape(title)}</Headline>
                            <Text style={this.styles.bookTitleSubline}>{this.book.pubdate}</Text>
                        </View>
                    </Surface>
                    <View style={this.styles.badges}>
                        {format !== null    && format !== ''    && <Text style={this.styles.badgeLabel}>{t('books:format')}</Text>}
                        {format !== null    && format !== ''    && <Badge style={this.styles.badge}>{format}</Badge>}
                        {edition !== null   && edition !== ''   && <Text style={this.styles.badgeLabel}>{t('books:edition')}</Text>}
                        {edition !== null   && edition !== ''   && <Badge style={this.styles.badge}>{edition}</Badge>}
                        {language !== null  && language !== ''  && <Text style={this.styles.badgeLabel}>{t('books:language')}</Text>}
                        {language !== null  && language !== ''  && <Badge style={this.styles.badge}>{language}</Badge>}
                        {publisher !== null && publisher !== '' && <Text style={this.styles.badgeLabel}>{t('books:publisher')}</Text>}
                        {publisher !== null && publisher !== '' && <Badge style={[this.styles.badge, this.styles.badgeFullWidth]}>{publisher}</Badge>}
                    </View>
                    <Text style={this.styles.badgeLabel}>{t('books:availability')}</Text>
                    {holdings === null && <Text style={[this.styles.notAvailable]}>{t('books:noLibraryFound')}</Text>}
                    {holdings !== null && holdings}
                </ScrollView>
            );
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


        const {themeStyles} = this.props.theme;
        const { book, t } = this.props;

        if(!book){
            return (
                <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
                    <AppbarComponent {...this.props}
                        title={t('search:title')}/>
                        <Text>{t('books:couldNotLoad')}</Text>
                </SafeAreaView>);
        } else if(!this.book) {
            try {
                libraryApi.getSearchDetailsByBookId(book.bookId, (bookDetails) => {
                    this.book = merge(book, {details: bookDetails});

                    this.setState({
                        inProgress: false
                    });
                });
            } catch {}
        }

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
                <AppbarComponent {...this.props}
                                 title={t('search:title')}
                                 rightAction={<Appbar.Action icon="share-variant" onPress={this._onShare.bind(this)}/>}/>
                {this._renderContent()}
            </SafeAreaView>
        );
    }
}


const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.bookDetail.component,
        pluginStyles: state.pluginReducer.bookDetail.styles
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(BookDetailComponent)))
