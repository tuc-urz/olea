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
  Checkbox,
  RadioButton,
  useTheme
} from 'react-native-paper'

/**
 * Resolve the selection colors from the active app theme.
 * @param {object} props - Paper control props, including any explicit theme or color overrides.
 * @returns {{color: string|undefined, uncheckedColor: string|undefined}} The default selection colors.
 */
function useSelectionColors (props) {
  const { colors } = useTheme(props.theme)
  return {
    color: colors.checkboxChecked,
    uncheckedColor: colors.checkboxUnchecked
  }
}

// Use the Paper variants that keep unchecked controls outlined on iOS.
export function CheckboxControl (props) {
  const colors = useSelectionColors(props)
  return <Checkbox.Android {...colors} {...props} />
}

export function CheckboxItem (props) {
  const colors = useSelectionColors(props)
  return <Checkbox.Item {...colors} {...props} mode='android' />
}

export function RadioButtonItem (props) {
  const colors = useSelectionColors(props)
  return <RadioButton.Item {...colors} {...props} mode='android' />
}
