function pageDefault() {    
    var dataSelect = d3.select("#selDataset");

    d3.json("data/samples.json").then(data => {
        var names = data.names;
        //console.log(names);

        dataSelect.selectAll("option")
            .data(names)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        var startUp = names[0];

        buildPlots(startUp);
        demographics(startUp);
        buildGauge(startUp);
        
    }).catch(error => console.log(error));
};





function newData(newID) {
    buildPlots(newID);
    demographics(newID);
};

function buildPlots(id) {
    d3.json("data/samples.json").then((data) => {
        var filterData = data.samples.filter(sample => sample.id == id);
        var result = filterData[0];
        //console.log(filterData);
        //console.log(result);

        var topTen = [];
        for (i=0; i<result.sample_values.length; i++) {
            topTen.push({
                id: `OTU ${result.otu_ids[i]}`,
                value: result.sample_values[i],
                label: result.otu_labels[i]
            });
        }
        //console.log(topTen);

        var topTenSort = topTen.sort(function sortFUnction(a,b) {
            return b.value - a.value;
        }).slice(0,10);
        //console.log(topTenSort);

        var topTenHorizontal = topTenSort.sort(function sortFunction(a,b) {
            return a.value - b.value;
        })
        //console.log(topTenHorizontal);

        var colors = ['#fff100', '#ff8c00', '#e81123', '#ec008c', '#68217a', '#00188f', '#00bcf2', '#00b294', '#009e49', '#bad80a']
        var traceHorizontal = {
            type: "bar",
            orientation: 'h',
            x: topTenHorizontal.map(row=> row.value),
            y: topTenHorizontal.map(row => row.id),
            text: topTenHorizontal.map(row => row.label),
            mode: 'markers',
            marker: {
                color: colors
            }
          };
        
        var horizontalData = [traceHorizontal];

        var horizontalLayout = {
            title: `<span style='font-size:1em; color:#00bcf2'><b>Top 10 OTUs for Subject ${id}<b></span>`,
            xaxis: {autorange: true, title: 'Sample Values'},
            yaxis: {autorange: true},
            width: 500,
            height: 500
          };

        Plotly.newPlot("bar", horizontalData, horizontalLayout);

        var bubbleTrace = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: 'Jet'
            },
            text: result.otu_labels
        };

        var bubbleData = [bubbleTrace];

        var bubbleLayout = {
            title: `<span style='font-size:1em; color:#00bcf2'><b>OTU Data for Subject ${id}<b></span>`,
            xaxis: {title:'OTU ID'},
            yaxis: {title: 'Sample Values'},
            width: window.width
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    }).catch(error => console.log(error));
};

function demographics(id) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterData = metadata.filter(stock => stock.id == id);
        var selection = d3.select("#sample-metadata");
        selection.html("");

        //console.log(filterData);

        Object.entries(filterData[0]).forEach(([key, value]) => {
            selection.append("h5")
                .text(`${key}: ${value}`);
        });
    });
};

function buildGauge(id) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterData = metadata.filter(stock => stock.id == id);
        console.log(filterData[0].wfreq);

        var gaugeTrace = {
            domain: {x:[0,1], y:[0,1]},
            value: filterData[0].wfreq,
            title: `<span style='font-size:1em; color:#00bcf2'><b>Washes Per Week for Subject ${id}<b></span>`,
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 15]},
                steps: [
                    {range: [0,1], color: "lightgray"},
                    {range: [1,2], color: "gray"}
                ],
                threshold: {
                    line: {color: "purple", width: 5},
                    thickness: 0.75,
                    value: filterData[0].wfreq
                }
            }
        };

        var gaugeData = [gaugeTrace];

        var gaugeLayout = {
            width: 500,
            height: 500
        };
    
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
};

pageDefault();