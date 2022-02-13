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

export { createFolderMutation };
