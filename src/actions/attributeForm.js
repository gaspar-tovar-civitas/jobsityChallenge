import {ADD_ATTRIBUTE, UPDATE_ATTRIBUTE, DELETE_ATTRIBUTE} from '../constants/attributeForm';

export function addAttribute(data) {
	return {
		type: ADD_ATTRIBUTE,
		data
	}
}

export function updateAttribute(data) {
	return {
		type: UPDATE_ATTRIBUTE,
		data
	}
}

export function deleteAttribute(id) {
	return {
		type: DELETE_ATTRIBUTE,
		id
	}
}
