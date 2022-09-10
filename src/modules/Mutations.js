import { gql } from '@apollo/client';
import { linkFragments, userFragments } from './Fragments';

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
        ...linkDetailsItem
      }
    }
  }
  ${linkFragments.linkDetails}
`;

const updateLinkMutation = gql`
  mutation updateLink($input: [UpdateLinkInput!]!) {
    linkManagement {
      updateLink(input: $input) {
        id
        url
        isCompleted
      }
    }
  }
`;

const deleteLinkMutation = gql`
  mutation deleteLink($input: [DeleteLinkInput!]!) {
    linkManagement {
      deleteLink(input: $input) {
        id
      }
    }
  }
`;

const updateUserMutation = gql`
  mutation updateUser($input: UpdateUserInput!) {
    userManagement {
      updateUser(input: $input) {
        ...userBasicDetailsItem
      }
    }
  }
  ${userFragments.userBasicDetails}
`;

export {
  addFolderMutation,
  updateFolderMutation,
  deleteFolderMutation,
  addLinkMutation,
  updateLinkMutation,
  deleteLinkMutation,
  updateUserMutation,
};
