/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RightHandSideDrawer from '@slintel/uic-drawer';
import DrawerTitle from '@slintel/uic-drawer-title';

import ShareNewsForm from './share-news-form';

export default class ShareNewsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      disableFormSubmit: false,
      shareNewsForm: null,
    };
  }

  onFormSubmit = async () => {
    const { shareNewsForm } = this.state;
    await shareNewsForm.current.submit();
  };

  shareNews = async (data) => {
    const { onSave, onClose } = this.props;

    await onSave(data);

    onClose();
  };

  onCancel = () => {
    const { onClose } = this.props;
    const { shareNewsForm } = this.state;

    let fields = shareNewsForm.current.getFieldsValue();
    fields = Object.keys(fields);

    shareNewsForm.current.resetFields(fields);

    onClose();
  };

  linkFormToDrawer = (ref) => {
    this.setState({
      shareNewsForm: ref,
    });
  };

  render() {
    const { rightSideDrawerWidth, visible, newsToShare, domainUsers } = this.props;
    const { loading, disableFormSubmit } = this.state;

    return (
      <RightHandSideDrawer
        visible={visible}
        onClose={this.onCancel}
        rightSideDrawerWidth={rightSideDrawerWidth}
        content={
          <ShareNewsForm
            newsToShare={newsToShare}
            onFormSubmit={this.shareNews}
            linkFormToDrawer={this.linkFormToDrawer}
            disabled={loading}
            domainUsers={domainUsers}
          />
        }
        title={
          <DrawerTitle
            title="SHARE NEWS"
            actions={[
              { title: 'Cancel', type: 'default', size: 'large', onClick: this.onCancel, disabled: loading },
              {
                title: 'Share',
                type: 'primary',
                size: 'large',
                onClick: this.onFormSubmit,
                disabled: loading || disableFormSubmit,
              },
            ]}
          />
        }
      />
    );
  }
}

ShareNewsDrawer.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  rightSideDrawerWidth: PropTypes.number,
  visible: PropTypes.bool.isRequired,
  newsToShare: PropTypes.shape({
    id: PropTypes.string,
    news: PropTypes.shape(),
  }).isRequired,
  domainUsers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    })
  ),
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
};

ShareNewsDrawer.defaultProps = {
  rightSideDrawerWidth: 640,
  mixpanel: null,
  domainUsers: [],
};
