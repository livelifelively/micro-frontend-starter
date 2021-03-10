import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

export default function CustomEmpty(props) {
  const { emptyStateMessage, blockHeight, noItemsImage } = props;

  const image = isEmpty(noItemsImage)
    ? 'https://d3ml3b6vywsj0z.cloudfront.net/website/empty%20state-01.png'
    : noItemsImage;

  return (
    <div style={{ height: blockHeight }} className="empty-state">
      <div>
        <img src={image} alt="No Items To Show" />
        <div>{emptyStateMessage}</div>
      </div>
    </div>
  );
}

CustomEmpty.propTypes = {
  emptyStateMessage: PropTypes.node.isRequired,
  // eslint-disable-next-line react/require-default-props
  blockHeight: PropTypes.string,
  noItemsImage: PropTypes.string,
};

CustomEmpty.defaultProps = {
  blockHeight: 'auto',
  noItemsImage: '',
};
