/**
 * Per-app SVG icon registry.
 *
 * Drop an SVG file into ../../assets/icons/, import it here, and add it to
 * the map. The registry is attached to the theme as `theme.icons` in
 * constants/Theme.js, and IconsOpenasist picks it up automatically.
 * See ../../assets/icons/README.md for SVG authoring conventions.
 */

import AddSvg from '../../assets/icons/add.svg'
import ArrowBackSvg from '../../assets/icons/arrow-back.svg'
import AutoAwesomeSvg from '../../assets/icons/auto-awesome.svg'
import CalendarMonthSvg from '../../assets/icons/calendar-month.svg'
import CallSvg from '../../assets/icons/call.svg'
import CheeseSvg from '../../assets/icons/cheese.svg'
import ContrastSvg from '../../assets/icons/contrast.svg'
import CowSvg from '../../assets/icons/cow.svg'
import DeerSvg from '../../assets/icons/deer.svg'
import DeleteSvg from '../../assets/icons/delete.svg'
import DescriptionSvg from '../../assets/icons/description.svg'
import DownloadSvg from '../../assets/icons/download.svg'
import DrumstickSvg from '../../assets/icons/drumstick.svg'
import EcoSvg from '../../assets/icons/eco.svg'
import EyeSvg from '../../assets/icons/eye.svg'
import FishSvg from '../../assets/icons/fish.svg'
import GarlicSvg from '../../assets/icons/garlic.svg'
import HomeSvg from '../../assets/icons/home.svg'
import HubSvg from '../../assets/icons/hub.svg'
import InfoSvg from '../../assets/icons/info.svg'
import KeyboardArrowDownSvg from '../../assets/icons/keyboard-arrow-down.svg'
import KeyboardArrowUpSvg from '../../assets/icons/keyboard-arrow-up.svg'
import LocationOnSvg from '../../assets/icons/location-on.svg'
import BugSvg from '../../assets/icons/bug.svg'
import MailSvg from '../../assets/icons/mail.svg'
import ManageAccountsSvg from '../../assets/icons/manage-accounts.svg'
import MapSvg from '../../assets/icons/map.svg'
import MenuSvg from '../../assets/icons/menu.svg'
import NestEcoLeafSvg from '../../assets/icons/nest-eco-leaf.svg'
import NewspaperSvg from '../../assets/icons/newspaper.svg'
import NotificationsSvg from '../../assets/icons/notifications.svg'
import OpalSvg from '../../assets/icons/opal.svg'
import OpenInNewSvg from '../../assets/icons/open-in-new.svg'
import PigSvg from '../../assets/icons/pig.svg'
import PublicSvg from '../../assets/icons/public.svg'
import RefreshSvg from '../../assets/icons/refresh.svg'
import RestaurantSvg from '../../assets/icons/restaurant.svg'
import ScheduleSvg from '../../assets/icons/schedule.svg'
import SearchSvg from '../../assets/icons/search.svg'
import SettingsSvg from '../../assets/icons/settings.svg'
import ShareSvg from '../../assets/icons/share.svg'
import SheepSvg from '../../assets/icons/sheep.svg'
import ShieldLockSvg from '../../assets/icons/shield-lock.svg'
import WifiSvg from '../../assets/icons/wifi.svg'
import WineBarSvg from '../../assets/icons/wine-bar.svg'

const iconsSVG = {
  accessibility: EyeSvg,
  'app-info': InfoSvg,
  back: ArrowBackSvg,
  'dark-light': ContrastSvg,
  dashboard: HomeSvg,
  deleteCode: DeleteSvg,
  down: KeyboardArrowDownSvg,
  download: DownloadSvg,
  importButton: AddSvg,
  imprint: DescriptionSvg,
  info: InfoSvg,
  lock: ShieldLockSvg,
  'map-search': MapSvg,
  mail: MailSvg,
  mensa: RestaurantSvg,
  'mensa-alcohol': WineBarSvg,
  'mensa-bio': EcoSvg,
  'mensa-climate-dish': PublicSvg,
  'mensa-new-recipe': AutoAwesomeSvg,
  'mensa-regional': LocationOnSvg,
  'mensa-vegan': NestEcoLeafSvg,
  menu: MenuSvg,
  news: NewspaperSvg,
  notifications: NotificationsSvg,
  'open-external': OpenInNewSvg,
  refresh: RefreshSvg,
  sbservice: ManageAccountsSvg,
  search: SearchSvg,
  settings: SettingsSvg,
  share: ShareSvg,
  time: ScheduleSvg,
  timetable: CalendarMonthSvg,
  up: KeyboardArrowUpSvg,
  wifi: WifiSvg,
  call: CallSvg,
  olea: HubSvg,
  'mensa-beef': CowSvg,
  'mensa-chicken': DrumstickSvg,
  'mensa-fish/seafood': FishSvg,
  'mensa-garlic': GarlicSvg,
  'mensa-insects': BugSvg,
  'mensa-lamb': SheepSvg,
  'mensa-pork': PigSvg,
  'mensa-vegetarian': CheeseSvg,
  'mensa-venison': DeerSvg,
  opal: OpalSvg,

  // Existing OLEA settings use these keys for the OLEA project links.
  rocket: HubSvg,
  feedback: HubSvg
}

export default iconsSVG
