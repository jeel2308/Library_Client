import { gql } from '@apollo/client';
import { linkFragments } from './Fragments';

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

const updateLinksMetadataMutation = gql`
  mutation updateLinksMetadata($input: [UpdateLinkMetadataInput!]!) {
    linkManagement {
      updateLinksMetadata(input: $input) {
        id
        title
        description
        url
      }
    }
  }
`;

export {
  addFolderMutation,
  updateFolderMutation,
  deleteFolderMutation,
  addLinkMutation,
  updateLinkMutation,
  deleteLinkMutation,
  updateLinksMetadataMutation,
};
