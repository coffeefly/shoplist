<template>
  <basic-container>
    <template v-if="tableData">
      <p>产品名称：{{ tableData.title }}</p>
      <p>产品价格：￥{{ tableData.price }} 元</p>
      <p>产品编号：{{ tableData.goodsno }}</p>
      <p>品牌名称：{{ tableData.brand }}</p>
      <table
        class="demo-table"
        border
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: 'rgba(103,194,58,.1)' }"
      >
        <thead>
          <tr>
            <th>颜色/尺码</th>
            <template v-for="(item, index) in tableData.sizeList">
              <th :key="index">{{ item }}</th>
            </template>
            <th>小计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in tableData.colorAndSize" :key="key">
            <td>{{ item.color }}</td>
            <template v-for="(childitem, childindex) in preDataList[key]">
              <td :key="childindex">
                <input
                  type="number"
                  v-number-only
                  style="width:50%"
                  @change="changeData($event, key, childindex)"
                  :value="childitem === 0 ? 0 : childitem"
                  :v-model="childitem"
                />
                <span> / {{ item.Inventory[childindex].value }}</span>
              </td>
            </template>
            <td>
              {{
                preDataList[key].reduce((pre, cur) => {
                  return pre + cur;
                })
              }}
            </td>
          </tr>
          <tr v-if="tableData.sizeList">
            <td
              :colspan="tableData.sizeList.length + 2"
              style="text-align:center;"
            >
              总件数:<span>{{ totalNum }}</span
              >, 总金额：￥<span>{{ totalMoney }}</span
              >元。
              <el-button :disabled="totalNum <= 0" type="primary" size="mini"
                >提交订单</el-button
              >
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </basic-container>
</template>

<script>
import BasicContainer from "@vue-materials/basic-container";
export default {
  name: "shopList",
  components: { BasicContainer },
  data() {
    return {
      tableData: {},
      preDataList: [[]],
      totalNum: 0,
      totalMoney: 0
    };
  },
  created() {
    this.getList();
  },
  directives: {
    numberOnly: {
      bind: function(el) {
        el.handler = function() {
          el.value = el.value.replace(/\D+/g, "");
        };
        el.addEventListener("input", el.handler);
      },
      unbind: function(el) {
        el.removeEventListener("input", el.handler);
      }
    }
  },
  methods: {
    //获取详细数据
    getList() {
      this.$axios({
        method: "get",
        url: "/getShopData"
      })
        .then(res => {
          if (res.code === this.GLOBAL.CODE) {
            this.tableData = res.data;
            let sum = 0;
            this.tableData.colorAndSize.map((el, elIndex) => {
              this.preDataList[elIndex] = [];
              el.Inventory.map((item, itemIndex) => {
                this.preDataList[elIndex][itemIndex] = 0;
                sum += item.value;
              });
            });
          } else {
            console.log("获取数据失败");
          }
        })
        .catch(err => {
          console.log("err: ", err);
          console.groupEnd();
        });
    },
    changeData(e, key, childindex) {
      let defaultval = this.tableData.colorAndSize[key].Inventory[childindex]
        .value;
      if (e.target.value === "") {
        e.target.value = defaultval;
      }
      if (e.target.value <= defaultval) {
        this.preDataList[key][childindex] = parseInt(e.target.value);
      }
      let newval = parseInt(e.target.value);
      let tempval = "";
      if (newval > defaultval) {
        this.$alert("不能超过库存数哦！");
      }
      tempval = this.preDataList[key][childindex];
      //计算总额
      this.totalNum = this.preDataList
        .map(el => {
          return el.reduce((pre, cur) => {
            return pre + cur;
          });
        })
        .reduce((pre, cur) => {
          return pre + cur;
        });
      this.totalMoney = this.totalNum * this.tableData.price;
      this.$nextTick(() => {
        e.target.value = tempval;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.demo-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  font-size: 14px;
  th {
    background-color: #e1f0d0;
  }
  td,
  th {
    text-align: left;
    height: 30px;
    line-height: 30px;
    padding-left: 5px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
