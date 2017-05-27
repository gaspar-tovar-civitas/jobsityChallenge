import {ADD_ATTRIBUTE, DELETE_ATTRIBUTE, DISABLE_SAVE} from '../constants/attributeForm';

export function addAttribute(data) {
	return {
		type: ADD_ATTRIBUTE,
		data
	}
}

export function deleteAttribute(id) {
	console.log('=========  id  =========');
	console.log(id);
	console.log('=====  End of id>  =====');
	return {
		type: DELETE_ATTRIBUTE,
		id
	}
}

export function disableSave(disable) {
	return {
		type: DISABLE_SAVE,
		disable
	}
}
