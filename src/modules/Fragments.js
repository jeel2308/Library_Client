import { gql } from '@apollo/client';

export const linkFragments = {
  linkDetails: gql`
    fragment linkDetailsItem on Link {
      id
      url
      isCompleted
    }
  `,
};

export const folderFragments = {
  folderBasicDetails: gql`
    fragment folderBasicDetailsItem on Folder {
      id
      name
    }
  `,
  folderDetails: gql`'
    fragment folderDetailsItem on Folder {
      id
      name
      links{
        ...linkDetailsItem
      }
    }
    ${linkFragments.linkDetails}
  `,
};
