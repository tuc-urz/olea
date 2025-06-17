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

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FlatList,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';

import { Appbar, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

import { DateTime } from 'luxon';

import AppbarComponent from '@openasist/component-app-bar';
import IconsOpenasist from '@openasist/icons-openasist';
import { useLanguage, useStagingServer } from '@openasist/core';

import componentStyles from './styles';

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
export default function JobPortalView(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const selectedCategorieIds = route?.params?.selectedIds ?? [];
    const checked = route?.params?.checked ?? [];
    const theme = useTheme();
    const { colors, themeStyles } = theme;
    const { t } = useTranslation();
    const language = useLanguage();
    const isStagingServerActive = useStagingServer();
    const apiUrl = isStagingServerActive
        ? theme.appSettings?.modules?.job?.api?.staging?.url
        : theme.appSettings?.modules?.job?.api?.production?.url;

    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState(null);
    const [jobsRequestInProgress, setJobsRequestInProgress] = useState(false);
    const [categoriesRequestInProgress, setCategoriesRequestInProgress] = useState(false);

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    )

    const refreshJobs = useCallback(
        () => {
            const getJobsUrl = new URL('jobs/', apiUrl);

            setJobsRequestInProgress(true);

            fetch(getJobsUrl)
                .then(response => response.json())
                .then(setJobs)
                .finally(() => setJobsRequestInProgress(false));
        },
        [apiUrl, setJobs, setJobsRequestInProgress]
    )

    const refreshCategories = useCallback(
        () => {
            const getJobsUrl = new URL('jobs/categories/', apiUrl);

            setCategoriesRequestInProgress(true);

            fetch(getJobsUrl)
                .then(response => response.json())
                .then(setCategories)
                .finally(() => setCategoriesRequestInProgress(false));
        },
        [apiUrl, setCategories, setCategoriesRequestInProgress]
    )


    useEffect(
        refreshJobs,
        [refreshJobs]
    )

    useEffect(
        refreshCategories,
        [refreshCategories]
    )

    const filteredJobs = useMemo(
        () => {
            if (Array.isArray(jobs) && jobs.length > 0) {
                if (Array.isArray(selectedCategorieIds) && selectedCategorieIds.length > 0)
                    return jobs.filter(job => selectedCategorieIds.includes(job.catID));
                else {
                    return jobs;
                }
            } else {
                return null;
            }
        },
        [jobs, selectedCategorieIds]
    )

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <View>
                <AppbarComponent {...props}
                    title={t('menu:titles.job')}
                    leftAction={
                        <Appbar.Action
                            icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} />}
                            onPress={
                                () => navigation.goBack(null)
                            }
                        />
                    }
                    rightAction={
                        <Appbar.Action icon="filter" onPress={
                            () =>
                                navigation.navigate(
                                    'JobFilter',
                                    {
                                        checked: checked,
                                        selectedIds: selectedCategorieIds,
                                        catData: categories,
                                    }
                                )
                        } />
                    } />
            </View>
            <View style={themeStyles.container}>
                {
                    filteredJobs?.length
                        ? <FlatList
                            data={filteredJobs}
                            initialNumToRender={6}
                            keyExtractor={
                                (item, index) => item?.url ?? 'job_' + index
                            }
                            refreshing={jobsRequestInProgress || categoriesRequestInProgress}
                            onRefresh={
                                () => {
                                    refreshCategories();
                                    refreshJobs();
                                }
                            }
                            renderItem={
                                ({ item }) =>
                                    <TouchableOpacity
                                        style={themeStyles.card}
                                        onPress={() => { Linking.openURL(item.url) }}
                                        accessible={true}
                                        accessibilityLabel={t(item.company ? 'accessibility:jobs.descriptionWithCompany' : 'accessibility:jobs.descriptionWithoutCompany', item)
                                        }
                                    >
                                        <View style={[themeStyles.cardContent]}>
                                            <Text style={[styles.title, themeStyles.cardTitle]}>
                                                {item.title}
                                            </Text>
                                            <Text style={[themeStyles.cardSubTitle, styles.companyCity]}>
                                                {item.company ? item.company + " - " : null}{item.place}
                                            </Text>
                                            <Text style={[themeStyles.cardSubTitle, styles.date]}>
                                                {item.category} - {DateTime.fromISO(item.dateFrom).setLocale(language).toLocaleString()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                            }
                        />
                        : jobsRequestInProgress || categoriesRequestInProgress
                            ? <View style={styles.innerContainer}>
                                <ActivityIndicator style={styles.activity} size="large" color={colors.loadingIndicator} />
                            </View>
                            : <View style={[styles.containerInner, styles.containerErrorMsg]}>
                                <Text style={styles.titleNoJobs}>{t('jobs:noJobsTitle')}</Text>
                                <Button
                                    onPress={
                                        () => {
                                            refreshJobs();
                                            refreshCategories();
                                        }
                                    }
                                    color={colors.buttonText}
                                    mode={'outlined'}
                                >
                                    {t('common:reload')}
                                </Button>
                            </View>
                }
            </View>
        </SafeAreaView>
    );
}