import { gql } from '@apollo/client';

export const folderFragments = {
  folderBasicDetails: gql`
    fragment folderBasicDetailsItem on Folder {
      id
      name
    }
  `,
};
