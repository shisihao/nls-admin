/* 商品 */
export interface productState {
  form: {
    id: number;
    gallery_id: number|string;
    is_much: number;
    delivery_id: number|string;
    name: string;
    desc: string;
    detail: string;
    cny_price: number;
    delivery_type: number;
    status: number;
    stock: number;
    limit_num: number;
    sales_num: number;
    sort: number;
    start_time: string;
    images: {name: string, url: string}[];
    specs_properties: specs_properties[]
    skus: skus[];
  }
}

interface specs_properties {
  name: string;
  properties: string[];
}

interface skus {
  id?: number;
  stock: number;
  sales_num: number;
  cny_price: number;
  image: string;
  properties: string[];
  specs_properties: skus_specs_properties[];
}

interface skus_specs_properties {
  p_id?: number;
  s_id?: number;
  p_name: string;
  s_name: string;
}