// 模拟数据生成函数
function generateMockData() {
    const sectors = [
        { name: '半导体', code: '半导体' },
        { name: '新能源汽车', code: '新能源汽车' },
        { name: '光伏', code: '光伏' },
        { name: '锂电池', code: '锂电池' },
        { name: '化工', code: '化工' },
        { name: '有色', code: '有色' },
        { name: '医药', code: '医药' },
        { name: '消费', code: '消费' },
        { name: '金融', code: '金融' },
        { name: '房地产', code: '房地产' },
        { name: '沪深300', code: '沪深300' },
        { name: '中证1000', code: '中证1000' },
        { name: '军工', code: '军工' },
        { name: '互联网', code: '互联网' },
        { name: '农业', code: '农业' }
    ];
    
    const stocks = {
        '半导体': [
            { code: '600703', name: '三安光电' },
            { code: '300782', name: '卓胜微' },
            { code: '300458', name: '全志科技' },
            { code: '300661', name: '圣邦股份' }
        ],
        '新能源汽车': [
            { code: '002594', name: '比亚迪' },
            { code: '601799', name: '星宇股份' },
            { code: '002460', name: '赣锋锂业' },
            { code: '300750', name: '宁德时代' }
        ],
        '光伏': [
            { code: '600586', name: '金晶科技' },
            { code: '000012', name: '南玻A' },
            { code: '601012', name: '隆基绿能' },
            { code: '300274', name: '阳光电源' }
        ],
        '锂电池': [
            { code: '300750', name: '宁德时代' },
            { code: '002460', name: '赣锋锂业' },
            { code: '002466', name: '天齐锂业' },
            { code: '300014', name: '亿纬锂能' }
        ]
    };
    
    // 生成各时间周期的资金数据
    function generateFundData(timeRange) {
        const data = [];
        sectors.forEach(sector => {
            const fundFlow = (Math.random() - 0.5) * 20;
            const northFund = (Math.random() - 0.5) * 10;
            const marginTrading = (Math.random() - 0.5) * 8;
            const etfFund = (Math.random() - 0.5) * 5;
            const largeOrder = (Math.random() - 0.5) * 15;
            const l2Data = (Math.random() - 0.5) * 12;
            
            // 计算强度指标
            const strength = Math.round((Math.random() - 0.3) * 100);
            
            data.push({
                name: sector.name,
                code: sector.code,
                fund_flow: parseFloat(fundFlow.toFixed(2)),
                north_fund: parseFloat(northFund.toFixed(2)),
                margin_trading: parseFloat(marginTrading.toFixed(2)),
                etf_fund: parseFloat(etfFund.toFixed(2)),
                large_order: parseFloat(largeOrder.toFixed(2)),
                l2_data: parseFloat(l2Data.toFixed(2)),
                strength: strength,
                ratio: parseFloat((Math.abs(fundFlow) / 100 * 100).toFixed(2))
            });
        });
        return data;
    }
    
    // 生成股票数据
    function generateStockData(sector, timeRange) {
        const sectorStocks = stocks[sector] || [];
        return sectorStocks.map(stock => {
            const fundFlow = (Math.random() - 0.5) * 5;
            const largeOrder = (Math.random() - 0.5) * 3;
            const l2Data = (Math.random() - 0.5) * 2;
            const strength = Math.round((Math.random() - 0.3) * 100);
            
            return {
                code: stock.code,
                name: stock.name,
                fund_flow: parseFloat(fundFlow.toFixed(2)),
                large_order: parseFloat(largeOrder.toFixed(2)),
                l2_data: parseFloat(l2Data.toFixed(2)),
                strength: strength
            };
        });
    }
    
    return {
        sectors: sectors,
        stocks: stocks,
        getSectorData: generateFundData,
        getStockData: generateStockData
    };
}

// 数据可视化函数
class FundFlowVisualizer {
    constructor() {
        this.mockData = generateMockData();
        this.currentSector = null;
        this.initCharts();
        this.bindEvents();
        this.renderMarketData();
        this.renderSectorData();
    }
    
    initCharts() {
        this.marketChart = echarts.init(document.getElementById('market-chart'));
        this.sectorChart = echarts.init(document.getElementById('sector-chart'));
        this.stockChart = echarts.init(document.getElementById('stock-chart'));
    }
    
    bindEvents() {
        // 大盘资金流向事件绑定
        document.getElementById('market-time-range').addEventListener('change', () => {
            this.renderMarketData();
        });
        
        document.getElementById('market-sort').addEventListener('change', () => {
            this.renderMarketData();
        });
        
        // 概念板块事件绑定
        document.getElementById('sector-time-range').addEventListener('change', () => {
            this.renderSectorData();
        });
        
        document.getElementById('sector-sort').addEventListener('change', () => {
            this.renderSectorData();
        });
        
        document.getElementById('sector-indicator').addEventListener('change', () => {
            this.renderSectorData();
        });
        
        document.getElementById('sector-filter').addEventListener('input', () => {
            this.renderSectorData();
        });
        
        // 股票详情事件绑定
        document.getElementById('stock-time-range').addEventListener('change', () => {
            if (this.currentSector) {
                this.renderStockData(this.currentSector);
            }
        });
    }
    
    // 渲染大盘资金流向数据
    renderMarketData() {
        const timeRange = parseInt(document.getElementById('market-time-range').value);
        const sortBy = document.getElementById('market-sort').value;
        
        let data = this.mockData.getSectorData(timeRange);
        
        // 排序
        data.sort((a, b) => {
            return b[sortBy] - a[sortBy];
        });
        
        // 绘制图表
        this.renderBarChart(this.marketChart, data, 'fund_flow', '大盘资金流向', '资金净流入(亿元)');
        
        // 渲染表格
        this.renderMarketTable(data);
    }
    
    // 渲染概念板块数据
    renderSectorData() {
        const timeRange = parseInt(document.getElementById('sector-time-range').value);
        const sortBy = document.getElementById('sector-sort').value;
        const indicator = document.getElementById('sector-indicator').value;
        const filter = document.getElementById('sector-filter').value.toLowerCase();
        
        let data = this.mockData.getSectorData(timeRange);
        
        // 筛选
        data = data.filter(item => item.name.toLowerCase().includes(filter));
        
        // 排序
        data.sort((a, b) => {
            return b[sortBy] - a[sortBy];
        });
        
        // 绘制图表
        this.renderBarChart(this.sectorChart, data, 'fund_flow', '概念板块资金流向', '资金净流入(亿元)');
        
        // 渲染表格
        this.renderSectorTable(data);
    }
    
    // 渲染股票数据
    renderStockData(sector) {
        this.currentSector = sector;
        const timeRange = parseInt(document.getElementById('stock-time-range').value);
        
        const data = this.mockData.getStockData(sector, timeRange);
        
        // 绘制图表
        this.renderBarChart(this.stockChart, data, 'fund_flow', `${sector}成分股资金流向`, '资金净流入(亿元)');
        
        // 渲染表格
        this.renderStockTable(data);
        
        // 显示详情区域
        document.getElementById('stock-analysis-section').style.display = 'block';
    }
    
    // 绘制柱状图
    renderBarChart(chart, data, valueField, title, yAxisName) {
        const names = data.map(item => item.name);
        const values = data.map(item => item[valueField]);
        
        const colors = values.map(value => value > 0 ? '#dc3545' : '#28a745');
        
        const option = {
            title: {
                text: title,
                left: 'center',
                textStyle: {
                    color: '#0056b3',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const data = params[0];
                    return `${data.name}<br/>${yAxisName}: ${data.value}亿元`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: names,
                axisLabel: {
                    interval: 0,
                    rotate: 45,
                    fontSize: 10
                }
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameTextStyle: {
                    fontSize: 12
                }
            },
            series: [{
                data: values,
                type: 'bar',
                itemStyle: {
                    color: function(params) {
                        return colors[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}亿',
                    fontSize: 9
                }
            }]
        };
        
        chart.setOption(option);
    }
    
    // 渲染大盘资金流向表格
    renderMarketTable(data) {
        const tbody = document.getElementById('market-table-body');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td class="${item.fund_flow >= 0 ? 'positive' : 'negative'}">${item.fund_flow}</td>
                <td>${item.ratio}%</td>
                <td class="${item.north_fund >= 0 ? 'positive' : 'negative'}">${item.north_fund}</td>
                <td class="${item.margin_trading >= 0 ? 'positive' : 'negative'}">${item.margin_trading}</td>
                <td class="${item.etf_fund >= 0 ? 'positive' : 'negative'}">${item.etf_fund}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // 渲染概念板块表格
    renderSectorTable(data) {
        const tbody = document.getElementById('sector-table-body');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td class="${item.fund_flow >= 0 ? 'positive' : 'negative'}">${item.fund_flow}</td>
                <td class="${item.large_order >= 0 ? 'positive' : 'negative'}">${item.large_order}</td>
                <td class="${item.l2_data >= 0 ? 'positive' : 'negative'}">${item.l2_data}</td>
                <td>${item.strength}</td>
                <td><button class="btn btn-sm btn-primary" onclick="visualizer.renderStockData('${item.name}')">查看成分股</button></td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // 渲染股票表格
    renderStockTable(data) {
        const tbody = document.getElementById('stock-table-body');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td class="${item.fund_flow >= 0 ? 'positive' : 'negative'}">${item.fund_flow}</td>
                <td class="${item.large_order >= 0 ? 'positive' : 'negative'}">${item.large_order}</td>
                <td class="${item.l2_data >= 0 ? 'positive' : 'negative'}">${item.l2_data}</td>
                <td>${item.strength}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// 页面加载完成后初始化
let visualizer;
document.addEventListener('DOMContentLoaded', () => {
    visualizer = new FundFlowVisualizer();
    
    // 监听窗口大小变化，调整图表尺寸
    window.addEventListener('resize', () => {
        if (visualizer) {
            visualizer.marketChart.resize();
            visualizer.sectorChart.resize();
            visualizer.stockChart.resize();
        }
    });
});

// 强度指标计算函数
function calculateStrength(stockData, indexData) {
    // 这里实现强度指标的计算逻辑
    // XXX1:=1.5;
    // A11:=(C-REF(C,1))/C;
    // B11:=(INDEXC-REF(INDEXC,1))/INDEXC;
    // D11:=(A11-B11)*100;
    // VAR1000:=A11>0 AND B11>0;
    // VAR2000:=A11>0 AND B11<0;
    // VAR3000:=A11<0 AND B11>0;
    // VAR4000:=A11<0 AND B11<0;
    // E:=EMA(MA(D11,5),3);
    // 强度:=100*SMA(MAX(D11,0),12,1)/SMA(ABS(D11),12,1)-5;
    
    return Math.round(Math.random() * 100); // 模拟计算结果
}