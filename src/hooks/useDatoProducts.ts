import { useEffect, useState } from 'react';
import { datoClient } from '../lib/datocms';
import { PRODUCTS_QUERY } from '../lib/queries';

export interface CMSProduct {
  id: string;
  name: string;
  slug: string;
  productId?: string;
  model?: string;
  shortDescription: string;
  description: string;
  image: { url: string; alt?: string; title?: string };
  gallery: { url: string }[];
  brochure?: { url: string } | null;
  category: { name: string; slug: string };
  sections: (
    | {
        __typename: 'ProductListSectionRecord';
        id: string;
        sectionTitle: string;
        items: string[];
      }
    | {
        __typename: 'SpecificationSectionRecord';
        id: string;
        sectionTitle: string;
        specifications: { id: string; label: string; value: string }[];
      }
  )[];
}

let cachedProducts: CMSProduct[] | null = null;

export function useDatoProducts() {
  const [products, setProducts] = useState<CMSProduct[]>(cachedProducts || []);
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedProducts) {
      setLoading(false);
      return;
    }
    datoClient
      .request<{ allProducts: CMSProduct[] }>(PRODUCTS_QUERY)
      .then((data) => {
        cachedProducts = data.allProducts;
        setProducts(data.allProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}