import React from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar } from 'antd';

import { EnvironmentOutlined } from '@ant-design/icons';

import './company-avatar-info.scss';

function CompanyInfoDetails(props) {
  const { location, website } = props;

  return (
    <div className="company-info-details">
      <div className="company-info-details__website">{website}</div>
      <div className="company-info-details__location">
        <EnvironmentOutlined />
        &nbsp;
        {location}
      </div>
    </div>
  );
}

export default function CompanyAvatarInfo(props) {
  const { company, oldDashboardURL } = props;

  return (
    <Card className="company-avatar-info" bordered={false}>
      <Card.Meta
        avatar={<Avatar src={company.logo} size="large" />}
        title={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <a
            target="_blank"
            className="linked-title linked-title--active"
            rel="noreferrer"
            href={`${oldDashboardURL}company-details/${company.id}`}
          >
            {company.name}
          </a>
        }
        description={
          <CompanyInfoDetails website={company.website} location={`${company.location[0]}, ${company.location[2]}`} />
        }
      />
    </Card>
  );
}

CompanyAvatarInfo.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    location: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  oldDashboardURL: PropTypes.string.isRequired,
};

CompanyInfoDetails.propTypes = {
  website: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};
