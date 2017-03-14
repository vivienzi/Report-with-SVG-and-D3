var data = [
{"KPI":"Kpi1", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"-14.34", "Deviation from Regional Ave":"-15.84",
"Deviation from National Avg":"-15.84"},
{"KPI":"Kpi2", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"9.55", "Deviation from Regional Ave":"11.45",
"Deviation from National Avg":"11.57"},
{"KPI":"Kpi3", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"-11.29", "Deviation from Regional Ave":"56.45",
"Deviation from National Avg":"56.45"},
{"KPI":"Kpi4", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"39.99", "Deviation from Regional Ave":"-3.24",
"Deviation from National Avg":"-3.23"},
{"KPI":"Kpi5", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"43.65", "Deviation from Regional Ave":"-4.75",
"Deviation from National Avg":"-4.75"},
{"KPI":"Kpi6", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"24.88", "Deviation from Regional Ave":"-16.45",
"Deviation from National Avg":"-16.45"},
{"KPI":"Kpi7", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"23.81", "Deviation from Regional Ave":"-3.54",
"Deviation from National Avg":"-3.54"},
{"KPI":"Kpi8", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"65.73", "Deviation from Regional Ave":"65.65",
"Deviation from National Avg":"65.65"},
{"KPI":"Kpi9", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"-19.65", "Deviation from Regional Ave":"-30.67",
"Deviation from National Avg":"-30.67"},
{"KPI":"Kpi10", "Date": "2017-03-10", "NPH Score":"80", "Measured Values":"12.34",
"Deviation from Previous 14 Days Avg":"-14.06", "Deviation from Regional Ave":"-49.99",
"Deviation from National Avg":"-49.99"}
];

var columns2 = [];
for(key in data[0]){
  columns2.push(key);
}

function radialtree(){
var width = 500;
var height = 500;
var svg = d3.select(".radialTree").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2 + 90) + ")");

var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

var tree = d3.tree()
    .size([360, 60])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv("/public/data.csv", function(error, data) {
  if (error) throw error;

  var root = tree(stratify(data));

  var link = g.selectAll(".link")
    .data(root.descendants().slice(1))
    .enter().append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
      });

  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

  node.append("circle")
      .attr("r", 0.5);

  node.append("text")
      .attr("dy", ".31em")
      .attr("fill",color)
      .attr("x", function(d) { return d.x < 180 === !d.children ? 3 : -3; })
      .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
      .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
      .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
});

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}
};
radialtree();

function tabulate(data, columns) {
    var table = d3.select('.table1').append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody');

    // append the header row
    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function(column) {
            return column;
        });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                };
            });
        })
        .enter()
        .append('td')
        .text(function(d) {
            return d.value;
        });

    return table;
}

// render the table(s)
tabulate(data, columns2); // 2 column table
