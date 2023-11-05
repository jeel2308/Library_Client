import _filter from 'lodash/filter';

export const LINK_ACTIONS = [
  { label: 'Edit', value: 'EDIT' },
  { label: 'Delete', value: 'DELETE' },
  {
    label: 'Select',
    value: 'SELECT',
  },
  {
    label: 'Move',
    value: 'MOVE',
    getVisibilityStatus: ({ showMoveAction }) => showMoveAction,
  },
  {
    label: 'Copy url',
    value: 'COPY',
  },
];

export const DELETE_LINK_OPERATION = 'DELETE_LINK_OPERATION';

export const getLinkActions = (data) => {
  return _filter(LINK_ACTIONS, (link) => {
    const { getVisibilityStatus } = link;
    return getVisibilityStatus?.(data) ?? true;
  });
};
