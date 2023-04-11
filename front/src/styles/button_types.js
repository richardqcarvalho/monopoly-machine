import colors from './colors'

const models = {
	primary: { color: colors.secondary, backgroundColor: colors.contrast },
	secondary: { color: colors.contrast, backgroundColor: colors.danger },
	terciary: { color: colors.danger, backgroundColor: colors.contrast },
}

const types = {}

Object.keys(models).forEach(type => (types[type] = type))

export default {
	types,
	models,
}
