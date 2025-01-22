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
import {Image, View} from 'react-native';
import PropTypes from "prop-types";

/**
 * Scaled Image Component
 *
 * This component calculates the height and width of the image (provided via uri)
 * and renders the image in correct height an width. If a width and / or height is set,
 * the image will be resized according to the provided values.
 *
 * Parameters:
 *  - uri: Image Uri
 *  - width: Desired width of the image (height will be calculated)
 *  - height: Desired height of the image (width will be calculated)
 *
 * Navigation-Parameters:
 *  - none
 *
 *
 *
 *  Sample usage (will render a image with full width of the current device):
 *
    <ScaledImageComponent uri={news.imageUrl} width={Dimensions.get('window').width} />
 */
export default class ScaledImageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { source: { uri: this.props.uri } };
    }

    componentDidMount() {
        Image.getSize(this.props.uri, (width, height) => {
            if (this.props.width && !this.props.height) {
                this.setState({
                    width: this.props.width,
                    height: height * (this.props.width / width)
                });
            } else if (!this.props.width && this.props.height) {
                this.setState({
                    width: width * (this.props.height / height),
                    height: this.props.height
                });
            } else {
                this.setState({ width: width, height: height });
            }
        });
    }

    render() {
        return (
            <View style={this.props.style && this.props.style}>
                <Image
                    source={this.state.source}
                    style={{ height: this.state.height, width: this.state.width }}
                />
            </View>
        );
    }
}



ScaledImageComponent.propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};
