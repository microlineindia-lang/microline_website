// src/lib/queries.ts
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

// Query for the Products page – clean and independent
export const PRODUCTS_QUERY = gql`
  query AllProducts {
    allProducts(orderBy: name_ASC) {
      id
      name
      slug
      productId
      model
      shortDescription
      description
      image {
        url
        alt
        title
      }
      gallery {
        url
      }
      brochure {
        url
      }
      category {
        name
        slug
      }
      sections {
        __typename
        ... on ProductListSectionRecord {
          id
          sectionTitle
          items
        }
        ... on SpecificationSectionRecord {
          id
          sectionTitle
          specifications {
            id
            label
            value
          }
        }
      }
    }
  }
`;