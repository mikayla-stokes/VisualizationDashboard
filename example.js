// U99796912

function main () {
    d3.csv('/MockStockData.csv', d3.autoType).then(
        function (d) {
            
            // filter data based on user selections
            const filteredData = d.filter(element => {
                const date = new Date(element.Date);
                return element.Stock === stockName && date >= startDate && date <= endDate;
            });

            // Parse the CSV file to extract details
            for (let index = 0; index < filteredData.length; index++) {
                const element = filteredData[index];
                console.log(element.Date);
                console.log(element.Stock);
                console.log(element.Price);
            }
            // Create the line chart
            const svg = d3.select("body").append("svg")
                .attr("width", 600)
                .attr("height", 600);

            const margin = { top: 20, right: 30, bottom: 30, left: 40 },
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleTime()
                .domain(d3.extent(filteredData, d => new Date(d.Date)))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(filteredData, d => d.Price)])
                .nice()
                .range([height, 0]);

            const line = d3.line()
                .x(d => x(new Date(d.Date)))
                .y(d => y(d.Price));

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Price ($)");

            g.append("path")
                .datum(filteredData)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        }
    );
}

main();
