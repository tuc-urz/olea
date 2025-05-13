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

/**
 * OLEA App Core Module
 *
 * This module contains all core functionality of the OLEA App.
 * This includes redux and services (rest-api, ...)
 */



// ----------------------------------------
// Redux
// ----------------------------------------
export * from './redux/store';
export * from './redux/actions/state';
export * from './redux/actions/setting';
export * from './redux/selectors';

// ----------------------------------------
// Api
// ----------------------------------------
export * from './api/canteens';
export * from './api/courses';
export * from './api/device';
export * from './api/feed';
export * from './api/feedback';
export * from './api/library';
export * from './api/lostfound';
export * from './api/occupancy';
export * from './api/officehours';
export * from './api/poi';
export * from './api/pts';
export * from './api/survey';
export * from './api/telephone';
export * from './api/jobs';



// ----------------------------------------
// Services
// ----------------------------------------
export * from './services/data';
export * from './services/search';


import * as RootNavigation from './services/root-navigation';
export { RootNavigation };
