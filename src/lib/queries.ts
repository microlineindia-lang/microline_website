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


export const BRANDS_QUERY = gql`
  query AllBrands {
    allBrands(orderBy: order_ASC) {
      id
      name
      slug
      shortDescription
      order
      logo {
        url
        alt
        title
      }
      logoDark {         # For dark mode
        url
        alt
        title
      }
    }
  }
`;

export const BRAND_DETAIL_QUERY = gql`
  query BrandDetail($slug: String!) {
    brand(filter: { slug: { eq: $slug } }) {
      id
      name
      slug
      shortDescription
      description
      brandResource
      order
      logo {
        url
        alt
        title
      }
      logoDark {
        url
        alt
        title
      }
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
      products {
        productId
        productName
        shortDescription
        productOverview
        officialUrl
        resource
        productImages {
          responsiveImage(imgixParams: { fit: crop, auto: format }) {
            src
            srcSet
            alt
            width
            height
          }
        }
      }
    }
  }
`;