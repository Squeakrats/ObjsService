/**
 * @author Yusef Sohail
 */

(function(root, factory) {
    if(typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.Objs = factory();
    }
}(this, function() {

var Objs = {};

/**
 * @class Structure for holding vertex data
 * @param {Int} index Vertex position index
 * @param {Int} uvIndex Texture coordinate index
 * @param {Int} normalIndex normal index
 */
class Vertex3 {
    constructor(index, uvIndex, normalIndex) {
        this.v = index;
        this.vt = uvIndex;
        this.vn = normalIndex;
    }

    static fromValues(values) {
        return new Vertex3(values[0], values[1], values[2]);
    }
}

/**
 * @class Structure for holding face data. (order 3)
 * @param {Int} a First vertex
 * @param {Int} b Second vertex
 * @param {Int} c Third vertex
 * @param {Int} m Material Index
 */
class Face3 {
    constructor(a, b, c, m=null) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.m = m;
    }
}

class Model {
    constructor() {
        this.vertices = []; // [v1, v2, v3, ... ]
        this.normals = []; // [n1, n2, n3, ... ]
        this.UVs = []; // [uv1, uv2, uv3, ... ]
        this.faces = []; // [f1, f2, f3, ...]
        this.groups = {};  // { groupname : [f1, f2, f3, ... ] }
        this.materials = []; // [materialname1, materialname2, ... ]
        this.mtllibs = []; // [filename1, filename2, ... ]
    }
}

let isString = (object) => { return typeof object == 'string' || object instanceof String }
let Index = (index, array) => { return (index >= 0)? index - 1 : array.length + index }
let parseVec3 = (tokens) => { return [ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ] }

// Makes a GET request to the given url. 
let getRequest = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function() {
            if(this.status != 200) 
                reject({ status : xhr.status, statusText : xhr.statusText });
            
            resolve(xhr.response);
        }
        xhr.onerror = function () { reject({ status : xhr.status, statusText : xhr.statusText }); }
        xhr.send();
    });
}

// converts order n face to array of order 3 using triangle fan method.
let triangulate = (vertices, materialIndex) => {
    if(vertices.length < 3)
        throw new Error("Must have at least 3 vertices to triangulate");

    if(vertices.length == 3) 
        return [new Face3(vertices[0], vertices[1], vertices[2], materialIndex)];

    // pick starting vertex 
    let faces = [];
    let v0 = vertices[0];
    for(var i = 2; i < vertices.length;i++) {
        let v1 = vertices[i-1];
        let v2 = vertices[i];
        faces.push(new Face3(v1, v2, v0, materialIndex)); // [v1, v2, v0]
    }
    return faces;
}

/**
 * @function Loads the given url and parses it as an .obj file
 * @param {String} url Url to load model from
 * @return {Promise} Promise to be resolved when the model has been parsed
 */
Objs.loadObj = (url) => {
    return getRequest(url).then((response)=> {
        return Objs.parseObj(response);
    })
}

/**
 * @function Parses a string as an .obj file
 * @param {String} stringText String to parse
 * @return {Model} Model representing the .obj file
 */
Objs.parseObj = (stringText) => {
    let model = new Model();
    let activeGroups = null;
    let activeMaterialIndex = null;

    stringText.split("\n").forEach((line)=> {
        if(!isString(line))
            return;

        let tokens = line.match(/\S+/g);
        if(!tokens || !tokens.length)
            return;
        
        switch(tokens[0]) {
            case 'g':
            {
                let names = (tokens.length == 1)? ["default"] : tokens.slice(1);

                for(let name of names)
                     if(!model.groups[name])
                        model.groups[name] = [];

                activeGroups = names;
                break;
            }
            case 'v':
               model.vertices.push(parseVec3(tokens)); break; 
            case 'vt':
                model.UVs.push(parseVec3(tokens)); break;
            case 'vn':
                model.normals.push(parseVec3(tokens)); break;
            case 'f':
            {
                if(tokens.length < 3) 
                    throw Error("Error: face element must contain at least 3 indices");
                    
                let vertices = [];
                for(var i = 1; i < tokens.length;i++) {
                    let subtoks = tokens[i].split("/");
                    let vertexIndex = Index(parseInt(subtoks[0]), model.vertices);
                    let uvIndex = (!!subtoks[1])? Index(parseInt(subtoks[1]), model.UVs): null;
                    let normalIndex = (!!subtoks[2])? Index(parseInt(subtoks[2]), model.normals): null;
                    let vertex = new Vertex3(vertexIndex, uvIndex, normalIndex);
                    vertices.push(vertex);
                }

                for(let face of triangulate(vertices, activeMaterialIndex)) {
                    model.faces.push(face);
                    if(activeGroups) {
                        for(let group of activeGroups)
                            model.groups[group].push(face);
                    }
                }
                break;
            }
            case 'usemtl':
            {
                let index = model.materials.indexOf(tokens[1]);
                if(index < 0) {
                    index = model.materials.length;
                    model.materials.push(tokens[1]);
                }
                activeMaterialIndex = index; break;
            }
                
            case 'mtllib':
                model.mtllibs.push(tokens[1]); break;
            default: 
        }
    })
    return model;
}

return Objs
}));
