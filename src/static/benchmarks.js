const runBenchmarks = function(options, deps) {

  console.log('Running Benchmarks')

  const { d3, jsdom: { JSDOM } } = deps;

  return new Promise(function(resolve, reject) {

    const { window } = new JSDOM(`...`);

    window.d3 = d3.select(window.document);

    const {
      FORMATS_ARRAY,
      dataArray,
      transforms,
      encodeSuite,
      decodeSuite,
    } = options;

    const formatResults = {};

    const resultsMap = {};
    FORMATS_ARRAY.map(format => {
      dataArray.map(dataset => {
        let _dataset = JSON.parse(JSON.stringify(dataset));
        encodeSuite.add(`${format} Encode ${_dataset.name}`, {
          defer: true,
          fn: async function(deferred) {
            const hashKey = format + _dataset.name;
            const result = await transforms['response'][format](_dataset.data);
            if(!resultsMap[hashKey]) {
              resultsMap[hashKey] = result;
            }
            deferred.resolve(result);
          },
          onComplete: function(result) {
            handleOnComplete(format, _dataset, 'Encoding', result);
          },
          onCycle() {
            _dataset = JSON.parse(JSON.stringify(dataset));
          }
        });
        decodeSuite.add(`${format} Decode ${dataset.name}`, {
          defer: true,
          fn: async function(deferred) {
            const hashKey = format + dataset.name;
            const buffer = resultsMap[hashKey];
            const result = await transforms['request'][format](buffer);
            deferred.resolve(result);
          },
          onComplete: function(event) {
            handleOnComplete(format, dataset, 'Decoding', event);
          }
        });
      });
    });

    encodeSuite.on('complete', function() {
      decodeSuite.run({
        async: true
      });
    });

    decodeSuite.on('complete', function() {
      console.log('Keys: ', Object.keys(formatResults));
      const results = Object.entries(formatResults).map(function(entry, index) {

        const key = entry[0];
        const result = entry[1];
        const fileName = key.replace(' ', '-').toLowerCase();
        console.log('Result:', JSON.stringify(Object.values(result)));

        return {
          fileName: fileName,
          graph: renderDifferenceGraph(
            'ms',
            Object.values(result)
          )
        };

      })
      resolve(results);
    });

    encodeSuite.run({
      async: true
    });

    function handleOnComplete(format, dataset, testType, event) {
      const metricName = `${testType} ${dataset.name}`;
      if(!formatResults[metricName]) {
        formatResults[metricName] = {};
      }

      setResultsValue(formatResults[metricName], format, metricName, event.target.times.period);
    }

    function renderDifferenceGraph(yAxisLabel, data) {

      data = JSON.parse(JSON.stringify(data));
      const jsonData = data.pop();
      const baseline = jsonData.values[0].value;

      const elementSelector = '.container';

      var margin = {top: 20, right: 160, bottom: 30, left: 120},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      const fontSize = 24;

      var x0 = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x0)
          .tickSize(0)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var color = d3.scale.ordinal()
          .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

      var conatiner = window.d3.select('body')
        .append('div').attr('class','container');

      window.document.querySelector(elementSelector).innerHTML = '';

      const svg = window.d3.select(elementSelector)
        .append("svg")
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("font-size", `${fontSize}px`)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var formatNames = data.map(function(d) { return d.format; });
      var metricNames = data[0].values.map(function(d) { return d.metric; });

      x0.domain(formatNames);
      x1.domain(metricNames).rangeRoundBands([0, x0.rangeBand()]);
      y.domain(d3.extent(data, function(format) {
        return format.values[0].value;
      })).nice();

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style('font-weight','bold')
          .text(yAxisLabel);

      var slice = svg.selectAll(".slice")
          .data(data)
          .enter().append("g")
          .attr("class", "g")
          .attr("transform",function(d) { return "translate(" + x0(d.format) + ",0)"; });

      slice.selectAll("rect")
          .data(function(d) { return d.values; })
      .enter().append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.metric); })
          .style("fill", function(d) { return color(d.metric) })
          .attr("y", function(d) {
            if (d.value > baseline) {
              return y(d.value);
            } else {
              return y(baseline);
            }
          })
          .attr("height", function(d) {
            return Math.abs(y(d.value) - y(baseline));
          });

      // Baseline
      svg.append("rect")
        .attr("width", width)
        .attr("height", 2)
        .style("fill", function(d) { return '#0000FF'; })
        .attr("x", function(d) { return x1(0); })
        .attr("y", function(d) { return y(baseline) - 1; });

      svg.append("text")
        .attr("x", width)
        .attr("y", function(d) { return y(baseline) - 6; })
        .text(`JSON \r\n ${baseline}`);



      //Legend
      var legend = svg.selectAll(".legend")
          .data(data[0].values.map(function(d) { return d.metric; }).reverse())
      .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d) { return color(d); });

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) {return d; });

      return window.d3.select('.container').html();
    }
  });

  function setResultsValue(results, format, metricName, value) {

    if(!results[format]) {
      results[format] = {
        format: format,
        values: []
      };
    }

    results[format].values.push({
      metric: metricName,
      value: value
    });
  }
};

if(typeof window !== 'undefined') {
  window.runBenchmarks = runBenchmarks;
} else {
  module.exports = runBenchmarks;
}