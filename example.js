// U99796912

document.addEventListener("DOMContentLoaded", function() {

    // Create the SVG element in the DOM
    const svg = d3.select("body").append("svg")
        .attr("id", "chart")
        .attr("width", 600)
        .attr("height", 600);

    function main() {
        d3.csv('/MockStockData.csv', d3.autoType).then(function(d) {
            const uniqueStocks = [...new Set(d.map(item => item.Stock))];
            const stockSelect = d3.select("#stockSelect");

            uniqueStocks.forEach(stock => {
                stockSelect.append("option").text(stock).attr("value", stock);
            });

            document.getElementById('filterButton').addEventListener('click', function() {
                const stockName = document.getElementById('stockSelect').value;
                const startDate = new Date(document.getElementById('startDate').value);
                const endDate = new Date(document.getElementById('endDate').value);

                const filteredData = d.filter(element => {
                    const date = new Date(element.Date);
                    return element.Stock === stockName && date >= startDate && date <= endDate;
                });

                drawChart(filteredData);
            });

            function drawChart(data) {
                d3.select("#chart").selectAll("*").remove();

                const margin = { top: 20, right: 30, bottom: 30, left: 40 },
                    width = +svg.attr("width") - margin.left - margin.right,
                    height = +svg.attr("height") - margin.top - margin.bottom,
                    g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

                const x = d3.scaleTime()
                    .domain(d3.extent(data, d => new Date(d.Date)))
                    .range([0, width]);

                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.Price)])
                    .nice()
                    .range([height, 0]);

                const line = d3.line()
                    .x(d => x(new Date(d.Date)))
                    .y(d => y(d.Price));

                g.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x));

                g.append("g")
                    .call(d3.axisLeft(y))
                    .append("text")
                    .attr("fill", "#000")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Price ($)");

                g.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", line);

                // Add tooltip
                const tooltip = d3.select("body").append("div")
                    .style("opacity", 0)
                    .style("position", "absolute");

                g.selectAll("dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", 5)
                    .attr("cx", d => x(new Date(d.Date)))
                    .attr("cy", d => y(d.Price))
                    .on("mouseover", function(event, d) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(`Stock: ${d.Stock}<br/>Date: ${d.Date}<br/>Price: ${d.Price}`)
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }

            // Initial draw with default values
            const initialStockName = uniqueStocks[0];
            const initialStartDate = new Date('2023-01-01');
            const initialEndDate = new Date('2023-12-31');
            const initialFilteredData = d.filter(element => {
                const date = new Date(element.Date);
                return element.Stock === initialStockName && date >= initialStartDate && date <= initialEndDate;
            });

            drawChart(initialFilteredData);
        });
    }

    main();
});
