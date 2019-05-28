export default {
  // 规则管理全部指标
  indicator: [
    { label: "已花费", value: "spent|true" }, // key | 是否支持实时排期
    { label: "总花费", value: "lifetime_spent|false" },
    { label: "频次", value: "frequency|true" },
    { label: "成效", value: "result|true" },
    { label: "单次成效费用", value: "cost_per|true" },
    {
      label: "移动应用安装",
      value: "mobile_app_install|true"
    },
    {
      label: "单次移动应用安装费用",
      value: "cost_per_mobile_app_install|true"
    },
    {
      label: "广告花费回报（ROAS）-移动应用购物",
      value: "mobile_app_purchase_roas|false"
    },
    {
      label: "广告花费回报（ROAS）-网站购物",
      value: "website_purchase_roas|false"
    },
    {
      label: "单日花费比率",
      value: "daily_ratio_spent|true"
    },
    {
      label: "总花费比率",
      value: "lifetime_ratio_spent|true"
    },
    {
      label: "受众覆盖%",
      value: "audience_reached_percentage|true"
    },
    {
      label: "广告系列名称",
      value: "campaign.name|true"
    },
    { label: "广告组名称", value: "adset.name|true" },
    { label: "版位", value: "adset.placement.page_types|false" },
    { label: "总预算", value: "lifetime_budget|true" },
    { label: "单日预算", value: "daily_budget|true" },
    { label: "竞价金额", value: "bid_amount|true" },
    { label: "付费事件", value: "billing_event|true" },
    { label: "优化目标", value: "optimization_goal|true" },
    {
      label: "创建时间（小时）",
      value: "hours_since_creation|false"
    },
    {
      label: "投放时间（秒）",
      value: "active_time|false"
    },
    { label: "当前时间", value: "current_time|false" },
    { label: "创建时间", value: "created_time|true" },
    {
      label: "上次编辑时间",
      value: "updated_time|true"
    },
    { label: "开始时间", value: "start_time|true" },
    {
      label: "所有移动应用事件",
      value: "app_custom_event|true"
    },
    {
      label: "移动应用解锁成就",
      value: "app_custom_event.fb_mobile_achievement_unlocked|true"
    },
    {
      label: "移动应用会话",
      value: "app_custom_event.fb_mobile_activate_app|true"
    },
    {
      label: "移动应用添加支付信息",
      value: "app_custom_event.fb_mobile_add_payment_info|true"
    },
    {
      label: "移动应用加入购物车",
      value: "app_custom_event.fb_mobile_add_to_cart|true"
    },
    {
      label: "移动应用加入心愿单",
      value: "app_custom_event.fb_mobile_add_to_wishlist|true"
    },
    {
      label: "移动应用完成注册",
      value: "app_custom_event.fb_mobile_complete_registration|true"
    },
    {
      label: "移动应用内容查看",
      value: "app_custom_event.fb_mobile_content_view|true"
    },
    {
      label: "移动应用发起结账",
      value: "app_custom_event.fb_mobile_initiated_checkout|true"
    },
    {
      label: "移动应用关卡完成",
      value: "app_custom_event.fb_mobile_level_achieved|true"
    },
    {
      label: "移动应用购物",
      value: "app_custom_event.fb_mobile_purchase|true"
    },
    {
      label: "移动应用提交评分",
      value: "app_custom_event.fb_mobile_rate|true"
    },
    {
      label: "移动应用搜索",
      value: "app_custom_event.fb_mobile_search|true"
    },
    {
      label: "移动应用点数花费",
      value: "app_custom_event.fb_mobile_spent_credits|true"
    },
    {
      label: "移动应用完成教程",
      value: "app_custom_event.fb_mobile_tutorial_completion|true"
    },
    {
      label: "移动应用其他操作",
      value: "app_custom_event.other|true"
    },
    {
      label: "单次移动应用成就解锁费用",
      value: "cost_per_mobile_achievement_unlocked|true"
    },
    {
      label: "单次移动应用会话费用",
      value: "cost_per_mobile_activate_app|true"
    },
    {
      label: "单次移动应用添加支付信息费用",
      value: "cost_per_mobile_add_payment_info|true"
    },
    {
      label: "单次移动应用加入购物车费用",
      value: "cost_per_mobile_add_to_cart|true"
    },
    {
      label: "单次移动应用加入心愿单费用",
      value: "cost_per_mobile_add_to_wishlist|true"
    },
    {
      label: "单次移动应用完成注册费用",
      value: "cost_per_mobile_complete_registration|true"
    },
    {
      label: "单次移动应用内容查看费用",
      value: "cost_per_mobile_content_view|true"
    },
    {
      label: "单次移动应用发起结账费用",
      value: "cost_per_mobile_initiated_checkout|true"
    },
    {
      label: "单次移动应用关卡完成费用",
      value: "cost_per_mobile_level_achieved|true"
    },
    {
      label: "单次移动应用购物费用",
      value: "cost_per_mobile_purchase|true"
    },
    {
      label: "单次移动应用提交评分费用",
      value: "cost_per_mobile_rate|true"
    },
    {
      label: "单次移动应用搜索费用",
      value: "cost_per_mobile_search|true"
    },
    {
      label: "单次移动应用点数花费的广告费用",
      value: "cost_per_mobile_spent_credits|true"
    },
    {
      label: "单次移动应用完成教程学习费用",
      value: "cost_per_mobile_tutorial_completion|true"
    },
    {
      label: "其他点击费用（链接）",
      value: "cost_per_link_click|true"
    },
    { label: "链接点击量", value: "link_clicks|true" },
    { label: "千次发展费用", value: "cpm|true" },
    {
      label: "点击率（链接）",
      value: "link_ctr|true"
    },
    {
      label: "总展示量",
      value: "lifetime_impressions|false"
    },
    { label: "展示次数", value: "impressions|true" },
    { label: "覆盖人数", value: "reach|true" },
    { label: "潜在客户", value: "leadgen|true" },
    { label: "操作", value: "actions|true" },
    { label: "点击量", value: "clicks|true" },
    { label: "CPA", value: "cpa|true" },
    { label: "CPC", value: "cpc|true" },
    { label: "点击率", value: "ctr|true" },
    { label: "成效率", value: "result_rate|true" },
    {
      label: "单次独立点击费用",
      value: "cost_per_unique_click|true"
    },
    {
      label: "独立用户点击量",
      value: "unique_clicks|true"
    },
    { label: "今日花费", value: "today_spent|false" },
    { label: "昨日花费", value: "yesterday_spent|false" },
    { label: "帖文互动", value: "post_engagement|true" },
    {
      label: "单次帖文互动",
      value: "cost_per_post_engagement|false"
    },
    {
      label: "观看视频达3秒的次数",
      value: "video_view|true"
    },
    {
      label: "单次视频观看费用",
      value: "cost_per_video_view|false"
    },
    { label: "主页赞", value: "like|true" },
    { label: "站外互动", value: "offsite_engagement|true" },
    { label: "帖子", value: "post|true" },
    { label: "帖子评论", value: "post_comment|true" },
    { label: "帖子获赞", value: "post_like|true" },
    { label: "帖子心情", value: "post_reaction|true" },
    { label: "内容查看", value: "view_content|true" },
    { label: "点击播放视频", value: "video_play|true" },
    { label: "提问回答", value: "vote|true" },
    {
      label: "新增消息联系人数量",
      value: "onsite_conversion.messaging_first_reply|true"
    },
    {
      label: "单次新增消息联系人费用",
      value: "cost_per_messaging_first_reply|true"
    },
    {
      label: "消息回复次数",
      value: "onsite_conversion.messaging_reply|true"
    },
    {
      label: "单次消息回复费用",
      value: "cost_per_messaging_reply|true"
    },
    {
      label: "预估预算花费%",
      value: "estimated_budget_spending_percentage|true"
    }
  ],
  // 创建广告组，选择应用事件
  appeventlist: [
    { name: '评分', key: 'RATE' },
    { name: '完成教学关卡', key: 'TUTORIAL_COMPLETION' },
    { name: '联系', key: 'CONTACT' },
    { name: '订制产品', key: 'CUSTOMIZE_PRODUCT' },
    { name: '捐赠', key: 'DONATE' },
    { name: '寻找位置', key: 'FIND_LOCATION' },
    { name: 'schedule', key: 'SCHEDULE' },
    { name: '开始试用', key: 'START_TRIAL' },
    { name: '递交申请', key: 'SUBMIT_APPLICATION' },
    { name: '订阅', key: 'SUBSCRIBE' },
    { name: '加入购物车', key: 'ADD_TO_CART' },
    { name: '加入心愿单', key: 'ADD_TO_WISHLIST' },
    { name: '发起结账', key: 'INITIATED_CHECKOUT' },
    { name: '添加支付信息', key: 'ADD_PAYMENT_INFO' },
    { name: '购物', key: 'PURCHASE' },
    { name: '引导', key: 'LEAD' },
    { name: '完成注册', key: 'COMPLETE_REGISTRATION' },
    { name: '查看内容', key: 'CONTENT_VIEW' },
    { name: '搜索', key: 'SEARCH' },
    { name: '服务预订', key: 'SERVICE_BOOKING_REQUEST' },
    { name: '7日内发起对话', key: 'MESSAGING_CONVERSATION_STARTED_7D' },
    { name: '完成关卡/升级', key: 'LEVEL_ACHIEVED' },
    { name: '解锁成就', key: 'ACHIEVEMENT_UNLOCKED' },
    { name: '花费点数', key: 'SPENT_CREDITS' },
    { name: '其它', key: 'OTHER' }
  ],
  // 创建广告组，优化目标
  adoptimizelist: [
    { name: '应用安装量', key: 'APP_INSTALLS' },
    { name: '留存率', key: 'DERIVED_EVENTS' },
    { name: '应用事件', key: 'DERIVED_EVENTS' }
  ],
  // 创建广告组，留存率
  remainlist: [
    { name: 'Day 2', key: '2' },
    { name: 'Day 7', key: '7' }
  ],
  // 创建广告组，投放时段
  putweek: [
    {
      name: "周一",
      key: 1
    },
    {
      name: "周二",
      key: 2
    },
    {
      name: "周三",
      key: 3
    },
    {
      name: "周四",
      key: 4
    },
    {
      name: "周五",
      key: 5
    },
    {
      name: "周六",
      key: 6
    },
    {
      name: "周七",
      key: 7
    }
  ],
  // 创建广告组，归因窗口
  allbecauselist: [
    { name: '点击后的1天', key: '1' },
    { name: '点击或浏览后的1天', key: '2' },
    { name: '点击后的7天', key: '3' },
  ],
  // 创建广告组广告组竞价策略
  bidmethodlist: [
    { name: '设有竞价上限的最低费用', key: 'LOWEST_COST_WITH_BID_CAP' },
    { name: '最低费用', key: 'LOWEST_COST_WITHOUT_CAP' },
    { name: '目标费用', key: 'TARGET_COST' }
  ],
  // 广告管理自定义列左侧目录
  adleftOption: [
    {
      title: "常用",
      key: "cy",
      child: [
        {
          name: "常用",
          key: "cy"
        }
      ]
    },
    {
      title: "设置",
      key: "sz",
      child: [
        { name: "Atom", key: "atom" },
        { name: "对象名称和编号", key: "dxmchbh" },
        { name: "目标、预算与排期", key: "mbysypq" },
        { name: "目标受众定位", key: "mbszdw" },
        { name: "广告创意", key: "ggcy" }
      ]
    },
    {
      title: "监测平台",
      key: "jcpt",
      child: [
        { name: "表现", key: "bx" },
        { name: "留存", key: "lc" },
        { name: "应用内事件", key: "yynsj" }
      ]
    }
  ]
}