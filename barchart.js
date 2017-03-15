
var dataSet =[
  {"date":"2017-03-10", "Cause Code":"no", "Quality":"388", "Percentage":"34.00",
  "Deviation from Previous 14 Days Avg":"-13.44", "Percentage(National Average)":"32.34",
  "Deviation from National Avg":"12.93"
},
{"date":"2017-03-10", "Cause Code":"0", "Quality":"238", "Percentage":"21.43",
"Deviation from Previous 14 Days Avg":"30.43", "Percentage(National Average)":"19.43",
"Deviation from National Avg":"11.03"
},
{"date":"2017-03-10", "Cause Code":"38", "Quality":"144", "Percentage":"12.81",
"Deviation from Previous 14 Days Avg":"-11.43", "Percentage(National Average)":"8.12",
"Deviation from National Avg":"57.39"
},
{"date":"2017-03-10", "Cause Code":"23", "Quality":"92", "Percentage":"8.19",
"Deviation from Previous 14 Days Avg":"39", "Percentage(National Average)":"8.46",
"Deviation from National Avg":"57.39"
},
{"date":"2017-03-10", "Cause Code":"39", "Quality":"84", "Percentage":"7.65",
"Deviation from Previous 14 Days Avg":"5.32", "Percentage(National Average)":"5.48",
"Deviation from National Avg":"-4.86"
},
{"date":"2017-03-10", "Cause Code":"39", "Quality":"37", "Percentage":"3.29",
"Deviation from Previous 14 Days Avg":"26.57", "Percentage(National Average)":"3.68",
"Deviation from National Avg":"39.57"
},
{"date":"2017-03-10", "Cause Code":"20", "Quality":"31", "Percentage":"2.59",
"Deviation from Previous 14 Days Avg":"29.70", "Percentage(National Average)":"4.27",
"Deviation from National Avg":"-21.53"
},
{"date":"2017-03-10", "Cause Code":"20", "Quality":"31", "Percentage":"1.78",
"Deviation from Previous 14 Days Avg":"66.54", "Percentage(National Average)":"1.05",
"Deviation from National Avg":"72.75"
}
]
var columns = [];
for(key in dataSet[0]){
  columns.push(key);
}

function barChart(){
var data1 = [];
for(i = 0; i < dataSet.length; i++){
  data1.push([ dataSet[i]["Cause Code"], dataSet[i]["Quality"], dataSet[i]["Percentage"]])
};

//draw canvas


var div = d3.select(".barChart").append("div").attr("class", "toolTip");

var axisMargin =20,
        margin = 25,
        valueMargin = 10,
        width = parseInt(d3.select('body').style('width'), 10)/2,
        height = parseInt(d3.select('body').style('height'), 10)/2,
        barHeight = (height-axisMargin-margin*2)* 0.6/data1.length,
        barPadding = (height-axisMargin-margin*2)*0.4/data1.length,
        bar, svg, scale, xAxis, labelWidth = 0;

var max = d3.max(data1)[1];
var color = d3.scaleOrdinal(d3.schemeCategory10);

svg = d3.select('.barChart')
        .append("svg")
        .attr("width", width)
        .attr("height", height);


bar = svg.selectAll("g")
        .data(data1)
        .enter()
        .append("g");

bar.attr("class", "bar")
        .attr("cx",0)
        .attr("fill",color)
        .attr("transform", function(d, i) {
            return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
        });

bar.append("text")
        .attr("class", "label")
        .attr("y", barHeight / 2)
        .attr("dy", "0.5em") //vertical align middle
        .text(function(d){
            return d[0];
        }).each(function() {
    labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
});

scale = d3.scaleLinear()
        .domain([0, max])
        .range([0, width - margin*2 - labelWidth]);

xAxis = d3.axisBottom()
        .scale(scale)
        .tickSize(-height + 2*margin + axisMargin);
//


bar.append("rect")
        .attr("transform", "translate("+labelWidth+", 0)")
        .attr("height", barHeight)
        .attr("width", function(d){
            return scale(d[1]);
        });

bar.append("text")
        .attr("class", "percentage")
        .attr("y", barHeight / 2)
        .attr("dx", -valueMargin + labelWidth) //margin right
        .attr("dy", ".35em") //vertical align middle
        .attr("text-anchor", "end")
        .text(function(d){
            return (d[2]+"%");
        })
        .attr("x", function(d){
            var width = this.getBBox().width;
            return Math.max(width + valueMargin, scale(d[1]));
        });
bar.on("mousemove", function(d) {
    div.style("left", d3.event.pageX + 10 + "px");
    div.style("top", d3.event.pageY - 25 + "px");
    div.style("display", "inline-block");
    div.html((d[0]) + "<br>" + (d[1]));
});
bar.on("mouseout", function(d) {
    div.style("display", "none");
});
//
svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - 2*axisMargin - margin)+")")
            .call(xAxis);

//
svg.append("text")
.attr("x", (width/2))
.attr("y", height - (margin))
.attr("text-anchor", "middle")
.style("font-size", "16px")
.text("Quality");

}//function end
barChart();
//---------------------table-------------------------

function tabulate(data, columns) {
    var table = d3.select('.table2').append('table')
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
        .attr('class', function(d,i){ return "col_" + i; })
        .text(function(d) {
            return d.value;
        });

    var colorcells = d3.selectAll(".col_4, .col_5, .col_6")
        .text(function(d){
          if(d.value>0){return("+" + d.value + "%")}
        })
        .style("color", function(d) {
            if (d.value > 0) {return "red"}
            else {return "green"}
        });


    return table;
}

// render the table(s)
tabulate(dataSet, columns); // 2 column table
