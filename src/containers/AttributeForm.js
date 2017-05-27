import React, { Component } from 'react';
import { render } from 'react-dom';
import classNames from 'classnames';
import t from 'tcomb-form';
import _ from 'lodash';
import { connect } from 'react-redux';
import { addAttribute, deleteAttribute, disableSave } from '../actions/attributeForm';
import { Glyphicon, Button } from 'react-bootstrap';
const Form = t.form.Form;

export class AttributeForm extends Component { // eslint-disable-line react/prefer-stateless-function

	constructor(props) {
		super(props);
		this.save = _.bind(this.save, this);
		this.handleAttributeClick = _.bind(this.handleAttributeClick, this);
		this.handleDeleteClick = _.bind(this.handleDeleteClick, this);
		this.onChange = _.bind(this.onChange, this);
		this._isClosed = true;
		this._isDuplicated = false;

	}

	save() {
		// call getValue() to get the values of the form
		if (!this._isDuplicated) {
			var value = this.refs.form.getValue();
			// if validation fails, value will be null
			if (value) {
				// value here is an instance of Person
				const extendedObject = {
					"category": this.props.category,
					"id":"z",
					"enumerations":[],
					"rangeMin":0,
					"ragenMax":1,
					"unitOfMeasurement":"mm",
					"presicion":1,
					"accuracy":1
				}
				this.props.addAttribute(Object.assign({}, value, extendedObject));
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

	onChange(e) {
			// validate a field on every change
		const name = _.chain(e)
			.get('target.value', '')
			.trim()
			.value();
		this._isDuplicated = false;
		_.map(this.props.data.data, (attribute) => {
			if (_.isMatch(attribute, { name }) == true) {
				this._isDuplicated = true;
			}
		})
	}

	render() {
		var dataType = t.enums({
			None: 'None',
			Number: 'Number',
			Boolean: 'Boolean',
			DateTime: 'DateTime',
			CDATA: 'CDATA'
		});
		const attribute = t.struct({
				name: t.String,
				description: t.String,
				deviceResourceType: t.String,
				defaultValue: t.String,
				dataType: dataType,
				format: t.String,
				enumerations: t.String
			}
		);
		const disabled = !_.isUndefined(this.props.attribute);

		const options = {
			disabled,
			fields: {
				deviceResourceType: {
					disabled: true
				},
				name: {
					attrs: {
						onKeyUp: this.onChange
					}
				}
			}
		}
		let value = {
			deviceResourceType: 'Default Value'
		}
		if(disabled) {
			const {name, description, deviceResourceType, defaultValue, format, enumerations} = _.get(this.props, 'attribute');
			value = {
				name,
				description,
				deviceResourceType,
				defaultValue,
				format,
				enumerations
			};
		} else {
			this._isClosed = false;
		}
		const glyph = this._isClosed ? 'down' : 'up';
		const saveButton = disabled ? null :
			<Button disabled={this._isDuplicated} className="btn-primary" onClick={this.save}>
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
				className={classNames('attribute', {'attribute-closed': this._isClosed })}
			>
				{deleteButton}
				{closeButton}
				<Form
					onChange={this.updateSelect}
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
		},
		disableSave: () => {
			dispatch(disableSave());
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AttributeForm)

