function pageDefault() {    
    var dataSelect = d3.select("#selDataset");

    d3.json("data/samples.json").then((data) => {
        var names = data.names;
        console.log(names);

        dataSelect.selectAll("option")
            .data(names)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        var startUp = names[0];

        buildPlots(startUp);
        demographics(startUp);
        
    }).catch(error => console.log(error));
};

pageDefault();

function newData(newID) {
    buildPlots(newID);
    demographics(newID);
};

function buildPlots(id) {
    d3.json("data/samples.json").then((data) => {
        var filterData = data.samples.filter((sample) => sample.id === id);
        var result = filterData[0];
        console.log(filterData);
        console.log(result);

        var topTen = [];
        for (i=0; i<result.sample_values.length; i++) {
            topTen.push({
                id: `OTU ${result.otu_ids[i]}`,
                value: result.sample_values[i],
                label: result.otu_labels[i]
            });
        }
        console.log(topTen);

        var topTenSort = topTen.sort(function sortFUnction(a,b) {
            return b.value - a.value;
        }).slice(0,10);
        console.log(topTenSort);
    })
};