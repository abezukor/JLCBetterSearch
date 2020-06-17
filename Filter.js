class Filter{
    constructor(text, col, id){
        console.log(text,col);
        this.col = col;
        this.text = text
        this.id = id;

        /*var colTitles = {
            0: "LCSC Part",
            1: "MFR.Part",
            2: "First Category",
            3: "Second Category",
            4: "Package",
            5: "Solder Joint",
            6: "Manufacturer",
            7: "Library Type",
            8: "Description",
            9: "Datasheet",
            10: "Price",
            11: "Stock"
        }*/
        this.displayText = text + " in " + col;
    }
    filter(part) {
        //console.log(part,this.col,this.text);
        return part[this.col].includes(this.text)
    };
}