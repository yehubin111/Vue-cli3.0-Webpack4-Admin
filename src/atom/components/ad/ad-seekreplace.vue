<template>
  <el-dialog
    :title="`查找替换${oldInfoList.length}个${typeData.name}`"
    :visible.sync="dialogFormVisible"
    @close="hideReplace"
  >
    <div class="replaceline">
      <p class="font">将</p>
      <el-input class="input" v-model="oldStr" @input="filterOld" placeholder="请输入内容"></el-input>
      <p class="font">改为</p>
      <el-input class="input" v-model="newStr" @input="filterNew" placeholder="请输入内容"></el-input>
    </div>
    <div class="replacecont">
      <el-radio-group v-model="replaceType" @change="typeChange">
        <el-radio label="Text">名称</el-radio>
        <el-radio label="Name" v-show="type == 'adName'" :disabled="tablock">标题</el-radio>
        <el-radio label="Desc" v-show="type == 'adName'" :disabled="tablock">文本</el-radio>
        <el-radio label="Link" v-show="type == 'adName'" :disabled="tablock">“查看更多”网址</el-radio>
      </el-radio-group>
    </div>
    <div class="articleList">
      <div class="left">
        <p class="title">当前文本</p>
        <div class="artlist">
          <p v-for="item in oldInfoList" :key="item.update" :title="item.key" v-html="item.name"></p>
        </div>
        <p
          class="count"
          v-show="oldStr.trim()"
        >“{{oldStr}}”出现在{{appearCount}}/{{oldInfoList.length}}个对象中</p>
      </div>
      <div class="left">
        <p class="title">新文本</p>
        <div class="artlist">
          <p v-for="item in newInfoList" :key="item.update" :title="item.key" v-html="item.name"></p>
        </div>
        <p class="count">将被“{{newStr}}”替换</p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideReplace">取 消</el-button>
      <el-button type="primary" @click="saveReplace">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
export default {
  // props: ["type"],
  data() {
    return {
      type: "",
      dialogFormVisible: false,
      oldStr: "",
      newStr: "",
      replaceType: "Text",
      tablock: true, // 切换锁，防止数据请求的时候，切换报错
      // type: 'campaignName',
      // count: 0,
      appearCount: 0,
      oldInfoList: [],
      newInfoList: [],
      oldTextList: [], // 名称
      newTextList: [],
      oldNameList: [], // 创意标题，仅广告
      newNameList: [],
      oldDescList: [], // 创意文本，仅广告
      newDescList: [],
      oldLinkList: [], // 创意link，仅广告
      newLinkList: [],
      creativeList: [] // 创意列表，仅广告
    };
  },
  methods: {
    typeChange() {
      this.oldStr = "";
      this.newStr = "";

      // 重置数据，之前可能有改动过
      let oldnow = this[`old${this.replaceType}List`];
      let newnow = this[`new${this.replaceType}List`];
      oldnow.forEach((v, i) => {
        v.key = v.old;
        v.name = v.old;
        v.update = i + v.old;
      });
      newnow.forEach((v, i) => {
        v.key = v.old;
        v.name = v.old;
        v.update = i + v.old;
      });
      this.oldInfoList = oldnow;
      this.newInfoList = newnow;
      console.log(this.oldInfoList);
    },
    hideReplace() {
      this.dialogFormVisible = false;
      // 初始化
      this.reset();
      console.log("reset");
    },
    reset() {
      this.replaceType = "Text";

      this.oldInfoList = [];
      this.newInfoList = [];
      this.oldTextList = [];
      this.newTextList = [];
      this.oldNameList = [];
      this.newNameList = [];
      this.oldDescList = [];
      this.newDescList = [];
      this.oldLinkList = [];
      this.newLinkList = [];
      this.creativeList = [];

      this.oldStr = "";
      this.newStr = "";
    },
    async saveReplace() {
      if (!this.oldStr.trim()) {
        Msgwarning("请输入需要替换的内容");
        return;
      }
      if (this.appearCount == 0) {
        Msgwarning("当前输入内容未匹配到相关文本");
        return;
      }
      
      let res;
      // 区分普通查找替换和创意相关查找替换
      if (this.replaceType == "Text") {
        let data = [];
        this.newInfoList.forEach(v => {
          let obj = {
            name: v.key,
            id: v.id
          };

          data.push(obj);
        });

        this.$store.dispatch("seekReplace", {
          data: encodeURIComponent(JSON.stringify(data)),
          type: this.type
        });
      } else {
        let arr = [];
        this.creativeList.forEach(v => {
          /**
           * 20190220 v2.2.1 新增动态创意
           */
          if(v.assetFeedSpec && v.assetFeedSpec != 'null') {
            let active = JSON.parse(v.assetFeedSpec);
            switch (this.replaceType) {
              case "Name":
                arr = this.newNameList.filter(g => g.id == v.fbAdId);
                active['titles'] = arr.map(m => m.key);
                break;
              case "Desc":
                arr = this.newDescList.filter(g => g.id == v.fbAdId);
                active['bodies'] = arr.map(m => m.key);
                break;
              case "Link":
                arr = this.newLinkList.filter(g => g.id == v.fbAdId);
                active['link_urls'][0]['deeplink_url'] = arr[0].key;
                break;
            }
            v.assetFeedSpec = JSON.stringify(active);
          } else {
            switch (this.replaceType) {
              case "Name":
                arr = this.newNameList.filter(g => g.id == v.fbAdId);
                if (v.cards) {
                  let card = JSON.parse(v.cards);
                  card.forEach((m, n) => {
                    m.title = arr[n].key;
                  });
                  v.cards = JSON.stringify(card);
                } else {
                  v.creativityTitle = arr[0].key;
                }
                break;
              case "Desc":
                arr = this.newDescList.filter(g => g.id == v.fbAdId);
                v.creativityText = arr[0].key;
                break;
              case "Link":
                arr = this.newLinkList.filter(g => g.id == v.fbAdId);
                v.platFromUrl = arr[0].key;
                break;
            }
          }
          v.projectId = this.$route.params.id;
        });

        this.$store.dispatch("seekReplaceCreate", {
          option: this.creativeList
        });

        // if (res && res.data) {
        //   let errlist = res.data.filter(v => !v.b);
        //   if (errlist.length == 0) {
        //     Msgsuccess("查找替换创意成功");
        //     // 重置列表数据
        //     this.$emit("resetPageData");
        //   } else {
        //     this.$alert(
        //       `${errlist
        //         .map(
        //           v => `<b style="color: #409eff">${v.fbAdId}</b> ${v.message}`
        //         )
        //         .join("<br/>")}`,
        //       "错误信息",
        //       {
        //         confirmButtonText: "确定",
        //         dangerouslyUseHTMLString: true,
        //         callback: () => {
        //           // 重置列表数据
        //           this.$emit("resetPageData");
        //         }
        //       }
        //     );
        //   }
        // }
      }

      this.dialogFormVisible = false;
      //重置
      this.hideReplace();
    },
    showBox(type, target) {
      this.type = type;
      this.dialogFormVisible = true;
      let idx = 0;
      let creativeArr = [];
      // console.log(target);

      target.forEach(v => {
        let obj = {
          id: v.seekid, // 不同type对应的id
          name: v[this.typeData.namekey], // 主内容
          key: v[this.typeData.namekey], // 显示在title
          old: v[this.typeData.namekey], // 该字段数据用于保存原始数据
          update: idx + v[this.typeData.namekey] // 用来更新列表，解决名称重复问题
        };

        this.oldTextList.push(Object.assign({}, obj));
        this.newTextList.push(Object.assign({}, obj));

        /**
         * 广告复制初始化需要保存额外字段
         * 创意标题，创意文本，创意link
         */
        if (this.type == "adName") {
          let obj = {
            adId: v.seekid,
            creativeId: v.creativeId,
            fbAccountId: v.accountId
          };
          creativeArr.push(obj);
        }
        idx++;
      });
      // 默认名称
      this.oldInfoList = this.oldTextList;
      this.newInfoList = this.newTextList;

      // 广告查找替换，初始化获取该广告下面创意的详情
      if (this.type == "adName") {
        this.creativeDeal(creativeArr);
      }
    },
    async creativeDeal(creativeArr) {
      let creativeId = creativeArr.map(v => v.creativeId).join(",");
      let adId = creativeArr.map(v => v.adId);
      let fbAccountId = creativeArr.map(v => v.fbAccountId);
      // 广告查找替换，初始化获取该广告下面创意的详情
      this.tablock = true;
      let res = await this.$store.dispatch("creativeDetail", {
        creativeId
      });
      this.tablock = false;
      this.creativeList = res.data;

      this.creativeList.forEach((v, i) => {
        // 补充字段
        v.fbAdId = adId[i];
        v.fbAccountId = fbAccountId[i];

        /**
         * @case1 动态创意 内容都在assetFeedSpec字段中（20190220 v2.2.1新增）
         * @case2 轮播创意 轮播创意的标题在cards字段中
         * @case3 普通创意
         */
        if (v.assetFeedSpec && v.assetFeedSpec != 'null') {
          let active = JSON.parse(v["assetFeedSpec"]);
          active.titles.forEach(g => {
            let objName = {
              id: adId[i],
              name: g["text"],
              key: g["text"],
              old: g["text"],
              update: g["text"]
            };
            this.oldNameList.push(Object.assign({}, objName));
            this.newNameList.push(Object.assign({}, objName));
          });
          active.bodies.forEach(g => {
            let objDesc = {
              id: adId[i],
              name: g["text"],
              key: g["text"],
              old: g["text"],
              update: g["text"]
            };
            this.oldDescList.push(Object.assign({}, objDesc));
            this.newDescList.push(Object.assign({}, objDesc));
          });
          let objLink = {
            id: adId[i],
            name: active["link_urls"][0]["deeplink_url"],
            key: active["link_urls"][0]["deeplink_url"],
            old: active["link_urls"][0]["deeplink_url"],
            update: active["link_urls"][0]["deeplink_url"]
          };
          this.oldLinkList.push(Object.assign({}, objLink));
          this.newLinkList.push(Object.assign({}, objLink));
        } else {
          let objName = {
            id: adId[i]
          };
          if (v.cards) {
            let card = JSON.parse(v.cards);
            let sidx = 0;
            card.forEach(g => {
              objName.name = g.title;
              objName.key = g.title;
              objName.old = g.title;
              objName.update = g.title;

              this.oldNameList.push(Object.assign({}, objName));
              this.newNameList.push(Object.assign({}, objName));
            });
          } else {
            objName.name = v.creativityTitle;
            objName.key = v.creativityTitle;
            objName.old = v.creativityTitle;
            objName.update = v.creativityTitle;

            this.oldNameList.push(Object.assign({}, objName));
            this.newNameList.push(Object.assign({}, objName));
          }

          let objDesc = {
            id: adId[i],
            name: v.creativityText,
            key: v.creativityText,
            old: v.creativityText,
            update: v.creativityText
          };
          this.oldDescList.push(Object.assign({}, objDesc));
          this.newDescList.push(Object.assign({}, objDesc));
          let objLink = {
            id: adId[i],
            name: v.platFromUrl,
            key: v.platFromUrl,
            old: v.platFromUrl,
            update: v.platFromUrl
          };
          this.oldLinkList.push(Object.assign({}, objLink));
          this.newLinkList.push(Object.assign({}, objLink));
        }
      });
    },
    filterOld() {
      let oldStr = this.oldStr.replace(/\?/g, "\\?");
      let oldreg = new RegExp(oldStr, "g");
      this.oldInfoList.forEach((v, i) => {
        if(v.old) {
          v.name = v.old.replace(
            oldreg,
            '<span style="color: red;">' + this.oldStr + "</span>"
          );
          v.update = i + v.name;
        }
      });
      this.appearCount = this.oldInfoList.filter(
        v => v.old && v.old.indexOf(this.oldStr) != -1
      ).length;

      if (!this.oldStr) {
        this.newInfoList.forEach((v, i) => {
          v.name = v.old;
          v.key = v.old;
          v.update = i + v.name;
        });
        return;
      }
      this.filterNew();
    },
    filterNew() {
      if (!this.oldStr) {
        return;
      }
      let oldStr = this.oldStr.replace(/\?/g, "\\?");
      let oldreg = new RegExp(oldStr, "g");
      this.newInfoList.forEach((v, i) => {
        if(v.old) {
          v.name = v.old.replace(
            oldreg,
            '<span style="color: red;">' + this.newStr + "</span>"
          );
          v.key = v.old.replace(oldreg, this.newStr);
          v.update = i + v.name;
        }
      });
    }
  },
  computed: {
    typeData() {
      let k = { name: "", effect: "", effectIds: "" };
      switch (this.type) {
        case "campaignName":
          k.name = "广告系列";
          k.namekey = "campaignName";
          break;
        case "adSetName":
          k.name = "广告组";
          k.namekey = "adSetName";
          break;
        case "adName":
          k.name = "广告";
          k.namekey = "adName";
          break;
      }
      return k;
    }
  }
};
</script>

<style lang="less" scoped>
.replaceline {
  overflow: hidden;
  display: flex;
  margin-bottom: 10px;
  .font {
    line-height: 40px;
    flex-basis: 40px;
    width: 40px;
    margin-right: 10px;
    display: block;
    white-space: nowrap;
  }
  .input {
    flex-grow: 1;
    margin-right: 10px;
  }
}
.replacecont {
  margin-bottom: 10px;
}
.articleList {
  display: flex;
  .left {
    flex: 1;
    overflow: hidden;
    // flex-grow: 0;
    // flex-shrink: 0;
    .title {
      font-size: 14px;
      font-weight: bold;
      padding-left: 10px;
      border: 1px solid #e5e5e5;
      line-height: 34px;
      background-color: #fff;
    }
    .count {
      line-height: 20px;
      margin: 8px auto;
      padding-left: 10px;
      font-weight: bold;
    }
    .artlist {
      border: 1px solid #e5e5e5;
      border-top: none;
      height: 300px;
      overflow-y: auto;
      width: 100%;
      p {
        padding-left: 10px;
        padding-right: 10px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
