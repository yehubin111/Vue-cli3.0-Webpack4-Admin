<template>
  <div class="rulelist" id="createList">
    <div class="box" v-for="(l, index) in createlist" :key="index">
      <div class="con">
        <p class="master">
          <span class="logo"><img :src="l.pageLogo" alt=""></span>
          <span class="name">{{l.pageName}}</span>
        </p> 
        <p class="describe"><pre>{{l.creativityText}}</pre></p>

        <el-carousel v-if="l.creativityType == 2" arrow="never" indicator-position="none">
          <el-carousel-item v-for="(crd, index) in l.card" :key="index">
            <p class="img">
              <img v-if="crd.cardType == 1" @click="showBigImg(crd.image.imageUrl)" :src="crd.image.imageUrl" alt="">
              <video v-else :src="crd.video.videoUrl" controls="controls"></video>
            </p>
            <div class="imginfo">
              <p class="ititle">
                <span :title="crd.cardTitle">{{crd.cardTitle}}</span>
              </p>
              <el-button class="ibutton" type="primary" round size="small">{{l.actionCallOnName}}</el-button>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div v-else-if="l.creativityType == 0">
          <p class="img">
            <img @click="showBigImg(l.img)" :src="l.img" alt="">
          </p>
          <div class="imginfo">
            <p class="ititle">
              <span :title="l.creativityTitle">{{l.creativityTitle}}</span>
            </p>
            <el-button class="ibutton" type="primary" round size="small">{{l.actionCallOnName}}</el-button>
          </div>
        </div>
        <div v-else>
          <p class="img">
            <video :src="l.video" controls="controls"></video>
          </p>
          <div class="imginfo">
            <p class="ititle">
              <span :title="l.creativityTitle">{{l.creativityTitle}}</span>
            </p>
            <el-button class="ibutton" type="primary" round size="small">{{l.actionCallOnName}}</el-button>
          </div>
        </div>

      </div>
      <div class="other">
        <!-- <p class="cytitle">
          <i class="el-icon-edit" @click="toChangeName(l.id, l.creativityName)"></i>{{l.creativityName}}</p> -->
        <p class="country">
          <span>
            <i class="el-icon-edit" @click="toChangeCountry(l.id, l.countryId)"></i>{{l.countryId}}</span>
        </p>
        <p>ID：{{l.id}}
          <span :class="{class: true, noclassify: !l.classify}">{{l.classify}}</span>
        </p>
        <p class="name">
          <span class="binfo">{{l.creater}} {{l.createTime | timeFormat('yyyy-MM-dd HH:mm:ss', l.createTime)}}</span>
          <span class="mutli">
            <el-checkbox v-model="createchecked[index]"></el-checkbox>
          </span>
          <span class="select">
            <el-select class="sex" size="mini" v-model="l.sex" placeholder="请选择" @change="updateSex(l.id, l.sex)">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </span>
        </p>
        <p class="switch">
          <el-switch v-model="l.status" @change="toOpenClose(l.id, l.status)" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#d7dae2">
          </el-switch>
        </p>
      </div>
    </div>
    <transition name="fade">
      <div class="imgDetail" @click="hideBigImg" v-show="originImg != ''">
        <img :src="originImg" alt="">
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      //   checked: false,
      originImg: "",
      options: [
        {
          value: "1,2",
          label: "all"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ]
    };
  },
  computed: {
    ...mapState(["createlist", "createchecked"])
  },
  methods: {
    hideBigImg() {
      this.originImg = "";
    },
    showBigImg(img) {
      this.originImg = `${img}`; //http://172.31.1.45
    },
    toChangeCountry(id, country) {
      this.$emit("changeCountry", id, country);
    },
    toChangeName(id, name) {
      this.$emit("changeName", id, name);
    },
    updateSex(id, sex) {
      this.$store.dispatch("updateSex", { id, sex });
    },
    toOpenClose(id, status) {
      let option = [];
      option.push({
        id: id,
        status: status
      });

      if (status == 1) this.$store.dispatch("openCreate", { option });
      else this.$store.dispatch("closeCreate", { option });
    }
  }
};
</script>
<style lang="less">
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  // background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  // background-color: #d3dce6;
}

.el-carousel__container{
  height: 273px !important;
}
</style>

<style lang="less" scoped>
.rulelist {
  overflow: hidden;
  margin-right: -15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-bottom: 50px;
  width: 100%;
  .imgDetail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 998;
    background-color: rgba(0, 0, 0, 0.5);
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .box {
    box-sizing: border-box;
    // padding: 0 0 30px 0;
    .con {
      //   height: 200px;
      border: 1px solid #e6e6e6;
      box-sizing: border-box;
      position: relative;
      margin-bottom: 10px;
      .master {
        overflow: hidden;
        margin: 20px 0 15px 20px;
        span {
          float: left;
          &.logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
            img {
              width: 100%;
            }
          }
          &.name {
            line-height: 40px;
            font-size: 14px;
            font-weight: bold;
            height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .describe {
        margin-left: 20px;
        margin-right: 20px;
        height: 60px;
        margin-bottom: 10px;
        // text-overflow: ellipsis;
        overflow: hidden;
        // white-space: nowrap;
        line-height: 20px;
        font-size: 12px;
        text-align: justify;
        color: #999;
        pre{
          font-family: arial,microsoft yahei,tahoma,sans-serif;
          line-height: 20px;
          font-size: 12px;
          text-align: justify;
          color: #999;
          white-space: pre-wrap;
        }
      }
      .img {
        margin: 0 20px;
        height: 200px;
        overflow: hidden;
        background-color: #f5f5f5;
        position: relative;
        img {
          height: 100%;
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
        }
        video {
          width: 100%;
          height: 100%;
        }
      }
      .imginfo {
        overflow: hidden;
        margin: 0 20px 20px 20px;
        border: 1px solid #f5f5f5;
        border-top: none;
        padding: 10px;
        .ititle {
          float: left;
          font-size: 14px;
          width: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-content: center;
          height: 32px;
          span {
            // height: 32px;
            overflow: hidden;
            line-height: 16px;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          }
        }
        .ibutton {
          float: right;
          width: 120px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .other {
      margin: 0 21px;
      position: relative;
      .cytitle {
        font-size: 14px;
        font-weight: bold;
        line-height: 24px;
        max-width: 60%;
        height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        padding-right: 20px;
        display: inline-block;
        i {
          position: absolute;
          right: 0;
          font-size: 16px;
          line-height: 24px;
          display: block;
          color: #999;
          cursor: pointer;
        }
      }
      .country {
        margin-bottom: 3px;
        span {
          display: inline-block;
          position: relative;
          padding-right: 20px;
          i {
            position: absolute;
            right: 0;
            font-size: 16px;
            line-height: 18px;
            display: block;
            color: #999;
            cursor: pointer;
          }
        }
      }
      .name {
        color: #999;
        line-height: 20px;
        height: 20px;
        .binfo {
          float: left;
        }
        .select {
          float: right;
          margin-top: -4px;
          margin-right: 5px;
          .sex {
            width: 52px;
          }
        }
        .mutli {
          float: right;
        }
      }
      .switch {
        position: absolute;
        right: 0;
        bottom: 33px;
      }
      .class {
        line-height: 26px;
        background-color: #f5f5f5;
        padding: 0 10px;
        border-radius: 5px;
        display: inline-block;
        margin-bottom: 10px;
        margin-left: 10px;
        &.noclassify {
          height: 26px;
          background-color: #fff;
          display: block;
        }
      }
    }
  }
}
</style>
