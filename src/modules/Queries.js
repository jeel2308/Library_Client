/**--external-- */
import { gql } from '@apollo/client';

/**--relative-- */
import { folderFragments } from './Fragments';

export const getUserFoldersQuery = gql`
  query getUserFolders($input: NodeInput!) {
    node(input: $input) {
      ... on User {
        id
        folders {
          ...folderBasicDetailsItem
        }
      }
    }
  }
  ${folderFragments.folderBasicDetails}
`;
