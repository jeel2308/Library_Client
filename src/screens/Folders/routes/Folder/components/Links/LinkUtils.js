import _filter from 'lodash/filter';

export const LINK_ACTIONS = [
  { label: 'Edit', value: 'EDIT' },
  { label: 'Delete', value: 'DELETE' },
  {
    label: 'Mark as complete',
    value: 'MARK_AS_COMPLETE',
    getVisibilityStatus: ({ isCompleted }) => !isCompleted,
  },
  {
    label: 'Mark as pending',
    value: 'MARK_AS_PENDING',
    getVisibilityStatus: ({ isCompleted }) => isCompleted,
  },
  {
    label: 'Select',
    value: 'SELECT',
  },
  {
    label: 'Move',
    value: 'MOVE',
  },
];

export const getLinkActions = (data) => {
  return _filter(LINK_ACTIONS, (link) => {
    const { getVisibilityStatus } = link;
    return getVisibilityStatus?.(data) ?? true;
  });
};
