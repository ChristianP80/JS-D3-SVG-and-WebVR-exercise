addEventListener('load', function() {

  var mainFetch;
  var categories = {};
  var body = document.body;
  var table = document.getElementById('categoriesTable')

  fetch('https://www.fixmystreet.com/open311/v2/requests.json?jurisdiction_id=fixmystreet.com&agency_responsible=2514&start_date=2018-04-01&end_date=2018-04-30')
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      mainFetch = result.requests[0];

      for (var i = 0; i < mainFetch.request.length; i++) {
        var post = mainFetch.request[i]
        var name = post.service_name;

        if (categories.hasOwnProperty(name)) {
          categories[name] += 1;
        } else {
          categories[name] = 1
        }
      }
      createTable();
      createDiagram();
      setUpScene();
      create3dDiadram();
    });

  function createTable() {
    Object.keys(categories).forEach(function(key) {
      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = key;
      cell2.innerHTML = categories[key];
      row.addEventListener('mouseenter', function(event) {
        event.target.style.background = "Steelblue ";
      });
      row.addEventListener('mouseleave', function(event) {
        event.target.style.background = "white";
      });
    });
  }

  var tooltip = d3.select(body)
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  function createDiagram() {
    var listOfCategories = [];
    var indexList = []
    Object.keys(categories).forEach(function(index) {
      listOfCategories.push(categories[index]);
      indexList.push(index)
    });
    var height = 400;
    var width = 800;

    var xScale = d3.scaleLinear()
      .domain([0, listOfCategories.length])
      .range([30, width]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(listOfCategories)])
      .range([height - 30, 30]);

    var yAxis = d3.axisLeft().scale(yScale);
    var xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(listOfCategories.length)
      .tickFormat(function(value, index) {
        return indexList[index];
      });

    var svg = d3.select('body')
      .append('svg')
      .attr('height', height + 150)
      .attr('width', width);

    svg.selectAll('rect')
      .data(listOfCategories)
      .enter()
      .append('rect')
      .attr('x', function (value, index) { return xScale(index); })
      .attr('y', function (value) { return yScale(value); })
      .attr('width', function () { return width / listOfCategories.length - 10; })
      .attr('height', function (value) { return height - yScale(value) - 30; })
      .attr('fill', 'steelblue')

      .on("mouseover", function(value, index){tooltip.text("There are " + value + " reports in " + indexList[index])
      d3.event.target.style.fill = "hotpink";
      return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){
        d3.event.target.style.fill = "steelblue";
        return tooltip.style("visibility", "hidden")
    ;});

    svg.append('g')
      .attr('transform', 'translate(25, 0)')
      .call(yAxis);

    svg.append('g')
      .attr('transform', 'translate(0, 380)')
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");
    }  

  function create3dDiadram() {
    var spaceing = -90;

    Object.keys(categories).forEach(function(key) {
      var box = document.createElement('a-box');
      box.setAttribute('height', categories[key]);
      box.setAttribute('width', '2');
      box.setAttribute('depth', '2');
      box.setAttribute('color', 'steelblue');
      box.setAttribute('position', spaceing + ' '  + (-20 + categories[key] / 2) + ' ' + '-100');
      scene.appendChild(box);
      spaceing += 3;
    });
  }

  var scene;

  function setUpScene() {
    var div = document.createElement('div');
    body.appendChild(div);
    div.style.height = "1000px";

    scene = document.createElement('a-scene');
    scene.setAttribute('height', '1000px');
    scene.setAttribute('embedded', 'true');
    div.appendChild(scene);


  }
});
