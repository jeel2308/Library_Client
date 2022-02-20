import { gql } from '@apollo/client';

const addFolderMutation = gql`
  mutation addFolder($input: AddFolderInput!) {
    folderManagement {
      addFolder(input: $input) {
        id
        name
      }
    }
  }
`;

const updateFolderMutation = gql`
  mutation updateFolder($input: UpdateFolderInput!) {
    folderManagement {
      updateFolder(input: $input) {
        id
        name
      }
    }
  }
`;

const deleteFolderMutation = gql`
  mutation deleteFolder($input: DeleteFolderInput!) {
    folderManagement {
      deleteFolder(input: $input) {
        id
      }
    }
  }
`;

const addLinkMutation = gql`
  mutation addLink($input: AddLinkInput!) {
    linkManagement {
      addLink(input: $input) {
        id
        url
        isCompleted
      }
    }
  }
`;

export {
  addFolderMutation,
  updateFolderMutation,
  deleteFolderMutation,
  addLinkMutation,
};
