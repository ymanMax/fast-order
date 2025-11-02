import * as echarts from '../../ec-canvas';

// 生成随机营业额数据
function generateRevenueData(year) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const data = months.map(() => Math.round(Math.random() * 1000) / 100); // 随机生成0-10万元的营业额数据
  return { months, data };
}

// 生成随机客流量数据
function generateCustomerData(month) {
  const days = Array.from({ length: new Date(2023, month, 0).getDate() }, (_, i) => (i + 1) + '日');
  const data = days.map(() => Math.round(Math.random() * 500)); // 随机生成0-500人的客流量数据
  return { days, data };
}

// 生成随机人物画像数据
function generateProfileData(dimension) {
  let categories, data;
  switch (dimension) {
    case 'gender':
      categories = ['男', '女'];
      data = [Math.round(Math.random() * 60) + 20, Math.round(Math.random() * 60) + 20]; // 随机生成20-80的百分比
      break;
    case 'age':
      categories = ['18岁以下', '18-25岁', '26-35岁', '36-45岁', '46岁以上'];
      data = categories.map(() => Math.round(Math.random() * 30) + 10); // 随机生成10-40的百分比
      break;
    case 'occupation':
      categories = ['学生', '上班族', '自由职业', '退休'];
      data = categories.map(() => Math.round(Math.random() * 40) + 10); // 随机生成10-50的百分比
      break;
    default:
      categories = ['男', '女'];
      data = [50, 50];
  }
  return { categories, data };
}

// 生成随机热销菜品数据
function generateDishesData(month) {
  const dishes = ['宫保鸡丁', '鱼香肉丝', '回锅肉', '麻婆豆腐', '糖醋排骨', '水煮鱼', '红烧肉', '烤鸭'];
  const data = dishes.map(() => Math.round(Math.random() * 200)); // 随机生成0-200份的销售量
  return { dishes, data };
}

Page({
  data: {
    // 营业额统计
    ecRevenue: null,
    revenueChart: null,
    revenueYears: [2020, 2021, 2022, 2023, 2024],
    selectedRevenueYear: 2023,
    
    // 客流量统计
    ecCustomer: null,
    customerChart: null,
    customerMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    selectedCustomerMonth: 0,
    
    // 人物画像
    ecProfile: null,
    profileChart: null,
    profileMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    selectedProfileMonth: 0,
    profileDimensions: ['性别', '年龄', '职业'],
    selectedProfileDimension: 0,
    
    // 热销菜品
    ecDishes: null,
    dishesChart: null,
    dishesMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    selectedDishesMonth: 0,
  },

  // 页面加载时初始化图表
  onLoad() {
    // 初始化营业额图表
    this.setData({
      ecRevenue: {
        onInit: (canvas, width, height) => {
          const chart = echarts.init(canvas, null, { width, height });
          const { months, data } = generateRevenueData(this.data.selectedRevenueYear);
          const option = {
            title: { text: '营业额趋势' },
            tooltip: { trigger: 'axis', formatter: '{b}: {c}万元' },
            xAxis: { type: 'category', data: months },
            yAxis: { type: 'value', name: '万元' },
            series: [{ data, type: 'line', smooth: true }]
          };
          chart.setOption(option);
          this.setData({ revenueChart: chart });
          return chart;
        }
      }
    });

    // 初始化客流量图表
    this.setData({
      ecCustomer: {
        onInit: (canvas, width, height) => {
          const chart = echarts.init(canvas, null, { width, height });
          const { days, data } = generateCustomerData(this.data.selectedCustomerMonth);
          const option = {
            title: { text: '客流量统计' },
            tooltip: { trigger: 'axis', formatter: '{b}: {c}人' },
            xAxis: { type: 'category', data: days, axisLabel: { rotate: 45 } },
            yAxis: { type: 'value', name: '人' },
            series: [{ data, type: 'bar' }]
          };
          chart.setOption(option);
          this.setData({ customerChart: chart });
          return chart;
        }
      }
    });

    // 初始化人物画像图表
    this.setData({
      ecProfile: {
        onInit: (canvas, width, height) => {
          const chart = echarts.init(canvas, null, { width, height });
          const { categories, data } = generateProfileData(['gender', 'age', 'occupation'][this.data.selectedProfileDimension]);
          const option = {
            title: { text: '用户分布' },
            tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
            legend: { orient: 'vertical', right: 10, data: categories },
            series: [{ name: '分布', type: 'pie', radius: '50%', data: categories.map((name, i) => ({ name, value: data[i] })) }]
          };
          chart.setOption(option);
          this.setData({ profileChart: chart });
          return chart;
        }
      }
    });

    // 初始化热销菜品图表
    this.setData({
      ecDishes: {
        onInit: (canvas, width, height) => {
          const chart = echarts.init(canvas, null, { width, height });
          const { dishes, data } = generateDishesData(this.data.selectedDishesMonth);
          const option = {
            title: { text: '热销菜品' },
            tooltip: { trigger: 'axis', formatter: '{b}: {c}份' },
            xAxis: { type: 'category', data: dishes, axisLabel: { rotate: 45 } },
            yAxis: { type: 'value', name: '份' },
            series: [{ data, type: 'bar' }]
          };
          chart.setOption(option);
          this.setData({ dishesChart: chart });
          return chart;
        }
      }
    });
  },

  // 营业额年份选择变化
  onRevenueYearChange(e) {
    this.setData({ selectedRevenueYear: this.data.revenueYears[e.detail.value] });
    this.updateRevenueChart();
  },

  // 更新营业额图表
  updateRevenueChart() {
    if (this.data.revenueChart) {
      const { months, data } = generateRevenueData(this.data.selectedRevenueYear);
      this.data.revenueChart.setOption({ xAxis: { data: months }, series: [{ data }] });
    }
  },

  // 客流量月份选择变化
  onCustomerMonthChange(e) {
    this.setData({ selectedCustomerMonth: e.detail.value });
    this.updateCustomerChart();
  },

  // 更新客流量图表
  updateCustomerChart() {
    if (this.data.customerChart) {
      const { days, data } = generateCustomerData(this.data.selectedCustomerMonth);
      this.data.customerChart.setOption({ xAxis: { data: days }, series: [{ data }] });
    }
  },

  // 人物画像月份选择变化
  onProfileMonthChange(e) {
    this.setData({ selectedProfileMonth: e.detail.value });
    this.updateProfileChart();
  },

  // 人物画像维度选择变化
  onProfileDimensionChange(e) {
    this.setData({ selectedProfileDimension: e.detail.value });
    this.updateProfileChart();
  },

  // 更新人物画像图表
  updateProfileChart() {
    if (this.data.profileChart) {
      const { categories, data } = generateProfileData(['gender', 'age', 'occupation'][this.data.selectedProfileDimension]);
      this.data.profileChart.setOption({ legend: { data: categories }, series: [{ data: categories.map((name, i) => ({ name, value: data[i] })) }] });
    }
  },

  // 热销菜品月份选择变化
  onDishesMonthChange(e) {
    this.setData({ selectedDishesMonth: e.detail.value });
    this.updateDishesChart();
  },

  // 更新热销菜品图表
  updateDishesChart() {
    if (this.data.dishesChart) {
      const { dishes, data } = generateDishesData(this.data.selectedDishesMonth);
      this.data.dishesChart.setOption({ xAxis: { data: dishes }, series: [{ data }] });
    }
  },

  // 页面卸载时销毁图表
  onUnload() {
    if (this.data.revenueChart) this.data.revenueChart.dispose();
    if (this.data.customerChart) this.data.customerChart.dispose();
    if (this.data.profileChart) this.data.profileChart.dispose();
    if (this.data.dishesChart) this.data.dishesChart.dispose();
  }
});