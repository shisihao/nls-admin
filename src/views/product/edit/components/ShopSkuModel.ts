interface specsProperties {
  s_name: string;
  p_name: string;
}

interface skuItem {
  image: string;
  cny_price: number|string
  stock: number,
  specs_properties: specsProperties[];
}

export default class GoodsSku {
  // 规格图
  image = ''
  // 人民币价格
  cny_price = 0
  // 库存
  stock = 0
  // sku规格属性
  specs_properties = []

  constructor(options:skuItem = {}) {
    [
      'image',
      'cny_price',
      'stock',
      'specs_properties'
    ].forEach((key:string) => {
      this[key] = options[key] || this[key]
    })
  }
}
