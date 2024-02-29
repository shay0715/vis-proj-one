class Scatterplot
{
    constructor(_config, _data)
    {
        this.config = 
        {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 1000,
            containerHeight: _config.containerHeight || 800,
            margin: _config.margin || {top: 10, right: 10, bottom: 10, left: 20},
            tooltipPadding: 10,
            legendBottom: 50,
            legendLeft: 50,
            legendRectHeight: 12, 
            legendRectWidth: 150
        }


        this.data = _data;

        this.firstData = d3.select(".firstData").node().value;
        this.secondData = d3.select(".secondData").node().value;


        this.us = _data;

        this.active = d3.select(null);

        this.initScatterplot();
    }

    initScatterplot() 
    {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr('class', 'center-container')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        vis.svg.append('rect')
            .attr('class', 'background center-container')
            .attr('height', vis.config.containerWidth )
            .attr('width', vis.config.containerHeight) 
            .on('click', vis.clicked);


        vis.updateGraphs();

        d3.select(".firstData").on("change", ()=>{
            
            vis.svg.selectAll("g").remove();
            this.firstData = d3.select(".firstData").node().value;

            vis.updateGraphs();
        })

        d3.select(".secondData").on("change", ()=>{
            
            vis.svg.selectAll("g").remove();
            this.secondData = d3.select(".secondData").node().value;

            vis.updateGraphs();
        })

    }

    updateGraphs()
    {
        let vis = this;
        vis.x = d3.scaleLinear()
                .domain(d3.extent(vis.data.objects.counties.geometries, d => d.properties[this.firstData] - 2))
                .range([vis.config.margin.left, vis.width+vis.config.margin.left]);

            vis.svg.append("g")
                .attr("transform", `translate(0, ${vis.height})`)
                .call(d3.axisBottom(vis.x));

            vis.y = d3.scaleLinear()
                .domain(d3.extent(vis.data.objects.counties.geometries, d => d.properties[this.secondData] - 2))
                .range([vis.height, 0]);

            vis.svg.append("g")
                .attr("transform", `translate(${vis.config.margin.left + 25}, 0)`)
                .call(d3.axisLeft(vis.y));

            vis.svg.append("g")
                .selectAll("dot")
                .data(topojson.feature(vis.us, vis.us.objects.counties).features)
                .enter().append("circle")
                    .attr("cx", (d) =>{
                        return vis.x(+d.properties[this.firstData]) - 1;
                    })
                    .attr("cy", (d) =>{
                        return vis.y(+d.properties[this.secondData]) - 1;
                    })
                    .attr("r", 2)
                    .attr("fill", "steelblue");

    }
}