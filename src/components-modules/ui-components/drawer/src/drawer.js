import React from 'react';
import PropTypes from 'prop-types';
import { Drawer as AntDrawer } from 'antd';

const Drawer = (props) => {
  const { onClose, sideDrawerWidth, visible, title, content, placement, closable } = props;

  return (
    <AntDrawer
      closable={closable}
      onClose={onClose}
      placement={placement}
      title={title}
      visible={visible}
      width={sideDrawerWidth}
    >
      {content}
    </AntDrawer>
  );
};

Drawer.propTypes = {
  closable: PropTypes.bool,
  content: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  placement: PropTypes.string,
  sideDrawerWidth: PropTypes.number,
  title: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
};

Drawer.defaultProps = {
  closable: false,
  placement: 'right',
  sideDrawerWidth: 640,
};

export default Drawer;
