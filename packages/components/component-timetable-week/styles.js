import { Dimensions } from "react-native";
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


export default function (theme) {
  return {
    eventContainer: {
      borderTopWidth: 8,
      paddingTop: 5,
      paddingLeft: 5, 
      paddingBottom: 10,
      marginBottom: 10,
      backgroundColor: theme.colors.eventContainerBackground,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
      overflow: 'visible'
    },
    eventTitle: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    eventRoom: {
      fontSize: 11,
      color: '#757575',
    },
    highlightDateContainer: {
      borderRadius: 100,
      borderWidth: 3,
      borderColor: 'red',
      height: 48,
      width: 48,
    },
    line: {
      backgroundColor: '#000',
    },
    strip: {
      height: 65,
      width: '89%',
      paddingTop: 5,
      paddingBottom: 5,
      backgroundColor: '#fff',
      alignSelf: 'flex-end'
    },
    viewStrip:{
      height: 65, 
      backgroundColor: '#fff', 
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    }
  };
}
