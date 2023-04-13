#!/usr/bin/env node
//✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤
const support = [
    { prefix: "data:image/jpeg;base64," , mimes: ["image/jpg","image/jpeg","image/x-citrix-jpeg","image/pjpeg"] , extensions: [".jpg",".jpeg"] },
    { prefix: "data:image/png;base64,"  , mimes: ["image/png","image/x-png","image/x-citrix-png"]               , extensions: [".png"]         },
    { prefix: "data:image/gif;base64,"  , mimes: ["image/gif"]                                                  , extensions: [".gif"]         },
    { prefix: "data:image/bmp;base64,"  , mimes: ["image/bmp"]                                                  , extensions: [".bmp"]         },
    { prefix: "data:image/tiff;base64," , mimes: ["image/tiff","image/tif"]                                     , extensions: [".tif",".tiff"] },
];
//✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤
const args = process.argv.slice(2);
if (args.length == 0) {
    const pkg = require("./package.json");
    const supportFormats = function() {
        var resp = [];
        for (var i=0;i<support.length;i++) resp.push(...support[i].extensions);
        return resp.sort().join(", ");
    };
    const supportMimes = function() {
        var resp = [];
        for (var i=0;i<support.length;i++) resp.push(...support[i].mimes);
        return resp.sort().join(", ");
    };
    console.log(
`
    software          : ${pkg.name} (v${pkg.version})
    information       : ${pkg.description}
    author            : ${pkg.author}
    usage             : ${pkg.name} <url|file|-json:file>
    supported formats : ${supportFormats()}
    supported mimes   : ${supportMimes()}
`
    );
    process.exit(0);
}
//✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤
const isUrl = require("is-url");
const request = require("sync-request");
const fs = require("fs");
const PATH = require("path");
const prefixFromContentType = function(contentType) {
    if (typeof contentType != "string") return null;
    contentType = contentType.toLowerCase();
    for (var i=0;i<support.length;i++) {
        if (support[i].mimes.indexOf(contentType)>=0) {
            return support[i].prefix;
        }
    }
    return null;
};
const prefixFromPath = function(path) {
    if (typeof path != "string") return null;
    if (!fs.existsSync(path)) return null;
    var extension = PATH.extname(path).toLowerCase();
    for (var i=0;i<support.length;i++) {
        if (support[i].extensions.indexOf(extension)>=0) {
            return support[i].prefix;
        }
    }
    return null;
};
//✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤
const primitiveDecode = function(arg) {
    if (isUrl(arg)) {
        var data = request("GET",arg);
        var dtyp = data.headers["content-type"];
        var pref = prefixFromContentType(dtyp);
        if (pref == null) throw new Error("mime format not admitted : " + dtyp);
        var base = data.getBody("base64");
        return pref+base;
    } else {
        var pref = prefixFromPath(arg);
        if (pref == null) throw new Error("file format not admitted : " + arg);
        var data = fs.readFileSync(arg,"binary"); 
        var base = Buffer.from(data,"binary").toString("base64");
        return pref+base;
    }
};
//✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤
while (args.length > 0) {
    var arg = args.shift();
    try {
        if (arg.startsWith("-json:")) {
            var jsonParser = function(key,value) {
                if (typeof value === "string") {
                    var backup = value;
                    try {
                        value = primitiveDecode(value);
                    } catch {
                        value = backup;
                    }
                }
                return value;
            };
            var json = JSON.parse(fs.readFileSync(arg.substring(6),"utf8"),jsonParser);
            fs.writeFileSync(arg.substring(6),JSON.stringify(json,null,2),"utf8");
        } else {
            console.log(primitiveDecode(arg));
        }
    } catch(e) {
        console.error(arg,e);
    }
}
//✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤✤


