axios.get("http://127.0.0.1:5000/api").then(function ({ data }) {
  drawScreePlot(data);
  drawBiPlot(data);
  drawDataMDS(data);
  drawVariableMDS(data);
  drawParallelCoordPlot(data,data.attribute);
});
var margin = { top: 50, right: 70, bottom: 70, left: 70 },
  width = 500 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
var order_axis = [];
function drawScreePlot(data) {
  const {
    cum_exp_var,
    exp_var,
    attribute,
    pc,
    pca_data,
    original_data,
    old_df,
    cluster_id,
    color_list,
    mds_data,
    variable_coord,
    data_set,
  } = data;
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  a = [];
  for (var i = 0; i < exp_var.length; i++) {
    a.push({ key: i + 1, value: exp_var[i], attribute: attribute, pc: pc });
  }
  domain_x = a.map((a) => a.key);

  var x = d3.scaleBand().range([0, width]).padding(0.2).domain(domain_x);

  var y = d3.scaleLinear().range([height, 0]).domain([0, 1]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  //add x-label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .text("Components");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .text("ScreePlot")
    .style("font-weight", "bold")
    .attr("fill", "blue")
    .style("font-size", "20px");

  // add y-axis
  svg.append("g").call(d3.axisLeft(y));

  // add y-lable
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2) - 50)
    .attr("y", -40)
    .text("Explained Variance Ratio");
  //add bars
  svg
    .selectAll("rect")
    .data(a)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.key))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => height - y(d.value))
    .style("fill", "#3498db")
    .on("click", function (d) {
      drawTable(d, data);
    });
  //  add text
  svg
    .selectAll("text.bar")
    .data(a)
    .enter()
    .append("text")
    .attr("class", "bar")
    .attr("transform", function (d) {
      return "translate(" + x(d.key) + "," + y(d.value) + ")";
    });
  cum_a = [];
  for (var i = 0; i < exp_var.length; i++) {
    cum_a.push({ key: i + 1, value: cum_exp_var[i] });
  }
  svg
    .append("path")
    .datum(cum_a)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.key))
        .y((d) => y(d.value))
    );
}

function drawBiPlot(data) {
  const { cum_exp_var, exp_var, pc, pca_data } = data;
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var pc1 = pc[0];
  var pc2 = pc[1];
  domain_x = [-0.5, 0.5];

  var x = d3.scaleLinear().range([0, width]).domain(domain_x);

  domain_y = [-0.8, 0.8];

  var y = d3.scaleLinear().range([height, 0]).domain(domain_y);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  //add x-label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .text("PC1");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .text("BiPlot")
    .style("font-weight", "bold")
    .attr("fill", "blue")
    .style("font-size", "20px");

  // add y-axis
  svg.append("g").call(d3.axisLeft(y));

  // add y-lable
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .text("PC2");

  // add the scatters
  xs = pca_data[0];
  ys = pca_data[1];
  scalex = 1.0 / (d3.max(xs) - d3.min(xs));
  scaley = 1.0 / (d3.max(ys) - d3.min(ys));
  xs = xs.map((d) => d * scalex);
  ys = ys.map((d) => d * scaley);

  biPlot_pc = [];
  for (var i = 0; i < pca_data[0].length; i++) {
    biPlot_pc.push({ x: xs[i], y: ys[i] });
  }
  svg
    .append("g")
    .selectAll("dot")
    .data(biPlot_pc)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", 1)
    .style("fill", "#3498db");
  //add lines
  biPlot_line = [];
  for (var i = 0; i < pc1.length; i++) {
    biPlot_line.push({ x: pc1[i], y: pc2[i] });
  }
  svg
    .append("g")
    .selectAll("line")
    .data(biPlot_line)
    .enter()
    .append("line")
    .style("stroke", "red")
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", (d) => x(d.x))
    .attr("y2", (d) => y(d.y));
}

function drawTable(data, original_data) {
  d3.select("thead").remove();
  d3.select("tbody").remove();

  d3.select("p")
    .text("Table of the highest PCA loadings")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("color", "blue");

  d3.select("table")
    .append("thead")
    .append("tr")
    .attr("class", "headrow")
    .append("th")
    .attr("scope", "col")
    .text("Attribute\\PC");
  d3.select("table").append("tbody");

  // get the top 4 SS Loadings
  sum_of_squared_loadings = [];
  result = [];
  attribute_vec = [];
  var temp = 0;
  for (var i = 0; i < data.attribute.length; i++) {
    //choose number of PCs
    for (var j = 0; j < data.key; j++) {
      // choose the attributes
      temp += Math.pow(data.pc[j][i], 2);
      attribute_vec.push(data.pc[j][i]);
    }
    sum_of_squared_loadings[i] = Math.sqrt(temp);
    result.push({
      attribute: data.attribute[i],
      loading: sum_of_squared_loadings[i],
      attribute_vec: attribute_vec,
    }); //first attribute, pc[i][0]
    temp = 0;
    attribute_vec = [];
  }
  result.sort((a, b) => parseFloat(b.loading) - parseFloat(a.loading));
  new_result = result.slice(0, 4);

  num_pc = [];
  for (var i = 1; i <= data.key; i++) {
    num_pc.push(i);
  }
  // add the PC+number
  d3.select(".headrow")
    .selectAll("th.content")
    .data(num_pc)
    .enter()
    .append("th")
    .attr("scope", "col")
    .attr("class", "content")
    .text((d) => "PC" + d);

  var tr = d3
    .select("tbody")
    .selectAll("tr")
    .data(new_result)
    .enter()
    .append("tr")
    .attr("scope", "row")
    .attr("class", "rowContent")
    .attr("id", function (d, i) {
      return "row" + i;
    })
    .text((d) => d.attribute);

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < data.key; j++) {
      d3.select("#row" + i)
        .append("td")
        .text(new_result[i].attribute_vec[j].toFixed(2));
    }
  }
  drawScatterPlotMatrix(new_result, original_data);
}

function drawScatterPlotMatrix(new_result, original_data) {
  d3.select(".scatter_matrix").remove();
  d3.select(".color_legend").remove();
  target_arr = [];
  for (var i = 0; i < 4; i++) {
    target_arr.push(original_data.attribute.indexOf(new_result[i].attribute));
  }
  // put the attributes in an array.
  scatter_matrix = [];
  for (var i = 0; i < 4; i++) {
    scatter_matrix.push({
      columns: new_result[i].attribute,
      values: original_data.original_data[target_arr[i]],
    });
  }
  scatters = [];
  for (var i = 0; i < 500; i++) {
    var str1, str2, str3, str4, legend;
    str1 = scatter_matrix[0].columns;
    str2 = scatter_matrix[1].columns;
    str3 = scatter_matrix[2].columns;
    str4 = scatter_matrix[3].columns;
    if (original_data.cluster_id[i] === 0) {
      legend = "red";
    } else if (original_data.cluster_id[i] === 1) {
      legend = "green";
    } else {
      legend = "blue";
    }
    scatters.push({
      [str1]: scatter_matrix[0].values[i],
      [str2]: scatter_matrix[1].values[i],
      [str3]: scatter_matrix[2].values[i],
      [str4]: scatter_matrix[3].values[i],
      legend: legend,
    });
  }
  var width = 600,
    size = 150,
    padding = 40;

  // set the x,y axis.
  var traits = scatter_matrix.map((d) => d.columns);
  var n = traits.length;
  var x = d3.scaleLinear().range([padding / 2, size - padding / 2]);
  var y = d3.scaleLinear().range([size - padding / 2, padding / 2]);

  var xAxis = d3
    .axisBottom()
    .scale(x)
    .ticks(6)
    .tickSize(size * n);

  var yAxis = d3
    .axisLeft()
    .scale(y)
    .ticks(6)
    .tickSize(-size * n);

  var domain = {};

  traits.forEach(function (trait, i) {
    domain[trait] = d3.extent(scatter_matrix[i].values);
  });
  // set the svg
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", size * n + padding)
    .attr("height", size * n + padding)
    .attr("class", "scatter_matrix")
    .append("g")
    .attr("transform", "translate(" + padding + "," + padding / 2 + ")")
    .style("font-size", "12px");

  //set the legends
  var color_legend = d3
    .select("body")
    .append("svg")
    .attr("width", 200)
    .attr("height", 200)
    .attr("margin-bottom", 200)
    .attr("class", "color_legend");

  color_legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", 40)
    .attr("r", 6)
    .style("fill", "red")
    .style("stroke", "black");
  color_legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", 60)
    .attr("r", 6)
    .style("fill", "green")
    .style("stroke", "black");
  color_legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", 80)
    .attr("r", 6)
    .style("fill", "blue")
    .style("stroke", "black");
  color_legend
    .append("text")
    .attr("x", 40)
    .attr("y", 40)
    .text("Cluster_0")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold");
  color_legend
    .append("text")
    .attr("x", 40)
    .attr("y", 60)
    .text("Cluster_1")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold");
  color_legend
    .append("text")
    .attr("x", 40)
    .attr("y", 80)
    .text("Cluster_2")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold");

  svg
    .append("text")
    .attr("x", width / 2 - 70)
    .attr("y", 0)
    .text("ScatterPlot Matrix")
    .style("font-weight", "bold")
    .attr("fill", "blue")
    .style("font-size", "20px");

  svg
    .selectAll(".x.axis")
    .data(traits)
    .enter()
    .append("g")
    .attr("class", "x axis")
    .attr("transform", function (d, i) {
      return "translate(" + (n - i - 1) * size + ",0)";
    })
    .each(function (d) {
      x.domain(domain[d]);
      d3.select(this).call(xAxis);
    });

  svg
    .selectAll(".y.axis")
    .data(traits)
    .enter()
    .append("g")
    .attr("class", "y axis")
    .attr("transform", function (d, i) {
      return "translate(0," + i * size + ")";
    })
    .each(function (d) {
      y.domain(domain[d]);
      d3.select(this).call(yAxis);
    });

  svg.selectAll(".axis line").style("stroke", "#ddd");
  svg.selectAll(".axis path").style("display", "None");

  var cell = svg
    .selectAll(".cell")
    .data(cross(traits, traits))
    .enter()
    .append("g")
    .attr("class", "cell")
    .attr("transform", function (d) {
      return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
    })
    .each(plot);

  cell
    .filter(function (d) {
      return d.i === d.j;
    })
    .append("text")
    .attr("x", padding)
    .attr("y", padding)
    .attr("dy", ".71em")
    .text((d) => d.x);

  // plot the scatter matrix
  function plot(p) {
    var cell = d3.select(this);
    x.domain(domain[p.x]);
    y.domain(domain[p.y]);

    cell
      .append("rect")
      .attr("class", "frame")
      .attr("x", padding / 2)
      .attr("y", padding / 2)
      .attr("width", size - padding)
      .attr("height", size - padding)
      .style("fill", "None")
      .style("stroke", "black");

    cell
      .selectAll("circle")
      .data(scatters)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[p.x]))
      .attr("cy", (d) => y(d[p.y]))
      .attr("r", 2.5)
      .style("fill", (d) => d.legend)
      .style("stroke", "black");
  }
}

//create a cross product with corresponding attributes/traits
function cross(a, b) {
  var c = [],
    n = a.length,
    m = b.length,
    i,
    j;
  for (i = 0; i < n; i++) {
    for (j = 0; j < m; j++) {
      c.push({ x: a[i], i: i, y: b[j], j: j });
    }
  }
  return c;
}

function drawDataMDS(data) {
  var x_max = d3.max(data.mds_data.map((d) => d[0]));
  var x_min = d3.min(data.mds_data.map((d) => d[0]));
  var x_domain = [x_min, x_max];
  var y_max = d3.max(data.mds_data.map((d) => d[1]));
  var y_min = d3.min(data.mds_data.map((d) => d[1]));
  var y_domain = [y_min, y_max];
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //set the legends
  var color_legend = d3
    .select("body")
    .append("svg")
    .attr("width", 200)
    .attr("height", 200)
    .attr("margin-bottom", 200)
    .attr("class", "color_legend");

  color_legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", 40)
    .attr("r", 6)
    .style("fill", "red")
    .style("stroke", "black");
  color_legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", 60)
    .attr("r", 6)
    .style("fill", "green")
    .style("stroke", "black");
  color_legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", 80)
    .attr("r", 6)
    .style("fill", "blue")
    .style("stroke", "black");
  color_legend
    .append("text")
    .attr("x", 40)
    .attr("y", 40)
    .text("Cluster_0")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold");
  color_legend
    .append("text")
    .attr("x", 40)
    .attr("y", 60)
    .text("Cluster_1")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold");
  color_legend
    .append("text")
    .attr("x", 40)
    .attr("y", 80)
    .text("Cluster_2")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold");

  svg
    .append("text")
    .attr("x", width / 2 - 70)
    .attr("y", 0)
    .text("data MDS Plot")
    .style("font-weight", "bold")
    .attr("fill", "blue")
    .style("font-size", "20px");
  // Add X axis
  var x = d3
    .scaleLinear()
    // data.mds_data
    .domain(x_domain)
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain(y_domain).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add dots
  scatters = [];
  for (var i = 0; i < 500; i++) {
    scatters.push({
      x: data.mds_data[i][0],
      y: data.mds_data[i][1],
      color: data.color_list[i],
    });
  }
  svg
    .append("g")
    .selectAll("dot")
    .data(scatters)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .attr("r", 1.5)
    .style("fill", (d) => d.color);
}

function drawVariableMDS(data) {
  var width = 600,
  height = 500;
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //set the legends
  svg
    .append("text")
    .attr("x", width / 2 - 70)
    .attr("y", 0)
    .text("variable MDS Plot")
    .style("font-weight", "bold")
    .attr("fill", "blue")
    .style("font-size", "20px");
  // Add X axis
  var x = d3
    .scaleLinear()
    // data.mds_data
    .domain([-1, 1])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add dots
  let scatters = [];
  for (var i = 0; i < data.variable_coord.length; i++) {
    scatters.push({
      x: data.variable_coord[i][0],
      y: data.variable_coord[i][1],
      attribute: data.attribute[i],
    });
  }
  var var_scatter = svg
    .selectAll("g .var")
    .data(scatters)
    .enter()
    .append("g")
    .attr("class", "var");

  var_scatter
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .attr("r", 10)
    .style("fill", "#3498db")
    .on("click",function(){
      d3.select(this).style("fill", "red");
      reOrderAxis(data);
    });

    // add values to scatters
  d3.selectAll(".dot")
  .data(data.attribute)
  .attr("value",d=>d);
  // add text to the scatter group
  var_scatter
    .append("text")
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("y", function (d) {
      return y(d.y);
    })
    .text((d) => d.attribute)
    .style("font-size","7px")
    .style("font-weight","bold")
    .style("position","relative")
    .style("left","12px");
}

function drawParallelCoordPlot(dataset,data_dimension) {
  d3.select(".pcp").remove();
  var width = 600,
    height = 500;
  var data = Object.values(dataset.old_df);
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "pcp")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  svg
    .append("text")
    .attr("x", width / 2 - 100)
    .attr("y", -20)
    .text("Parallel Coordinates Plot")
    .style("font-weight", "bold")
    .attr("fill", "blue")
    .style("font-size", "20px");

  var y = {};
  dimensions = data_dimension;
  for (i in dimensions) {
    attribute = dimensions[i];
    y[attribute] = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return d["" + attribute];
        })
      )
      .range([height, 0]);
  }

  function path(d) {
    return d3.line()(
      dimensions.map(function (p) {
        return [x(p), y[p](d[p])];
      })
    );
  }

  x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);

  //add the lines/paths
  svg
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "none")
    .style("opacity", 0.5);

  // add the legend
  svg
    .selectAll("path")
    .data(dataset.color_list)
    .style("stroke", (d) => d);

  svg
    .selectAll("myAxis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .each(function (d) {
      d3.select(this).call(d3.axisLeft().scale(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function (d) {
      return d;
    })
    .style("fill", "black");
  }
  // add the form and all the options to re-draw PCP
  //   var form_list = [];
  //   var form_group = d3.select("body")
  //   .append("form")
  //   .on("submit",function(){
  //     updatePCP(dataset);
  //   })
  //   .append("div")
  //   .attr("class","form-group")
  //   .attr("id","myForm");
  
  //   var selects = form_group.selectAll("select")
  //   .data(dimensions)
  //   .enter()
  //   .append("select")
  //   .on("change",changeSelect)
  //   .attr("class","custom-select")
  //   .style("width","auto");
  
  //   selects.selectAll("option")
  //   .data(dimensions)
  //   .enter()
  //   .append("option")
  //   .attr("value", (d) => d)
  //   .text((d) => d);
  
  
  //   form_group.append("button")
  //   // .attr("id","myBtn")
  //   .attr("type","submit")
  //   .attr("class","btn btn-primary")
  //   .text("Update PCP with new axes arrangement!")
  //   // .on("click",function(){
  //   //   updatePCP(dataset);
  //   // });
  // }

  // //form update
  // function updatePCP(dataset){
  //   d3.event.preventDefault();
  //   console.log(d3.event.target);
  //   console.log(data);
  //   // form_list.push
  //   // drawParallelCoordPlot(dataset,);
  // }
  // function changeSelect(){
  //   console.log(d3.event);
  // }
  
//extra credit
function reOrderAxis(dataset){
  console.log(dataset);
  var text = d3.event.target.attributes.value.value;
  if(!order_axis.includes(text)){
    order_axis.push(text);
  }
  console.log("reorder called"); 
  console.log(order_axis);
  if(order_axis.length === dataset.attribute.length){
    drawParallelCoordPlot(dataset,order_axis);
    order_axis = [];
    d3.selectAll(".dot").style("fill","#3498db");
  }
}




