import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { Tabs, Tab, Row, Col, Grid, PageHeader } from 'react-bootstrap';


import AttributeForm from './AttributeForm';
import data from '../data/data.json';
import { modifyCategory } from '../actions/category';
import { addAttribute } from '../actions/attributeForm';

const JSONArea = styled.textarea`
                  width: 100%;
                  height: 1000px;`;
const CATEGORIES = _.groupBy(data.data, 'category');

const FORM_INITIAL_VALUE = {
  formData: {
    name: '',
    description: '',
    defaultValue: '',
    dataType: 'string',
    format: 'none',
    enumerations: [''],
    deviceResourceType: 'Default Value',
    isNew: true,
  },
};

export class App extends Component {

  constructor(props) {
    super(props);
    this.updateCategory = _.bind(this.updateCategory, this);
    this.addEmptyAttribute = _.bind(this.addEmptyAttribute, this);
  }

  componentWillMount() {
    this.updateCategory(1);
    this.addEmptyAttribute();
    _.map(CATEGORIES, (attributes, category) => {
      this.addEmptyAttribute(category);
    });
  }

  updateCategory(key) {
    this.props.modifyCategory(Object.keys(CATEGORIES)[key - 1]);
  }

  addEmptyAttribute(category) {
    const extendedObject = {
      category,
    };
    this.props.addAttribute(Object.assign({}, FORM_INITIAL_VALUE.formData, extendedObject));
  }

  render() {
    const dataValues = this.props.data;
    let key = 0;
    //  Extract the tabs from the JSON
    const tabs = _.map(CATEGORIES, (attributes, category) => {
      key += 1;
      const attributesInCategory = _.partition(dataValues.data, { category });
      return (<Tab eventKey={key} key={key} title={category} >
        {
          _.map(attributesInCategory[0], (attribute, index) => {
            if (index > (_.size(attributesInCategory[0]) - 1)) {
              attribute.isNew = false;
            }
            return (
              <AttributeForm
                key={index}
                attribute={attribute}
                addEmptyAttribute={this.addEmptyAttribute}
              />
            );
          })
        }
      </Tab>);
    });
    return (
      <Grid className="container">
        <Row>
          <Col xs={12} className="text-center">
            <PageHeader>
              Jobsity test<small> Technical Test for Jobsity React Dev</small>
            </PageHeader>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Tabs id="attributeTypes" defaultActiveKey={1} onSelect={this.updateCategory}>
              {tabs}
            </Tabs>
          </Col>
          <Col xs={6}>
            <JSONArea value={JSON.stringify(dataValues, null, '\t')} disabled />
          </Col>
        </Row>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  data: state.data,
  page: state.category.page,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addAttribute: (data) => {
      dispatch(addAttribute(data));
    },
    modifyCategory: (page) => {
      dispatch(modifyCategory(page));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
