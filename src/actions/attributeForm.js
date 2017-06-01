import {ADD_ATTRIBUTE, DELETE_ATTRIBUTE} from '../constants/attributeForm';

export function addAttribute(data) {
	return {
		type: ADD_ATTRIBUTE,
		data
	}
}

export function deleteAttribute(id) {
	return {
		type: DELETE_ATTRIBUTE,
		id
	}
}
