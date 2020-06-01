import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: "contain",
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  numberInput: {
    width: INFINITE_WIDTH,
  },
  expiryInput: {
    width: 80,
  },
  cvcInput: {
    width: 80,
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  input: {
    height: 40,
    color: "black",
    minWidth: 50,
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      inputStyle, validColor, invalidColor, placeholderColor,
      placeholders, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return "placeholder";
  }

  render() {
    const {type} = this.props;
    if (type && type === 'form') {
      return this.renderForm();
    }
    return this.renderFade();
  }

  renderFade() {
    const { focused, values: { number }, inputStyle, status: { number: numberStatus } } = this.props;
    const showRightPart = focused && focused !== "number";

    return (
      <View style={s.container}>
        <View style={[
          s.leftPart,
          showRightPart ? s.hidden : s.expanded,
        ]}>
          <CCInput {...this._inputProps("number")}
            keyboardType="numeric"
            containerStyle={s.numberInput} />
        </View>
        <TouchableOpacity onPress={showRightPart ? this._focusNumber : this._focusExpiry }>
          <Image style={s.icon} source={Icons[this._iconToShow()]} />
        </TouchableOpacity>
        <View style={[
          s.rightPart,
          showRightPart ? s.expanded : s.hidden,
        ]}>
          <TouchableOpacity onPress={this._focusNumber}
            style={s.last4}>
            <View pointerEvents={"none"}>
              <CCInput field="last4"
                keyboardType="numeric"
                value={ numberStatus === "valid" ? number.substr(number.length - 4, 4) : "" }
                inputStyle={[s.input, inputStyle]}
                containerStyle={[s.last4Input]} />
            </View>
          </TouchableOpacity>
          <CCInput {...this._inputProps("expiry")}
            keyboardType="numeric"
            containerStyle={s.expiryInput} />
          <CCInput {...this._inputProps("cvc")}
            keyboardType="numeric"
            containerStyle={s.cvcInput} />
        </View>
      </View>
    );
  }

  renderForm() {
    const { focused, values: { number }, containerStyle, inputStyle, labelStyle, status: { number: numberStatus } } = this.props;
    const showRightPart = focused && focused !== "number";
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.number}>
          <CCInput
            label={'CARD NUMBER'}
            labelStyle={[styles.labelStyle, labelStyle]}
            {...this._inputProps("number")}
            keyboardType="numeric"
            containerStyle={styles.numberInput}
          />
          <Image style={s.icon} source={Icons[this._iconToShow()]} />
        </View>
        <View style={styles.secondRow}>
          <CCInput {...this._inputProps("expiry")}
                   label={'EXPIRY'}
                   labelStyle={[styles.labelStyle, labelStyle]}
                   keyboardType="numeric"
                   inputStyle={[{width: 80, height: 40}, inputStyle]}
                   containerStyle={styles.expiryInput} />
          <CCInput {...this._inputProps("cvc")}
                   label={'CVC'}
                   labelStyle={[styles.labelStyle, labelStyle]}
                   keyboardType="numeric"
                   inputStyle={[{width: 50, height: 40}, inputStyle]}
                   containerStyle={styles.cvcInput} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: "contain",
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  labelStyle: {
    marginRight: 10,
  },
  number: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    //overflow: "hidden",
    justifyContent: 'space-between',
  },
  numberInput: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    //width: INFINITE_WIDTH,
  },
  secondRow: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    //width: INFINITE_WIDTH,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  expiryInput: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cvcInput: {
    alignItems: 'center',
    flexDirection: 'row',
    //width: 80,
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  input: {
    height: 40,
    color: "black",
  },
});
