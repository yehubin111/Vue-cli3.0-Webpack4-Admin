import baseurl from "./baseurl";

export default {
    'itemlist': 'project/getMyProject',  // 获取项目列表
    'changepassword': 'user/changePassword?oldPassword={oldPassword}&password={password}&password2={password2}', // 修改密码
    'gettoken': 'facebook/getLongTimeToken',  // 获取长token
    'logout': 'user/logout',  // 退出
    'messagecount': 'user/UnreadMessageCount',  // 消息条数
    // 'messagecount': 'http://localhost:3000/gecors',
    'videourl': 'tool/transformUrl',  // 短视频链接转换
    // pandect
    'initurl': 'report/rptTotal',
    'appurl': 'report/rptAppcpi',
    'appcpitotal': 'report/sumAppcpi', // 合计
    'counturl': 'report/countRecharge', // 待充值广告
    'customevent': 'report/afEvents?', // 自定义事件列表
    // bm
    'bmlist': 'facebook/bms',  // bm列表
    'addbmlist': 'facebook/sync/bms',  // 添加bm列表
    'savebm': 'facebook/save/bms',  // 保存添加bm
    'bmaccountlist': 'facebook/adaccounts?bm_id={bmid}',  // 当前bmid 广告账户列表
    'addaccountlist': 'facebook/sync/adaccounts?bm_id={bmid}',  // 当前bmid 添加广告账户列表
    'saveaccount': 'facebook/save/adaccounts',  // 保存新增广告账户
    'switchstatus': 'facebook/updateAccountStatus', // 更改广告账户状态
    'pagelist': 'page/pageList?bm_id={bmid}',  // 当前bmid 主页管理列表
    'addpagelist': 'page/sync/pages?bm_id={bmid}',  // 当前bmid 添加主页管理列表
    'savepage': 'page/save/pages',  // 保存新增主页管理
    'pbia': 'facebook/pbia?page_id={pageid}',  // pbia
    // app
    'applist': 'facebook/applicationList',  // app列表
    'addapplist': 'facebook/sync/applications', // 新增app列表
    'saveapp': 'facebook/save/applications', // 保存app
    'setapp': 'facebook/application/adaccounts?application_id={applicationid}', //设置app
    'cansetapp': 'facebook/application/canSyncAdaccount?application_id={applicationid}',  // 设置app 未加入
    'saveset': 'facebook/application/saveAdaccounts', // 保存设置app
    'delset': 'facebook/application/delAdaccounts',  // 取消设置app
    'setaf': 'facebook/application/bangdingAf?', // 设置af
    // manage
    'managelist': 'project/getProjects?keywords={keywords}&status={status}&pageIndex={pageIndex}&pageSize={pageSize}', // 项目管理列表
    'addproject': 'project/addProject',  // 添加项目
    'editproject': 'project/updateProject',  // 编辑项目
    'projectover': 'project/projectIsOFF', //项目归档
    'projectbegin': 'project/projectIsON',  // 项目激活
    // project rules
    'getrules': 'optimize/{projectId}/ruleGroups',  // 规则管理列表
    'openrule': 'optimize/{projectId}/ruleGroups/add',  // 打开规则
    'closerule': 'optimize/{projectId}/ruleGroups/delete', //关闭规则
    'optimize': 'optimize/{projectId}/logs?', // 优化记录列表 ?fbAccountId={fbAccountId}&ruleGroupId={ruleGroupId}&status={status}&startTime={startTime}&endTime={endTime}&pageNo={pageNo}&pageSize={pageSize}
    'optimizeadaccount': 'optimize/getAdaccountLists?', // 优化记录广告账户
    // create
    'matchmd5': `${baseurl[process.env.VUE_APP_URLBASE].MD5_URL}/file/search`,
    'fileupload': `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`,
    'classify': 'creative/getClassifys?projectId={projectid}', // 分类列表
    'createlist': 'creative/getCreatives?', // 创意列表
    'countries': 'common/countries',  // 国家列表
    'createcountry': 'creative/getCountrys?', // 创意列表国家
    'updatesex': 'creative/updateSex', //修改性别
    'createopen': 'creative/creativeStatusisOn', // 批量开启
    'createclose': 'creative/creativeStatusisOff', // 批量关闭
    'syncall': 'creative/synCreatives?',  // 同步全部
    'syncgroup': 'creative/synCreateiveAccount', // 批量同步
    'synctime': 'creative/getSynTime?', // 获取批量同步时间
    'addcountries': 'creative/addCreativeCountrys?creativityIds={creativityIds}&countryId={countryId}', // 批量添加国家
    'synclist': 'creative/getCreativePage?', // 同步记录
    'synclistall': 'creative/synAssignCreatives?ids={ids}', //同步全部
    'allpagelist': 'page/allPages', // 新增创意主页列表
    'actionlist': 'creative/actionCallOn',  // 行动号召列表
    'toaddcreate': 'creative/addCreativity', //新增创意 单个
    'addcreates': 'creative/addCreatives',  // 新增创意 批量
    // gener
    'language': 'common/locales', // 语言列表
    'interests': 'common/interests', //兴趣列表
    'platform': 'facebook/application?application_id={applicationid}', // 平台列表
    'system': 'common/versions?os={os}', // 系统列表
    'addcreatelist': 'creative/getCreativesNoPage', // 创意列表 无分页
    'creategener': 'plan/create', //创建推广计划
    'planlist': 'plan/list?', // 推广计划列表
    'plancountry': 'project/countries?project_id={projectid}', // 推广计划列表国家列表
    'changeprice': 'plan/updateGoalBid', // 修改出价
    'inusecreate': 'plan/inUsedCreative?', //已选创意列表
    'nousecreate': 'plan/notUsedCreative?', // 未选创意列表
    'addcreate': 'plan/addCreative', //添加创意
    'delcreate': 'plan/delCreative', //删除创意
    'autoselect': 'plan/autoSelectCreative?', //智能选择
    'delallcreate': 'plan/delAllCreative', //删除所有创意
    'addallcreate': 'plan/addAllCreative?', //添加所有创意
    'accountlist': 'plan/adaccounts?', // 广告账户列表
    'addaccount': 'plan/addAdaccount', // 添加广告账户
    'delaccount': 'plan/delAdaccount', // 删除广告账户
    'planlog': 'plan/create/log?', //广告创建记录
    'logdetail': 'plan/adCreateDetail?', //广告创建记录详情
    'adfailreason': 'plan/errorMsg/ad?', // 广告失败原因
    'adsetfailreason': 'plan/errorMsg/adset?', // 广告组失败原因
    'campaignfailreason': 'plan/errorMsg/campaign?', //广告系列失败原因
    // 'genertarget': 'plan/getAudienceByAccount?', // 推广计划受众列表
    'genertarget': 'v2/audience/usableAudienceList?', // 推广计划受众列表
    'generaccount': 'plan/getAccountByAudience?', // 推广计划广告账户列表
    // 'logcreate': 'plan/createAd', // 创建广告
    'logcreate': 'plan/createAdv2', // 创建广告
    'logcreatenum': 'plan/plan/predictCreateDetail?', // 创建广告上面数量
    'createinfo': 'plan/info?', // 推广计划详情
    'editcreate': 'plan/update', // 修改推广计划
    'openplan': 'plan/openPlan', //开启智能推广计划
    'closeplan': 'plan/closePlan', //关闭智能推广计划
    'bidguide': 'plan/priceGuide?', // 出价指南
    // ad
    'adlisttotal': 'projectad/sumFbAdList', // 广告管理列表合计
    'adlist': 'projectad/getProjectsAd?', // 广告列表
    'adlistnew': 'projectad/getFbAdList', // 新版广告列表
    'adlistdata': 'projectad/getProjectsAdCpi?', //广告列表其他数据
    'adaccountlist': 'projectad/getAdaccountLists?', // 广告账户列表
    'changeadstatus': 'projectad/updateStatus?', //修改广告状态
    'adafdata': 'projectad/getAfDatas?', // af数据
    'eventdata': 'projectad/getAfEvents?', // 事件数据
    'savecondition': 'projectad/saveTag?', // 保存筛选条件
    'getcondition': 'projectad/queryTag?', // 获取筛选条件
    'deletecondition': 'projectad/deleteTag?', // 删除筛选条件
    'updatetime': 'projectad/fbDataUpdateTime', // 获取更新时间
    'resetname': 'fbAd/updateName?', // 重命名
    'seekreplace': 'fbAd/replaceName?', // 查找替换
    'seekreplacecreate': 'fbAd/fbAdCreative', // 查找替换创意
    'creativedetail': 'fbAd/getCreatives?', // 获取创意详情，查找替换用
    'adcampaignlist': 'fbAd/getFbCampaign?', // 广告系列列表，复制用
    'adsetlist': 'fbAd/getFbAdSet?', // 广告组列表，复制用
    'adcopy': 'fbAd/copyAd', // 复制
    'calcucount': 'ad/getDetailCount?', // 获取campaign adset ad数量，编辑用
    'createcampaign': 'ad/createCampaign', // 创建广告系列
    'campaigninfo': 'ad/getCampaignInfo?', // 批量获取广告系列信息，编辑时用
    'editcampaign': 'ad/editCampaign', // 编辑广告系列
    'createcampaignlist': 'ad/projectCampaignList?', // 广告系列列表，创建广告组用
    'createadset': 'ad/createAdSet', // 创建广告组
    'adsetinfo': 'ad/getAdSetInfo?', // 批量获取广告组信息，编辑时用
    'editadset': 'ad/editAdSet', // 编辑广告组
    'createadsetlist': 'ad/projectAdSetList?', // 广告组列表，创建广告用
    'createad': 'ad/createAd', // 创建广告
    'adinfo': 'ad/getAdInfo?', // 批量获取广告信息，编辑时用
    'dynamiccreate': 'fbAd/isDynamicCreative?', // 是否是动态创意，编辑广告用
    'editad': 'ad/editAd', // 编辑广告
    'createeditasync': 'ad/modifyAdWithNewCreative', // 创建创意 创建/编辑广告
    'appinfo': 'ad/getAppInfo?', // 获取应用信息，编辑广告组用
    'isactivead': 'ad/isIncludeAd?', // 动态创意广告组是否包含广告，创建广告用
    'asyncquery': 'fbAd/getJob?', // 异步获取JOB进度，复制用
    // 'joblist': 'fbAd/getJobList', // 初始化获取JOB列表
    'joblist': 'asyncTasks/unCompleted', // 初始化获取JOB列表
    'jobresultdetail': 'asyncTasks/', // task任务结果详情，主要针对有出现失败的任务
    'calendardata': '/afFile/getDateList?', // 数据日历高亮日期
    'addatacsv': `${baseurl[process.env.VUE_APP_URLBASE].BASE_URL}/afFile/upload`, // af留存数据文件上传 ${baseurl[process.env.VUE_APP_URLBASE].BASE_URL}
    'submitafdata': `afFile/upload`, // af留存数据提交
    'affiledownload': 'afFile/download?', // af数据下载
    // data
    'conditionlist': 'report/getRptOption', //条件获取
    'datalist': 'report/rptAccount', //账户报表
    'adformlist': 'report/rptAd', // 广告报表
    'createformlist': 'report/rptCreate', //创意报表
    'daycpi': 'report/rptCpi', //每日cpi
    'getoptionmore': 'report/getRptOptionMore?', // 获取筛选条件
    'createcard': 'report/rptCreateCarousel?', // 创意报表轮播卡片列表
    'matterlist': 'report/rptMaterial', // 素材报表列表
    'getvideourl': 'report/video/source?', // 根据视频id，获取视频地址
    // target
    // 'targetlist': 'audience/list?', // 受众列表
    'targetlist': 'v2/audience/list?', // 受众列表 v2
    'targetdetail': 'audience/detail?', // 受众详情
    'appmethod': 'audience/appEvents?', // 应用对应的用户
    // 'addtarget': 'audience/create', // 新增自定义受众
    'addtarget': 'v2/audience/createCustomAudience', // 新增自定义受众
    // 'edittarget': 'audience/edit', // 编辑自定义受众
    'targetadddetail': 'audience/createDetail?', // 新增编辑受众结果
    'liketarget': 'v2/audience/getCustomAudienceByAccount?', // 指定广告账户下的自定义受众
    'autoliketarget': 'v2/audience/createAudienceWithAudience', // 根据自定义受众创建类似受众
    'pageliketarget': 'v2/audience/createAudienceUsePage', // 根据主页创建类似受众
    'adliketarget': 'v2/audience/createCustomAudienceWithCampaign', // 根据广告创建类似受众
    'specialtarget': 'v2/audience/editAudience', // 特殊受众
    // 'targetinfo': 'audience/info?', // 编辑时获取受众信息
    'targetinfo': 'v2/audience/getAudienceDetail?', // 编辑时获取受众信息
    'targetcampaigns': 'audience/campaigns?', // 类似受众广告系列
    'campaigntoaccount': 'audience/getAccountByBatch?', // 广告系列获取广告账户
    'targetdelete': 'v2/audience/deleteBatchAudience', // 单个删除受众
    'targetshare': 'v2/audience/shareAudience', // 受众共享
    'deletedetail': 'v2/audience/waitingDeleteAudienceDetail?', // 待删除的受众详情
    // regular
    'regularlist': 'optimize/ruleGroupsList?', // 规则列表
    'regularstatus': 'optimize/update?', // 规则状态更改
    'allrules': 'optimize/allRules', // 规则报表页面，规则列表
    'reguformdata': 'optimize/ruleRpt?', // 规则报表页面数据
    // message
    'messagelist': 'user/userMessage?', // 获取消息列表
    'setmessage': 'user/setUserMessageStatus?', // 消息设置已读
    'setallread': 'user/setUserMessageRead', // 全部已读
    'messageCountWebsocket': `${location.protocol.indexOf('https:') != -1? 'wss':'ws'}://${baseurl[process.env.VUE_APP_URLBASE].WEBSOCKET_URL}/websocket/`, // 获取消息数量websocket连接地址
}