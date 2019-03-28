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
            <template v-for="(childitem, childindex) in item.Inventory">
              <td :key="childindex">
                <input
                  type="number"
                  v-number-only
                  @input="inputChange(childitem, $event, key, childindex)"
                  @change="changeData(childitem, $event, key, childindex)"
                  :value="childitem.value"
                  :v-model="childitem.value"
                />
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
      colorAndSize: [],
      preDataList: [[]],
      totalNum: 0,
      totalMoney: 0,
      total: 0
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
            this.colorAndSize = this.tableData.colorAndSize;
            let sum = 0;
            this.tableData.colorAndSize.map((el, elIndex) => {
              this.preDataList[elIndex] = [];
              el.Inventory.map((item, itemIndex) => {
                this.preDataList[elIndex][itemIndex] = item.value;
                sum += item.value;
              });
            });
            this.totalNum = sum;
            this.total = sum;
            this.totalMoney = sum * this.tableData.price;
          } else {
            console.log("获取数据失败");
          }
        })
        .catch(err => {
          console.log("err: ", err);
          console.groupEnd();
        });
    },
    //输入框事件
    inputChange(defaultval, e, key, childindex) {
      if (e.target.value <= defaultval.value) {
        this.preDataList[key][childindex] = parseInt(e.target.value);
      }
    },
    changeData(defaultval, e, key, childindex) {
      console.log(e.target.value === "");
      if (e.target.value === "") {
      }
      let newval = parseInt(e.target.value);
      console.log(newval > defaultval.value, newval, defaultval.value);
      if (newval > defaultval.value) {
        //计算总额
        this.totalNum =
          this.total -
          defaultval.value +
          parseInt(this.preDataList[key][childindex]);
        this.$alert("不能超过库存数哦！");
      } else {
        this.totalNum = this.total - defaultval.value + newval;
      }
      this.totalMoney = this.totalNum + this.tableData.price;
      this.$nextTick(() => {
        e.target.value = parseInt(this.preDataList[key][childindex]);
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
}
</style>
