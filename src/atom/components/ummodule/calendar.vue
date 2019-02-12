<template>
  <div class="calendar">
    <div class="nowdate">
      <span class="leftctrl">
        <i class="el-icon-d-arrow-left" @click="setYear(-1)"></i>
        <i class="el-icon-arrow-left" @click="setMonth(-1)"></i>
      </span>
      {{year}}年{{month}}月
      <span class="rightctrl">
        <i class="el-icon-arrow-right" @click="setMonth(1)"></i>
        <i class="el-icon-d-arrow-right" @click="setYear(1)"></i>
      </span>
    </div>
    <div class="week">
      <p v-for="(week, index) in week" :key="index">{{week}}</p>
    </div>
    <div class="day">
      <ul v-for="(line, index) in day" :key="index">
        <li
          :class="{'prev-day': day.key=='prev','next-day': day.key=='next', 'day-on': day.key=='on'}"
          v-for="(day, idx) in line"
          :key="idx"
        >
          <span>{{day.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["dayOn", "disabledDate"],
  data() {
    return {
      monthday: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      week: ["日", "一", "二", "三", "四", "五", "六"],
      day: []
    };
  },
  mounted() {
    // this.setDay();
    // console.log(1);
  },
  watch: {
    dayOn(n, o) {
      this.setDay();
    }
  },
  methods: {
    setYear(count) {
      this.year += count;
      this.monthChange();
      this.setDay();
    },
    setMonth(count) {
      this.month += count;
      if (this.month == 13) {
        this.month = 1;
        this.year++;
      }
      if (this.month == 0) {
        this.month = 12;
        this.year--;
      }
      this.monthChange();
      this.setDay();
    },
    monthChange() {
      this.$emit("monthChange", this.year, this.month);
    },
    reset() {
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth() + 1;
    },
    setDay() {
      let dayarr = [];
      // 当前月份天数
      let nowcountarr = this.getMonthDaycount(this.year, this.month);
      let nowcount = nowcountarr[0];
      // 上个月天数
      let prevcountarr = this.getMonthDaycount(this.year, this.month - 1);
      let prevcount = prevcountarr[0];
      // 下个月天数
      let nextcountarr = this.getMonthDaycount(this.year, this.month + 1);
      // 需要高亮的日期
      let nowon = [],
        prevon = [],
        nexton = [];
      if (Array.isArray(this.dayOn)) {
        this.dayOn.forEach(v => {
          let ar = v.split("-");
          if (ar[0] == nowcountarr[1] && ar[1] == nowcountarr[2]) {
            nowon.push(v);
          }
          if (ar[0] == prevcountarr[1] && ar[1] == prevcountarr[2]) {
            prevon.push(v);
          }
          if (ar[0] == nextcountarr[1] && ar[1] == nextcountarr[2]) {
            nexton.push(v);
          }
        });
      }
      // 如果有特殊情况需要置灰的
      let disabledArr = [];
      if (this.disabledDate) {
        disabledArr = this.disabledDate.split("-");
      }
      while (nowcount > 0) {
        let obj = {
          name: nowcount,
          key: "",
          year: nowcountarr[1],
          month: nowcountarr[2]
        };

        switch (true) {
          case nowcountarr[1] > disabledArr[0]:
          case nowcountarr[1] == disabledArr[0] &&
            nowcountarr[2] > disabledArr[1]:
          case nowcountarr[1] == disabledArr[0] &&
            nowcountarr[2] == disabledArr[1] &&
            nowcount >= disabledArr[2]:
            obj.key = "next";
            break;
          default:
            obj.key = "now";
            break;
        }

        obj.key = nowon.find(v => v.split("-")[2] == nowcount) ? "on" : obj.key;
        dayarr.unshift(obj);
        nowcount--;
      }
      // 保存当月天数日期
      this.monthday = dayarr.slice(0);
      //   console.log(dayarr);
      // 本月第一天星期
      let firstday = this.getDayWeek(this.year, this.month, 1);
      // 向前补充天数
      while (firstday > 0) {
        dayarr.unshift({
          name: prevcount,
          key: prevon.find(v => v.split("-")[2] == prevcount) ? "on" : "prev",
          year: prevcountarr[1],
          month: prevcountarr[2]
        });
        prevcount--;
        firstday--;
      }
      //   console.log(dayarr);
      // 向后补充天数
      let t = 1;
      while (dayarr.length % 7 > 0) {
        dayarr.push({
          name: t,
          key: nexton.find(v => v.split("-")[2] == t) ? "on" : "next",
          year: nextcountarr[1],
          month: nextcountarr[2]
        });
        t++;
      }
      //   console.log(dayarr);
      // 每7天分割
      this.day = [];
      for (let i = 0; i < dayarr.length; i += 7) {
        this.day.push(dayarr.slice(i, i + 7));
      }
    },
    getMonthDaycount(year, month) {
      // 获取当前月份下一个月的第0天，即当前月份的最后一天，也就是天数
      let d = new Date(year, month, 0);
      return [d.getDate(), d.getFullYear(), d.getMonth() + 1];
    },
    getDayWeek(year, month, day) {
      // 获取星期，0为周日
      let d = new Date(year, month - 1, day);
      return d.getDay();
    }
  }
};
</script>

<style lang="less" scoped>
.calendar {
  width: 100%;
  border: 1px solid #ebebeb;
  max-width: 300px;
  min-width: 240px;
  padding: 10px 15px;
  .nowdate {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    position: relative;
    .leftctrl {
      position: absolute;
      left: 0;
      font-size: 14px;
      cursor: pointer;
    }
    .rightctrl {
      position: absolute;
      right: 0;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .week {
    display: flex;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    p {
      flex: 1;
      text-align: center;
      font-size: 12px;
    }
  }
  .day {
    width: 100%;
    ul {
      width: 100%;
      display: flex;
      li {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: pointer;
        height: 40px;
        &.prev-day {
          color: #c0c4cc;
        }
        &.next-day {
          color: #c0c4cc;
        }
        &.day-on {
          span {
            display: inline-block;
            text-align: center;
            line-height: 26px;
            border-radius: 50%;
            width: 26px;
            height: 26px;
            background-color: #409eff;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
