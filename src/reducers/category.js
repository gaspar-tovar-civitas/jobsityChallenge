import { fromJS } from 'immutable';

import { GET_CATEGORY, MODIFY_CATEGORY } from '../constants/category';

const initialState = { page: 1 };

function categoryReducer(state = initialState, action) {
	switch (action.type) {
		case GET_CATEGORY:
			return state.page;
		case MODIFY_CATEGORY:
			return {...state, page: action.page}
		default:
			return state
	}
}

export default categoryReducer;
