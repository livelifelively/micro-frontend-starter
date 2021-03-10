/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */

/**
 * ADAPTER
 * @param {Object} list
 */
export function _adapter_listsGetAPI_listsObject(list, type) {
  return {
    count: list.count,
    rows: list.rows,
    type,
  };
}

/**
 * ADAPTER - Add Bulk Items To List API
 * @param {Object} preferences User Preferences
 * @param {Array} subCategories Subcategories
 * @param {Number} timeFrom Unix Timestamp
 */
export function _adapter_addIntentBulkItemsToList(preferences, subCategories = [], timeFrom = null, type) {
  return {
    ...preferences,
    subCategories: subCategories.reduce((agg, v) => {
      if (v.label && v.label.toLowerCase() !== 'all') {
        agg.push(v.label);
      }
      return agg;
    }, []),
    locations: preferences.locations,
    sizes: preferences.sizes,
    sectors: preferences.sectors,
    createdAt: timeFrom,
    keywords: type === 'filter' && preferences.keywords && preferences.keywords.map((v) => v.original),
    techAdds: type === 'filter' && preferences.techAdds && preferences.techAdds.map((v) => v.original),
    techDrops: type === 'filter' && preferences.techDrops && preferences.techDrops.map((v) => v.original),
    technologies: type === 'filter' && preferences.technologies && preferences.technologies.map((v) => v.original),
    filterType: type,
  };
}
