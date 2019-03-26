export default {
  nickname: '',
  itemlist: [],

  appInstallsLists: '',
  appSpendDatasLists: '',
  todayInstallsNum: '',
  todaySpend: '',
  reportAppDataList: [],
  allReportAppDataList: [],
  videoerrmsg: [],
  videoresult: [],

  ifapp: false, // 是否选择了单个app
  customevent: [], // 自定义事件列表
  customunit: '', // 自定义事件收益单位
  appdata: [],
  appcpitotal: {}, // appcpi合计
  appcount: 0,
  ifaccount: false,
  appdataall: [], // 带个APP数据用于导出全部
  appdataid: '',
  appdataappid: '',
  appdatastartdate: '',
  appdataenddate: '',
  appdatatotal: 0,
  appdataindex: 1,
  appdatapagesize: 20,
  appdatacountry: '', // 国家筛选
  appdataimporession: '', // 平台筛选
  appdatasort: '', // 筛选
  paycountlist: [],
  paycount: 0, //待充值数量
  countryfilter: [],
  //account
  getbmover: false, // 是否已请求完成
  bmlist: [],
  addbmlist: [], // bm列表
  bm_pageIndex: 1,
  bm_pageSize: 20,
  disbmid: '', // 当前bmid
  disaccount: [],  // 当前广告账户列表
  accounttotal: 0,
  disaddaccount: [], // 当前添加广告账户列表
  addata: {},  // 所有bm广告账户列表
  adaccount: {},  // 所有bm添加广告账户列表
  accountkwd: '',  // 广告账户搜索关键字

  dispage: [], // 当前主页管理列表
  pagetotal: 0,
  bmpg_pageIndex: 1,
  bmpg_pageSize: 20,
  disaddpage: [], //当前添加主页管理列表
  pagedata: {},  // 所有bm主页管理列表
  pageaccount: {},  // 所有bm添加主页管理列表
  pagekwd: '', // 主页管理搜索关键字
  // app
  applist: [], //app应用列表
  appkwd: '', // app搜索关键字
  addapplist: [], // app新增列表
  setapplist: [], // app设置列表已加入
  cansetapplist: [],  // app设置列表未加入
  setappstatus: '', // app设置启用未启用筛选
  // manage
  manageapplist: [],  // 项目添加应用列表
  managelist: [], // 项目未归档列表
  pagesize: 20,  // managelist 单页数量
  total: 0, // managelist 总条数
  projectkwd: '', //项目搜索关键字
  // project rules
  rulelist: [], // 规则管理列表
  ruleapp: [],  // 优化记录规则列表
  optotal: 0, // 优化记录总数
  oppagesize: 20, // 优化记录单页条数
  optimizelist: [], // 优化记录列表
  optimizeaccount: [], //优化记录广告账户
  // create
  createlist: [], // 创意列表
  createchecked: [], // 创意列表多选情况
  createcheckstatus: false, // 是否已全选
  allcheckidstatus: [],  // 多选情况已选id, status列表
  classify: [], // 创意分类列表
  countries: [], // 国家列表
  crtotal: 0,
  crpagesize: 20,
  creativityName: '',
  cr_classify: '',  // 创意列表参数
  cr_countryId: '',
  cr_sex: '',
  cr_status: '',
  cr_pageIndex: 1,
  cr_pageSize: 21,
  cr_projectId: '',
  allpagelist: [], // 新增创意主页列表
  allactions: [], // 新增创意行动号召列表
  synctime: 0,// 批量同步创意所需时间
  addcreate: true,  // 新增单个创意，资源是否正在上传 true 否 false 是
  withcreate: true,
  cardcreate: true,
  wantupload: 0, // 将要上传的文件数量
  // sync
  synclist: [], // 同步记录列表
  synctotal: 0,
  sync_status: '', // 同步记录参数
  sync_keyWords: '',
  sync_fbAccountId: '',
  sync_pageSize: 20,
  sync_pageIndex: 1,
  sync_projectId: '',
  // gener
  othercountries: [], // 另外一个国家列表
  language: [], // 语言列表
  interests: [], // 兴趣列表
  platform: [], // 平台列表
  system: [], // 系统列表
  selectcreate: [], //已选创意列表
  createstatus: '', // 创意列表状态筛选条件
  createclassify: '', // 创意列表分类筛选条件
  createkeyword: '', //创意列表关键字筛选条件
  pl_project_id: '',  // 推广计划列表
  bidguide: [], // 出价指南
  // pl_create_type: '',
  pl_country: '',
  pl_platform: '',
  pl_keyword: '',
  pl_pageIndex: 1,
  pl_pageSize: 20,
  planlist: [], // 推广计划列表
  pltotal: 0,
  plpagesize: 20,
  plancountry: [], // 推广计划列表国家列表
  inusecreate: [], //已选创意列表
  nousecreate: [], //未选创意列表
  inusetotal: 0, // 已选创意总数
  nousetotal: 0, // 未选创意总数
  plcreatestatus: '', // 创意列表筛选条件
  plcreateclassify: '',
  plcreatekeyword: '',
  inuseaccount: [], // 已选广告账户列表
  nouseaccount: [], // 未选广告账户列表
  accountstatus: '', // 广告账户列表筛选status
  accountkeyword: '',  // 广告账户列表筛选 keyword
  loglist: [], // 广告创建记录
  logdetail: [], //广告创建记录详情
  logdetailid: '', // 广告详情id
  logdetailname: '', //广告详情name
  logcreatecreative: 0, // 创建广告创意数量
  logcreateaccount: 0, // 创建广告广告账户数
  logcreateset: 0, // 创建广告广告组数
  logcreatecampaign: 0, // 创建广告广告系列数
  createinfo: {}, // 推广计划详情
  disinfo: [], // 当前信息
  createplatform: [],
  genertarget: [], // 创建推广计划受众列表
  generaccount: [], // 创建推广计划广告账户列表
  ifadcreate: false, // 创建广告是否成功，影响是否显示创建详情
  classifyforplan: [], // 智能选择分类列表
  classifyfiltercount: 0, // 智能选择符合分类创意数量
  // ad
  adplanlist: [],
  nowtime: '', // 服务器时间
  updatetime: '', // 更新时间
  datestatus: '', // 更新时间状态
  adstarttime: '',
  adendtime: '',
  adaccountid: [],
  adplanid: '',
  careData: [],
  searchList: [
    {
      name: '按时间', key: 'dateOptions', list:
        [
          { cname: '无', key: '', checked: false },
          { cname: '日', key: 'insight_date', checked: false },
          { cname: '周', key: 'weak', checked: false },
          { cname: '2周', key: 'twoweaks', checked: false },
          { cname: '月', key: 'month', checked: false }
        ]
    },
    {
      name: '按投放', key: 'partOptions', list:
        [
          { cname: '无', key: '', checked: false },
          { cname: '年龄', key: 'age', checked: false },
          { cname: '性别', key: 'gender', checked: false },
          { cname: '年龄和性别', key: 'gender,age', checked: false },
          { cname: '国家', key: 'country', checked: false },
          { cname: '设备', key: 'impression_device', checked: false },
          { cname: '版位和设备', key: 'publisher_platform,impression_device', checked: false }
        ]
    },
    {
      name: '按动态创意', key: 'partOptions', list:
        [
          { cname: '无', key: '', checked: false },
          { cname: '图片/视频', key: 'agCreativity', checked: false },
          { cname: '文本', key: 'bagCreativity', checked: false },
          { cname: '标题', key: 'tagCreativity', checked: false },
          { cname: '行动号召', key: 'cagCreativity', checked: false }
        ]
    },
    {
      name: '按轮播卡片', key: 'partOptions', importkey: 'material_id', list:[]
    }
  ],
  adapplicationid: '', // appid 保存广告管理自定义列
  adlisttimeout: false, // 广告管理列表超时情况处理
  adcount: 0,
  adsetcount: 0,
  campaigncount: 0,
  editcampaignlist: [], // 编辑广告系列，初始化数据列表
  createcampaignlist: [], // 广告系列列表，创建广告组用
  editadsetlist: [], // 编辑广告组，初始化数据列表
  createadsetlist: [], // 广告组列表，创建广告组用
  adcreatelist: [], // 创意列表，创建广告用
  adcreatetotal: 0,
  editadlist: [], // 编辑广告，初始化数据列表
  adapplist: [], // app列表，创建编辑广告组用
  createallpagelist: [], // 主页列表，编辑广告组用
  exportstatus: true, // 广告管理导出状态，false则导出按钮无法点击
  isdynamic: false, // 是否动态创意，编辑广告用
  adwantupload: 0, // 将要上传的文件数量，创建广告用
  adsetlistload: false, // 广告组远程搜索load，创建广告用
  /**
   * 广告管理页面投放状态默认条件
   * @父级 已归档/已删除 @子级 已归档/已删除
   * @父级 没选/已暂停/投放中 @子级 已暂停+投放中
   * @父级 已暂停/投放中+已归档/已删除 @子级 已暂停+投放中+已归档/已删除
   */
  sortdefault: 'ACTIVE,PAUSED',
  adcreateadd: true,  // 新增单个创意，资源是否正在上传 true 否 false 是，创建广告用
  calendardate: [], // 导入af数据日历
  hascreatead: false, // 动态创意广告组是否包含广告，创建广告用
  withcreatead: true, // 新增动态创意，资源是否正在上传 true 否 false 是，创建广告用
  imgspwant: 0, // 非素材库将要上传的文件数量，创建广告用
  viospwant: 0, // 非素材库将要上传的文件数量，创建广告用
  edittype: 0, // 编辑广告组初始类型

  adlist: [], // 广告管理列表
  adlisttotal: {}, // 广告管理列表数据合计
  adpagesize: 20, // 广告管理页面一页数量
  adcampaignlist: '[]', //广告管理 广告系列列表
  adcampaigntotal: 0,
  adsetlist: '[]', //广告管理 广告组列表
  adsettotal: 0,
  adadlist: '[]', //广告管理 广告列表
  adadtotal: 0,
  campainsortlist: [], // 广告管理 已选的广告系列列表
  setsortlist: [], // 广告管理 已选广告组列表
  adsortlist: [], // 广告管理 已选广告列表
  copycampaignlist: [], // 广告系列列表，复制用
  copyadsetlist: [], // 广告组列表，复制用
  copyjoblistdetail: [], //当前进行的job列表详细，复制用
  jobtotal: 0, // job总数
  jobcomplete: 0,  // job已完成，包括成功和失败
  jobfaildetail: false, // job任务失败详情弹窗状态
  taskname: '', // task名称
  taskfail: 0, // task失败数量
  tasksuccess: 0, // task成功数量
  tasknamedetail: '', // task名称 详情弹框用
  taskfaildetail: 0, // task失败数量 详情弹框用
  tasksuccessdetail: 0, // task成功数量 详情弹框用
  taskresult: [], // job 失败详情
  taskerror: '', // job失败详情无数据
  adtab: 'campaignName',

  adalllist: [], //广告管理列表所有数据，用于导出全部
  adaccountlist: [], //广告账户列表
  campain_option: '',
  set_option: '',
  ad_option: '',
  customunit: '',
  customeventcampain: [],
  customeventset: [],
  customeventad: [],
  adcustomevent: [],
  conditionlist: [], // 已保存筛选条件列表
  // data
  adcampaign: [], //广告系列
  adaccount: [], // 广告账户
  adcreate: [], //广告创意
  datacountry: [], //国家
  dataage: [], //年龄
  dataplatform: [], //设备
  dataimpression: [], // 版位
  datalist: [], // 账户报表列表
  datatotal: 0,
  datasum: {},
  datasort: '', // 排序
  adformlist: [],
  adformtotal: 0,
  createformlist: [],
  createformtotal: 0,
  createformsum: {},
  createcardlist: [],
  createcardtotal: 0,
  daycpilist: [],
  daycpitotal: 0,
  cpicountry: [],
  cpiimpression: [],
  imagematterlist: [], // 图片列表
  imagemattersum: {}, // 图片总数
  imagemattertotal: 0,
  videomatterlist: [], // 视频列表
  videomattersum: {}, // 视频总数
  videomattertotal: 0,
  // target
  tg_project_id: '',
  tg_projectId: '',
  tg_pageSize: 20,
  tg_pageIndex: 1,
  tg_keyword: '',
  tg_type: '',
  tg_adaccounts: '',
  targetadlist: [], // 创建类似受众用的广告系列列表
  targetadsetlist: [], // 创建类似受众用的广告组列表
  targetadsetarray: {}, // 创建类似受众用的广告组列表集合
  targetlist: [],
  targettype: [],
  targettotal: 0,
  targetdetail: [],
  appaccount: [], // 应用的所有用户
  targetinfo: null, //编辑时受众信息
  liketargetinfo: null, //编辑类似受众信息
  specialtargetinfo: null, // 特殊受众
  // addtargetaccount: [], // 编辑时账户
  // addliketargetaccount: [],
  targetaccount: [], //类似受众根据自定义受众对应广告账户
  // campainother: [], // 类似受众广告系列特殊字段
  resultid: '',
  targetadddetail: [], //创建编辑结果
  liketarget: [], //类似受众自定义受众列表
  targetcampaigns: [], //类似受众广告系列
  ifmorecampaigns: true, // 下拉加载开关，防止多次触发
  targetapplist: [],
  ifsame: false, // 创建了相同的类似受众为true
  targetplanlist: [], //根据广告创建类似受众推广计划列表
  treegradelist: [], //campaign列表
  treegradefilter: '', // campaign过滤关键字
  treegradeall: {}, // 所有campaign
  targetlog: [], // 推广计划二级菜单，创建记录
  // targetlogdel: [], 
  filterarr: [], // 推广计划二级菜单，已打开过的推广计划
  targetcampaignaccount: [], // 广告系列对应广告账户
  deleteusing: [], // 将要删除的受众共享情况
  deletesharing: [], // 将要删除的受众使用情况
  // regular
  rg_ruleStatus: '',
  rg_keyword: '',
  rg_pageNo: 1,
  rg_pageSize: 20,
  newrulelist: [], // 规则管理列表
  newruletotal: 0, // 规则管理列表总数
  ruleoption: {
    fbAccountIds: '',
    pageIndex: 1,
    pageSize: 20,
    level: '',
    projectId: ''
  },
  regularlist: [], //规则列表
  regulartotal: 0, // 规则列表总数
  allrules: [], //规则报表种的规则列表
  ruleform: [], // 规则报表表格数据
  // message
  messagelist: [], // 消息列表
  messagetotal: 0, // 消息总数
  msgpageindex: 1,
  msgpagesize: 20,
  messagecount: 0, // 头部消息条数
}