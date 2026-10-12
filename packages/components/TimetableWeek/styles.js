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
			color: theme.colors.eventTitleText,
			fontSize: 12,
			fontWeight: 'bold',
		},
		eventRoom: {
			color: theme.colors.eventRoomText,
			fontSize: 11,			
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
			backgroundColor: theme.colors.calendarHeaderBackground,
			alignSelf: 'flex-end'
		},
		viewStrip: {
			height: 65,
			backgroundColor: theme.colors.calendarHeaderBackground,
			elevation: 4,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 3 },
			shadowOpacity: 0.2,
			shadowRadius: 2,
		},
		hourStyle: {
			fontSize: 12,
			color: theme.colors.text,
		},
	};
}
