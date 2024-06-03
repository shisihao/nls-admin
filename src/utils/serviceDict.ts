// ? 系统全局字典
/**
 * @description：默认分页数据
 */
export const pages = {
  page: 1,
  limit: 20,
  total: 0,
  pageSizes: [20, 50, 100, 150, 200]
}

/**
 * @description：广告
 */
export const adsTypeOptions = [
  { label: '全部', value: "" },
  { label: '静态展示', value: 0, type: 'info' },
  { label: '外链广告', value: 1, type: 'primary' },
  { label: '内联广告', value: 2, type: 'warning' }
]

/**
 * @description：定义menu类型
 */
export const menuTypeOptions = [
  { label: "目录", value: 0, type: 'primary' },
  { label: "菜单", value: 1, type: 'warning' },
  { label: "按钮", value: 2, type: 'info' }
];

/**
 * @description：文件类型
 */
export const lessonTypeOptions = [
  { label: '全部', value: '' },
  { label: '视频', value: 0 },
  { label: '其他', value: 1 }
]

/**
 * @description：媒体类型
 */
export const classType = {
  videoType: ['mp4', 'mov'],
  documentType: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
  imageType: ['png', 'jpg', 'jpeg', 'gif'],
  androidType: ['apk'],
  iosType: ['ipa']
}

/**
 * @description：审核状态
 */
export const statusOptions = [
  { label: '全部', value: '' },
  { label: '待审核', value: 0, type: 'warning' },
  { label: '通过', value: 1, type: 'success' },
  { label: '驳回', value: 2, type: 'danger' }
]

/**
 * @description：认证状态
 */
export const companyStatusOptions = [
  { label: '全部', value: '' },
  { label: '待认证', value: 0, type: 'warning' },
  { label: '通过', value: 1, type: 'success' },
  { label: '失败', value: 2, type: 'danger' }
]

/**
 * @description：状态
 */
export const stateOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 0, type: 'success' },
  { label: '禁用', value: 1, type: 'danger' }
]

/**
 * @description：支付类型
 */
export const payTypeOptions = [
  { label: '全部', value: '' },
  { label: '微信', value: 'wxpay' },
  { label: '支付宝', value: 'alipay' },
  { label: '银行卡', value: 'bank' },
  { label: '抖音支付', value: 'dypay' }
]

/**
 * @description：收支状态
 */
export const actionOptions = [
  { label: '全部', value: '' },
  { label: '收入', value: 1 },
  { label: '支出', value: 2 }
];

/**
 * @description：资金类型
 */
export const fundType = [
  { label: '全部', value: '' },
  // { label: "积分", value: 'integral' },
  { label: "现金", value: 'cny' }
];

/**
 * @description：用户性别
 */
export const genderType = [
  { label: "男", value: 1 },
  { label: "女", value: 2 }
];

/**
 * @description：是非状态
 */
export const isStatusOptions = [
  { label: '全部', value: '', type: '' },
  { label: "否", value: 0, type: 'danger' },
  { label: "是", value: 1, type: 'success' }
];

/**
 * @description：上下架状态
 */
export const launchOptions = [
  { label: '全部', value: '' },
  { label: '上架', value: 0, type: 'success' },
  { label: '下架', value: 1, type: 'danger' }
]

/**
 * @description：用户类型
 */
export const userTypeOptions = [
  { label: '全部', value: '' },
  { label: '个人', value: 0, type: 'primary' },
  { label: '公司', value: 1, type: 'warning' }
]