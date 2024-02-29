class Histogram 
{
    constructor(_config, _data, _selection)
    {
        this.config = 
        {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 350,
            margin: _config.margin || {top: 10, right: 10, bottom: 10, left: 20},
            tooltipPadding: 10,
            legendBottom: 50,
            legendLeft: 50,
            legendRectHeight: 12, 
            legendRectWidth: 150
        }

        this.threshold = 100;

        this.data = _data;

        this.selection = _selection;

        this.currentData = d3.select(this.selection).node().value;

        this.us = _data;

        this.active = d3.select(null);

        this.initHistogram();
    }

    initHistogram() 
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
        
        this.updateGraph();
        
        
        d3.select(this.selection).on("change",  () => {
            this.currentData = d3.select(this.selection).node().value;
            vis.svg.selectAll("g").remove();
            this.updateGraph();
        });
    }

    updateGraph()
    {
        let vis = this;
            vis.bins = d3.bin()
            .thresholds(vis.threshold)
            .value((d) => {
                return d.properties[this.currentData];
                
                
            })
            (topojson.feature(vis.us, vis.us.objects.counties).features);

        vis.x = d3.scaleLinear()
            .domain([vis.bins[0].x0, vis.bins[vis.bins.length-1].x1 +1])
            .range([vis.config.margin.left, vis.width + vis.config.margin.left]);


        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.bins, (d) => d.length)])
            .range([vis.height, vis.config.margin.bottom]);

        vis.svg.append("g")
        .selectAll()
        .data(vis.bins)
        .enter().append("rect")
            .attr("fill", "steelblue")
            .attr("x", (d) => 
            {
                return vis.x(d.x0) + 1
            })
            .attr("width", (d) => vis.x(d.x1) - vis.x(d.x0) - 1)
            .attr("y", (d) => vis.y(d.length))
            .attr("height", (d) => vis.y(0) - vis.y(d.length));
        
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.x).ticks(vis.width/80).tickSizeOuter(0))
            .call((g) => g.append("text")
                .attr("x", width)
                .attr("y", vis.config.margin.bottom - 20)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(vis.currentData));
        
        vis.svg.append("g")
            .attr("transform", `translate(${vis.config.margin.left+15}, 0)`)
            .call(d3.axisLeft(vis.y).ticks(vis.height/40))
            .call((g) => g.append("text")
            .call((g) => g.remove(".domain"))
                .attr("x", -vis.config.margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Frequency (# of counties"));
        }
}