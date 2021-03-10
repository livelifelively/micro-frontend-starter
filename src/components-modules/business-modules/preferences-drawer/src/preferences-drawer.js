/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import RightHandSideDrawer from '@slintel/uic-drawer';
import DrawerTitle from '@slintel/uic-drawer-title';

import PreferencesForm from './preferences-form';

export default class PreferencesDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preferences: null,
      preferencesChanges: {},
      resetPreferencesFormState: () => {},
      loading: false,
      preferencesForm: {},
      disableFormSubmit: true,
    };
  }

  async componentDidMount() {
    const { userId } = this.props;
    await this.fetchUserPreferences(userId);
  }

  fetchUserPreferences = async (userId) => {
    const { getUserPreferences } = this.props;
    const data = await getUserPreferences(userId);
    return new Promise((resolve) => {
      this.setState({ preferences: data }, resolve);
    });
  };

  onSave = async () => {
    const { onSave, onClose, updateUserPreferences } = this.props;
    const { preferences, preferencesChanges, resetPreferencesFormState } = this.state;

    const newPreferences = {
      ...preferences,
      ...preferencesChanges,
    };

    this.setState({ loading: true });

    const response = await updateUserPreferences(newPreferences);

    const userPrefsUpdatedAt = response?.updateUserPrerences?.updated_at;
    const userPrefsCreatedAt = response?.updateUserPrerences?.created_at;

    await onSave(newPreferences, userPrefsUpdatedAt, userPrefsCreatedAt);
    await resetPreferencesFormState(newPreferences);

    this.setState({
      loading: false,
      preferences: newPreferences,
    });
    onClose();
  };

  /**
   * When we reset the form state back to last saved, we have to reset state within the preferences-form
   * Mostly to handle click cancel button case.
   * @param {Function} resetFunction code to execute in preferences form when we reset the preferences state.
   */
  resetFormState = (resetFunction) => {
    this.setState({
      resetPreferencesFormState: resetFunction,
    });
  };

  formReference = (ref) => {
    this.setState({
      preferencesForm: ref,
    });
  };

  onCancel = () => {
    const { onClose } = this.props;
    const { preferences, resetPreferencesFormState } = this.state;

    this.setState({
      preferences: cloneDeep(preferences),
    });

    resetPreferencesFormState(preferences);
    onClose();
  };

  onPreferencesChange = async (changedData) => {
    const { preferencesChanges, preferencesForm } = this.state;
    this.setState({
      preferencesChanges: {
        ...preferencesChanges,
        ...changedData,
      },
    });
    try {
      /**
       * again a hack. this in a nacent form will show all errors on untouched fields.
       * #FIXME
       * No need to push for changes on each field. Just track this reference for values. #TODO
       */
      await preferencesForm.current.validateFields();
      this.setState({ disableFormSubmit: false });
    } catch (e) {
      this.setState({ disableFormSubmit: true });
    }
  };

  render() {
    const {
      rightSideDrawerWidth,
      visible,
      mixpanel,
      getLocationsSuggestions,
      getSubCategoriesSuggestions,
      getTechnologiesSuggestions,
    } = this.props;
    const { preferences, loading, disableFormSubmit } = this.state;

    return (
      preferences && (
        <RightHandSideDrawer
          visible={visible}
          onClose={this.onCancel}
          rightSideDrawerWidth={rightSideDrawerWidth}
          content={
            <PreferencesForm
              userPreferences={preferences}
              onChange={this.onPreferencesChange}
              resetFormState={this.resetFormState}
              formReference={this.formReference}
              disabled={loading}
              mixpanel={mixpanel}
              getLocationsSuggestions={getLocationsSuggestions}
              getTechnologiesSuggestions={getTechnologiesSuggestions}
              getSubCategoriesSuggestions={getSubCategoriesSuggestions}
            />
          }
          title={
            <DrawerTitle
              title="YOUR SALES PREFERENCES"
              actions={[
                { title: 'Cancel', type: 'default', size: 'large', onClick: this.onCancel, disabled: loading },
                {
                  title: 'Save',
                  type: 'primary',
                  size: 'large',
                  onClick: this.onSave,
                  disabled: loading || disableFormSubmit,
                },
              ]}
            />
          }
        />
      )
    );
  }
}

PreferencesDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  getUserPreferences: PropTypes.func.isRequired,
  getLocationsSuggestions: PropTypes.func.isRequired,
  getTechnologiesSuggestions: PropTypes.func.isRequired,
  getSubCategoriesSuggestions: PropTypes.func.isRequired,
  updateUserPreferences: PropTypes.func.isRequired,
  rightSideDrawerWidth: PropTypes.number,
  visible: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
};

PreferencesDrawer.defaultProps = {
  rightSideDrawerWidth: 640,
  mixpanel: null,
};
