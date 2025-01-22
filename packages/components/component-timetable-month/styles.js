import { Dimensions, View, TouchableOpacity, Text } from "react-native";
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


export default function (theme) {
  return {
    event: {
      padding: 4,
      borderRadius: 4,
      backgroundColor: '#a3f2c5',
      margin: 2,
      overflow: 'hidden',
    },
    eventTitle: {
      color: '#000000',
      fontSize: 12,
    },
    strip:{
      height: 65, 
      paddingTop: 5, 
      paddingBottom: 5, 
      backgroundColor: '#fff', 
      elevation: 4, 
    },
    highlightDateContainer: {
      borderRadius: 100,
      borderWidth: 3,
      borderColor: 'red',
      height: 48,
      width: 48,
    }
  };
}
