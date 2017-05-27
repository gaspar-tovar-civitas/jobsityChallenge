import { fromJS } from 'immutable';

import { ADD_ATTRIBUTE, DELETE_ATTRIBUTE, DISABLE_SAVE } from '../constants/attributeForm';
import data from '../data/data.json';

const initialState = data;

function attributeFormReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_ATTRIBUTE:
			state.data.push(action.data);
			return Object.assign({ data: state.data });
		case DELETE_ATTRIBUTE:
			_.remove(state.data, { 'id': action.id})
			return Object.assign({ data: state.data });
		case DISABLE_SAVE:
			state.disableSave = action.disable;
			return Object.assign({ data: state.data });
		default:
			return state
	}
}

export default attributeFormReducer;
