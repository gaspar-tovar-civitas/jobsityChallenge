import React, { Component } from 'react';
import { render } from 'react-dom';
import classNames from 'classnames';
import t from 'tcomb-form';
import _ from 'lodash';
import { connect } from 'react-redux';
import { addAttribute, deleteAttribute } from '../actions/attributeForm';
import { Glyphicon, Button } from 'react-bootstrap';
const Form = t.form.Form;
const FORM_INITIAL_VALUE = {
	disableSave: false,
	isObject: false,
	formData: {
		name: '',
		description: '',
		deviceResourceType: '',
		defaultValue: '',
		dataType: 'string',
		format: 'none',
		enumerations: [''],
		deviceResourceType: 'Default Value'
	},
	dataType: {
		string: 'String',
		object: 'Object'
	},
	format: {
		none: 'None',
		number: 'Number',
		boolean: 'Boolean',
		dateTime: 'DateTime',
		cdata: 'CDATA'
	},
	name: false,
	rangeError: false,
	enumerationsError: false
};


export class AttributeForm extends Component { // eslint-disable-line react/prefer-stateless-function

	constructor(props) {
		super(props);
		this.save = _.bind(this.save, this);
		this.handleAttributeClick = _.bind(this.handleAttributeClick, this);
		this.handleDeleteClick = _.bind(this.handleDeleteClick, this);
		this.onChange = _.bind(this.onChange, this);
		this._isClosed = true;
		this.state = FORM_INITIAL_VALUE;
	}

	save() {
		// call getValue() to get the values of the form
		if (!this._isDuplicated) {
			var value = this.refs.form.props.value;
			// if validation fails, value will be null
			if (value) {
				// value here is an instance of Person
				if(!value.name) {
					this.setState({disableSave: true, nameError: true});
					return false;
				}

				if (value.enumerations) {
					_.pull(value.enumerations, '', undefined);
				}
				const extendedObject = {
					category: this.props.category
				}
				this.props.addAttribute(Object.assign({}, value, extendedObject));
				this.setState(FORM_INITIAL_VALUE);
			}
		}
	}

	handleAttributeClick() {
		this._isClosed= !this._isClosed;
		this.forceUpdate();
	}

	handleDeleteClick() {
		this.props.deleteAttribute(this.props.attribute.id);
	}

	onChange(formDataChanged, path) {
			// validate a field on every change
		if (this.refs.form.getComponent(path)) this.refs.form.getComponent(path).validate();

		const isObject = formDataChanged.dataType === 'object';
		const nullValues = {
			defaultValue: null,
			format: 'none'
		};
		const disableSave = this._validateNumberFormat();
		const enumerationsError = this._validateEnumeration();

		let formData = isObject ? Object.assign(formDataChanged, nullValues) : formDataChanged;
		switch (path[0]) {
			case 'dataType':
				this.setState({isObject});
				break;

			case 'name':
				if(this.state.disableSave) {
					this.setState({disableSave: false, nameError: false});
				}
				_.map(this.props.data.data, (attribute) => {
					if (_.isMatch(attribute, { name: formData.name }) == true) {
						this.setState({disableSave: true, nameError: true});
					}
				})
				break;

			case 'rangeMin':
				this.setState({disableSave, rangeError: disableSave});
				break;

			case 'rangeMax':
				this.setState({disableSave, rangeError: disableSave});
				break;

			case 'presicion':
				this.setState({disableSave, rangeError: disableSave});
				break;

			case 'accuracy':
				this.setState({disableSave, rangeError: disableSave});
				break;

			case 'enumerations':
				this.setState({disableSave: enumerationsError, enumerationsError})
				break;
		}
		this.setState({formData});
	}

	_validateEnumeration() {
		const enumerations = this.refs.form.getComponent('enumerations').props.value;
		return (enumerations.length > 1 && !enumerations[enumerations.length-2]);


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
			}
			if (accuracy && result) {
				result = (min < accuracy) && (accuracy < max);

			}
		}
		return !result;
	}

	render() {
		var dataType = t.enums(this.state.dataType);
		var selectFormat = t.enums(this.state.format);
		const attribute = t.struct({
				name: t.String,
				description: t.maybe(t.String),
				deviceResourceType: t.maybe(t.String),
				defaultValue: t.maybe(t.String),
				dataType,
				format: selectFormat,
				rangeMin: t.Number,
				rangeMax: t.Number,
				unitOfMeasurement: t.maybe(t.String),
				presicion: t.Number,
				accuracy: t.Number,
				enumerations: t.list(t.String)
			}
		);
		const disabled = !_.isUndefined(this.props.attribute);
		if (disabled) {
			this.state.formData.format = this.props.attribute.format;
		}
		const numberFormat = this.state.formData.format == 'number';
		const noneFormat = this.state.formData.dataType != 'object' && this.state.formData.format == 'none';
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
				remove: 'Remove'
			},
			template: formLayout,
			fields: {
				name: {
					hasError: this.state.nameError,
					disabled
				},
				description: {
					disabled
				},
				deviceResourceType: {
					disabled: true,
					disabled
				},
				defaultValue: {
					disabled: this.state.isObject,
					disabled
				},
				dataType: {
					nullOption: false,
					disabled
				},
				format: {
					nullOption: false,
					disabled: this.state.isObject,
					disabled
				},
				rangeMin: {
					type: numberFormat,
					hasError: this.state.rangeError,
					disabled
				},
				rangeMax: {
					type: numberFormat,
					hasError: this.state.rangeError,
					disabled
				},
				unitOfMeasurement: {
					type: numberFormat,
					hasError: this.state.rangeError,
					disabled
				},
				presicion: {
					type: numberFormat,
					hasError: this.state.rangeError,
					disabled
				},
				accuracy: {
					type: numberFormat,
					hasError: this.state.rangeError,
					disabled
				},
				enumerations: {
					className: noneFormat,
					hasError: this.state.enumerationsError,
					disableOrder: true,
					disabled
				}
			}
		};
		let value = {};
		if(disabled) {
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
			value = {
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
		} else {
			value = this.state.formData;
			this._isClosed = false;
		}
		const glyph = this._isClosed ? 'down' : 'up';
		const saveButton = disabled ? null :
			<Button disabled={this.state.disableSave} className="btn-primary" onClick={this.save}>
				Save
			</Button>;
		const closeButton = !disabled ? null :
			<Button className="attribute-control-button" onClick={this.handleAttributeClick}>
				<Glyphicon glyph={`glyphicon glyphicon-menu-${glyph}`} />
			</Button>;
		const deleteButton = !disabled ? null :
			<Button className="attribute-delete-button" onClick={this.handleDeleteClick}>
				<Glyphicon glyph={`glyphicon glyphicon-trash`} />
			</Button>;

		return (
			<div
				className={classNames('attribute grid', {'attribute-closed': this._isClosed })}
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

AttributeForm.propTypes = {
	attribute: React.PropTypes.object
};

const mapStateToProps = state => ({
	data: state.data,
	category: state.category.page

});

const mapDispatchToProps = (dispatch) => {
	return {
		addAttribute: (data) => {
			dispatch(addAttribute(data));
		},
		deleteAttribute: (id) => {
			dispatch(deleteAttribute(id));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AttributeForm)

