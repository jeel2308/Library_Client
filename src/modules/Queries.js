/**--external-- */
import { gql } from '@apollo/client';

/**--relative-- */
import { folderFragments } from './Fragments';

export const getFolders = gql`
  query getFolders($id: ID!) {
    user(id: $id) {
      id
      folders {
        ...folderBasicDetailsItem
      }
    }
  }
  ${folderFragments.folderBasicDetails}
`;
