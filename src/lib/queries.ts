import { gql } from 'graphql-request';

export const RESOURCES_QUERY = gql`
{
  allCatalogueItems(orderBy: title_ASC) {
    id
    title
    description
    fileType
    fileSize

    catalogueFile {
      url
    }
  }

  allVideoResources(orderBy: title_ASC) {
    id
    title
    duration
    videoUrl

    thumbnail {
      url
    }
  }
}
`;