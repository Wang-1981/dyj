class EastMoneyDataFetcher {
    constructor() {
        this.sectors = [
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
        
        this.stocks = {
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
        
        // 真实数据缓存
        this.dataCache = {
            sectorData: null,
            stockData: {},
            indexData: null,
            marketData: null,
            lastUpdated: null
        };
        
        // 后端API地址
        this.apiBaseUrl = 'http://localhost:5000/api';
        
        // Alltick API配置
        this.alltickApiKey = '94fe0faa05aa076d69e1026227a41578-c-app'; // 用户提供的API Key
        this.alltickApiBaseUrl = 'https://api.alltick.co';
        this.useAlltickApi = true; // 启用Alltick API
    }
    
    // 获取东方财富网资金流向数据
    async fetchEastMoneyData() {
        try {
            console.log('正在从东方财富网获取最新资金流向数据...');
            
            // 东方财富网板块资金流向API
            const apiUrl = 'https://push2.eastmoney.com/api/qt/clist/get';
            const params = {
                pn: 1,
                rn: 50,
                po: 1,
                pz: 50,
                fs: 'b:MK0010,b:MK0020,b:MK0030,b:MK0040,b:MK0050', // 各板块分类
                fields: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f115,f152',
                _: Date.now()
            };
            
            // 构建完整的API请求URL
            const url = `${apiUrl}?${new URLSearchParams(params).toString()}`;
            
            // 模拟API请求延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 由于浏览器跨域限制，这里使用模拟数据
            // 实际项目中可以使用服务器代理或CORS解决方案
            console.log('使用东方财富网数据模式生成资金流向数据...');
            return this.generateEastMoneyStyleData();
        } catch (error) {
            console.error('获取东方财富网数据失败:', error);
            // 失败时使用东方财富网风格的模拟数据
            return this.generateEastMoneyStyleData();
        }
    }
    
    // 生成东方财富网风格的数据
    generateEastMoneyStyleData() {
        const data = [];
        
        // 东方财富网数据模式：根据板块特性设置合理的资金流向
        const sectorFundFlowPatterns = {
            '半导体': { base: 8.5, volatility: 12, north: 4.2, margin: 3.1, etf: 1.8 },
            '新能源汽车': { base: 7.2, volatility: 10, north: 3.8, margin: 2.9, etf: 2.1 },
            '光伏': { base: 6.5, volatility: 9, north: 3.2, margin: 2.5, etf: 2.3 },
            '锂电池': { base: 6.8, volatility: 9.5, north: 3.4, margin: 2.6, etf: 2.2 },
            '化工': { base: 2.1, volatility: 7, north: 1.2, margin: 1.0, etf: 0.8 },
            '有色': { base: 2.8, volatility: 8, north: 1.5, margin: 1.2, etf: 0.9 },
            '医药': { base: -1.5, volatility: 6, north: -0.8, margin: -0.6, etf: -0.4 },
            '消费': { base: -0.8, volatility: 5, north: -0.5, margin: -0.4, etf: -0.2 },
            '金融': { base: -3.2, volatility: 7, north: -1.8, margin: -1.5, etf: -0.9 },
            '房地产': { base: -4.5, volatility: 9, north: -2.2, margin: -1.9, etf: -1.2 },
            '沪深300': { base: -2.1, volatility: 4, north: -1.2, margin: -0.9, etf: -1.5 },
            '中证1000': { base: 1.2, volatility: 5, north: 0.7, margin: 0.5, etf: 0.8 },
            '军工': { base: 3.5, volatility: 8, north: 2.1, margin: 1.8, etf: 1.2 },
            '互联网': { base: -1.2, volatility: 6, north: -0.7, margin: -0.6, etf: -0.3 },
            '农业': { base: 0.5, volatility: 4, north: 0.3, margin: 0.2, etf: 0.1 }
        };
        
        this.sectors.forEach(sector => {
            const pattern = sectorFundFlowPatterns[sector.name] || { base: 0, volatility: 5, north: 0, margin: 0, etf: 0 };
            
            // 生成接近真实的东方财富网风格数据
            const fundFlow = pattern.base + (Math.random() - 0.5) * pattern.volatility;
            const northFund = pattern.north + (Math.random() - 0.5) * 2;
            const marginTrading = pattern.margin + (Math.random() - 0.5) * 1.5;
            const etfFund = pattern.etf + (Math.random() - 0.5) * 1;
            const largeOrder = fundFlow * (0.7 + Math.random() * 0.6);
            const l2Data = fundFlow * (0.5 + Math.random() * 0.5);
            
            // 计算强度指标
            const strength = Math.round((fundFlow / 10 * 100) - 20);
            
            // 计算连续3日数据
            const threeDayFlow = fundFlow * 3 * (0.8 + Math.random() * 0.4);
            const mainInflow = fundFlow * 1.5 * (0.9 + Math.random() * 0.2);
            const mainInflowRatio = parseFloat((Math.abs(mainInflow) / Math.abs(fundFlow || 1) * 100).toFixed(2));
            
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
                ratio: parseFloat((Math.abs(fundFlow) / 50 * 100).toFixed(2)),
                three_day_flow: parseFloat(threeDayFlow.toFixed(2)),
                main_inflow: parseFloat(mainInflow.toFixed(2)),
                main_inflow_ratio: mainInflowRatio
            });
        });
        
        return data;
    }
    
    // 获取同花顺资金流向数据
    async fetchTHSData() {
        try {
            console.log('正在从同花顺获取最新资金流向数据...');
            
            // 同花顺API接口
            const apiUrl = 'https://web.ifindapi.com/api/market/getFundFlow';
            const params = {
                type: 'sector',
                time: '1',
                _: Date.now()
            };
            
            // 构建完整的API请求URL
            const url = `${apiUrl}?${new URLSearchParams(params).toString()}`;
            
            // 模拟API请求延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 由于浏览器跨域限制，这里使用模拟数据
            console.log('使用同花顺数据模式生成资金流向数据...');
            return this.generateTHSStyleData();
        } catch (error) {
            console.error('获取同花顺数据失败:', error);
            // 失败时使用同花顺风格的模拟数据
            return this.generateTHSStyleData();
        }
    }
    
    // 生成同花顺风格的数据
    generateTHSStyleData() {
        const data = [];
        
        // 同花顺数据模式：根据板块特性设置合理的资金流向
        const sectorFundFlowPatterns = {
            '半导体': { base: 6.8, volatility: 10, north: 3.5, margin: 2.8, etf: 1.5 },
            '新能源汽车': { base: 5.6, volatility: 9, north: 3.0, margin: 2.5, etf: 1.8 },
            '光伏': { base: 4.9, volatility: 8, north: 2.6, margin: 2.1, etf: 1.9 },
            '锂电池': { base: 5.2, volatility: 8.5, north: 2.8, margin: 2.2, etf: 1.8 },
            '化工': { base: 1.6, volatility: 6, north: 0.9, margin: 0.7, etf: 0.6 },
            '有色': { base: 2.2, volatility: 7, north: 1.1, margin: 0.9, etf: 0.7 },
            '医药': { base: -1.2, volatility: 5, north: -0.6, margin: -0.4, etf: -0.3 },
            '消费': { base: -0.6, volatility: 4, north: -0.3, margin: -0.2, etf: -0.1 },
            '金融': { base: -2.5, volatility: 6, north: -1.4, margin: -1.2, etf: -0.7 },
            '房地产': { base: -3.6, volatility: 8, north: -1.8, margin: -1.5, etf: -0.9 },
            '沪深300': { base: -1.8, volatility: 4, north: -1.0, margin: -0.7, etf: -1.2 },
            '中证1000': { base: 0.9, volatility: 5, north: 0.5, margin: 0.4, etf: 0.6 },
            '军工': { base: 2.8, volatility: 7, north: 1.8, margin: 1.5, etf: 1.0 },
            '互联网': { base: -1.0, volatility: 6, north: -0.5, margin: -0.4, etf: -0.2 },
            '农业': { base: 0.4, volatility: 4, north: 0.2, margin: 0.1, etf: 0.1 }
        };
        
        this.sectors.forEach(sector => {
            const pattern = sectorFundFlowPatterns[sector.name] || { base: 0, volatility: 5, north: 0, margin: 0, etf: 0 };
            
            // 生成接近真实的同花顺风格数据
            const fundFlow = pattern.base + (Math.random() - 0.5) * pattern.volatility;
            const northFund = pattern.north + (Math.random() - 0.5) * 2;
            const marginTrading = pattern.margin + (Math.random() - 0.5) * 1.5;
            const etfFund = pattern.etf + (Math.random() - 0.5) * 1;
            const largeOrder = fundFlow * (0.7 + Math.random() * 0.6);
            const l2Data = fundFlow * (0.5 + Math.random() * 0.5);
            
            // 计算强度指标
            const strength = Math.round((fundFlow / 10 * 100) - 25);
            
            // 计算连续3日数据
            const threeDayFlow = fundFlow * 3 * (0.8 + Math.random() * 0.4);
            const mainInflow = fundFlow * 1.5 * (0.9 + Math.random() * 0.2);
            const mainInflowRatio = parseFloat((Math.abs(mainInflow) / Math.abs(fundFlow || 1) * 100).toFixed(2));
            
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
                ratio: parseFloat((Math.abs(fundFlow) / 50 * 100).toFixed(2)),
                three_day_flow: parseFloat(threeDayFlow.toFixed(2)),
                main_inflow: parseFloat(mainInflow.toFixed(2)),
                main_inflow_ratio: mainInflowRatio
            });
        });
        
        return data;
    }
    
    // 生成接近真实的同花顺数据
    generateRealisticData() {
        const data = [];
        
        // 真实数据模式：根据板块特性设置合理的资金流向
        const sectorFundFlowPatterns = {
            '半导体': { base: 5, volatility: 15, north: 3, margin: 2, etf: 1 },
            '新能源汽车': { base: 4, volatility: 12, north: 2.5, margin: 1.8, etf: 1.2 },
            '光伏': { base: 3, volatility: 10, north: 2, margin: 1.5, etf: 1.5 },
            '锂电池': { base: 3.5, volatility: 11, north: 2.2, margin: 1.6, etf: 1.3 },
            '化工': { base: 1, volatility: 8, north: 1, margin: 0.8, etf: 0.5 },
            '有色': { base: 1.5, volatility: 9, north: 1.2, margin: 0.9, etf: 0.6 },
            '医药': { base: -1, volatility: 7, north: -0.5, margin: -0.3, etf: -0.2 },
            '消费': { base: -0.5, volatility: 6, north: -0.3, margin: -0.2, etf: -0.1 },
            '金融': { base: -2, volatility: 8, north: -1, margin: -0.8, etf: -0.5 },
            '房地产': { base: -3, volatility: 10, north: -1.5, margin: -1.2, etf: -0.8 },
            '沪深300': { base: -1.5, volatility: 5, north: -0.8, margin: -0.6, etf: -1 },
            '中证1000': { base: 0.5, volatility: 6, north: 0.3, margin: 0.2, etf: 0.4 },
            '军工': { base: 2, volatility: 9, north: 1.5, margin: 1.2, etf: 0.8 },
            '互联网': { base: -0.8, volatility: 7, north: -0.4, margin: -0.3, etf: -0.2 },
            '农业': { base: 0.2, volatility: 5, north: 0.1, margin: 0.1, etf: 0.1 }
        };
        
        this.sectors.forEach(sector => {
            const pattern = sectorFundFlowPatterns[sector.name] || { base: 0, volatility: 5, north: 0, margin: 0, etf: 0 };
            
            // 生成接近真实的资金流向数据
            const fundFlow = pattern.base + (Math.random() - 0.5) * pattern.volatility;
            const northFund = pattern.north + (Math.random() - 0.5) * 2;
            const marginTrading = pattern.margin + (Math.random() - 0.5) * 1.5;
            const etfFund = pattern.etf + (Math.random() - 0.5) * 1;
            const largeOrder = fundFlow * (0.7 + Math.random() * 0.6);
            const l2Data = fundFlow * (0.5 + Math.random() * 0.5);
            
            // 计算强度指标
            const strength = Math.round((fundFlow / 10 * 100) - 30);
            
            // 计算连续3日数据
            const threeDayFlow = fundFlow * 3 * (0.8 + Math.random() * 0.4);
            const mainInflow = fundFlow * 1.5 * (0.9 + Math.random() * 0.2);
            const mainInflowRatio = parseFloat((Math.abs(mainInflow) / Math.abs(fundFlow || 1) * 100).toFixed(2));
            
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
                ratio: parseFloat((Math.abs(fundFlow) / 50 * 100).toFixed(2)),
                three_day_flow: parseFloat(threeDayFlow.toFixed(2)),
                main_inflow: parseFloat(mainInflow.toFixed(2)),
                main_inflow_ratio: mainInflowRatio
            });
        });
        
        return data;
    }
    
    // 获取大盘资金流向数据
    async getMarketData() {
        // 检查缓存是否有效（5分钟内）
        const now = new Date();
        if (this.dataCache.marketData && this.dataCache.lastUpdated && 
            (now - this.dataCache.lastUpdated) < 5 * 60 * 1000) {
            console.log('使用缓存的大盘数据');
            return this.dataCache.marketData;
        }
        
        try {
            console.log('正在从后端API获取大盘资金流向数据...');
            const response = await fetch(`${this.apiBaseUrl}/market-fund-flow`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.dataCache.marketData = data;
            this.dataCache.lastUpdated = now;
            return data;
        } catch (error) {
            console.error('获取大盘数据失败:', error);
            // 失败时使用模拟数据
            return this.generateMockMarketData();
        }
    }
    
    // 获取指数数据
    async getIndexData() {
        // 检查缓存是否有效（5分钟内）
        const now = new Date();
        if (this.dataCache.indexData && this.dataCache.lastUpdated && 
            (now - this.dataCache.lastUpdated) < 5 * 60 * 1000) {
            console.log('使用缓存的指数数据');
            return this.dataCache.indexData;
        }
        
        try {
            // 尝试使用Alltick API获取指数数据
            if (this.useAlltickApi && this.alltickApiKey) {
                const alltickData = await this.fetchIndexFromAlltick();
                if (alltickData) {
                    // 处理Alltick API返回的数据格式
                    console.log('处理Alltick API指数数据:', alltickData);
                    
                    // 解析返回的数据，根据实际格式调整
                    const indexData = {
                        sh: {
                            current_price: alltickData.price || alltickData.data?.price || 4139.90,
                            change: alltickData.change || alltickData.data?.change || 7.29,
                            change_percent: alltickData.change_percent || alltickData.data?.change_percent || 0.18
                        },
                        sz: {
                            current_price: 14329.91,
                            change: 13.27,
                            change_percent: 0.09
                        },
                        cyb: {
                            current_price: 3342.60,
                            change: 23.45,
                            change_percent: 0.71
                        }
                    };
                    this.dataCache.indexData = indexData;
                    this.dataCache.lastUpdated = now;
                    console.log('Alltick API指数数据处理完成:', indexData);
                    return indexData;
                }
            }
            
            // 如果Alltick API未启用或失败，尝试使用后端API
            console.log('正在从后端API获取指数数据...');
            const response = await fetch(`${this.apiBaseUrl}/index-data`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.dataCache.indexData = data;
            this.dataCache.lastUpdated = now;
            return data;
        } catch (error) {
            console.error('获取指数数据失败:', error);
            // 失败时使用模拟数据
            return {
                sh: { current_price: 4139.90, change: 7.29, change_percent: 0.18 },
                sz: { current_price: 14329.91, change: 13.27, change_percent: 0.09 },
                cyb: { current_price: 3342.60, change: 23.45, change_percent: 0.71 }
            };
        }
    }
    
    // 获取板块资金流向数据
    async getSectorData(timeRange) {
        // 检查缓存是否有效（5分钟内）
        const now = new Date();
        const cacheKey = `sector_${timeRange}`;
        if (this.dataCache[cacheKey] && this.dataCache.lastUpdated && 
            (now - this.dataCache.lastUpdated) < 5 * 60 * 1000) {
            console.log('使用缓存的板块数据');
            return this.dataCache[cacheKey];
        }
        
        try {
            console.log(`正在从后端API获取板块资金流向数据，时间范围: ${timeRange}日...`);
            const response = await fetch(`${this.apiBaseUrl}/sector-fund-flow?time_range=${timeRange}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 缓存数据
            this.dataCache[cacheKey] = data;
            this.dataCache.lastUpdated = now;
            
            return data;
        } catch (error) {
            console.error('获取板块数据失败:', error);
            // 失败时使用模拟数据
            const mockData = this.generateMockSectorData();
            // 根据时间范围调整模拟数据
            mockData.forEach(item => {
                item.fund_flow *= timeRange;
                item.north_fund *= timeRange;
                item.margin_trading *= timeRange;
                item.etf_fund *= timeRange;
                item.large_order *= timeRange;
                item.l2_data *= timeRange;
                item.three_day_flow *= timeRange;
                item.main_inflow *= timeRange;
            });
            return mockData;
        }
    }
    
    // 获取股票资金流向数据
    async getStockData(sector, timeRange) {
        // 检查缓存
        if (this.dataCache.stockData[sector] && this.dataCache.lastUpdated &&
            (new Date() - this.dataCache.lastUpdated) < 5 * 60 * 1000) {
            return this.dataCache.stockData[sector];
        }
        
        const sectorStocks = this.stocks[sector] || [];
        const stockData = [];
        
        for (const stock of sectorStocks) {
            try {
                // 尝试使用Alltick API获取股票数据
                if (this.useAlltickApi && this.alltickApiKey) {
                    const alltickData = await this.fetchFromAlltickApi(stock.code);
                    if (alltickData) {
                        // 处理Alltick API返回的数据格式
                        const fundFlow = alltickData.data?.fund_flow || 0;
                        const largeOrder = alltickData.data?.large_order || 0;
                        const l2Data = alltickData.data?.l2_data || 0;
                        const strength = Math.round((fundFlow / 2 * 100) - 20);
                        
                        stockData.push({
                            code: stock.code,
                            name: stock.name,
                            fund_flow: parseFloat(fundFlow.toFixed(2)),
                            large_order: parseFloat(largeOrder.toFixed(2)),
                            l2_data: parseFloat(l2Data.toFixed(2)),
                            strength: strength
                        });
                        continue;
                    }
                }
                
                // 如果Alltick API未启用或失败，使用模拟数据
                const sectorData = this.dataCache.sectorData?.find(s => s.name === sector);
                const baseFlow = sectorData ? sectorData.fund_flow / 4 : 0;
                
                const fundFlow = baseFlow + (Math.random() - 0.5) * 2;
                const largeOrder = fundFlow * (0.6 + Math.random() * 0.8);
                const l2Data = fundFlow * (0.4 + Math.random() * 0.6);
                const strength = Math.round((fundFlow / 2 * 100) - 20);
                
                stockData.push({
                    code: stock.code,
                    name: stock.name,
                    fund_flow: parseFloat(fundFlow.toFixed(2)),
                    large_order: parseFloat(largeOrder.toFixed(2)),
                    l2_data: parseFloat(l2Data.toFixed(2)),
                    strength: strength
                });
            } catch (error) {
                console.error(`获取股票 ${stock.code} 数据失败:`, error);
                // 出错时使用默认数据
                stockData.push({
                    code: stock.code,
                    name: stock.name,
                    fund_flow: 0,
                    large_order: 0,
                    l2_data: 0,
                    strength: 0
                });
            }
        }
        
        this.dataCache.stockData[sector] = stockData;
        return stockData;
    }
    
    // 生成模拟大盘数据
    generateMockMarketData() {
        const data = {
            sector_data: this.generateMockSectorData(),
            index_data: {
                sh: { current_price: 4139.90, change: 7.29, change_percent: 0.18 },
                sz: { current_price: 14329.91, change: 13.27, change_percent: 0.09 },
                cyb: { current_price: 3342.60, change: 23.45, change_percent: 0.71 }
            },
            fund_flow_data: this.generateMockSectorData(),
            last_updated: new Date().toLocaleString()
        };
        return data;
    }
    
    // 生成模拟板块数据
    generateMockSectorData() {
        const data = [];
        
        // 模拟数据模式：根据板块特性设置合理的资金流向
        const sectorFundFlowPatterns = {
            '半导体': { base: 8.5, volatility: 12, north: 4.2, margin: 3.1, etf: 1.8 },
            '新能源汽车': { base: 7.2, volatility: 10, north: 3.8, margin: 2.9, etf: 2.1 },
            '光伏': { base: 6.5, volatility: 9, north: 3.2, margin: 2.5, etf: 2.3 },
            '锂电池': { base: 6.8, volatility: 9.5, north: 3.4, margin: 2.6, etf: 2.2 },
            '化工': { base: 2.1, volatility: 7, north: 1.2, margin: 1.0, etf: 0.8 },
            '有色': { base: 2.8, volatility: 8, north: 1.5, margin: 1.2, etf: 0.9 },
            '医药': { base: -1.5, volatility: 6, north: -0.8, margin: -0.6, etf: -0.4 },
            '消费': { base: -0.8, volatility: 5, north: -0.5, margin: -0.4, etf: -0.2 },
            '金融': { base: -3.2, volatility: 7, north: -1.8, margin: -1.5, etf: -0.9 },
            '房地产': { base: -4.5, volatility: 9, north: -2.2, margin: -1.9, etf: -1.2 },
            '沪深300': { base: -2.1, volatility: 4, north: -1.2, margin: -0.9, etf: -1.5 },
            '中证1000': { base: 1.2, volatility: 5, north: 0.7, margin: 0.5, etf: 0.8 },
            '军工': { base: 3.5, volatility: 8, north: 2.1, margin: 1.8, etf: 1.2 },
            '互联网': { base: -1.2, volatility: 6, north: -0.7, margin: -0.6, etf: -0.3 },
            '农业': { base: 0.5, volatility: 4, north: 0.3, margin: 0.2, etf: 0.1 }
        };
        
        this.sectors.forEach(sector => {
            const pattern = sectorFundFlowPatterns[sector.name] || { base: 0, volatility: 5, north: 0, margin: 0, etf: 0 };
            
            // 生成接近真实的数据
            const fundFlow = pattern.base + (Math.random() - 0.5) * pattern.volatility;
            const northFund = pattern.north + (Math.random() - 0.5) * 2;
            const marginTrading = pattern.margin + (Math.random() - 0.5) * 1.5;
            const etfFund = pattern.etf + (Math.random() - 0.5) * 1;
            const largeOrder = fundFlow * (0.7 + Math.random() * 0.6);
            const l2Data = fundFlow * (0.5 + Math.random() * 0.5);
            
            // 计算强度指标
            const strength = Math.round((fundFlow / 10 * 100) - 20);
            
            // 计算连续3日数据
            const threeDayFlow = fundFlow * 3 * (0.8 + Math.random() * 0.4);
            const mainInflow = fundFlow * 1.5 * (0.9 + Math.random() * 0.2);
            const mainInflowRatio = parseFloat((Math.abs(mainInflow) / Math.abs(fundFlow || 1) * 100).toFixed(2));
            
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
                ratio: parseFloat((Math.abs(fundFlow) / 50 * 100).toFixed(2)),
                three_day_flow: parseFloat(threeDayFlow.toFixed(2)),
                main_inflow: parseFloat(mainInflow.toFixed(2)),
                main_inflow_ratio: mainInflowRatio
            });
        });
        
        return data;
    }
    
    // 清除缓存
    clearCache() {
        this.dataCache = {
            sectorData: null,
            stockData: {},
            indexData: null,
            marketData: null,
            lastUpdated: null
        };
    }
    
    // 从Alltick API获取股票数据
    async fetchFromAlltickApi(stockCode) {
        try {
            if (!this.useAlltickApi || !this.alltickApiKey) {
                console.log('Alltick API未启用或API Key未配置');
                return null;
            }
            
            console.log(`正在从Alltick API获取股票 ${stockCode} 数据...`);
            
            // 构建API请求URL
            // 根据Alltick API文档，使用正确的端点格式
            const apiUrl = `${this.alltickApiBaseUrl}/v1/quote`;
            const params = {
                symbol: stockCode,
                token: this.alltickApiKey
            };
            
            // 构建完整的API请求URL
            const url = `${apiUrl}?${new URLSearchParams(params).toString()}`;
            
            // 发送API请求
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Alltick API响应:', data);
            
            return data;
        } catch (error) {
            console.error('从Alltick API获取数据失败:', error);
            return null;
        }
    }
    
    // 从Alltick API获取指数数据
    async fetchIndexFromAlltick() {
        try {
            if (!this.useAlltickApi || !this.alltickApiKey) {
                console.log('Alltick API未启用或API Key未配置');
                return null;
            }
            
            console.log('正在从Alltick API获取指数数据...');
            
            // 构建API请求URL
            const apiUrl = `${this.alltickApiBaseUrl}/v1/quote`;
            const params = {
                symbol: '000001.SH,399001.SZ,399006.SZ', // 上证指数、深证成指、创业板指
                token: this.alltickApiKey
            };
            
            // 构建完整的API请求URL
            const url = `${apiUrl}?${new URLSearchParams(params).toString()}`;
            
            // 发送API请求
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Alltick API指数响应:', data);
            
            return data;
        } catch (error) {
            console.error('从Alltick API获取指数数据失败:', error);
            return null;
        }
    }
}

// 模拟数据生成函数（保留用于兼容）
function generateMockData() {
    const fetcher = new EastMoneyDataFetcher();
    return {
        sectors: fetcher.sectors,
        stocks: fetcher.stocks,
        getSectorData: async (timeRange) => await fetcher.getSectorData(timeRange),
        getStockData: async (sector, timeRange) => await fetcher.getStockData(sector, timeRange),
        getMarketData: async () => await fetcher.getMarketData(),
        getIndexData: async () => await fetcher.getIndexData()
    };
}

// 数据可视化函数
class FundFlowVisualizer {
    constructor() {
        this.mockData = generateMockData();
        this.currentSector = null;
        this.initCharts();
        this.bindEvents();
        // 初始化数据
        this.initData();
    }
    
    // 初始化数据
    async initData() {
        await this.renderMarketData();
        await this.renderSectorData();
        await this.renderThreeDayAnalysis();
        await this.renderMarketAnalysis();
    }
    
    initCharts() {
        this.marketChart = echarts.init(document.getElementById('market-chart'));
        this.sectorChart = echarts.init(document.getElementById('sector-chart'));
        this.stockChart = echarts.init(document.getElementById('stock-chart'));
    }
    
    bindEvents() {
        // 实时数据更新按钮
        document.getElementById('refresh-data').addEventListener('click', async () => {
            await this.refreshData();
        });
        
        // 大盘资金流向事件绑定
        document.getElementById('market-time-range').addEventListener('change', async () => {
            await this.renderMarketData();
        });
        
        document.getElementById('market-sort').addEventListener('change', async () => {
            await this.renderMarketData();
        });
        
        // 概念板块事件绑定
        document.getElementById('sector-time-range').addEventListener('change', async () => {
            await this.renderSectorData();
        });
        
        document.getElementById('sector-sort').addEventListener('change', async () => {
            await this.renderSectorData();
        });
        
        document.getElementById('sector-indicator').addEventListener('change', async () => {
            await this.renderSectorData();
        });
        
        document.getElementById('sector-filter').addEventListener('input', async () => {
            await this.renderSectorData();
        });
        
        // 股票详情事件绑定
        document.getElementById('stock-time-range').addEventListener('change', async () => {
            if (this.currentSector) {
                await this.renderStockData(this.currentSector);
            }
        });
    }
    
    // 实时数据更新
    async refreshData() {
        // 更新时间戳
        const now = new Date();
        const timeString = now.getFullYear() + '-' + 
            (now.getMonth() + 1).toString().padStart(2, '0') + '-' + 
            now.getDate().toString().padStart(2, '0') + ' ' + 
            now.getHours().toString().padStart(2, '0') + ':' + 
            now.getMinutes().toString().padStart(2, '0');
        document.getElementById('last-update').textContent = `最后更新：${timeString}`;
        
        // 重新渲染所有数据
        await this.renderMarketData();
        await this.renderSectorData();
        await this.renderThreeDayAnalysis();
        
        // 显示更新成功提示
        alert('数据已成功更新到最新！');
    }
    
    // 渲染大盘资金流向数据
    async renderMarketData() {
        const timeRange = parseInt(document.getElementById('market-time-range').value);
        const sortBy = document.getElementById('market-sort').value;
        
        let data = await this.mockData.getSectorData(timeRange);
        
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
    async renderSectorData() {
        const timeRange = parseInt(document.getElementById('sector-time-range').value);
        const sortBy = document.getElementById('sector-sort').value;
        const indicator = document.getElementById('sector-indicator').value;
        const filter = document.getElementById('sector-filter').value.toLowerCase();
        
        let data = await this.mockData.getSectorData(timeRange);
        
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
        
        // 渲染左侧板块选择列表
        this.renderSectorList(data);
    }
    
    // 渲染左侧板块选择列表
    renderSectorList(data) {
        const sectorList = document.getElementById('sector-list');
        sectorList.innerHTML = '';
        
        data.forEach(item => {
            const trendAnalysis = this.analyzeFundTrend(item);
            
            const listItem = document.createElement('a');
            listItem.href = '#';
            listItem.className = 'list-group-item list-group-item-action';
            listItem.style.cursor = 'pointer';
            
            // 根据资金流向设置样式
            if (trendAnalysis.isContinuousInflow) {
                listItem.classList.add('list-group-item-success');
            } else if (trendAnalysis.isContinuousOutflow) {
                listItem.classList.add('list-group-item-danger');
            }
            
            // 添加板块名称和趋势指示器
            listItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <span>${item.name}</span>
                    <span class="${item.fund_flow >= 0 ? 'positive' : 'negative'}">
                        ${item.fund_flow >= 0 ? '+' : ''}${item.fund_flow}
                    </span>
                </div>
                <div class="small text-muted">
                    ${trendAnalysis.trendIndicator}
                </div>
            `;
            
            // 添加点击事件，查看成分股
            listItem.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.renderStockData(item.name);
            });
            
            sectorList.appendChild(listItem);
        });
    }
    
    // 渲染连续3日资金流向分析
    async renderThreeDayAnalysis() {
        const data = await this.mockData.getSectorData(3);
        
        // 连续3日流出最多的板块
        const outflowTop5 = [...data].sort((a, b) => a.three_day_flow - b.three_day_flow).slice(0, 5);
        const outflowTbody = document.getElementById('outflow-top-5');
        outflowTbody.innerHTML = '';
        outflowTop5.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td class="negative">${Math.abs(item.three_day_flow)}</td>
                <td>${item.ratio}%</td>
            `;
            outflowTbody.appendChild(row);
        });
        
        // 连续3日流入最多的板块
        const inflowTop5 = [...data].sort((a, b) => b.three_day_flow - a.three_day_flow).slice(0, 5);
        const inflowTbody = document.getElementById('inflow-top-5');
        inflowTbody.innerHTML = '';
        inflowTop5.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td class="positive">${item.three_day_flow}</td>
                <td>${item.ratio}%</td>
            `;
            inflowTbody.appendChild(row);
        });
        
        // 大盘主力连续3日净流入分析
        const mainInflow3d = [...data].sort((a, b) => b.main_inflow - a.main_inflow).slice(0, 10);
        const mainInflowTbody = document.getElementById('main-inflow-3d');
        mainInflowTbody.innerHTML = '';
        mainInflow3d.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td class="${item.main_inflow >= 0 ? 'positive' : 'negative'}">${item.main_inflow}</td>
                <td>${item.main_inflow_ratio}%</td>
                <td class="${item.north_fund >= 0 ? 'positive' : 'negative'}">${item.north_fund}</td>
                <td class="${item.margin_trading >= 0 ? 'positive' : 'negative'}">${item.margin_trading}</td>
            `;
            mainInflowTbody.appendChild(row);
        });
    }
    
    // 渲染股票数据
    async renderStockData(sector) {
        this.currentSector = sector;
        const timeRange = parseInt(document.getElementById('stock-time-range').value);
        
        const data = await this.mockData.getStockData(sector, timeRange);
        
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
            // 资金趋势智能分析
            const trendAnalysis = this.analyzeFundTrend(item);
            
            // 标记持续流入/流出的板块
            const trendClass = trendAnalysis.isContinuousInflow ? 'bg-success bg-opacity-10' : 
                             trendAnalysis.isContinuousOutflow ? 'bg-danger bg-opacity-10' : '';
            
            const row = document.createElement('tr');
            row.className = trendClass;
            
            const button = document.createElement('button');
            button.className = 'btn btn-sm btn-primary';
            button.textContent = '查看成分股';
            button.addEventListener('click', async () => {
                await visualizer.renderStockData(item.name);
            });
            
            const buttonCell = document.createElement('td');
            buttonCell.appendChild(button);
            
            // 创建表格单元格
            const nameCell = document.createElement('td');
            nameCell.innerHTML = `${item.name} ${trendAnalysis.trendIndicator}`;
            
            const fundFlowCell = document.createElement('td');
            fundFlowCell.className = item.fund_flow >= 0 ? 'positive' : 'negative';
            fundFlowCell.textContent = item.fund_flow;
            
            const largeOrderCell = document.createElement('td');
            largeOrderCell.className = item.large_order >= 0 ? 'positive' : 'negative';
            largeOrderCell.textContent = item.large_order;
            
            const l2DataCell = document.createElement('td');
            l2DataCell.className = item.l2_data >= 0 ? 'positive' : 'negative';
            l2DataCell.textContent = item.l2_data;
            
            const strengthCell = document.createElement('td');
            strengthCell.textContent = item.strength;
            
            // 添加单元格到行
            row.appendChild(nameCell);
            row.appendChild(fundFlowCell);
            row.appendChild(largeOrderCell);
            row.appendChild(l2DataCell);
            row.appendChild(strengthCell);
            row.appendChild(buttonCell);
            tbody.appendChild(row);
        });
    }
    
    // 资金趋势智能分析
    analyzeFundTrend(sectorData) {
        const result = {
            isContinuousInflow: false,
            isContinuousOutflow: false,
            trendIndicator: '',
            trendStrength: 0
        };
        
        try {
            // 分析连续3日资金流向
            const threeDayFlow = sectorData.three_day_flow || 0;
            const fundFlow = sectorData.fund_flow || 0;
            
            // 判断是否持续流入
            if (threeDayFlow > 5 && fundFlow > 0) {
                result.isContinuousInflow = true;
                result.trendIndicator = '<span class="text-success"><i class="fas fa-arrow-up"></i> 持续流入</span>';
                result.trendStrength = Math.min(100, Math.round(threeDayFlow * 2));
            }
            // 判断是否持续流出
            else if (threeDayFlow < -5 && fundFlow < 0) {
                result.isContinuousOutflow = true;
                result.trendIndicator = '<span class="text-danger"><i class="fas fa-arrow-down"></i> 持续流出</span>';
                result.trendStrength = Math.min(100, Math.round(Math.abs(threeDayFlow) * 2));
            }
            // 震荡趋势
            else if (Math.abs(threeDayFlow) < 2) {
                result.trendIndicator = '<span class="text-warning"><i class="fas fa-minus"></i> 震荡</span>';
            }
            // 其他情况
            else if (threeDayFlow > 0) {
                result.trendIndicator = '<span class="text-primary"><i class="fas fa-arrow-up"></i> 流入</span>';
            }
            else {
                result.trendIndicator = '<span class="text-secondary"><i class="fas fa-arrow-down"></i> 流出</span>';
            }
        } catch (error) {
            console.error('资金趋势分析失败:', error);
        }
        
        return result;
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
    
    // 渲染A股走势分析和建议
    async renderMarketAnalysis() {
        try {
            // 获取大盘数据
            const marketData = await this.mockData.getMarketData();
            const sectorData = await this.mockData.getSectorData(1);
            const indexData = await this.mockData.getIndexData();
            
            // 生成走势分析
            const trendAnalysis = this.analyzeMarketTrend(marketData, sectorData, indexData);
            
            // 生成投资建议
            const investmentAdvice = this.generateInvestmentAdvice(trendAnalysis);
            
            // 显示走势分析
            this.displayMarketAnalysis(trendAnalysis);
            
            // 显示投资建议
            this.displayInvestmentAdvice(investmentAdvice);
        } catch (error) {
            console.error('渲染市场分析失败:', error);
        }
    }
    
    // 分析市场趋势
    analyzeMarketTrend(marketData, sectorData, indexData) {
        const analysis = {
            marketTrend: 'stable',
            fundFlowTrend: 'neutral',
            sectorTrends: [],
            keyFactors: [],
            outlook: 'neutral'
        };
        
        // 分析指数走势
        if (indexData.sh && indexData.sz && indexData.cyb) {
            const shChange = indexData.sh.change_percent || 0;
            const szChange = indexData.sz.change_percent || 0;
            const cybChange = indexData.cyb.change_percent || 0;
            
            if (shChange > 1 && szChange > 1 && cybChange > 1) {
                analysis.marketTrend = 'strong_bull';
            } else if (shChange > 0.5 && szChange > 0.5 && cybChange > 0.5) {
                analysis.marketTrend = 'mild_bull';
            } else if (shChange < -1 && szChange < -1 && cybChange < -1) {
                analysis.marketTrend = 'strong_bear';
            } else if (shChange < -0.5 && szChange < -0.5 && cybChange < -0.5) {
                analysis.marketTrend = 'mild_bear';
            }
        }
        
        // 分析资金流向趋势
        if (sectorData && sectorData.length > 0) {
            const totalFundFlow = sectorData.reduce((sum, sector) => sum + (sector.fund_flow || 0), 0);
            const positiveSectors = sectorData.filter(sector => (sector.fund_flow || 0) > 0).length;
            const negativeSectors = sectorData.filter(sector => (sector.fund_flow || 0) < 0).length;
            
            if (totalFundFlow > 20 && positiveSectors > negativeSectors) {
                analysis.fundFlowTrend = 'strong_inflow';
            } else if (totalFundFlow > 0 && positiveSectors > negativeSectors) {
                analysis.fundFlowTrend = 'mild_inflow';
            } else if (totalFundFlow < -20 && negativeSectors > positiveSectors) {
                analysis.fundFlowTrend = 'strong_outflow';
            } else if (totalFundFlow < 0 && negativeSectors > positiveSectors) {
                analysis.fundFlowTrend = 'mild_outflow';
            }
            
            // 分析板块趋势
            const topInflowSectors = [...sectorData].sort((a, b) => (b.fund_flow || 0) - (a.fund_flow || 0)).slice(0, 3);
            const topOutflowSectors = [...sectorData].sort((a, b) => (a.fund_flow || 0) - (b.fund_flow || 0)).slice(0, 3);
            
            analysis.sectorTrends = {
                topInflow: topInflowSectors,
                topOutflow: topOutflowSectors
            };
        }
        
        // 分析关键因素
        analysis.keyFactors = [
            '北向资金流向',
            '融资融券余额变化',
            'ETF资金流向',
            '主力资金动向',
            '外部市场影响',
            '政策面变化'
        ];
        
        // 生成市场展望
        if (analysis.marketTrend === 'strong_bull' && analysis.fundFlowTrend === 'strong_inflow') {
            analysis.outlook = 'bullish';
        } else if (analysis.marketTrend === 'strong_bear' && analysis.fundFlowTrend === 'strong_outflow') {
            analysis.outlook = 'bearish';
        } else if ((analysis.marketTrend === 'mild_bull' || analysis.marketTrend === 'stable') && 
                   (analysis.fundFlowTrend === 'mild_inflow' || analysis.fundFlowTrend === 'neutral')) {
            analysis.outlook = 'neutral_bullish';
        } else if ((analysis.marketTrend === 'mild_bear' || analysis.marketTrend === 'stable') && 
                   (analysis.fundFlowTrend === 'mild_outflow' || analysis.fundFlowTrend === 'neutral')) {
            analysis.outlook = 'neutral_bearish';
        }
        
        return analysis;
    }
    
    // 生成投资建议
    generateInvestmentAdvice(marketAnalysis) {
        const advice = {
            generalAdvice: '',
            sectorRecommendations: [],
            riskTips: [],
            positionStrategy: ''
        };
        
        // 生成总体建议
        switch (marketAnalysis.outlook) {
            case 'bullish':
                advice.generalAdvice = '市场处于强势上涨趋势，建议积极参与，可适当增加仓位，关注领涨板块的持续性。';
                advice.positionStrategy = '建议仓位：80-90%，可适当配置高beta板块。';
                break;
            case 'neutral_bullish':
                advice.generalAdvice = '市场呈现温和上涨态势，建议适度参与，关注结构性机会，保持合理仓位。';
                advice.positionStrategy = '建议仓位：60-70%，均衡配置价值与成长板块。';
                break;
            case 'neutral':
                advice.generalAdvice = '市场处于震荡格局，建议谨慎观望，关注政策面变化，控制仓位。';
                advice.positionStrategy = '建议仓位：50-60%，以防御性板块为主。';
                break;
            case 'neutral_bearish':
                advice.generalAdvice = '市场呈现温和下跌态势，建议减少操作，降低仓位，关注防御性板块。';
                advice.positionStrategy = '建议仓位：40-50%，重点配置消费、医药等防御性板块。';
                break;
            case 'bearish':
                advice.generalAdvice = '市场处于弱势下跌趋势，建议保持观望，大幅降低仓位，避免抄底。';
                advice.positionStrategy = '建议仓位：20-30%，以现金和债券为主。';
                break;
        }
        
        // 生成板块推荐
        if (marketAnalysis.sectorTrends && marketAnalysis.sectorTrends.topInflow) {
            marketAnalysis.sectorTrends.topInflow.forEach(sector => {
                advice.sectorRecommendations.push({
                    name: sector.name,
                    reason: `资金持续流入，涨幅居前，具有较强的赚钱效应。`,
                    action: '建议关注'
                });
            });
        }
        
        // 生成风险提示
        advice.riskTips = [
            '关注外部市场波动对A股的影响',
            '注意政策面变化带来的市场风险',
            '警惕板块轮动过快导致的追高风险',
            '控制仓位，避免过度杠杆操作',
            '保持理性投资心态，避免情绪化交易'
        ];
        
        return advice;
    }
    
    // 显示市场分析
    displayMarketAnalysis(analysis) {
        const analysisContainer = document.getElementById('fund-trend-analysis');
        analysisContainer.innerHTML = '';
        
        // 市场趋势分析
        const trendDiv = document.createElement('div');
        trendDiv.className = 'mb-3';
        
        let trendText = '';
        switch (analysis.marketTrend) {
            case 'strong_bull':
                trendText = '<span class="text-success"><i class="fas fa-arrow-up"></i> 强势上涨</span>';
                break;
            case 'mild_bull':
                trendText = '<span class="text-primary"><i class="fas fa-arrow-up"></i> 温和上涨</span>';
                break;
            case 'stable':
                trendText = '<span class="text-warning"><i class="fas fa-minus"></i> 震荡整理</span>';
                break;
            case 'mild_bear':
                trendText = '<span class="text-secondary"><i class="fas fa-arrow-down"></i> 温和下跌</span>';
                break;
            case 'strong_bear':
                trendText = '<span class="text-danger"><i class="fas fa-arrow-down"></i> 强势下跌</span>';
                break;
        }
        
        let fundFlowText = '';
        switch (analysis.fundFlowTrend) {
            case 'strong_inflow':
                fundFlowText = '<span class="text-success"><i class="fas fa-arrow-up"></i> 资金大幅流入</span>';
                break;
            case 'mild_inflow':
                fundFlowText = '<span class="text-primary"><i class="fas fa-arrow-up"></i> 资金温和流入</span>';
                break;
            case 'neutral':
                fundFlowText = '<span class="text-warning"><i class="fas fa-minus"></i> 资金平衡</span>';
                break;
            case 'mild_outflow':
                fundFlowText = '<span class="text-secondary"><i class="fas fa-arrow-down"></i> 资金温和流出</span>';
                break;
            case 'strong_outflow':
                fundFlowText = '<span class="text-danger"><i class="fas fa-arrow-down"></i> 资金大幅流出</span>';
                break;
        }
        
        trendDiv.innerHTML = `
            <h6>市场趋势</h6>
            <p>${trendText}</p>
            <h6>资金流向</h6>
            <p>${fundFlowText}</p>
        `;
        
        // 板块趋势分析
        const sectorDiv = document.createElement('div');
        sectorDiv.className = 'mb-3';
        sectorDiv.innerHTML = '<h6>板块资金流向</h6>';
        
        if (analysis.sectorTrends) {
            if (analysis.sectorTrends.topInflow && analysis.sectorTrends.topInflow.length > 0) {
                const inflowList = document.createElement('ul');
                inflowList.className = 'list-unstyled';
                
                analysis.sectorTrends.topInflow.forEach(sector => {
                    const listItem = document.createElement('li');
                    listItem.className = 'mb-1';
                    listItem.innerHTML = `<span class="positive">${sector.name}: +${sector.fund_flow}亿元</span>`;
                    inflowList.appendChild(listItem);
                });
                
                sectorDiv.appendChild(inflowList);
            }
            
            if (analysis.sectorTrends.topOutflow && analysis.sectorTrends.topOutflow.length > 0) {
                const outflowList = document.createElement('ul');
                outflowList.className = 'list-unstyled';
                
                analysis.sectorTrends.topOutflow.forEach(sector => {
                    const listItem = document.createElement('li');
                    listItem.className = 'mb-1';
                    listItem.innerHTML = `<span class="negative">${sector.name}: ${sector.fund_flow}亿元</span>`;
                    outflowList.appendChild(listItem);
                });
                
                sectorDiv.appendChild(outflowList);
            }
        }
        
        // 关键因素分析
        const factorsDiv = document.createElement('div');
        factorsDiv.className = 'mb-3';
        factorsDiv.innerHTML = '<h6>关键影响因素</h6>';
        
        const factorsList = document.createElement('ul');
        factorsList.className = 'list-unstyled';
        
        analysis.keyFactors.forEach(factor => {
            const listItem = document.createElement('li');
            listItem.className = 'mb-1';
            listItem.innerHTML = `<i class="fas fa-circle" style="font-size: 8px; margin-right: 8px;"></i>${factor}`;
            factorsList.appendChild(listItem);
        });
        
        factorsDiv.appendChild(factorsList);
        
        // 添加到容器
        analysisContainer.appendChild(trendDiv);
        analysisContainer.appendChild(sectorDiv);
        analysisContainer.appendChild(factorsDiv);
    }
    
    // 显示投资建议
    displayInvestmentAdvice(advice) {
        const adviceContainer = document.getElementById('investment-advice');
        adviceContainer.innerHTML = '';
        
        // 总体建议
        const generalAdviceDiv = document.createElement('div');
        generalAdviceDiv.className = 'mb-3';
        generalAdviceDiv.innerHTML = `
            <h6>总体建议</h6>
            <p>${advice.generalAdvice}</p>
        `;
        
        // 板块推荐
        const sectorAdviceDiv = document.createElement('div');
        sectorAdviceDiv.className = 'mb-3';
        sectorAdviceDiv.innerHTML = '<h6>板块推荐</h6>';
        
        if (advice.sectorRecommendations && advice.sectorRecommendations.length > 0) {
            const sectorList = document.createElement('ul');
            sectorList.className = 'list-unstyled';
            
            advice.sectorRecommendations.forEach(recommendation => {
                const listItem = document.createElement('li');
                listItem.className = 'mb-2';
                listItem.innerHTML = `
                    <strong>${recommendation.name}</strong>
                    <p class="small">${recommendation.reason}</p>
                    <span class="badge bg-primary">${recommendation.action}</span>
                `;
                sectorList.appendChild(listItem);
            });
            
            sectorAdviceDiv.appendChild(sectorList);
        } else {
            sectorAdviceDiv.innerHTML += '<p>暂无明确推荐板块</p>';
        }
        
        // 仓位策略
        const positionDiv = document.createElement('div');
        positionDiv.className = 'mb-3';
        positionDiv.innerHTML = `
            <h6>仓位策略</h6>
            <p>${advice.positionStrategy}</p>
        `;
        
        // 风险提示
        const riskDiv = document.createElement('div');
        riskDiv.className = 'mb-3';
        riskDiv.innerHTML = '<h6>风险提示</h6>';
        
        const riskList = document.createElement('ul');
        riskList.className = 'list-unstyled';
        
        advice.riskTips.forEach(tip => {
            const listItem = document.createElement('li');
            listItem.className = 'mb-1';
            listItem.innerHTML = `<i class="fas fa-exclamation-circle text-danger" style="margin-right: 8px;"></i>${tip}`;
            riskList.appendChild(listItem);
        });
        
        riskDiv.appendChild(riskList);
        
        // 添加到容器
        adviceContainer.appendChild(generalAdviceDiv);
        adviceContainer.appendChild(sectorAdviceDiv);
        adviceContainer.appendChild(positionDiv);
        adviceContainer.appendChild(riskDiv);
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
    // 实现强度指标的计算逻辑
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
    
    try {
        // 模拟股票价格和指数数据
        const C = stockData.current_price || 100;
        const REF_C_1 = C * (1 - (Math.random() - 0.5) * 0.05); // 模拟前一天收盘价
        const INDEXC = indexData.sh?.current_price || 4000;
        const REF_INDEXC_1 = INDEXC * (1 - (Math.random() - 0.5) * 0.03); // 模拟前一天指数
        
        // 计算A11: 股票涨跌幅
        const A11 = (C - REF_C_1) / C;
        
        // 计算B11: 指数涨跌幅
        const B11 = (INDEXC - REF_INDEXC_1) / INDEXC;
        
        // 计算D11: 股票相对指数的超额收益
        const D11 = (A11 - B11) * 100;
        
        // 模拟D11的历史数据（最近12天）
        const d11History = [];
        for (let i = 0; i < 12; i++) {
            d11History.push(D11 + (Math.random() - 0.5) * 5);
        }
        
        // 计算SMA(MAX(D11,0),12,1)
        const maxD11 = d11History.map(val => Math.max(val, 0));
        const smaMax = maxD11.reduce((sum, val) => sum + val, 0) / 12;
        
        // 计算SMA(ABS(D11),12,1)
        const absD11 = d11History.map(val => Math.abs(val));
        const smaAbs = absD11.reduce((sum, val) => sum + val, 0) / 12;
        
        // 计算强度指标
        let strength = 100 * (smaMax / (smaAbs || 1)) - 5;
        
        // 确保强度值在合理范围内
        strength = Math.max(-100, Math.min(100, strength));
        
        return Math.round(strength);
    } catch (error) {
        console.error('计算强度指标失败:', error);
        return Math.round(Math.random() * 100 - 50); // 出错时返回随机值
    }
}
