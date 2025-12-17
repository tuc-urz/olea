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

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { Appbar, useTheme } from 'react-native-paper';
import { AccordionList } from 'accordion-collapse-react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';

import moment from 'moment';
import { DateTime } from 'luxon';

import EventContextProvider, { usePersonalEvents, usePersonalEventsCode, useEvents } from '@olea-bps/context-event';
import { AppBar as AppbarComponent } from '@olea-bps/components';
import IconsOpenasist from '@olea-bps/icons-openasist';
import { EventCodeInput as EventCodeInputComponent } from '@olea-bps/components';
import { TimetableEvent as TimetableEventComponent } from '@olea-bps/components'

import componentStyles from './styles';

/**
 * @param {*} allEvents List of events
 * @param {*} start Startingpoint of the timeslot-list/start of the event-day
 * @param {*} end Endpoint of the timeslot-list/end of the event-day
 * @param {*} length length of the single timeslots
 * @returns a list of objects for each timeslot including start(startTs), end(endTs) and a list(events) of events for that timeslot
 * startTs and endTs are moment().js-elements/modified date-time-elements while events will contain the event-objects for this timeslot
 */
function generateTimeslots(allEvents, start, end, length) {

  const timeslotList = [];
  /*
    For-Loop that loops from the start to the end in increments provided by length
    So that there are timeslots from the start to the end of the event day
  */
  for (let timeSlot = moment(start); timeSlot.isSameOrBefore(end); timeSlot.add(length, 'hours')) {
    // Define start and end(start + length) for each timeslot
    var timeslotStart = moment(timeSlot);
    var timeslotEnd = moment(timeSlot).add(length, 'hours');

    /*
      Use the build in filter()-Method to find all events in the given timeslot, so between timeslotStart and timeslotEnd
      The timeslotStart and timeslotEnd are defined in the yyyy-MM-ddTHH:mm:ssZ-format in order to be able to compare them directly to the
      start and end-prop in the event-Objects
      A event will be sorted in the current timeslot, if the value of the start prop is between the start and end of the current timeslot
      This is due to also include events that start in one timeslot and end in another timeslot
    */
    var eventsInTimeslot = allEvents.filter(
      currentEvent =>
        moment(currentEvent.begin).isSameOrAfter(timeslotStart)
        &&
        moment(currentEvent.begin).isBefore(timeslotEnd)
    );

    // If there are any Event-objects in the given timeslot, the event have to be sorted in the correct order
    if (eventsInTimeslot.length > 0) {
      // After that, push the current timeslot-object into the timeslotList
      timeslotList.push({ startTs: timeslotStart.format('HH:mm'), endTs: timeslotEnd.format('HH:mm'), eventsTs: eventsInTimeslot })
    }
  }

  return timeslotList;
}

/**
 * Event View
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */

/**
 * Die Funktion erzeugt einen Header für die jeweilige Liste, der eine Kurzbezeichnung und ein Icon zur Identifikation beinhaltet
 *
 * @param {object} props beinhaltet styles, themes und weitere props
 * @param {boolean} props.isExpanded Flag das signalisiert, ob die aktuelle Liste geöffnet ist oder nicht
 * @param {string} props.startTime Startzeit der Liste
 * @param {string} props.endTime Endzeit der Liste
 */
function TimeslotAccordionHeader({ startTime, endTime, styles, isExpanded }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors, themeStyles } = theme;

  return (
    <View style={styles.header}>
      <View style={[themeStyles.cardLeftIcon, { marginStart: 5 }]}>
        <IconsOpenasist icon={('info')} size={25} color={colors.icon} />
      </View>
      <Text style={styles.headerText}>{`${startTime} ${t('event:type.to')} ${endTime} ${t('event:type.oclock')}`}</Text>
      <View style={styles.arrowIcon}>
        <IconsOpenasist icon={isExpanded ? 'up' : 'down'} size={20} color={colors.grayLight5} />
      </View>
    </View>
  );
}

/**
 * @param {object} props beinhaltet styles, themes und weitere props
 * @param {Array} props.items Die Liste von Events vom aktuellen Tab
 * @return eine Scrollview, welche eine Liste von TimeTableEventComponent enthält
 */
function EventList({ items: events = [], styles }) {
  const { t } = useTranslation();

  return (
    <ScrollView>
      {
        events
          ?.map(
            (event) => {
              const startTime = DateTime.fromISO(event.begin).toLocaleString(DateTime.TIME_24_SIMPLE);
              const endTime = DateTime.fromISO(event.end).toLocaleString(DateTime.TIME_24_SIMPLE);

              return (
                <TimetableEventComponent
                  key={event.id}
                  type={event?.type ? t(`event:type:${event.type}`) : null}
                  title={event?.title}
                  location={event?.location}
                  locationUrl={event?.locationUrl}
                  description={event?.description}
                  times={{ start: startTime, end: endTime }} />
              );
            }
          )
        ?? null
      }
    </ScrollView>
  );
}

/***
 * Hook-Component welche eine Accordionliste mit dem entsprechenden Inhalt generiert. Inklusive Header.
 *
 * @param props beinhaltet styles, themes und weitere props
 */
function EventTimeslotList() {
  const componentName = EventTimeslotList.name;
  const theme = useTheme();
  const [events, refreshEvents] = useEvents();

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme, componentStyles]
  );

  const timeslots = useMemo(
    () => {
      if (Array.isArray(events) && events.length > 0) {
        // get the value of the start-prop of the earliest-event
        const earliestEvent = events.reduce((previousEvent, currentEvent) => { return currentEvent.begin < previousEvent.begin ? currentEvent : previousEvent });
        // get the value of the end-prop of the latest-event
        const latestEvent = events.reduce((previousEvent, currentEvent) => { return currentEvent.end > previousEvent.end ? currentEvent : previousEvent });
        return generateTimeslots(events, earliestEvent.begin, latestEvent.end, 1.5);

      } else if (Array.isArray(events) && events.length === 0) {
        return [];

      } else {
        console.debug(componentName, ':', 'No events to Generate timeslots');
        return null;
      }
    },
    [events, generateTimeslots]
  );

  useEffect(
    () => {
      refreshEvents();
    },
    [refreshEvents]
  );

  return Array.isArray(timeslots)
    ? timeslots.length > 0
      ? <AccordionList
        list={timeslots}
        header={
          (timeslot, index, isExpanded) => <TimeslotAccordionHeader startTime={timeslot.startTs} endTime={timeslot.endTs} styles={styles} isExpanded={isExpanded} />
        }
        body={
          (timeslot) => <EventList items={timeslot.eventsTs} styles={styles} />
        }
      />
      : <View style={styles.content}>
        <Text>
          Es werden gerade keine Veranstalltungen angeboten
        </Text>
      </View>
    : <View style={styles.content}>
      <Text>{t('canteen:notAvailable')}</Text>
      <ActivityIndicator style={styles.activity} size='large' color={theme.colors.loadingIndicator} />
    </View>

}

function SelectedEventList() {
  const componentName = SelectedEventList.name;
  const theme = useTheme();

  const [personalEvents, refreshPersonalEvents] = usePersonalEvents();

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme, componentStyles]
  );

  useEffect(
    () => {
      refreshPersonalEvents();
    },
    [refreshPersonalEvents]
  )

  return (
    <EventList
      styles={styles}
      items={personalEvents}
    />
  )
}

const TabViewScenes = SceneMap({
  all_events: EventTimeslotList,
  personal_events: SelectedEventList,
});


export default function EventsView(props) {

  const [personalEventsCode] = usePersonalEventsCode();
  const theme = useTheme();
  const { colors, themeStyles } = theme;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [showCodeInput, setShowCodeInput] = useState(personalEventsCode ? false : true);
  const [tabIndex, setTabIndex] = useState(0);

  const tabRoutes = useMemo(
    () =>
      [
        {
          key: 'personal_events',
          title: t('event:tabs.selected'),
          accessibilityLabel: t('accessibility:event.selected'),
        },
        {
          key: 'all_events',
          title: t('event:tabs.all'),
          accessibilityLabel: t('accessibility:event.all'),
        }
      ],
    [t]
  );


  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  )

  const leftAction = useMemo(
    () => (
      <Appbar.Action
        icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} />}
        onPress={() => {
          navigation.goBack();
        }} />
    ),
    [colors, navigation]
  )

  const rightAction = useMemo(
    () => (
      <Appbar.Action
        icon={showCodeInput ? 'table' : 'table-plus'}
        color={colors.appbarIconColor}
        onPress={() => setShowCodeInput(showCodeInput => !showCodeInput)}
      />
    ),
    [showCodeInput, setShowCodeInput, colors]
  )

  const closeCodeInput = useCallback(
    () => setShowCodeInput(false),
    [setShowCodeInput]
  );

  const closeCodeInputAndShowPersonalEvents = useCallback(
    () => {
      setTabIndex(tabRoutes.findIndex(route => route.key === 'personal_events'));
      setShowCodeInput(false);
    },
    [tabRoutes, setShowCodeInput, setTabIndex]
  );


  return (
    <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
      <View>
        <AppbarComponent {...props}
          title={t('menu:titles.event')}
          leftAction={leftAction}
          rightAction={rightAction}
        />
      </View>
      {
        showCodeInput
          ? <EventCodeInputComponent {...props}
            onClose={closeCodeInput}
            onPersonalEventsImported={closeCodeInputAndShowPersonalEvents}
          />
          : <View style={themeStyles.container}>
            <TabView
              index={tabIndex}
              navigationState={{ index: tabIndex, routes: tabRoutes }}
              initialLayout={{ height: 0, width: Dimensions.get('window').width }}
              onIndexChange={setTabIndex}
              renderTabBar={props =>
                <TabBar
                  {...props}
                  style={themeStyles.tabs}
                  labelStyle={themeStyles.tab}
                  activeColor={themeStyles.tabs.activeColor}
                  inactiveColor={themeStyles.tabs.inactiveColor}
                  indicatorStyle={themeStyles.tabIndicator}
                  tabStyle={{ paddingHorizontal: 20 }}
                />
              }
              renderScene={TabViewScenes}
            />
          </View>
      }
    </SafeAreaView>
  );
}

export function APIProvidetEventsView(props) {
  return (
    <EventContextProvider>
      <EventsView
        {...props}
      />
    </EventContextProvider>
  )
}
