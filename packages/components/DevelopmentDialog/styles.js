export default function (theme) {
  return {
    selectOption: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    menuItemOption: {
      paddingStart: 16,
      paddingEnd: 0
    },
    text: {
      color: theme.colors.text
    }
  }
}
