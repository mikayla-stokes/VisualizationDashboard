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
        }
    );
}

main();
