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
  {
    label: 'Copy url',
    value: 'COPY',
  },
];

export const FETCH_MORE_LINKS_OPERATION = 'FETCH_MORE_LINKS_OPERATION';

export const DELETE_LINK_OPERATION = 'DELETE_LINK_OPERATION';

export const getLinkActions = (data) => {
  return _filter(LINK_ACTIONS, (link) => {
    const { getVisibilityStatus } = link;
    return getVisibilityStatus?.(data) ?? true;
  });
};
