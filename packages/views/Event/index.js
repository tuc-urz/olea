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

import {
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { useTranslation } from 'react-i18next'
import {
  Appbar,
  List,
  useTheme
} from 'react-native-paper'
import {
  TabView,
  TabBar,
  SceneMap
} from 'react-native-tab-view'
import { useNavigation } from '@react-navigation/native'

import moment from 'moment'
import { DateTime } from 'luxon'

import EventContextProvider, { usePersonalEvents, usePersonalEventsCode, useEvents } from '../../context/context-event'
import AppbarComponent from '../../components/AppBar'
import IconsOpenasist from '../../libraries/icons-openasist'
import EventCodeInputComponent from '../../components/EventCodeInput'
import TimetableEventComponent from '../../components/TimetableEvent'

import componentStyles from './styles'

/**
 * Groups events into non-empty time slots based on when each event begins.
 * @param {Object[]} allEvents - Events to group, each with a begin timestamp.
 * @param {string} start - ISO timestamp at which the first slot starts.
 * @param {string} end - ISO timestamp up to which slots are generated.
 * @param {number} length - Duration of each slot in hours.
 * @returns {Object[]} Slots with a start timestamp as ID, display times and matching events.
 */
function generateTimeslots (allEvents, start, end, length) {
  const timeslotList = []
  /*
    For-Loop that loops from the start to the end in increments provided by length
    So that there are timeslots from the start to the end of the event day
  */
  for (let timeSlot = moment(start); timeSlot.isSameOrBefore(end); timeSlot.add(length, 'hours')) {
    // Define start and end(start + length) for each timeslot
    const timeslotStart = moment(timeSlot)
    const timeslotEnd = moment(timeSlot).add(length, 'hours')
    const eventsInTimeslot = allEvents.filter(
      currentEvent =>
        moment(currentEvent.begin).isSameOrAfter(timeslotStart) &&
        moment(currentEvent.begin).isBefore(timeslotEnd)
    )

    if (eventsInTimeslot.length > 0) {
      timeslotList.push({
        id: timeslotStart.toISOString(),
        startTs: timeslotStart.format('HH:mm'),
        endTs: timeslotEnd.format('HH:mm'),
        eventsTs: eventsInTimeslot
      })
    }
  }

  return timeslotList
}

/**
 * Renders event cards inside the scroll container provided by the current tab.
 * @param {Object} props - Component props.
 * @param {Object[]} [props.items=[]] - Events to display in their existing order.
 */
function EventList ({ items: events = [], styles }) {
  const { t } = useTranslation()

  return (
    <>
      {
        events
          ?.map(
            (event) => {
              const startTime = DateTime.fromISO(event.begin).toLocaleString(DateTime.TIME_24_SIMPLE)
              const endTime = DateTime.fromISO(event.end).toLocaleString(DateTime.TIME_24_SIMPLE)

              return (
                <TimetableEventComponent
                  key={event.id}
                  type={event?.type ? t(`event:type:${event.type}`) : null}
                  title={event?.title}
                  location={event?.location}
                  locationUrl={event?.locationUrl}
                  description={event?.description}
                  times={{ start: startTime, end: endTime }}
                />
              )
            }
          ) ??
        null
      }
    </>
  )
}

/**
 * Renders the time slots for the All Events tab, with one slot open at a time.
 */
function EventTimeslotList () {
  const componentName = EventTimeslotList.name
  const theme = useTheme()
  const [events, refreshEvents] = useEvents()
  const { t } = useTranslation()

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme, componentStyles]
  )

  const timeslots = useMemo(
    () => {
      if (Array.isArray(events) && events.length > 0) {
        // get the value of the start-prop of the earliest-event
        const earliestEvent = events.reduce((previousEvent, currentEvent) => { return currentEvent.begin < previousEvent.begin ? currentEvent : previousEvent })
        // get the value of the end-prop of the latest-event
        const latestEvent = events.reduce((previousEvent, currentEvent) => { return currentEvent.end > previousEvent.end ? currentEvent : previousEvent })
        return generateTimeslots(events, earliestEvent.begin, latestEvent.end, 1.5)
      } else if (Array.isArray(events) && events.length === 0) {
        return []
      } else {
        console.debug(componentName, ':', 'No events to Generate timeslots')
        return null
      }
    },
    [events, generateTimeslots]
  )

  useEffect(
    () => {
      refreshEvents()
    },
    [refreshEvents]
  )

  function renderTimeslotIcon () {
    return (
      <View style={[theme.themeStyles.cardLeftIcon, { marginStart: 5 }]}>
        <IconsOpenasist icon='info' size={25} color={theme.colors.icon} />
      </View>
    )
  }

  /**
   * Renders a collapsible time slot with its scheduled events.
   * @param {Object} row - FlatList render data for the current row.
   * @param {Object} row.item - Time slot with its ID, display times and events.
   */
  function renderTimeslot ({ item: timeslot }) {
    const title = `${timeslot.startTs} ${t('event:type.to')} ${timeslot.endTs} ${t('event:type.oclock')}`

    return (
      <List.Accordion
        id={timeslot.id}
        title={title}
        titleNumberOfLines={0}
        titleStyle={[styles.headerText, { color: theme.colors.text }]}
        style={{ backgroundColor: theme.colors.background }}
        left={renderTimeslotIcon}
      >
        <View style={{ paddingLeft: 0 }}>
          <EventList items={timeslot.eventsTs} />
        </View>
      </List.Accordion>
    )
  }

  return Array.isArray(timeslots)
    ? timeslots.length > 0
      ? (
        <List.AccordionGroup>
          <FlatList
            data={timeslots}
            keyExtractor={timeslot => timeslot.id}
            renderItem={renderTimeslot}
          />
        </List.AccordionGroup>
        )
      : (
        <View style={styles.content}>
          <Text>Es werden gerade keine Veranstalltungen angeboten</Text>
        </View>
        )
    : (
      <View style={styles.content}>
        <Text>{t('canteen:notAvailable')}</Text>
        <ActivityIndicator style={styles.activity} size='large' color={theme.colors.loadingIndicator} />
      </View>
      )
}

function SelectedEventList () {
  const theme = useTheme()
  const [personalEvents, refreshPersonalEvents] = usePersonalEvents()

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme, componentStyles]
  )

  useEffect(
    () => {
      refreshPersonalEvents()
    },
    [refreshPersonalEvents]
  )

  return (
    <ScrollView>
      <EventList
        styles={styles}
        items={personalEvents}
      />
    </ScrollView>
  )
}

const TabViewScenes = SceneMap({
  all_events: EventTimeslotList,
  personal_events: SelectedEventList
})

export default function EventsView (props) {
  const [personalEventsCode] = usePersonalEventsCode()
  const theme = useTheme()
  const { colors, themeStyles } = theme
  const { t } = useTranslation()
  const navigation = useNavigation()

  const [showCodeInput, setShowCodeInput] = useState(!personalEventsCode)
  const [tabIndex, setTabIndex] = useState(0)

  const tabRoutes = useMemo(
    () =>
      [
        {
          key: 'personal_events',
          title: t('event:tabs.selected'),
          accessibilityLabel: t('accessibility:event.selected')
        },
        {
          key: 'all_events',
          title: t('event:tabs.all'),
          accessibilityLabel: t('accessibility:event.all')
        }
      ],
    [t]
  )

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  )

  const leftAction = useMemo(
    () => (
      <Appbar.Action
        icon={props => <IconsOpenasist {...props} icon='back' color={colors.appbarIconColor ?? colors.primaryText} />}
        onPress={() => {
          navigation.goBack()
        }}
      />
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
  )

  const closeCodeInputAndShowPersonalEvents = useCallback(
    () => {
      setTabIndex(tabRoutes.findIndex(route => route.key === 'personal_events'))
      setShowCodeInput(false)
    },
    [tabRoutes, setShowCodeInput, setTabIndex]
  )

  return (
    <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
      <View>
        <AppbarComponent
          {...props}
          title={t('menu:titles.event')}
          leftAction={leftAction}
          rightAction={rightAction}
        />
      </View>
      {
        showCodeInput
          ? (
            <EventCodeInputComponent
              {...props}
              onClose={closeCodeInput}
              onPersonalEventsImported={closeCodeInputAndShowPersonalEvents}
            />
            )
          : (
            <View style={themeStyles.container}>
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
                  />}
                renderScene={TabViewScenes}
              />
            </View>
            )
      }
    </SafeAreaView>
  )
}

export function APIProvidetEventsView (props) {
  return (
    <EventContextProvider>
      <EventsView
        {...props}
      />
    </EventContextProvider>
  )
}
