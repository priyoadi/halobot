// Deprecated.

import withMetadataArgument from '../min/exports/withMetadataArgument.js'

import _isValidNumber from '../es6/validate.js'

export function isValidNumber() {
	return withMetadataArgument(_isValidNumber, arguments)
}
