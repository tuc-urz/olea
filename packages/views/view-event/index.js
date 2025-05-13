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

import React, { useState, useMemo, useEffect } from 'react';

import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { connect } from 'react-redux'
import { withTranslation } from "react-i18next";
import { Appbar, withTheme } from "react-native-paper";

import { AccordionList } from "accordion-collapse-react-native";
import { TabView, TabBar } from 'react-native-tab-view';
import moment from "moment";
import componentStyles from "./styles";
import AppbarComponent from "@olea/component-app-bar";
import IconsOLEA from "@olea/icons-olea";
import EventCodeInputComponent from "@olea/component-event-code-input";
import TimetableEventComponent from "@olea/component-timetable-event"
import * as SecureStore from 'expo-secure-store';

import EventAPIProvider, { useEventApiClient } from './EventAPIContext'

/**
 * Event View
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */

/***
  * @param headerTitle der Title, welcher im Listenkopf angezeigt wird
  * @param index der aktuellen Liste, der wichtig zur Identifikation ist, da es mehrere Listen gibt
  * @param isExpanded Flag das signalisiert, ob die aktuelle Liste geöffnet ist oder nicht
  * @param props beinhaltet styles, themes und weitere props
  * Die Function erzeugt einen Header für die jeweilige Liste, der eine Kurzbezeichnung und ein Icon zur Identifikation beinhaltet
*/

function ListHeader(props) {

  const { listTitle, theme: { colors, themeStyles }, styles, isExpanded, t } = props;
  return (
    <View style={styles.header}>
      <View style={[themeStyles.cardLeftIcon, { marginStart: 5 }]}>
        <IconsOLEA icon={('info')} size={25} color={colors.icon} />
      </View>
      <Text style={styles.headerText}>{`${listTitle.startTs} ${t('event:type.to')} ${listTitle.endTs} ${t('event:type.oclock')}`}</Text>
      <View style={styles.arrowIcon}>
        <IconsOLEA icon={isExpanded ? "up" : "down"} size={20} color={colors.grayLight5} />
      </View>
    </View>
  );
};

/***
  * @param items Die Liste von Events vom aktuellen Tab
  * @param props beinhaltet styles, themes und weitere props
  * @return eine Scrollview, welche eine Liste von TimeTableEventComponent enthält
*/
function ListContent(props) {
  const { items, styles, t } = props;

  return (
    <ScrollView>
      <View>
        {
          items
            .sort((first, second) => {
              let sortOrder = moment(first.begin) - moment(second.begin);

              return sortOrder === 0
                ? moment(first.end) - moment(second.end)
                : sortOrder
            })
            .map((event, index) => {
              const startTime = moment(event.begin).format('HH:mm');
              const endTime = moment(event.end).format('HH:mm');
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
            })
        }
      </View>
    </ScrollView>
  );
};


/***
  * @param props beinhaltet styles, themes und weitere props
  * Function wird nur aufgerufen, sollte es keine Veranstaltungen geben, die gerendert werden können
*/
function NoConnection(props) {

  const { styles, theme: { colors }, t } = props;
  console.log("NoConncection reached");
  return (
    <View style={styles.content}>
      <Text>{t('canteen:notAvailable')}</Text>
      <ActivityIndicator style={styles.activity} size="large" color={colors.primary} />
    </View>
  );
}

/***
  * @param props beinhaltet styles, themes und weitere props
  * Hook-Component welche eine Accordionliste mit dem entsprechenden Inhalt generiert. Inklusive Header,
*/
function EventList(props) {
  const { styles, timeslots } = props;
  return (
    <>
      {timeslots ?? [] ? (
        <AccordionList
          list={timeslots}
          expandedIndex={null}
          header={(timeslot, index, isExpanded) => (
            <ListHeader
              {...props}
              listTitle={timeslot}
              styles={styles}
              isExpanded={isExpanded} />
          )}
          body={(timeslot) => {
            return (
              <ListContent {...props} items={timeslot.eventsTs} styles={styles} />
            );
          }}
        />
      ) : (
        <NoConnection {...props} />
      )}
    </>
  );
}



function EventsView(props) {
  const eventApiClient = useEventApiClient();

  const [eventCode, setEventCode] = useState("");

  const [iconPressed, setIconPressed] = useState(true);

  const [codeInCache, setCodeInCache] = useState(false);

  const [continuedWithout, setContinuedWithout] = useState(false);

  const [showCodeView, setShowCodeView] = useState(false);

  const getEventCode = async () => {
    try {
      const code = await SecureStore.getItemAsync('eventCode');
      console.log(`Code aus Secure Storage: ${code}`);

      if (code !== null) {
        setEventCode(code);
        setCodeInCache(true);
      } else {
        setCodeInCache(false);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    // Aufrufen der Funktion zur Initialisierung des Event-Codes
    getEventCode();
  }, []);

  useEffect(() => {
    //console.log(`CodeInCache: ${codeInCache}`)
    if (codeInCache === false) {
      setShowCodeView(true);
    } else {
      setShowCodeView(false);
    }

  }, [codeInCache])

  useEffect(() => {
    if (codeInCache === true || continuedWithout === true) {
      setShowCodeView(current => !current);
    }


  }, [iconPressed]);

  const { theme, theme: { colors, themeStyles }, navigation, t } = props

  /**
   *
   * @param {*} start Startingpoint of the timeslot-list/start of the event-day
   * @param {*} end Endpoint of the timeslot-list/end of the event-day
   * @param {*} length length of the single timeslots
   * @returns a list of objects for each timeslot including start(startTs), end(endTs) and a list(events) of events for that timeslot
   * startTs and endTs are moment().js-elements/modified date-time-elements while events will contain the event-objects for this timeslot
   */
  function _setTimeslots(allEvents, start, end, length) {

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


  const [tabIndex, setTabIndex] = useState(0)

  const [timeslots, setTimeslots] = useState([]);

  // Is commenting out, because we need to discuss, how we calculate earliestEvent and latestEvent with events-states
  //// get the value of the start-prop of the earliest-event
  //const earliestEvent = events.reduce((previousEvent, currentEvent) => { return currentEvent.begin < previousEvent.begin ? currentEvent : previousEvent });
  //// get the value of the end-prop of the latest-event
  //const latestEvent = events.reduce((previousEvent, currentEvent) => { return currentEvent.end > previousEvent.end ? currentEvent : previousEvent });

  const [selectedEvents, setSelectedEvents] = useState([])
  const [tabRoutes, setTabroutes] = useState([
    {
      key: 'selected_events',
      title: t('event:tabs.selected'),
      accessibilityLabel: t('accessibility:event.selected'),
    },
    {
      key: 'all_events',
      title: t('event:tabs.all'),
      accessibilityLabel: t('accessibility:event.all'),
    }
  ])

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  )

  const currentTabRouteKey = tabRoutes[tabIndex]?.key ?? '';

  useEffect(() => {
    if (currentTabRouteKey == 'all_events') {
      console.debug('Get events')
      eventApiClient.getAll()
        .then((allEvents) => {
          //console.debug(`Fetched events: ${JSON.stringify(allEvents, null, 2)}`)

          // get the value of the start-prop of the earliest-event
          const earliestEvent = allEvents.reduce((previousEvent, currentEvent) => { return currentEvent.begin < previousEvent.begin ? currentEvent : previousEvent });
          // get the value of the end-prop of the latest-event
          const latestEvent = allEvents.reduce((previousEvent, currentEvent) => { return currentEvent.end > previousEvent.end ? currentEvent : previousEvent });

          setTimeslots(_setTimeslots(allEvents, earliestEvent.begin, latestEvent.end, 1.5));
        }).catch(
          error => console.debug(`Error while getting events: ${error}`)
        );
    }
  }, [tabIndex])

  useEffect(() => {
    if (currentTabRouteKey == 'selected_events') {
      console.debug('Get personal events')
      eventApiClient?.getByPersonalCode(eventCode)
        .then((selectedEventsJsonResponse) => {
          console.debug(`Fetched personal events: ${JSON.stringify(selectedEventsJsonResponse, null, 2)}`)
          setSelectedEvents(selectedEventsJsonResponse);
        }).catch(
          error => console.debug(`Error while getting personal events: ${error}`)
        );
    }
  }, [tabIndex, eventCode])

  const leftAction = useMemo(
    () => (
      <Appbar.Action
        icon={props => <IconsOLEA {...props} icon={'back'} color={colors.primaryText} />}
        onPress={() => {
          navigation.goBack(null);
        }} />
    ),
    [colors, navigation]
  )


  // console.log(eventCode);
  //console.log(`iconPressed: ${iconPressed}, showCodeView: ${showCodeView}`)



  const rightAction = useMemo(
    () => (
      <Appbar.Action
        icon={showCodeView ? "table" : "table-plus"}
        color={colors.appbarIconColor}
        onPress={() => {
          setIconPressed((current) => !current)
        }
        }
      />
    ),
    [colors, navigation, showCodeView]
  )

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
        showCodeView
          ? <>
            <EventCodeInputComponent {...props}
              setShowCodeView={setShowCodeView}
              eventCode={eventCode}
              setEventCode={setEventCode}
              setCodeInCache={setCodeInCache}
              setContinuedWithout={setContinuedWithout} />
          </>
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
                  indicatorStyle={themeStyles.tabIndicator}
                  tabStyle={{ paddingHorizontal: 20 }}
                />
              }

              renderScene={({ route }) =>
                (route.key === "all_events" ? <EventList {...props} styles={styles} timeslots={timeslots} /> : <ListContent {...props} styles={styles} items={selectedEvents} />)
              }
            />
          </View>
      }
    </SafeAreaView>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settingReducer
  };
};

const ConnectedEventsView = connect(mapStateToProps, null)(withTranslation()(withTheme(EventsView)))

export default ConnectedEventsView

export function APIProvidetEventsView(props) {
  return (
    <EventAPIProvider>
      <ConnectedEventsView
        {...props}
      />
    </EventAPIProvider>
  )
}
