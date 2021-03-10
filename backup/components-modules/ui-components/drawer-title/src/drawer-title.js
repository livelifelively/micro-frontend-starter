import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

export default function DrawerTitle(props) {
  const { title, actions } = props;
  return (
    <div className="drawer-header">
      <div className="drawer-header__title">{title}</div>
      <div className="drawer-header__actions">
        {actions.map((val) => {
          return (
            <Button
              loading={val.loading || false}
              type={val.type}
              key={val.title}
              size={val.size}
              onClick={val.onClick}
              disabled={val.disabled}
            >
              {val.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

DrawerTitle.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};
