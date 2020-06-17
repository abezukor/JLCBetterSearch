var filters = [];
var filterID = 0;
var parts;
//makes an parts array
function processData(allText) {
    //console.log(allText);
    var psv = d3.dsvFormat("|");
    parts = psv.parse(allText);
    parts.shift();
    console.log(parts[12]);
    partslistupdate();
}
//updates everything
function updateLists(){
    partslistupdate();
    filtersListUpdate();
}
//Next and previous page buttons
function changepage(i){
    var pnum = document.getElementById('pagenum');
    var newpage = Number(pnum.value) + Number(i);
    var minpage = Number(pnum.getAttribute("min"));
    var maxpage = Number(pnum.getAttribute("max"));
    console.log("Values: ", minpage, maxpage, newpage, newpage => minpage);
    if (newpage>=minpage && newpage<=maxpage){
        document.getElementById('pagenum').value = newpage;
        partslistupdate();
    }
}
//updates the parts list and the numbers
function partslistupdate(){
    console.log("Rerender");
    newpts = applyFilters(parts);
    document.getElementById("resultscount").innerHTML = newpts.length;
    var numperpage = Number(document.getElementById("numtoDisplay").value);
    var pagenum = Number(document.getElementById("pagenum").value)-1;
    document.getElementById("pagenum").setAttribute("max", Math.floor(newpts.length/numperpage)+1);
    console.log(numperpage*pagenum+numperpage);
    document.getElementById("pagecount").innerHTML = Math.floor(newpts.length/numperpage)+1;
    renderTable(newpts,numperpage*pagenum, numperpage*pagenum+numperpage)
}
//updates the filters list
function filtersListUpdate(){
    var list = document.getElementById("filtersList");
    $('.filterListItem').remove();
    filters.forEach(function (filter) {
            var btn = document.createElement("button");
            btn.innerHTML = "Remove: " + filter.displayText;
            btn.setAttribute("onclick", "removeFilter("+ filter.id +")");
            btn.className="filterListItem";

            list.appendChild(btn);
    });
}
//apply the filter to a big parts list
function applyFilters(parts){
    function checkPart(part){
        var passes = true;
        filters.forEach(function (filter) {
            passes = passes && filter.filter(part);
        });
        return passes;
    }
    var filteredparts = parts.filter(checkPart); 
    return filteredparts
}
//render the parts table
function renderTable(displayparts,startnum=0,endnum=300){
    console.log(startnum,endnum);
    var partsTable = document.getElementById("partsTable");

    $('.partdata').remove();
    var rowkeys = ["LCSC Part", "MFR.Part", "First Category", "Second Category", "Package", "Solder Joint", "Manufacturer", "Library Type", "Description", "Datasheet", "Price", "Stock"];
    var i, j;
    for(i=startnum; i<displayparts.length && i<endnum; i++){
        var partRow = partsTable.insertRow(-1);
        partRow.setAttribute("class", "partdata");
        for(j=0; j<12;j++){
            varField = partRow.insertCell(-1);
            switch(j){
                case 9:
                    varField.innerHTML = displayparts[i][rowkeys[j]].link(displayparts[i][rowkeys[j]]);
                    varField.children[0].setAttribute("target", "_blank"); 
                    varField.children[0].setAttribute("class", "partdata");
                    break;
                default:
                    varField.innerHTML = "<p class =\"partdata\">" + displayparts[i][rowkeys[j]] + "</p>";
            }
            
        }
    }
}
function makeFilter(){
    var filterform = document.forms["filtermaker"];
    console.log(filterform);
    filters.push(new Filter(filterform["search_term"].value, filterform["attributesselect"].value, filterID));
    filterID++;
    updateLists();
}
function removeFilter(id) {
    function checkFilter(filter){
        return filter.id != id
    }
    filters = filters.filter(checkFilter);
    updateLists();
}