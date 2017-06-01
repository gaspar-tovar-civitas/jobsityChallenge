import React, { Component } from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { Tabs, Tab, Row, Col, Grid, PageHeader } from 'react-bootstrap';


import AttributeForm from './AttributeForm';
import data from '../data/data.json';
import { modifyCategory } from '../actions/category';
const JSONArea = styled.textarea`
                  width: 100%;
                  height: 1000px;`;
const CATEGORIES = _.groupBy(data.data, 'category');

export class App extends Component {

  constructor(props) {
    super(props);
    this.updateCategory = _.bind(this.updateCategory, this);
  }

  componentDidMount() {
    this.updateCategory(1);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  updateCategory(key) {
    this.props.modifyCategory(Object.keys(CATEGORIES)[key-1]);
  }

  render() {
    const dataValues = this.props.data;
    
    let key = 0;
    const tabs =_.map(CATEGORIES, (attributes, category) => {
      key++;
      const attributesInCategory = _.partition(dataValues.data, { 'category': category });
      return <Tab eventKey={key} key={key} title={category}>
        {
          _.map(attributesInCategory[0], (attribute, index) => {
            return  <AttributeForm key={index}  attribute={attribute}/>
          })
        }
        <AttributeForm key={key}/>
      </Tab>
    });
    return (
      <Grid className="container">
        <Row>
          <Col xs={12} className="text-center">
            <PageHeader>Jobsity test<small> Technical Test for Jobsity React Dev</small></PageHeader>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Tabs id="attributeTypes" defaultActiveKey={1} onSelect={this.updateCategory}>
              {tabs}
            </Tabs>
          </Col>
          <Col xs={6}>
            <JSONArea value={JSON.stringify(dataValues)} disabled />
          </Col>
        </Row>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  data: state.data,
  page: state.category.page
});

const mapDispatchToProps = (dispatch) => {
  return {
    modifyCategory: (page) => {
      return dispatch(modifyCategory(page));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
