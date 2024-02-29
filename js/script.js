let width = 800;
let height = 600;

let geoData;
let countyData;

let feilds = [
    "poverty_perc", "median_household_income", "education_less_than_high_school_percent", 
    "air_quality", "park_access", "percent_inactive", "percent_smoking", "urban_rural_status", 
    "elderly_percentage", "number_of_hospitals", "number_of_primary_care_physicians", 
    "percent_no_heath_insurance", "percent_high_blood_pressure", "percent_coronary_heart_disease",
    "percent_stroke","percent_high_cholesterol"
];


d3.select(".fieldOne")
    .append("span")
        .text("Field One: ")
    .append("select")
        .attr("class", "firstData");

d3.select(".fieldTwo")
    .append("span")
        .text("Field Two: ")
    .append("select")
        .attr("class", "secondData");

for(let i=0; i<feilds.length; i++)
{
    let words = feilds.at(i).split("_");
    let completedWord = "";
    for(let j=0; j<words.length; j++)
    {
        let firstLetterCap = words.at(j).charAt(0).toUpperCase();
        let otherLetters = words.at(j).slice(1);
        completedWord = completedWord + firstLetterCap + otherLetters + " ";
    }
    d3.select(".firstData")
    .append("option")
    .attr("value", feilds.at(i))
    .attr("label", completedWord)
    .text(feilds.at(i));

    d3.select(".secondData")
        .append("option")
        .attr("value", feilds.at(i))
        .attr("label", completedWord)
        .text(feilds.at(i));
}

Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"),
    d3.csv("../national_health_data.csv")
]).then(data => {
    geoData = data[0];
    countyData = data[1];

    geoData.objects.counties.geometries.forEach(d => {
        for(let i=0; i < countyData.length; i++)
        {
            if(d.id == countyData.at(i).cnty_fips)
            {
                feilds.forEach(feild =>{
                    d.properties[feild] = countyData.at(i)[feild];
                });                
            }
        }
    })

    const choroplethMap = new ChoroplethMap({
        parentElement: '.firstVis',
    }, geoData, ".firstData");

    const compMap = new ChoroplethMap({
        parentElement: '.secondVis',
    }, geoData, ".secondData");

    d3.select(".dataVis").on("change", () => {
        d3.select(".firstVis > svg").remove();
        d3.select(".secondVis > svg").remove();
    
        let dataRep = d3.select(".dataVis").node().value;

        if(dataRep === "Histogram")
        {
            const histo = new Histogram({
                parentElement: '.firstVis',
            }, geoData, ".firstData");

            const histoTwo = new Histogram({
                parentElement: '.secondVis',
            }, geoData, ".secondData");
        }
        else if(dataRep === "ChoroplethMap")
        {
            const choroplethMap = new ChoroplethMap({
                parentElement: '.firstVis',
            }, geoData, ".firstData");
        
            const compMap = new ChoroplethMap({
                parentElement: '.secondVis',
            }, geoData, ".secondData");
        }
        else if(dataRep == "Scatterplot")
        {
            const scatter = new Scatterplot({
                parentElement: '.firstVis',
            }, geoData);
        }
    
    
    });
    
});

