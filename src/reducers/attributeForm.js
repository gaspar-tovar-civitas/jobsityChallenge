import _ from 'lodash';
import { ADD_ATTRIBUTE, UPDATE_ATTRIBUTE, DELETE_ATTRIBUTE } from '../constants/attributeForm';
import data from '../data/data.json';

const initialState = data;

function attributeFormReducer(state = initialState, action) {
  const nextIndex = _.size(state.data) > 0 ? _.maxBy(state.data, 'id').id + 1 : 1;
  switch (action.type) {
    case ADD_ATTRIBUTE:
      _.assign(action.data, { id: nextIndex });
      state.data.push(action.data);
      return Object.assign({ data: state.data });
    case UPDATE_ATTRIBUTE:
      _.chain(state.data)
      .find({ id: action.data.id })
      .update(action.data);
      return Object.assign({ data: state.data });
    case DELETE_ATTRIBUTE:
      _.remove(state.data, { id: action.id });
      return Object.assign({ data: state.data });
    default:
      return state;
  }
}

export default attributeFormReducer;
