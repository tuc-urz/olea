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

/* global requestAnimationFrame */

import {
  useState,
  useEffect,
  useMemo,
  useRef
} from 'react'

import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList
} from 'react-native'

import {
  List,
  useTheme
} from 'react-native-paper'

import {
  TabView,
  TabBar,
  TabBarItem
} from 'react-native-tab-view'

import { useTranslation } from 'react-i18next'

import {
  CommonActions,
  useNavigation,
  useRoute
} from '@react-navigation/native'

import {
  DateTime,
  Duration
} from 'luxon'

import moment from 'moment'
import 'moment/locale/de'
import AppbarComponent from '../../components/AppBar'
import IconsOpenasist from '../../libraries/icons-openasist'
import MensaMenu from '../../components/MensaMenu'

import {
  useCanteen,
  useCanteens,
  useFilteredMenu
} from '../../context/context-canteen'

import { useLanguage } from '../../libraries/core'

import componentStyles from './styles'

/**
 * Generiert die Tabs/Routen für die Mensa-Tabview
 *
 * @param {DateTime} begin Tag mit dem die Generierung der Tabs/Routen beginnen soll
 * @param {Number} daysToRender Anzahl der Tage, die gerendert werden sollen
 * @param {string} language Sprache, welche für die Datumsformatierung der Tabs verwendet werden soll
 * @param {Number[]} disabledWeekdays Liste an Wochentagen welche nicht mit in die Tabs aufgenommen werden sollen im ISO Wochentagsnummer-Format
 * @returns
 */
function generateDayRoutes (begin, daysToRender, language, disabledWeekdays = []) {
  return Array?.from(
    { length: daysToRender },
    (_, index) => {
      const currentDay = begin.setLocale(language).plus({ days: index }).startOf('day')
      const isoDayDate = currentDay?.toISODate()
      return {
        key: isoDayDate,
        date: currentDay
      }
    }
  )?.filter(dayRoute => !disabledWeekdays?.includes(dayRoute?.date?.weekday))
}

function CanteenAccordion ({ canteenId, menuDate, styles, onContentLayout }) {
  const { t } = useTranslation()
  const [canteen] = useCanteen(canteenId)
  const [, refreshMenu, mealAmount, filteredMealAmount, activeSelections] =
        useFilteredMenu(canteenId, menuDate)
  const { colors } = useTheme()

  useEffect(
    () => {
      refreshMenu()
    },
    [canteenId, menuDate]
  )

  const description =
        Array.isArray(activeSelections) && activeSelections.length > 0
          ? t('canteen:amountOfFilteredMeals', {
            filteredMealAmount,
            mealAmount,
            filters: activeSelections.map(
              selection => t(selection.labelKey)
            )
          })
          : undefined

  return (
    <List.Accordion
      id={canteenId}
      title={canteen?.title ?? `Fehler: Mensa mit ID ${canteenId} kann nicht angezeigt werden. Bitte melden!`}
      description={description}
      titleNumberOfLines={0}
      descriptionNumberOfLines={0}
      titleStyle={[styles.headerText, { color: colors.text }]}
      descriptionStyle={{ color: colors.text }}
      style={{ backgroundColor: colors.surface ?? colors.background }}
      left={() =>
        canteen?.type
          ? (
            <View style={styles.accordionIcon}>
              <IconsOpenasist
                icon={canteen.type === 'cafeteria' ? 'coffee' : 'mensa'}
                size={25}
                color={colors.icon}
              />
            </View>
            )
          : null}
    >
      <View
        style={styles.accordionContent}
        onLayout={() => onContentLayout?.(canteenId)}
      >
        <MensaMenu
          canteenId={canteenId}
          menuDate={menuDate}
        />
      </View>
    </List.Accordion>
  )
}

/**
 * Akkordion, welches die Mensen einer Universität anzeigt.
 * Es werden automatisch die Mensen aus dem Mensa-Kontext geladen.
 *
 * @component
 * @param {Object} props
 * @param {string} props.menuDate - Datum des Essensangebotes, welches als String im ISO 8601 Format zu übergeben ist.
 * @param {string} [props.expandedCanteenId] - ID der Mensa, dessen Akkordion-Element geöffent sein soll.
 * @param {JSX.Element} [props.CanteensEmptyComponent] - JSX, welches angezeigt werden soll, wenn keine Mensen angezeigt werden können.
 * @param {(expandedCanteenId: string) => void} [props.onCanteenSelect] - Event welches ausgelöst wird, wenn der Nutzer ein Akkordion-Element öffnet oder schließt.
 * @returns {JSX.Element}
 *
 * @example
 * const [activeCanteen, setActiveCanteen] = useState(null);
 *
 * return (
 *     <CanteensAccordion
 *         menuDate={'01-12-2020'}
 *         expandedCanteenId={activeCanteen}
 *         onCanteenSelect={
 *             expandedCanteenId => setActiveCanteen(expandedCanteenId)
 *         }
 *         CanteensEmptyComponent={
 *             <Text>Keine Mensa gefunden</Text>
 *         }
 *     />
 * )
 */
function CanteensAccordion ({ expandedCanteenId, menuDate, onCanteenSelect, CanteensEmptyComponent }) {
  const [canteens] = useCanteens()
  const canteensIds = useMemo(
    () => Object.keys(canteens),
    [canteens]
  )
  const theme = useTheme()

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  )
  const listRef = useRef(null)
  const pendingScrollId = useRef(null)
  const currentId = expandedCanteenId == null
    ? null
    : String(expandedCanteenId)

  const handleAccordionPress = canteenId => {
    const nextId = currentId === canteenId ? null : canteenId
    pendingScrollId.current = currentId !== null ? nextId : null
    onCanteenSelect?.(nextId)
  }

  const handleContentLayout = canteenId => {
    if (pendingScrollId.current !== canteenId) return

    requestAnimationFrame(() => {
      if (pendingScrollId.current !== canteenId) return

      pendingScrollId.current = null
      const index = canteensIds.indexOf(canteenId)

      if (index >= 0) {
        listRef.current?.scrollToIndex({
          index,
          viewPosition: 0,
          animated: false
        })
      }
    })
  }

  return (
    <List.AccordionGroup
      expandedId={currentId ?? ''}
      onAccordionPress={handleAccordionPress}
    >
      <FlatList
        data={canteensIds}
        extraData={expandedCanteenId}
        keyExtractor={canteenId => canteenId}
        ref={listRef}
        renderItem={({ item: canteenId }) => (
          <CanteenAccordion
            canteenId={canteenId}
            menuDate={menuDate}
            styles={styles}
            onContentLayout={handleContentLayout}
          />
        )}
        ListEmptyComponent={CanteensEmptyComponent}
      />
    </List.AccordionGroup>
  )
}

/**
 * Canteens View
 *
 * In this view the tabbar and the scenes for the different canteens for each day are rendered
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */

// TODO:
//  - remove unused dependencies
//  - add comments
//  - recheck code
//  - rename to view-canteens?

export default function CanteensView (props) {
  const language = useLanguage()
  const route = useRoute()

  const { style } = props

  const theme = useTheme()
  const { themeStyles, colors } = theme
  const { t } = useTranslation()
  const navigation = useNavigation()

  const styles = useMemo(() => StyleSheet.create(componentStyles(theme)), [theme])

  const disabledWeekdays = theme?.appSettings?.modules?.canteen?.disabledWeekdays ?? []
  const weeksToRender = theme?.appSettings?.modules?.canteen?.weeksToRender ?? 1
  const daysToRender = Duration.fromDurationLike({ week: weeksToRender }).as('days')
  const now = DateTime.now()
  const begin = now.startOf('week')
  const daysTabViewRoutes = generateDayRoutes(begin, daysToRender, language, disabledWeekdays)

  // Derzeitiger Tag
  const today = now.startOf('day')
  // Suche nach dem Index des heutigen Tages oder den Tag danach. Kann kein Index gefunden werden, wird -1 genommen.
  let initialDayTabIndex = daysTabViewRoutes.findIndex((dayTab) => dayTab.date >= today)
  // Wenn kein Index gefunden werden konnte, wird der letzte Tab genommen
  // Wenn nur eine Woche gerendert wird und die Wochenendtagen ausgeschalten wird, wird kein folgetag gefunden.
  initialDayTabIndex = initialDayTabIndex === -1 ? daysTabViewRoutes.length - 1 : initialDayTabIndex

  // Dieser State wird an alle Mensa-Akkordions in jedem Tages-Tab weitergeben, damit jedes Mensa-Akkordion die selbe Mensa öffen hat.
  // Ein null-Wert, heißt dass alle Mensa-Akkordion-Elemente geschlossen sind.
  const [activeCanteen, setActiveCanteen] = useState(null)

  const [index, setIndex] = useState(initialDayTabIndex)

  useEffect(() => {
    const unsubscribeFocusListener = navigation.addListener('focus', () => {
      _setActiveCanteenFromRoute()
      _setTabViewIndexFromRoute()
    })

    // Cleanup function
    return () => {
      unsubscribeFocusListener()
    }
  }, [route.params?.canteenId])

  // Generieren der Tagestabs
  const routes = useMemo(
    () => generateDayRoutes(begin, daysToRender, language, disabledWeekdays),
    [begin.toISODate(), daysToRender, language, disabledWeekdays]
  )

  /*
     When a user presses a component meal item in dashboard she is taken to the Canteen Tab View.
     To automatically expand the canteen with the pressed meal in the accordion, the canteen id is passed as a route param.
     This method is responsible for setting the component state from the route param values which in turn controls the tab view.
     (active canteen = the canteen which is expanded in accordion)
     */
  const _setActiveCanteenFromRoute = () => {
    const canteenId = route?.params?.canteenId
    if (canteenId) {
      setActiveCanteen(canteenId)

      /*
            After setting the active canteen state, the passedCanteenId needs to get set as undefined.
            so the lastly collapsed canteen will stay collapsed after navigating through the main tab navigation
            and not the canteen with the lastly passed id
            */
      navigation.dispatch(CommonActions.setParams({ canteenId: undefined }))
    }
  }

  const _setTabViewIndexFromRoute = () => {
    const menuDate = route.params?.menuDate

    if (!menuDate) return

    const menuDateIndex = routes.findIndex((route) => route.date.toISODate() === menuDate)
    setIndex(menuDateIndex)
    navigation.dispatch(CommonActions.setParams({ menuDate: undefined }))
  }

  const _renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        style={themeStyles.tabs}
        activeColor={themeStyles.tabs.activeColor}
        inactiveColor={themeStyles.tabs.inactiveColor}
        indicatorStyle={themeStyles.tabIndicator}
        tabStyle={{ width: 'auto', paddingHorizontal: 20 }}
        renderTabBarItem={({ route, navigationState, ...rest }) => (
          <TabBarItem
            {...rest}
            key={route.key}
            route={route}
            navigationState={navigationState}
            labelStyle={themeStyles.tab}
            activeColor={themeStyles.tabs.activeColor}
            inactiveColor={themeStyles.tabs.inactiveColor}
            // Die einbindung von moment.js zum Anzeigen des Wochentages sollte langfristig entfernt werden.
            // Funktioniert die Luxon funktionalität der Wochenanzeige nicht unter iOS datetime.toFormat('ccc')
            labelText={`${moment.unix(route.date.toUnixInteger()).locale(language).format('dd')}, ${route.date.toFormat('dd.LL.')}`}
            accessibilityLabel={route.date.toFormat('DDDD')}
          />
        )}
      />
    )
  }

  return (
    <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
      <AppbarComponent title={t('canteen:title')} {...props} />
      <View style={themeStyles.container}>
        <TabView
          style={style}
          navigationState={{
            index,
            routes,

            // aktive Canteene wird mit übergeben, damit alle Tabs die selbe Mensa öffnen.
            activeCanteen
          }}
          renderTabBar={_renderTabBar}
          onIndexChange={setIndex}
          renderScene={({ route }) => {
            const menuDate = route?.key

            return (
              <CanteensAccordion
                menuDate={menuDate}
                expandedCanteenId={activeCanteen}
                onCanteenSelect={
                  // Wenn dieses Akkordion eine Mensa öffnet oder schließt, wird der activeCanteen statte mit der ID der Mensa aktualisiert.
                  // Falls der Nutzer die Mensa schließt und damit keine Mensa im Akkordion öffen ist, wird null in den State geschrieben.
                  (expandedCanteenId) => setActiveCanteen(expandedCanteenId)
                }
                CanteensEmptyComponent={
                  <View>
                    <Text>{t('canteen:notAvailable')}</Text>
                    <ActivityIndicator
                      style={styles.activity}
                      size='large'
                      color={colors.loadingIndicator}
                    />
                  </View>
                }
              />
            )
          }}
          lazy
          lazyPreloadDistance={2}
          renderLazyPlaceholder={(route) => (
            <View style={styles.centerContainer}>
              <ActivityIndicator
                style={styles.activity}
                size='large'
                color={theme.colors.loadingIndicator}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}
