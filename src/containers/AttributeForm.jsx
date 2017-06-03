import React, { Component } from 'react';
import classNames from 'classnames';
import t from 'tcomb-form';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Glyphicon, Button } from 'react-bootstrap';
import { addAttribute, updateAttribute, deleteAttribute } from '../actions/attributeForm';

const Form = t.form.Form;
// Initial values of the form
const STATE_INITIAL_VALUE = {
  disableSave: false,
  isObject: false,
  dataType: {
    string: 'String',
    object: 'Object',
  },
  format: {
    none: 'None',
    number: 'Number',
    boolean: 'Boolean',
    dateTime: 'DateTime',
    cdata: 'CDATA',
  },
  name: false,
  rangeError: false,
  enumerationsError: false,
  isClosed: true,
};


class AttributeForm extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.save = _.bind(this.save, this);
    this.handleAttributeClick = _.bind(this.handleAttributeClick, this);
    this.handleDeleteClick = _.bind(this.handleDeleteClick, this);
    this.onChange = _.bind(this.onChange, this);
    this.state = STATE_INITIAL_VALUE;
    this._formData = {};
  }

  componentDidMount() {
    if (this.props.attribute.isNew) {
      this.setState({ isClosed: false });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.attribute.isNew === true && nextState.isClosed === true) {
      this.setState({ isClosed: false });
      return true;
    }
    return false;
  }

  onChange(formDataChanged, path) {
    // validate a field on every change
    // if the component exists validate if its on the right values
    if (this.refs.form.getComponent(path)) this.refs.form.getComponent(path).validate();
    // check if dataType object was selected
    const isObject = formDataChanged.dataType === 'object';
    // reset values
    const nullValues = {
      defaultValue: null,
      format: 'none',
    };
    const disableSave = this._validateNumberFormat();
    const enumerationsError = this._validateEnumeration();

    let formData = Object.assign(this.props.attribute, formDataChanged);
    formData = isObject ? Object.assign(formDataChanged, nullValues) : formData;
    switch (path[0]) {
      case 'dataType':
        this.setState({ isObject });
        break;

      case 'name':
        if (this.state.disableSave) {
          this.setState({ disableSave: false, nameError: false });
        }
        // check if name is duplicated
        _.map(this.props.data.data, (attribute) => {
          if (_.isMatch(attribute, { name: _.trim(formData.name) })
            && !_.isMatch(attribute, { name: _.trim(formData.name), id: formData.id })) {
            this.setState({ disableSave: true, nameError: true });
          }
        });
        break;

      case 'rangeMin':
        this.setState({ disableSave, rangeError: disableSave });
        break;

      case 'rangeMax':
        this.setState({ disableSave, rangeError: disableSave });
        break;

      case 'presicion':
        this.setState({ disableSave, rangeError: disableSave });
        break;

      case 'accuracy':
        this.setState({ disableSave, rangeError: disableSave });
        break;

      case 'enumerations':
        this.setState({ disableSave: enumerationsError, enumerationsError });
        break;

      default:
    }
    // Check if name is empty
    this._formData = formData;
    this.props.updateAttribute(formData);
  }

  // function to delete an attribute
  handleDeleteClick() {
    this.props.deleteAttribute(this.props.attribute.id);
  }

  save() {
    const value = this.refs.form.props.value;
    if (value) {
      // Check if name is empty
      if (!value.name) {
        this.setState({ disableSave: true, nameError: true });
        return false;
      }
      if ((value.format === 'number') && (!value.rangeMin || !value.rangeMax || !value.accuracy || !value.presicion)) {
        this.setState({ disableSave: true, rangeError: true });
        return false;
      }
      // Delete empty values from enumerations array
      if (this._formData.enumerations) {
        _.pull(value.enumerations, '', undefined);
      }
      // Add current category to the object
    }
    const extendedObject = {
      category: this.props.category,
      isNew: false,
    };

    this.props.updateAttribute(Object.assign(this._formData, extendedObject));
    this.props.addEmptyAttribute(this.props.category);
    this.setState({ isClosed: true });
  }

  // function to open and close information on the attribute
  handleAttributeClick() {
    this.setState({ isClosed: !this.state.isClosed });
  }

  _validateEnumeration() {
    const enumerations = this.refs.form.getComponent('enumerations').props.value;
    return (enumerations.length > 1 && !enumerations[enumerations.length - 2]);
  }

  _validateNumberFormat() {
    const min = this.refs.form.getComponent('rangeMin').props.value;
    const max = this.refs.form.getComponent('rangeMax').props.value;
    const presicion = this.refs.form.getComponent('presicion').props.value;
    const accuracy = this.refs.form.getComponent('accuracy').props.value;
    let result = true;
    if (min && max) {
      result = (min < max);
      if (presicion && result) {
        result = (min < presicion) && (presicion < max);
        if (result) {
          result = ((max - min) % presicion === 0);
        }
      }
      if (accuracy && result) {
        result = (min < accuracy) && (accuracy < max);
        if (result) {
          result = ((max - min) % accuracy === 0);
        }
      }
    }
    return !result;
  }

  render() {
    const disabled = !this.props.attribute.isNew;
    const selectDataType = t.enums(this.state.dataType);
    const selectFormat = t.enums(this.state.format);
    const numberFormat = this.props.attribute.format === 'number';
    const noneFormat = this.props.attribute.dataType !== 'object' && this.props.attribute.format === 'none';
    const attribute = t.struct({ name: t.String,
      description: t.maybe(t.String),
      deviceResourceType: t.maybe(t.String),
      defaultValue: t.maybe(t.String),
      dataType: selectDataType,
      format: selectFormat,
      rangeMin: t.Number,
      rangeMax: t.Number,
      unitOfMeasurement: t.maybe(t.String),
      presicion: t.Number,
      accuracy: t.Number,
      enumerations: t.list(t.String),
    });

    const formLayout = (locals) => {
      return (
        <div className="container-fluid" disabled="disabled">
          <div className="row">
            <div className="col-md-4">{locals.inputs.name}</div>
            <div className="col-md-8">{locals.inputs.description}</div>
          </div>
          <div className="row">
            <div className="col-md-5">{locals.inputs.deviceResourceType}</div>
            <div className="col-md-7">{locals.inputs.defaultValue}</div>
          </div>
          <div className="row">
            <div className="col-md-5">{locals.inputs.dataType}</div>
            <div className="col-md-7">{locals.inputs.format}</div>
          </div>
          <div className={ classNames('row', {'show': numberFormat, 'hide': !numberFormat})}>
            <div className="col-md-6">{locals.inputs.rangeMin}</div>
            <div className="col-md-6">{locals.inputs.rangeMax}</div>
          </div>
          <div className={ classNames('row', {'show': numberFormat, 'hide': !numberFormat})}>
            <div className="col-md-4">{locals.inputs.presicion}</div>
            <div className="col-md-4">{locals.inputs.unitOfMeasurement}</div>
            <div className="col-md-4">{locals.inputs.accuracy}</div>
          </div>
          <div className={ classNames('row', {'show': noneFormat, 'hide': !noneFormat})}>
            <div className="col-md-12">{locals.inputs.enumerations}</div>
          </div>
        </div>
      );
    };

    const options = {
      i18n: {
        optional: '',
        required: '',
        add: 'Add',
        remove: 'Remove',
      },
      template: formLayout,
      fields: {
        name: {
          hasError: this.state.nameError,
          disabled,
        },
        description: {
          disabled,
        },
        deviceResourceType: {
          disabled: true,
        },
        defaultValue: {
          disabled: this.state.isObject || disabled,
        },
        dataType: {
          nullOption: false,
          disabled,
        },
        format: {
          nullOption: false,
          disabled: this.state.isObject || disabled,
        },
        rangeMin: {
          type: numberFormat,
          hasError: this.state.rangeError,
          disabled,
        },
        rangeMax: {
          type: numberFormat,
          hasError: this.state.rangeError,
          disabled,
        },
        unitOfMeasurement: {
          type: numberFormat,
          hasError: this.state.rangeError,
          disabled,
        },
        presicion: {
          type: numberFormat,
          hasError: this.state.rangeError,
          disabled,
        },
        accuracy: {
          type: numberFormat,
          hasError: this.state.rangeError,
          disabled,
        },
        enumerations: {
          className: noneFormat,
          hasError: this.state.enumerationsError,
          disableOrder: true,
          disabled,
        }
      }
    };
    const {
      name,
      description,
      deviceResourceType,
      defaultValue,
      format,
      dataType,
      rangeMin,
      rangeMax,
      unitOfMeasurement,
      presicion,
      accuracy,
      enumerations
      } = _.get(this.props, 'attribute');
    const value = {
      name,
      description,
      deviceResourceType,
      defaultValue,
      format,
      dataType,
      rangeMin,
      rangeMax,
      unitOfMeasurement,
      presicion,
      accuracy,
      enumerations
    };
    const glyph = this.state.isClosed ? 'down' : 'up';
    const saveButton = disabled ? null :
      <Button disabled={this.state.disableSave} className="btn-primary" onClick={this.save}>
        Save
      </Button>;
    const closeButton = !disabled ? null :
      <Button className="attribute-control-button" onClick={this.handleAttributeClick}>
        <Glyphicon glyph={`glyphicon glyphicon-menu-${glyph}`}/>
      </Button>;
    const deleteButton = !disabled ? null :
      <Button className="attribute-delete-button" onClick={this.handleDeleteClick}>
        <Glyphicon glyph={`glyphicon glyphicon-trash`}/>
      </Button>;

    return (
      <div
        className={classNames('attribute grid', {'attribute-closed': this.state.isClosed })}
      >
        <div className="container-fluid">
          <div className="row button-holder">
            {deleteButton}
            {closeButton}
          </div>
        </div>
        <Form
          onChange={this.onChange}
          ref="form"
          type={attribute}
          options={options}
          value={value}
        />
        {saveButton}
      </div>
    );
  }
}
;

AttributeForm.propTypes = {
  attribute: React.PropTypes.object,
  enableForm: React.PropTypes.bool,
  addEmptyAttribute: React.PropTypes.func,
};

const mapStateToProps = state => ({
  data: state.data,
  category: state.category.page,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addAttribute: (data) => {
      dispatch(addAttribute(data));
    },
    updateAttribute: (data) => {
      dispatch(updateAttribute(data));
    },
    deleteAttribute: (id) => {
      dispatch(deleteAttribute(id));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttributeForm);

