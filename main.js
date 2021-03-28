// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 2500;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275 + 50;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;


let svgOne = d3.select("#graph1")
    .append("svg")
    .attr('width', graph_1_width)     
    .attr('height', graph_1_height)     
    .append("g")
    .attr('transform', `translate(${margin.left},${margin.top})`);


// Set up reference to count SVG group for Graph One
let countRef = svgOne.append("g");

let svgTwo = d3.select("#graph2")
    .append("svg")
    .attr('width', graph_2_width)     
    .attr('height', graph_2_height)     
    .append("g")
    .attr('transform', `translate(${margin.left},${margin.top})`);

let countRefTwo= svgTwo.append("g");

let tooltip = d3.select("#graph2")     
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

let svgThree = d3.select("#graph3")
    .append("svg")
    .attr('width', graph_3_width)     
    .attr('height', graph_3_height)     
    .append("g")
    .attr('transform', `translate(${margin.left},${margin.top})`);

csv_file = ["../data/graphOne.csv", "../data/graphTwo.csv","../data/graphThree.csv"]

// Graph One - Line graph 
d3.csv(csv_file[0]).then(function(data) {
    
    // x elements in width - represents the years 
    var x = d3.scaleBand()
        .domain(data.map(function myFunction(d) {return d.year}))
        .range([ 0, graph_1_width - margin.left - margin.right ])
        .padding(1);
    
    // Create x axis 
    svgOne.append("g")
        .attr("transform", `translate(0, ${graph_1_height - margin.top - margin.bottom})`)   
        .call(d3.axisBottom(x).tickSize(0).tickPadding(10));


    // y elements in height - represent the # of football games     
    var y = d3.scaleLinear()
        .domain([d3.min(data, function(d,i)  {
            return parseInt(d.count) - 200
        }) , d3.max(data, function(d,i)  {
            return parseInt(d.count) +200
        })  ])
        .range([ graph_1_height  - margin.top - margin.bottom, 0 ]);
    y.nice()

    // Create y axis 
    svgOne.append("g")
        .call(d3.axisLeft(y).tickSize(-5).tickPadding(10))


    // Create the path crossing pass each height
    svgOne.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#2A7AB0")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d['year']) })
        .y(function(d) { return y(parseInt(d['count']))})
        )

    // Create circles around year
    let dots = svgOne.selectAll("dot").data(data);

    dots.enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.year); })      
        .attr("cy", function (d) { return y(d.count); })      
        .attr("r", 4)       
        .style("fill",  "#34385e" )

    let counts = countRef.selectAll("text").data(data);

    // Create 
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {
            return x(d['year']) - 12})       
            .attr("y", function(d) { return y(d['count'])  + 25})      
            .style("text-anchor", "start")
            .text(function(d) {
                return parseInt(d['count'])});
    
    // X axis Title
    svgOne.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2 },
        ${(graph_1_height - margin.top - margin.bottom) + 40})`)       
        .style("text-anchor", "middle")
        .style("font-size", 13)
        .text("Years");

    // Y Axis Title 
    svgOne.append("text")
        .attr("transform", `translate(-100, ${(graph_1_height - margin.top - margin.bottom) / 2})`)      
        .style("text-anchor", "middle")
        .style("font-size", 13)
        .text("# of Football Games");

    // Title of Graph
    svgOne.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`)       
        .style("text-anchor", "middle")
        .style("font-size", 18)
        .text("Number of Football Games From 2000-2004")
})



// Bar Graph - Top 10 Winning Nations

d3.csv(csv_file[1]).then(function(data) {

    // Top 10 Countries 
    data = cleanData(data, function(a,b) {
        return parseInt(b.winningPerc)-parseInt(a.winningPerc);
    });

    let x = d3.scaleLinear()
        .domain([0,d3.max(data, function(d,i)  {
            return parseInt(d.winningPerc)
        })])
        .range([0, graph_2_width - margin.left - margin.right -20]);

    let y = d3.scaleBand()
        .domain(data.map(function(d) { return d['country']}))
        .range([0, graph_2_height - margin.top - margin.bottom])
        .padding(0.1);  
    
    svgTwo.append("g").call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svgTwo.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["country"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    let mouseover = function(d) {
        let color_span = `<span style="color: #406098;">`;
        let html = `${color_span}${d.country}</span><br/>
            Number of Wins: ${color_span}${d.wins}</span><br/>
            Number of Neutrals: ${color_span}${d.neutrals}</span><br/>
            Total Number of Matches: ${color_span}${d.total}</span>`;      

        tooltip.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY)} + 100px`)
                .style("box-shadow", `2px 2px 5px ${color(d.country)}`)   
                .transition()
                .duration(200)
                .style("opacity", 0.9)
};

    let mouseout = function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    };

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['country']); })
        .attr("x", x(0))
        .attr("y", function(d) {
            return y(d['country']);
        })               
        .attr("width", function(d) {
            return x(parseInt(d['winningPerc']));
        })
        .attr("height",  y.bandwidth())
        .on("mouseover", mouseover) 
        .on("mouseout", mouseout);;

    let counts = countRefTwo.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {
            return   x(d['winningPerc']) + 5
        })      
        .attr("y", function(d) { return y(d.country) + 10})      
        .style("text-anchor", "start")
        .text(function(d) {
            return parseInt(d['winningPerc']) + "%"
        });           

    svgTwo.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
        ${(graph_2_height - margin.top - margin.bottom +30)})`)       
        .style("text-anchor", "middle")
        .text("Winning Percentages");


    svgTwo.append("text")
        .attr("transform", `translate(-120, ${(graph_2_height - margin.top - margin.bottom) / 2})`)       
        .style("text-anchor", "middle")
        .text("Nations");


    svgTwo.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-10})`)       
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 Nations in FIFA By Winning Percentages ");
})

function cleanData(data, comparator) {
    // sort the data
    var sorted = data.sort(comparator)
    // take top 10
    var elems = sorted.slice(0, 10)
    return elems;

}
// GRAPH 3 

let x_graphThree = d3.scaleLinear()
    .range([0, graph_3_width - margin.left - margin.right]);

let y_graphThree = d3.scaleBand()
    .range([0, graph_3_height - margin.top - margin.bottom])
    .padding(0.1);  

let countRef_graphThree = svgThree.append("g");

let y_axis_label_graphThree = svgThree.append("g");

let x_axis_text_graphThree = svgThree.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
    ${(graph_3_height - margin.top - margin.bottom) + 30})`)       
    .style("text-anchor", "middle")


let y_axis_text_graphThree = svgThree.append("text")
    .attr("transform", `translate(-120, ${(graph_3_height -50 - margin.top - margin.bottom) / 2})`)       
    .style("text-anchor", "middle")
    .text("Nations");

let title_graphThree = svgThree.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)       
    .style("text-anchor", "middle")
    .style("font-size", 18);

function dataTransform_graphThree(index, attr) {

    d3.csv(csv_file[2]).then(function(data) {

        data = cleanData_graphThree(data, index)

        x_graphThree.domain([0,d3.max(data, function(d, i)  {
            if (index == 0) {
                return parseInt(d.winningPerc)
            } else {
                return parseInt(d.victoryStrength)
            }
        })]);

        y_graphThree.domain(data.map(function myFunction(d) {
            return d.country 
        }) )

        y_axis_label_graphThree.call(d3.axisLeft(y_graphThree).tickSize(0).tickPadding(10))

        let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["country"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 15));

        let bars = svgThree.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color(d["country"]) })
            .attr("x", x_graphThree(0))
            .attr("y", function(d) {
                return y_graphThree(d["country"])
            })                 
            .attr("width", function(d) {
                return x_graphThree(parseInt(d[attr]))
            })
            .attr("height",  y_graphThree.bandwidth());        

        let counts = countRef_graphThree.selectAll("text").data(data);


        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) {
                return   x_graphThree(parseInt(d[attr])) + 5
            })        
            .attr("y", function (d) {
                return 23 + y_graphThree(d["country"])} )        
            .style("text-anchor", "start")
            .text(function(d) {
                return (d[attr]) + "%"
            });           
        
        main_title = '';
        if (index == 0) {
            main_title = "Winning Percentages"
        } else {
            main_title = "Victory Strengths"
        }
        
        x_axis_text_graphThree.text(main_title);

        title_graphThree.text("Top Performing Teams in Last 2 World Cup By " + main_title);

        bars.exit().remove();
        counts.exit().remove();
    });
}

function cleanData_graphThree(data, index) {
    sorted = data.sort(function(a,b) {
        if (index == 0) {
            return b.winningPerc - a.winningPerc
        } else {
            return b.victoryStrength - a.victoryStrength
        }
    })
    sliced = sorted.slice(0, 15)
    return sliced
}

dataTransform_graphThree(0, "winningPerc");
