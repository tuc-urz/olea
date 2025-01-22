import { Dimensions } from "react-native";

const width = Dimensions.get('window').width;

export default function(theme) {
    return {
      formContainer: {
        backgroundColor: '#F6F7F7',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        left: '5%',
        right: '5%',
        position: 'absolute',
        bottom: 100,
      },
      inputContainer:{
        flex: 1,
        width:'100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection:'row',
        marginBottom: 15,
      },
      infoIcon: {
        width: '10%',
        marginLeft: '3%',
      },
      codeInput: {
        height: 50,
        width: '87%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
      },
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
      },
      buttonContainer:{
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection:'row',
      },
      dismissButton: {
        color: '#007bff',
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 16,
      },
      deleteButtonContainer:{
        flexDirection:'row',
      },
      deleteButton: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 16,
        marginRight: 3,
      },
      floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      },
      importButton:{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10, 
        padding: theme.paddings.small,
        flex: 1,
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10

      },
      importButtonLabel: {
        color: theme.colors.messages.noticeText,
        ...theme.fonts.medium,
        fontSize: theme.fontSizes.xl,
        lineHeight: theme.lineHeights.l,
        marginLeft: theme.paddings.small
      },
      errorText: {
        color: 'red',
        marginLeft: 5,
        marginBottom: 10,
      },
      infoText: {
        color: 'black',
        marginLeft: 5,
      }
    };
};
