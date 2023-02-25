var fs = require('fs');

function loadjson(filepath) {
    var data;
    try {
        var jsondata = fs.readFileSync(filepath, "utf-8")
        data = JSON.parse(jsondata);
    }
    catch (err) {
        console.log(err);
    }
    return data;
}

function savejson(filepath, data) {
    var datastr = JSON.stringify(data, null, 4);

    if (datastr) {
        try {
            fs.writeFileSync(filepath, datastr);
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = {
    loadjson,
    savejson
}