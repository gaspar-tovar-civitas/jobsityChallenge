import { combineReducers } from 'redux';
import attributeFormReducer from './attributeForm';
import categoryReducer from './category';

const rootReducer = combineReducers({
  data: attributeFormReducer,
  category: categoryReducer,
});

export default rootReducer;
