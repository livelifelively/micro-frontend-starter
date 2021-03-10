/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable import/no-unresolved */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RightHandSideDrawer from '@slintel/uic-drawer';
import DrawerTitle from '@slintel/uic-drawer-title';
import history from '@slintel/s-history';
import { showError } from '@slintel/s-notifications';
import AddToListForm from './add-to-list-form';

const LIMIT_EXPORT = 50000;

const AddToListDrawer = ({
  visible,
  onClose,
  getLists,
  addItemsToList,
  addIntentBulkItemsToList,
  checkedItems,
  toggleCreateListDrawerVisibility,
  isFetchListItems,
  setReloadListItems,
  isBulkSelected,
  currentFilterSet,
  currentTotalDataCount,
}) => {
  const [listObj, setListObj] = useState({});
  const [selectedList, setSelectedList] = useState(null);
  const [pageStart, setPageStart] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const getTheList = async (searchValue, page = 1, sorting = { key: 'updatedAt', order: 'descend' }) => {
    try {
      const params = {
        type: 'company',
        page,
      };
      if (sorting && sorting.order) {
        params.sortKey = sorting.key;
        params.sortOrder = sorting.order === 'descend' ? 'DESC' : 'ASC';
      }
      if (searchValue) {
        params.searchTerm = searchValue;
      }
      setLoading(true);
      const response = await getLists(params);
      setLoading(false);
      setReloadListItems(false);
      setListObj(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (visible || isFetchListItems) {
      setSearchTerm('');
      setPageStart(1);
      getTheList();
    }
  }, [visible, isFetchListItems]);

  const onCancel = () => {
    onClose();
  };

  const onAdd = async () => {
    try {
      if (!(selectedList && selectedList.id)) {
        throw new Error('List not found');
      }
      let payload = {};
      if (isBulkSelected) {
        if (currentTotalDataCount + selectedList.itemCount > LIMIT_EXPORT) {
          throw new Error(`Can add up to ${LIMIT_EXPORT} records to the list`);
        }
        const response = await addIntentBulkItemsToList(selectedList.id, currentFilterSet);
        if (!response.listId) {
          throw new Error('Oops! There was an error while adding to the list, please try again');
        }
        history.push(`/list/${response.listId}`);
        window.location.reload();
      } else {
        const ids = checkedItems.map((item) => item.company.id);
        if (!ids.length) {
          throw new Error('Please select a company');
        }
        if (ids.length + selectedList.itemCount > LIMIT_EXPORT) {
          throw new Error(`Can add up to ${LIMIT_EXPORT} records to the list`);
        }
        payload = {
          ids,
          total_companies: ids.length,
        };
        const response = await addItemsToList(selectedList.id, payload);
        if (!response.listId) {
          throw new Error('Oops! There was an error while adding to the list, please try again');
        }
        history.push(`/list/${response.listId}`);
        window.location.reload();
      }
    } catch (ex) {
      showError(ex.message);
    }
  };

  const openCreateList = () => {
    toggleCreateListDrawerVisibility(true);
  };

  return (
    <RightHandSideDrawer
      visible={visible}
      onClose={onCancel}
      content={
        <AddToListForm
          listObj={listObj}
          setSelectedList={setSelectedList}
          openCreateList={openCreateList}
          pageStart={pageStart}
          setPageStart={setPageStart}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          getTheList={getTheList}
          loading={loading}
        />
      }
      title={
        <DrawerTitle
          title="ADD TO LIST"
          actions={[
            { title: 'Cancel', type: 'default', size: 'large', onClick: onCancel },
            {
              title: 'Add',
              type: 'primary',
              size: 'large',
              onClick: onAdd,
            },
          ]}
        />
      }
    />
  );
};

AddToListDrawer.defaultProps = {
  isFetchListItems: false,
  setReloadListItems: null,
  isBulkSelected: false,
  currentFilterSet: null,
};

AddToListDrawer.propTypes = {
  getLists: PropTypes.func.isRequired,
  addItemsToList: PropTypes.func.isRequired,
  addIntentBulkItemsToList: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  checkedItems: PropTypes.array.isRequired,
  toggleCreateListDrawerVisibility: PropTypes.func.isRequired,
  isFetchListItems: PropTypes.bool,
  setReloadListItems: PropTypes.func,
  isBulkSelected: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  currentFilterSet: PropTypes.object,
  currentTotalDataCount: PropTypes.number.isRequired,
};

export default AddToListDrawer;
