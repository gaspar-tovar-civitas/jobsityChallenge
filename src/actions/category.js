import {GET_CATEGORY, MODIFY_CATEGORY} from '../constants/category';

export function getCategory() {
	return {
		type: GET_CATEGORY
	}
}

export function modifyCategory(page) {
	return {
		type: MODIFY_CATEGORY,
		page
	}
}
