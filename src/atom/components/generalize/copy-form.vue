<template>
  <div class="formlist">
    <div class="bidguide">
      <gener-guide
        :bid="form.bid"
        :maxbid="form.maxbid"
        :moneytype="form.moneytype"
        :money="form.money"
      ></gener-guide>
    </div>
    <div class="eltitle">
      <b>基础信息</b>
      <span>推广计划保存后可编辑，也可多次生成广告</span>
    </div>
    <el-form class="elform" label-position="left" label-width="150px" :model="form">
      <el-form-item label="推广计划名称">
        <el-input v-model="form.name" placeholder="请输入推广计划名称，用以展示在计划管理中"></el-input>
      </el-form-item>
      <el-form-item label="推广计划类型" class="cline ctype">
        <el-radio-group v-model="form.type">
          <el-radio label="manual">通用推广计划</el-radio>
          <el-radio label="auto">智能推广计划</el-radio>
        </el-radio-group>
        <span class="typetip1">需要手动创建广告和选择创意</span>
        <span class="typetip2">每天11点自动选择创意并创建广告</span>
      </el-form-item>
      <el-form-item label="应用" class="cline">
        <el-select class="select" disabled v-model="form.actions" placeholder="请选择应用">
          <el-option
            v-for="(l, index) in commonapp"
            :key="index"
            :label="l.name"
            :value="l.applicationId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告账户" class="cline">
        <el-select
          class="select accountselect"
          v-model="form.account"
          multiple
          filterable
          placeholder="请选择广告账户"
          popper-class="downlist"
          collapse-tags
          @change="accountToAudience"
        >
          <el-option
            v-for="item in commonaccount"
            :key="item.code"
            :label="item.name + '(' + item.fbId.split('_')[1] + ')'"
            :value="item.fbId"
            :disabled="item.accountStatus != 1"
          >
            <span class="downline" style>
              <span style="float: left">{{ item.name }}</span>
              <span class="info" style="float: right; font-size: 13px;">支持CPI</span>
            </span>
            <span class="downline info" style=" font-size: 13px;">{{item.fbId.split('_')[1]}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告系列花费上限">
        <div>
          <el-tooltip
            class="conditiontip"
            effect="dark"
            content="设置广告系列总花费上限。当花费达到上限时，广告系列中的广告组就会停止"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
          <el-input
            class="optimizeinput"
            v-show="form.setmax"
            v-model="form.costmax"
            placeholder="请输入花费上限，不能低于100"
          ></el-input>
          <el-progress class="progress" v-show="form.setmax" :percentage="70" status="text">已花费$300</el-progress>
          <el-button type="text" @click="form.setmax = !form.setmax">{{form.setmax? '删除上限': '设置上限'}}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="广告系列预算优化">
        <div>
          <el-tooltip
            class="conditiontip"
            effect="dark"
            content="根据你选择的优化投放方案和竞价策略，预算优化功能将为广告系列中的各广告组分配预算，力求获得更多成效。你可以控制每个广告组的花费。"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
          <el-switch
            v-model="form.campaignoptimize"
            active-color="#13ce66"
            inactive-color="#d7dae2"
          ></el-switch>
          <p class="optimizetip" v-show="form.campaignoptimize">
            广告系列不符合广告系列预算优化要求。
            <el-tooltip
              effect="dark"
              content="未满足 - 所有广告组均使用相同的预算类型（总预算或单日预算）"
              placement="top-start"
            >
              <el-button type="text" class="checkbutton">查看资格要求</el-button>
            </el-tooltip>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="广告系列预算" v-show="form.campaignoptimize">
        <div>
          <el-radio-group v-model="form.moneytype">
            <el-radio label="day_budget">单日预算</el-radio>
            <el-radio label="total_budget">总预算</el-radio>
          </el-radio-group>
          <div class="moneyinput">
            <span class="moneyus">$</span>
            <el-input class="minput" v-model="form.money" placeholder="请输入预算金额（单位：美元）"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="广告系列竞价策略" v-show="form.campaignoptimize">
        <div>
          <el-tooltip class="conditiontip" effect="dark" placement="top-start">
            <div slot="content">
              每种竞价策略适合不同的业务目标，需要你权衡利弊。如果你更希望从预算获得最大价值，请使用最低费用竞价策略。如果你更关心稳定的单次优化事件平均费用，请使用目标费用竞价策略。
              <br>你将在每个广告组中设置竞价上限。详细了解。
              <br>你在广告组层级中设置的广告投放优化方式将影响你所获得的成效。如果你选择设置竞价上限或目标费用，请在每个广告组中输入具体金额。
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
          <el-select class="formselect" v-model="form.bidmethod" placeholder="请选择竞价策略">
            <el-option
              v-for="item in bidmethodlist"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
          <p>
            <el-button type="text" class="checkbutton" @click="setMaxCost">设置广告组{竞价上限/目标费用}</el-button>
          </p>
        </div>
      </el-form-item>
    </el-form>
    <div class="eltitle">
      <b>受众和版位</b>
      <span>设置目标受众，正确选择版位，高效展示广告</span>
    </div>
    <el-form class="elform" label-position="left" label-width="150px" :model="form">
      <el-form-item label="国家" class="cline">
        <el-select
          class="select"
          v-model="form.country"
          multiple
          filterable
          placeholder="请选择国家，可搜索"
        >
          <el-option
            v-for="item in othercountries"
            :key="item.code"
            :label="item.name + '(' + item.code + ')'"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平台" class="cline timerange" v-show="form.actions != ''">
        <el-radio-group v-model="form.platform" @change="toGetsystem">
          <el-radio :label="l.marketType" v-for="l in createplatform" :key="l.marketType"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="系统版本" class="cline" v-show="form.platform != ''">
        <el-select class="selectHalf" v-model="form.minversion" placeholder="最低版本">
          <el-option
            v-for="(l, index) in system"
            :key="index"
            :label="l.os + ' ' + l.version"
            :value="l.version"
          ></el-option>
        </el-select>--
        <el-select class="selectHalf" v-model="form.maxversion" placeholder="最高版本">
          <el-option
            v-for="(l, index) in system"
            :key="index"
            :label="l.os + ' ' + l.version"
            :value="l.version"
          ></el-option>
        </el-select>
        <p style="font-size: 12px;color: #999;">最高版本为空则无上限</p>
      </el-form-item>
      <el-form-item label="受众" class="cline">
        <div class="targettip">定位至少符合以下一项条件的用户</div>
        <el-select
          class="select accountselect"
          no-data-text="暂无受众，请修改账户或新增受众"
          v-model="form.target"
          multiple
          filterable
          placeholder="请选择受众，可搜索"
        >
          <el-option-group
            v-for="group in genertarget"
            :key="group.label"
            :label="group.label.split('_')[1]"
          >
            <el-option
              v-for="item in group.options"
              :key="item.code"
              :label="`${item.name}（${item.audienceId}）`"
              :value="`${item.audienceId}|${group.label}`"
              v-show="form.notarget.indexOf(`${item.audienceId}|${group.label}`) == -1"
            ></el-option>
          </el-option-group>
        </el-select>
        <el-checkbox-group v-model="form.iftarget">
          <el-checkbox label="1" name="type">不排除任何受众</el-checkbox>
        </el-checkbox-group>
        <div class="targettip" v-if="form.iftarget[0] != 1">排除至少符合以下一项条件的用户</div>
        <el-select
          class="select accountselect"
          no-data-text="暂无受众，请修改账户或新增受众"
          v-if="form.iftarget[0] != 1"
          v-model="form.notarget"
          multiple
          filterable
          placeholder="请选择受众，可搜索"
        >
          <el-option-group
            v-for="group in genertarget"
            :key="group.label"
            :label="group.label.split('_')[1]"
          >
            <el-option
              v-for="item in group.options"
              :key="item.code"
              :label="`${item.name}（${item.audienceId}）`"
              :value="`${item.audienceId}|${group.label}`"
              v-show="form.target.indexOf(`${item.audienceId}|${group.label}`) == -1"
            ></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" v-show="form.platform != ''">
        <el-checkbox-group v-model="form.equip">
          <el-checkbox
            label="Android_Smartphone"
            name="type"
            v-if="form.platform == 'google_play'"
          >安卓智能手机</el-checkbox>
          <el-checkbox label="iPhone" name="type" v-if="form.platform == 'itunes'">iPhone</el-checkbox>
          <el-checkbox label="iPad" name="type" v-if="form.platform == 'itunes'">iPad</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="性别" class="cline">
        <el-radio-group v-model="form.sex" @change="getFilterCount">
          <el-radio label="0">全部</el-radio>
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" class="cline">
        <el-slider v-model="form.age" range :min="13" :max="65" :format-tooltip="formatTooltip"></el-slider>
      </el-form-item>
      <el-form-item label="语言" class="cline">
        <el-select
          class="select"
          v-model="form.language"
          multiple
          filterable
          placeholder="请选择语言，可搜索"
        >
          <el-option
            v-for="item in language"
            :key="item.localeId"
            :label="item.name"
            :value="item.localeId.toString()"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="兴趣" class="cline">
        <el-select
          class="select"
          v-model="form.interest"
          multiple
          filterable
          placeholder="请选择兴趣，可搜索"
        >
          <el-option
            v-for="item in interests"
            :key="item.featureId"
            :label="item.name"
            :value="item.featureId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户过滤" class="cline">
        <el-checkbox-group v-model="form.filtra">
          <el-checkbox label="1" name="filtra">过滤已安装用户</el-checkbox>
          <el-checkbox label="2" name="filtra">过滤已关注用户</el-checkbox>
        </el-checkbox-group>
        <div class="moneyinput" v-show="form.filtra && form.filtra.indexOf('2') != -1">
          <el-select class="select" v-model="form.filtrapage" multiple placeholder="请选择要过滤的主页，必选">
            <el-option
              v-for="(l, index) in commonpage"
              :key="index"
              :label="l.name"
              :value="l.pageId"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="自动版位">
        <el-checkbox-group v-model="form.auto">
          <el-checkbox label="1" name="type">是（Facebook自动选择最好的版位）</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="版位" class="verpla" v-show="form.auto[0] != 1">
        <el-checkbox-group v-model="form.verpla">
          <el-checkbox
            label="facebook"
            name="type"
            :disabled="form.verpla && (form.verpla.indexOf('audience_network') != -1 || form.verpla.indexOf('messenger') != -1)"
          >Facebook</el-checkbox>
          <el-checkbox label="instagram" name="type">Instagram</el-checkbox>
          <el-checkbox
            label="audience_network"
            name="type"
            :disabled="form.verpla && form.verpla.indexOf('facebook') == -1"
          >Audience Network</el-checkbox>
          <el-checkbox
            label="messenger"
            name="type"
            :disabled="form.verpla && form.verpla.indexOf('facebook') == -1"
          >Messenger</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div class="eltitle">
      <b>预算、排期和竞价</b>
      <span>设置花费预期、展示时间、竞价策略等</span>
    </div>
    <el-form class="elform" label-position="left" label-width="150px" :model="form">
      <el-form-item label="预算" class="cline ctype">
        <el-radio-group v-model="form.moneytype" @change="moneytypeChange">
          <el-radio label="day_budget">单日预算</el-radio>
          <el-radio label="total_budget">总预算</el-radio>
        </el-radio-group>
        <div class="moneyinput">
          <span class="moneyus">$</span>
          <el-input class="minput" v-model="form.money" placeholder="请输入预算金额（单位：美元）"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="投放日期" v-show="form.moneytype == 'total_budget'">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="投放时段" class="cline timerange" v-show="form.moneytype == 'total_budget'">
        <el-radio-group v-model="form.timerange">
          <el-radio label="allday">全天投放广告</el-radio>
          <el-radio label="schedule">分时间段投放</el-radio>
        </el-radio-group>
        <div class="moneyinput" v-show="form.timerange == 'schedule'">
          <el-select class="selectsmall" v-model="form.rdate" multiple placeholder="按广告受众所在时区">
            <el-option v-for="(l, index) in putweek" :key="index" :label="l.name" :value="l.key"></el-option>
          </el-select>
          <el-time-picker
            class="timeselect"
            is-range
            v-model="form.rtime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </div>
      </el-form-item>
      <el-form-item label="优化目标">
        <el-tooltip
          class="conditiontip"
          style="left: -90px;"
          effect="dark"
          content="请根据你的目标选择广告投放的方式，我们会将广告展示给最有可能实现你所优化成效的用户。例如：如果选择链接点击量为优化目标，广告将向更可能点击链接的用户展示。"
          placement="top-start"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <el-select class="formselect" v-model="form.optimizedist" placeholder="请选择优化目标">
          <el-option
            v-for="item in adoptimizelist"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="留存率">
        <el-tooltip
          class="conditiontip"
          style="left: -104px;"
          effect="dark"
          content="请根据你的目标选择广告投放的方式，我们会将广告展示给最有可能实现你所优化成效的用户。例如：如果选择链接点击量为优化目标，广告将向更可能点击链接的用户展示。"
          placement="top-start"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <el-select class="formselect" v-model="form.remain" placeholder="请选择留存率">
          <el-option
            v-for="item in remainlist"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择应用事件">
        <el-tooltip
          class="conditiontip"
          style="left: -62px;"
          effect="dark"
          content="请根据你的目标选择广告投放的方式，我们会将广告展示给最有可能实现你所优化成效的用户。例如：如果选择链接点击量为优化目标，广告将向更可能点击链接的用户展示。"
          placement="top-start"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <el-select class="formselect" v-model="form.appevent" placeholder="请选择应用事件">
          <el-option
            v-for="item in appeventlist"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归因窗口">
        <el-tooltip
          class="conditiontip"
          effect="dark"
          style="left: -90px;"
          content="选择用户从点击或浏览广告到完成应用安装（或转化）通常需要的时间。使用基于这一时间窗生成的数据来优化广告投放。具体而言，假如你的转化时间窗是1天，我们将通过用户与广告互动后的1天内生成的数据来优化广告"
          placement="top-start"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <el-select class="formselect" v-model="form.because" placeholder="请选择归因窗口">
          <el-option
            v-for="item in becauselist"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告组花费上限">
        <el-tooltip
          class="conditiontip"
          style="left: -50px;"
          effect="dark"
          content="这个广告组所属的广告系列使用了预算优化功能，如果你对其花费有要求，请在这里设置花费限额。"
          placement="top-start"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <p class="formtip">这个广告组所属的广告系列使用了预算优化功能，如果你对其花费有要求，请在这里设置花费限额。</p>
        <p v-show="costmaxmin">
          最低
          <el-input v-model="form.adsetcostmin" class="smallinput" size="mini" placeholder="非必填"></el-input>
          {单日/总}预算
        </p>
        <p v-show="costmaxmin">我们无法保证花费金额完全符合</p>
        <p v-show="costmaxmin">
          最高
          <el-input v-model="form.adsetcostmax" class="smallinput" size="mini" placeholder="非必填"></el-input>
          {单日/总}预算
        </p>
        <p v-show="costmaxmin">你的花费不会超过这个金额</p>
        <el-button
          type="text"
          @click="costmaxmin = !costmaxmin"
        >{{costmaxmin? '移除花费限制': '为广告组添加花费限额'}}</el-button>
      </el-form-item>
      <el-form-item label="广告组竞价策略">
        <el-tooltip class="conditiontip" style="left: -50px;" effect="dark" placement="top-start">
          <div slot="content">
            每项竞价策略专门针对特定业务目标而设计，也有各自的利弊。
            <br>如果你更重视花费效率，最低单次成效费用竞价策略最佳，但也可能导致你难以均衡花费。如果你更重视保持稳定花费，均衡单次成效费用竞价策略最佳，但也可能降低花费效率。
            <br>请注意，可用的竞价策略因广告投放的优化方式而异。
          </div>
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <p class="formtip">目标费用 - 提高预算时，单次应用安装/转化费用稳定在平均值</p>
        <el-select class="formselect" v-model="form.bidmethodselect" placeholder="请选择竞价策略">
          <el-option
            v-for="item in bidmethodlist"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
        <p>
          <el-input v-model="form.bidmethodinput" class="smallinput" size="mini" placeholder="必填"></el-input>
          /{应用安装/转化}
        </p>
        <p class="formtip">我们对任何单次应用安装/转化设置的竞价不会超过此金额。如果此金额过低，你可能无法充分花费预算</p>
        <p class="formtip">在你的预算条件下获得更多应用安装/转化</p>
        <p class="formtip">提高预算时，单次应用安装/转化费用稳定在平均值</p>
      </el-form-item>
      <el-form-item label="计费方式">
        <el-tooltip class="conditiontip" style="left: -90px;" effect="dark" placement="top-start">
          <div slot="content">
            你的选项决定广告收费方式。对很多优化目标，你将为每次广告展示付费。
            <br>部分优化目标还允许你选择展示或操作（例如链接点击量或视频 10 秒观看量）。
            <br>这里显示的推荐选项，将为你平衡有效预算花费，分析广告成效，实现广告目标。
          </div>
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <el-radio-group v-model="form.billingmethod">
          <el-radio label="1">展示</el-radio>
          <el-radio label="2">安装</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="投放类型">
        <el-tooltip class="conditiontip" style="left: -90px;" effect="dark" placement="top-start">
          <div slot="content">
            匀速投放通过调整预算使用速率来控制你的花费。预算使用速率调整功能可防止预算花费过快，这是大多数广告主的首选设置，推荐使用。
            <br>加速投放可能对时效性强的推广有帮助。你需要设置带上限的最低费用才能使用加速投放。
          </div>
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <el-radio-group v-model="form.puttype">
          <el-radio label="1">匀速</el-radio>
          <el-radio label="2">加速</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="出价" class="cline">
        <el-radio-group v-model="form.bid" @change="maxbidDefault">
          <el-radio label="cpi">CPI</el-radio>
          <el-radio label="cpm">CPM</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="竞价上限">
        <div class="moneyinput">
          <span class="moneyus">$</span>
          <el-input class="minput" v-model="form.maxbid" :placeholder="maxbidplace"></el-input>
        </div>
      </el-form-item>-->
    </el-form>
    <div class="eltitle">
      <b>结构和创意</b>
      <span>根据广告组数量、广告组创意数和创意数生成相对应的广告系列数量</span>
    </div>
    <el-form class="elform" label-position="left" label-width="150px" :model="form">
      <el-form-item label="广告组数" class="cline ctype">
        <el-input-number v-model="form.adcount" :min="1" label="广告组数"></el-input-number>
        <div class="countfont">每个广告系列包含的广告组数量，太多也会有内部竞争影响整体效率</div>
      </el-form-item>
      <el-form-item label="广告组创意数" class="cline ctype">
        <el-input-number
          v-model="form.count"
          @change="countChange"
          :min="1"
          :max="50"
          label="广告组创意数"
        ></el-input-number>
        <div class="countfont">每个广告组包含的创意数量。1-3个为佳，3个以上会有内部竞争影响整体效率</div>
      </el-form-item>
      <el-form-item label="创意类型" class="cline" v-show="form.type == 'auto'">
        <el-checkbox-group v-model="form.createtype" @change="getFilterCount">
          <el-checkbox label="0" name="type">单图片</el-checkbox>
          <el-checkbox label="1" name="type">单视频</el-checkbox>
          <el-checkbox label="2" name="type">轮播</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择分类" class="cline" v-show="form.type == 'auto'">
        <el-select
          class="select"
          multiple
          v-model="form.classify"
          placeholder="选填，为空则不限制分类"
          @change="getFilterCount"
        >
          <el-option
            v-for="(item, index) in classifyforplan"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创意数量" class="cline ctype" v-show="form.type == 'auto'">
        <el-input-number
          v-model="form.createcount"
          @change="createcountChange"
          :min="1"
          label="创意数量"
        ></el-input-number>
        <div class="countfont">符合条件的创意总数为：{{classifyfiltercount}}</div>
      </el-form-item>
      <el-form-item label="选择策略" class="cline cline-strategy" v-show="form.type == 'auto'">
        <el-radio-group v-model="form.tactics" class="strategy">
          <el-radio :label="1">新创意优先</el-radio>
          <el-radio :label="2">完全随机</el-radio>
          <el-radio :label="3">高点击率优先</el-radio>
          <el-radio :label="4">视频/图片不同优先</el-radio>
        </el-radio-group>
        <el-tooltip
          class="item"
          effect="dark"
          content="不同策略会选到不同的创意，请根据需求选择合适的策略"
          placement="bottom-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div class="elsubmit">
      <el-button type="primary" @click="toSubmit">提 交</el-button>
    </div>
  </div>
</template>

<script>
  import GenerGuide from "./gener-guide";
  import { mapState, mapGetters, mapMutations } from "vuex";
  import { Msgwarning } from "../../js/message";
  export default {
    props: ["createinfo"],
    components: {
      GenerGuide
    },
    data() {
      return {
        state: "",
        state2: "",
        state3: "",
        maxbidplace:
          this.createinfo.billingType == "cpi"
            ? "请输入竞价上限（单位：美元）"
            : "选填",
        costmaxmin: false,
        form: {
          name: this.createinfo.name,
          type: this.createinfo.createType,
          actions: this.createinfo.applicationId,
          country: this.createinfo.country ? this.createinfo.country : [],
          platform: this.createinfo.platform,

          target: this.createinfo.included,
          iftarget: this.createinfo.excludedAudiences ? [] : ["1"],
          notarget: this.createinfo.excluded,
          minversion: this.createinfo.version,
          maxversion: this.createinfo.maxVersion
            ? this.createinfo.maxVersion
            : "",
          moneytype: this.createinfo.budgetType,
          money:
            this.createinfo.budgetType == "day_budget"
              ? this.createinfo.dayBudget / 100
              : this.createinfo.totalBudget / 100,
          date: [
            this.createinfo.startTime
              ? new Date(this.createinfo.startTime)
              : new Date(),
            this.createinfo.endTime
              ? new Date(this.createinfo.endTime)
              : new Date()
          ],
          timerange: this.createinfo.scheduleType,
          rdate: this.createinfo.days ? this.createinfo.days : [],
          rtime: [
            new Date(
              2016,
              9,
              10,
              this.createinfo.startMinute
                ? this.createinfo.startMinute.split(":")[0]
                : 0,
              0,
              0
            ),
            new Date(
              2016,
              9,
              10,
              this.createinfo.endMinute
                ? this.createinfo.endMinute.split(":")[0]
                : 23,
              0,
              0
            )
          ],
          equip: this.createinfo.device,
          sex: this.createinfo.gender ? this.createinfo.gender[0] : "",
          age: [this.createinfo.minAge, this.createinfo.maxAge],
          language: this.createinfo.locales ? this.createinfo.locales : [],
          interest: this.createinfo.interest ? this.createinfo.interest : [],
          auto:
            this.createinfo.position && this.createinfo.position.length == 0
              ? ["1"]
              : [],
          verpla: this.createinfo.position ? this.createinfo.position : [], //版位
          bid: this.createinfo.billingType, //出价
          maxbid:
            this.createinfo.bidAmount === "" || this.createinfo.bidAmount === null
              ? ""
              : this.createinfo.bidAmount / 100,
          filtra: [
            this.createinfo.filteInstalledUser ? "1" : "",
            this.createinfo.filteAttentionUser &&
            this.createinfo.filteAttentionUser.length > 0
              ? "2"
              : ""
          ],
          filtrapage: this.createinfo.filteAttentionUser
            ? this.createinfo.filteAttentionUser
            : [],

          account: this.createinfo.fbAccountIds,
          adcount: this.createinfo.adsetNum,
          count: this.createinfo.adNum,
          createtype: this.createinfo.creativeType
            ? this.createinfo.creativeType
            : [],
          classify: this.createinfo.creativeClassify
            ? this.createinfo.creativeClassify
            : [],
          createcount: this.createinfo.creativeNum,
          tactics: this.createinfo.creativeStrategy
            ? this.createinfo.creativeStrategy
            : 1,
          // 20190524新增
          setmax: false,
          costmax: "",
          campaignoptimize: false,
          bidmethod: "",
          optimizedist: "APP_INSTALLS",
          remain: "",
          appevent: "",
          because: "",
          adsetcostmin: "",
          adsetcostmax: "",
          bidmethodinput: "",
          bidmethodselect: "LOWEST_COST_WITH_BID_CAP",
          billingmethod: "1",
          puttype: "1"
        },
        msg: {
          name: "请输入推广计划名称",
          country: "请选择国家",
          // actions: "请选择应用",
          platform: "请选择平台",
          version: "请选择系统版本",
          money: "请输入预算金额",
          date: "请选择投放日期",
          rdate: "请选择星期",
          equip: "请选择设备",
          language: "请选择语言",
          // interest: "请选择兴趣",
          verpla: "请选择版位",
          maxbid: "请输入竞价上限",
          maxbidmax: "竞价上限必须大于0.02美元",
          filtra: "请选择用户过滤",
          filtrapage: "请选择需要过滤的主页",
          createtype: "请选择创意类型"
        }
      };
    },
    mounted() {
      if (this.form.actions) {
        let applicationid = this.form.actions;
        this.$store.dispatch("getCreatePlatform", { applicationid });

        // 20181105新增出价指南数据
        if (this.form.country.length == 0) return;
        let country = this.form.country.join(",");
        let billingEvent =
          this.form.bid == "cpi" ? "APP_INSTALLS" : "IMPRESSIONS";
        this.$store.dispatch("bidGuide", {
          country,
          fbApplicationId: applicationid,
          billingEvent
        });
      }

      this.toGetsystem();
      // 初始化获取受众已经广告账户列表
      if (this.form.account.length == 0) {
        this.SETSTATE({ k: "genertarget", v: [] });
        return;
      }
      let fb_account_ids = this.form.account.join(",");
      this.$store.dispatch("generTargetList", { fb_account_ids });

      this.getFilterCount();
    },
    computed: {
      ...mapState([
        "itemlist",
        "othercountries",
        "language",
        "interests",
        "commonapp",
        "createplatform",
        "system",
        "commonpage",
        "genertarget",
        "commonaccount",
        "classifyforplan",
        "classifyfiltercount",
        "bidmethodlist",
        "remainlist",
        "putweek",
        "allbecauselist",
        "bidmethodlist",
        "adoptimizelist",
        "appeventlist"
      ]),
      equip() {
        return this.form.platform;
      },
      becauselist() {
        return this.allbecauselist;
      }
    },
    watch: {
      equip(n, o) {
        this.form.equip =
          n == "google_play" ? ["Android_Smartphone"] : ["iPhone", "iPad"];
      },
      "form.name": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.type": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.country": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.platform": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.target": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.notarget": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.minversion": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.maxversion": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.moneytype": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.money": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.sex": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.language": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.interest": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.bid": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.maxbid": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.filtrapage": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.account": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      },
      "form.count": {
        handler(n, o) {
          this.$emit("changeEdit", false);
        }
      }
    },
    methods: {
      ...mapMutations(["SETSTATE"]),
      setMaxCost() {

      },
      getFilterCount() {
        if (this.form.createtype.length == 0 || this.form.country.length == 0) {
          this.SETSTATE({ k: "classifyfiltercount", v: 0 });
          return;
        }

        let country = this.form.country.join(",");
        let gender = this.form.sex;
        let projectId = this.$route.params.id;
        let creativetype = this.form.createtype.join(",");
        let classify = this.form.classify.join(",");
        this.$store.dispatch("classifyFilterCountNoPlan", {
          country,
          gender,
          projectId,
          creativetype,
          classify
        });
      },
      // getFilterCount() {
      //   if(this.form.createtype.length == 0) {
      //     this.SETSTATE({k: 'classifyfiltercount', v: 0});
      //     return
      //   };

      //   let planid = this.$route.params.pid;
      //   let creativetype = this.form.createtype.join(',');
      //   let classify = this.form.classify.join(',');
      //   this.$store.dispatch('classifyFilterCount', {planid, creativetype, classify})
      // },
      showBidChart() {
        if (this.form.country.length == 0 || !this.form.actions) {
          return;
        }
        // 20181105新增出价指南数据
        let country = this.form.country.join(",");
        let billingEvent =
          this.form.bid == "cpi" ? "APP_INSTALLS" : "IMPRESSIONS";
        this.$store.dispatch("bidGuide", {
          country,
          fbApplicationId: this.form.actions,
          billingEvent
        });
      },
      accountToAudience() {
        this.form.target = [];
        this.form.notarget = [];

        if (this.form.account.length == 0) {
          this.SETSTATE({ k: "genertarget", v: [] });
          return;
        }
        let fb_account_ids = this.form.account.join(",");
        this.$store.dispatch("generTargetList", { fb_account_ids });
      },
      moneytypeChange() {
        this.form.money = "";
      },
      formatTooltip(val) {
        if (val == 65) return "65+";
      },
      maxbidDefault() {
        if (this.form.bid == "cpi") {
          this.form.maxbid = "0.02";
          this.maxbidplace = "请输入竞价上限（单位：美元）";
        } else {
          this.form.maxbid = "";
          this.maxbidplace = "选填";
        }
      },
      toSubmit() {
        console.log(this.form);
        let self = this;

        let check = this.dataChecked();
        if (!check[0]) {
          Msgwarning(check[1]);
          return;
        }

        let warnstr = [];
        let h = this.$createElement;
        let day = parseInt(
          (this.form.date[1] - this.form.date[0]) / (24 * 3600 * 1000)
        );
        if (
          this.form.moneytype == "day_budget" &&
          parseFloat(this.form.money) >= 5000
        ) {
          warnstr.push(
            h("p", null, [
              h("span", { style: "color:#999" }, "每日预算："),
              h("span", { style: "color:red" }, `$${this.form.money}`)
            ])
          );
        }
        if (
          this.form.moneytype == "total_budget" &&
          parseFloat(this.form.money) / day >= 5000
        ) {
          warnstr.push(
            h("p", null, [
              h("span", { style: "color:#999" }, "总预算："),
              h("span", { style: "color:red" }, `$${this.form.money}`)
            ])
          );
        }
        if (this.form.bid == "cpi" && this.form.maxbid >= 50) {
          warnstr.push(
            h("p", null, [
              h("span", { style: "color:#999" }, "CPI出价："),
              h("span", { style: "color:red" }, `$${this.form.maxbid}`)
            ])
          );
        }
        if (this.form.bid == "cpm" && this.form.maxbid >= 50) {
          warnstr.push(
            h("p", null, [
              h("span", { style: "color:#999" }, "CPM出价："),
              h("span", { style: "color:red" }, `$${this.form.maxbid}`)
            ])
          );
        }
        if (warnstr.length > 0) {
          this.$msgbox({
            title: "创建推广计划",
            message: h(
              "div",
              null,
              [h("span", null, "确认创建此推广计划吗？")].concat(warnstr)
            ),
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              self.toDispatch();
            })
            .catch(() => {});
        } else {
          self.toDispatch();
        }
      },
      toDispatch() {
        let target = {},
          notarget = {};
        this.form.target.forEach(v => {
          let k = v.split("|");
          let account = k[1];
          if (!target[account]) {
            target[account] = [];
          }
          target[account].push(k[0]);
        });
        this.form.notarget.forEach(v => {
          let k = v.split("|");
          let account = k[1];
          if (!notarget[account]) {
            notarget[account] = [];
          }
          notarget[account].push(k[0]);
        });

        // return;
        let option = {
          // planAdaccountVOList: [],
          // planCreativeVOList: [],
          planInfoVO: {
            adNum: this.form.count,
            applicationId: this.form.actions,
            bidAmount:
              this.form.maxbid === "" ? null : parseInt(this.form.maxbid * 100),
            billingType: this.form.bid,
            budgetType: this.form.moneytype,
            country: this.form.country,
            createType: this.form.type,
            creativeNum: this.form.createcount,
            creativeType: this.form.createtype,
            dayBudget: parseInt(this.form.money * 100),
            days: this.form.rdate,
            device:
              this.form.platform == "itunes"
                ? this.form.equip.filter(v => v == "iPhone" || v == "iPad")
                : this.form.equip.filter(v => v == "Android_Smartphone"),
            endMinute: this.$timeFormat(this.form.rtime[1], "HH") + ":00",
            endTime: new Date(this.form.date[1]).getTime(),
            filteAttentionUser: this.form.filtrapage,
            filteInstalledUser: this.form.filtra.indexOf("1") != -1 ? "yes" : "",
            gender: [this.form.sex],
            goalBid: "",
            interest: this.form.interest,
            locales: this.form.language,
            maxAge: this.form.age[1],
            minAge: this.form.age[0],
            name: this.form.name,
            platform: this.form.platform,
            position: this.form.auto[0] == "1" ? [] : this.form.verpla,
            projectId: this.$route.params.id,
            scheduleType: this.form.timerange,
            startMinute: this.$timeFormat(this.form.rtime[0], "HH") + ":00",
            startTime: new Date(this.form.date[0]).getTime(),
            totalBudget: parseInt(this.form.money * 100),
            fbAccountIds: this.form.account,
            includeAudiences: JSON.stringify(target),
            excludedAudiences:
              this.form.iftarget[0] == 1 ? "" : JSON.stringify(notarget),
            version: this.form.minversion,
            maxVersion: this.form.maxversion ? this.form.maxversion : null,
            adsetNum: this.form.adcount,
            creativeStrategy: this.form.tactics,
            creativeClassify: this.form.classify
            //   planId: this.$route.params.pid
          },
          route: this.$router,
          projectid: this.$route.params.id
        };
        // 阻止路由离开页面钩子触发
        this.$emit("changeEdit", true);

        this.$store.dispatch("createGener", { option });
      },
      dataChecked() {
        if (this.form.name == "") return [false, this.msg.name];
        if (this.form.country.length == 0) return [false, this.msg.country];
        //   if (this.form.actions == "") return [false, this.msg.actions];
        if (this.form.platform == "") return [false, this.msg.platform];

        if (this.form.minversion == "") return [false, this.msg.version];
        if (this.form.money == "") return [false, this.msg.money];
        if (this.form.moneytype == "total_budget") {
          if (!this.form.date || this.form.date.length == 0)
            return [false, this.msg.date];
          if (this.form.timerange == "schedule" && this.form.rdate.length == 0)
            return [false, this.msg.rdate];
        }
        if (this.form.equip.filter(v => v).length == 0)
          return [false, this.msg.equip];
        // if (this.form.language.length == 0) return [false, this.msg.language];
        //   if (this.form.interest.length == 0) return [false, this.msg.interest];
        if (this.form.auto.length == 0 && this.form.verpla.length == 0)
          return [false, this.msg.verpla];
        if (this.form.bid == "cpi" && this.form.maxbid == "")
          return [false, this.msg.maxbid];
        if (
          this.form.maxbid != "" &&
          (isNaN(parseInt(this.form.maxbid)) || this.form.maxbid < 0.02)
        )
          return [false, this.msg.maxbidmax];
        // if (this.form.filtra.length == 0) return [false, this.msg.filtra];
        if (this.form.filtra.indexOf("2") != -1) {
          if (this.form.filtrapage.length == 0)
            return [false, this.msg.filtrapage];
        }
        if (this.form.type == "auto") {
          if (this.form.createtype.length == 0)
            return [false, this.msg.createtype];
        }

        return [true];
      },
      toGetsystem() {
        let os = this.form.platform == "itunes" ? "ios" : "android";

        this.$store.dispatch("getSystem", { os });
      },
      // toGetplatform() {
      //   let applicationid = this.form.actions;

      //   this.$store.dispatch("getPlatform", { applicationid });
      // },
      countChange() {},
      createcountChange() {}
    }
  };
</script>

<style lang="less" scoped>
.formlist {
  position: relative;
  .conditiontip {
    position: absolute;
    left: -36px;
    top: 14px;
  }
  .formtip {
    line-height: 24px;
    padding-top: 8px;
  }
  .smallinput {
    width: 100px;
  }
  .optimizeinput {
    margin-bottom: 15px;
  }
  .bidguide {
    position: absolute;
    top: 0;
    right: 0;
  }
  .eltitle {
    font-size: 18px;
    line-height: 30px;
    margin-bottom: 30px;
    span {
      font-size: 12px;
      color: #666;
      margin-left: 10px;
    }
  }
  .elsubmit {
    padding-left: 110px;
    margin-bottom: 100px;
  }
  .elform {
    width: 50%;
    margin-bottom: 40px;

    .selectsmall {
      width: 180px;
      float: left;
      margin-right: 20px;
    }
    .timeselect {
      width: 300px;
      float: left;
    }
    .countfont {
      font-size: 12px;
      color: #999;
      line-height: 18px;
      margin-top: 10px;
    }
    .targettip {
      font-size: 14px;
      color: #999;
      line-height: 18px;
      margin-top: 10px;
      width: 500px;
      margin-bottom: 10px;
    }
    .verpla,
    .timerange {
      width: 200%;
    }
    .dateselect {
      width: 100%;
    }
    .moneyinput {
      position: relative;
      overflow: hidden;
      .moneyus {
        position: absolute;
        z-index: 9;
        left: 8px;
        font-size: 18px;
      }
    }
    .search {
      width: 100%;
    }
    .select {
      width: 100%;
      &.accountselect {
        width: 500px;
      }
    }
    .selectHalf {
      width: 45%;
    }
    .ctype {
      height: 78px;
    }
    .cline-strategy {
      position: relative;
      .strategy {
        width: 700px;
      }
      .item {
        position: absolute;
        left: -51px;
        top: 14px;
      }
    }
    .typetip1 {
      position: absolute;
      color: #999;
      left: 28px;
      top: 36px;
      font-size: 12px;
      width: 110px;
      line-height: 16px;
    }
    .typetip2 {
      position: absolute;
      color: #999;
      left: 171px;
      top: 36px;
      font-size: 12px;
      width: 110px;
      line-height: 16px;
    }
  }
}
</style>
