(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // === 行军日程数据 ===
  // 每个数据点：日期标签, 里程, 海拔, 天气得分, 地形得分, MPI总分
  var marchData = [
    { date: '6/12', label: '翻越夹金山', dist: 27, alt: 4114, weather: 20, terrain: 20, mpi: 52.0, event: '翻越第一座雪山·暴风雪' },
    { date: '6/13', label: '下山至达维', dist: 28, alt: 3500, weather: 5, terrain: 15, mpi: 23.9, event: '达维会师' },
    { date: '6/14', label: '达维→懋功', dist: 35, alt: 3200, weather: 5, terrain: 5, mpi: 16.8, event: '懋功会师' },
    { date: '6/15', label: '懋功休整', dist: 0, alt: 3200, weather: 5, terrain: 5, mpi: 3.0, event: '休整待命' },
    { date: '6/26', label: '懋功→两河口', dist: 40, alt: 3100, weather: 10, terrain: 15, mpi: 22.6, event: '两河口会议' },
    { date: '6/27', label: '两河口→卓克基', dist: 45, alt: 3400, weather: 10, terrain: 15, mpi: 27.1, event: '道路泥泞' },
    { date: '6/28', label: '卓克基休整', dist: 0, alt: 3400, weather: 5, terrain: 5, mpi: 3.4, event: '松潘战役计划' },
    { date: '6/29', label: '卓克基→梭磨', dist: 30, alt: 3600, weather: 5, terrain: 15, mpi: 19.6, event: '向梦笔山前进' },
    { date: '6/30', label: '梭磨→梦笔山麓', dist: 25, alt: 3900, weather: 15, terrain: 15, mpi: 26.0, event: '气温骤降' },
    { date: '7/1', label: '翻越梦笔山', dist: 22, alt: 4080, weather: 20, terrain: 20, mpi: 44.6, event: '翻越第二座雪山·暴风雪' },
    { date: '7/2', label: '下山至刷经寺', dist: 30, alt: 3600, weather: 5, terrain: 15, mpi: 18.4, event: '下山休整' },
    { date: '7/3', label: '刷经寺→昌德村', dist: 28, alt: 3700, weather: 5, terrain: 15, mpi: 18.3, event: '向长板山前进' },
    { date: '7/4', label: '翻越长板山', dist: 20, alt: 4400, weather: 15, terrain: 20, mpi: 43.5, event: '翻越第三座雪山·亚克夏山' },
    { date: '7/5', label: '下山至黑水', dist: 25, alt: 3500, weather: 5, terrain: 15, mpi: 16.3, event: '下山至黑水' },
    { date: '7/6', label: '翻越昌德山', dist: 18, alt: 4283, weather: 15, terrain: 20, mpi: 41.3, event: '翻越第四座雪山' },
    { date: '7/7', label: '翻越打鼓山', dist: 20, alt: 4752, weather: 20, terrain: 20, mpi: 50.1, event: '翻越第五座也是最高雪山·暴风雪' },
    { date: '7/8', label: '下山至芦花', dist: 25, alt: 3400, weather: 5, terrain: 15, mpi: 16.0, event: '连续翻越后休整' },
    { date: '7/9', label: '芦花休整', dist: 0, alt: 3400, weather: 5, terrain: 5, mpi: 3.4, event: '沙窝会议' },
    { date: '7/21', label: '芦花→毛儿盖', dist: 50, alt: 3500, weather: 10, terrain: 10, mpi: 28.5, event: '粮食匮乏' },
    { date: '7/22', label: '毛儿盖休整', dist: 0, alt: 3500, weather: 5, terrain: 10, mpi: 3.5, event: '毛儿盖会议' },
    { date: '8/21', label: '进入草地', dist: 20, alt: 3500, weather: 10, terrain: 25, mpi: 28.0, event: '沼泽遍布' },
    { date: '8/22', label: '草地第1天', dist: 20, alt: 3500, weather: 10, terrain: 25, mpi: 28.0, event: '沼泽吞噬战士' },
    { date: '8/23', label: '草地第2天', dist: 20, alt: 3500, weather: 20, terrain: 25, mpi: 32.0, event: '夜间暴风雨·冻饿交加' },
    { date: '8/24', label: '草地第3天', dist: 20, alt: 3500, weather: 10, terrain: 25, mpi: 28.0, event: '粮食断绝' },
    { date: '8/25', label: '草地第4天', dist: 20, alt: 3400, weather: 10, terrain: 25, mpi: 27.7, event: '沼泽减员剧增' },
    { date: '8/26', label: '草地第5天', dist: 20, alt: 3400, weather: 5, terrain: 25, mpi: 25.7, event: '体力极度透支' },
    { date: '8/27', label: '到达班佑', dist: 15, alt: 3400, weather: 5, terrain: 10, mpi: 17.3, event: '走出草地·减员惨重' }
  ];

  // 计算各维度贡献值
  var altWeight = 0.35;
  var distWeight = 0.25;
  var weatherWeight = 0.20;
  var terrainWeight = 0.20;

  var altContrib = marchData.map(function(d) {
    return +(Math.max(0, (d.alt - 3000) / 1000) * 10 * altWeight).toFixed(2);
  });
  var distContrib = marchData.map(function(d) {
    return +(d.dist * 0.8 * distWeight).toFixed(2);
  });
  var weatherContrib = marchData.map(function(d) {
    return +(d.weather * weatherWeight).toFixed(2);
  });
  var terrainContrib = marchData.map(function(d) {
    return +(d.terrain * terrainWeight).toFixed(2);
  });

  var dates = marchData.map(function(d) { return d.date; });
  var mpiValues = marchData.map(function(d) { return d.mpi; });
  var altValues = marchData.map(function(d) { return d.alt; });

  // === 图1：MPI折线图 ===
  var chart1 = echarts.init(document.getElementById('chart-pressure'), null, { renderer: 'svg' });

  // 标记点：极端压力日
  var markPoints = [];
  marchData.forEach(function(d, i) {
    if (d.mpi >= 45) {
      markPoints.push({
        coord: [i, d.mpi],
        value: d.label,
        itemStyle: { color: '#c62828' },
        label: { show: true, formatter: d.label, fontSize: 9, color: '#c62828', fontWeight: 'bold', position: 'top' }
      });
    }
  });

  chart1.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var p = params[0];
        var idx = p.dataIndex;
        var d = marchData[idx];
        return '<div style="font-weight:bold;font-size:13px;margin-bottom:4px;">' + d.label + '</div>' +
               '<div style="font-size:11px;color:#888;margin-bottom:6px;">' + d.event + '</div>' +
               '<table style="font-size:11px;">' +
               '<tr><td style="padding:2px 8px 2px 0;">MPI</td><td><b>' + d.mpi.toFixed(1) + '</b></td></tr>' +
               '<tr><td style="padding:2px 8px 2px 0;">海拔</td><td>' + d.alt + 'm</td></tr>' +
               '<tr><td style="padding:2px 8px 2px 0;">里程</td><td>' + d.dist + 'km</td></tr>' +
               '</table>';
      }
    },
    grid: { left: 60, right: 70, top: 60, bottom: 70 },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 10, rotate: 35 },
      name: '日期（1935年）',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: { color: muted, fontSize: 11 }
    },
    yAxis: [
      {
        type: 'value',
        name: '压力指数(MPI)',
        min: 0,
        max: 60,
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 10 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        nameTextStyle: { color: muted, fontSize: 11 }
      },
      {
        type: 'value',
        name: '海拔(m)',
        min: 2000,
        max: 5000,
        position: 'right',
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 10, formatter: '{value}' },
        splitLine: { show: false },
        nameTextStyle: { color: muted, fontSize: 11 }
      }
    ],
    series: [
      {
        name: 'MPI',
        type: 'line',
        data: mpiValues,
        smooth: false,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: {
          color: function(p) {
            var v = p.value;
            if (v >= 45) return '#c62828';
            if (v >= 30) return '#ef6c00';
            if (v >= 15) return '#f9a825';
            return '#558b2f';
          }
        },
        lineStyle: { color: accent, width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: accent + '40' },
              { offset: 1, color: accent + '05' }
            ]
          }
        },
        markPoint: { data: markPoints, symbolSize: 0 },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', width: 1 },
          data: [
            { yAxis: 45, lineStyle: { color: '#c62828' }, label: { formatter: '极端(45)', color: '#c62828', fontSize: 9, position: 'end' } },
            { yAxis: 30, lineStyle: { color: '#ef6c00' }, label: { formatter: '高度(30)', color: '#ef6c00', fontSize: 9, position: 'end' } },
            { yAxis: 15, lineStyle: { color: '#558b2f' }, label: { formatter: '中度(15)', color: '#558b2f', fontSize: 9, position: 'end' } }
          ]
        }
      },
      {
        name: '海拔',
        type: 'line',
        yAxisIndex: 1,
        data: altValues,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: accent2, width: 1.5, type: 'dashed', opacity: 0.7 },
        itemStyle: { color: accent2 }
      }
    ],
    legend: {
      data: ['MPI', '海拔'],
      top: 10,
      textStyle: { color: ink, fontSize: 11 },
      itemWidth: 20,
      itemHeight: 10
    }
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // === 图2：各维度贡献堆积面积图 ===
  var chart2 = echarts.init(document.getElementById('chart-breakdown'), null, { renderer: 'svg' });

  chart2.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'cross' },
      formatter: function(params) {
        var idx = params[0].dataIndex;
        var d = marchData[idx];
        var html = '<div style="font-weight:bold;margin-bottom:4px;">' + d.label + '</div>';
        params.forEach(function(p) {
          html += '<div style="font-size:11px;"><span style="display:inline-block;width:10px;height:10px;background:' + p.color + ';margin-right:5px;"></span>' + p.seriesName + ': ' + p.value.toFixed(2) + '</div>';
        });
        html += '<div style="font-size:11px;margin-top:4px;border-top:1px solid #ccc;padding-top:2px;">总计: ' + d.mpi.toFixed(1) + '</div>';
        return html;
      }
    },
    legend: {
      data: ['海拔贡献', '里程贡献', '天气贡献', '地形贡献'],
      top: 5,
      textStyle: { color: ink, fontSize: 10 },
      itemWidth: 15,
      itemHeight: 10
    },
    grid: { left: 60, right: 30, top: 50, bottom: 60 },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 9, rotate: 35 },
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: '贡献值',
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 10 },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      nameTextStyle: { color: muted, fontSize: 11 }
    },
    series: [
      {
        name: '海拔贡献',
        type: 'line',
        stack: 'total',
        areaStyle: { opacity: 0.6 },
        lineStyle: { width: 0 },
        data: altContrib,
        itemStyle: { color: accent }
      },
      {
        name: '里程贡献',
        type: 'line',
        stack: 'total',
        areaStyle: { opacity: 0.6 },
        lineStyle: { width: 0 },
        data: distContrib,
        itemStyle: { color: accent2 }
      },
      {
        name: '天气贡献',
        type: 'line',
        stack: 'total',
        areaStyle: { opacity: 0.6 },
        lineStyle: { width: 0 },
        data: weatherContrib,
        itemStyle: { color: '#5b8c5a' }
      },
      {
        name: '地形贡献',
        type: 'line',
        stack: 'total',
        areaStyle: { opacity: 0.6 },
        lineStyle: { width: 0 },
        data: terrainContrib,
        itemStyle: { color: '#7a6b5d' }
      }
    ]
  });
  window.addEventListener('resize', function() { chart2.resize(); });

})();
