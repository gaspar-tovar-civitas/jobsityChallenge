import { fromJS } from 'immutable';
import _ from 'lodash';
import { ADD_ATTRIBUTE, DELETE_ATTRIBUTE } from '../constants/attributeForm';
import data from '../data/data.json';

const initialState = data;

function attributeFormReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_ATTRIBUTE:
			const nextIndex = _.maxBy(state.data, 'id').id + 1;
			action.data.id = nextIndex;
			state.data.push(action.data);
			return Object.assign({ data: state.data });
		case DELETE_ATTRIBUTE:
			_.remove(state.data, { 'id': action.id});
			return Object.assign({ data: state.data });
		default:
			return state
	}
}

export default attributeFormReducer;
