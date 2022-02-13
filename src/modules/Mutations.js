import { gql } from '@apollo/client';

const createFolderMutation = gql`
  mutation createFolder($input: AddFolderInput!) {
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

export { createFolderMutation, updateFolderMutation };
