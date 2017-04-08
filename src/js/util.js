/**
 * @author Yusef Sohail
 */
import {Objs} from "../lib/Objs";

let copy = (src, dst, off) => {
    for(let i = 0; i < src.length;i++)
        dst[off + i] = src[i];
}

let createThreeMesh = (model) => {
    let srcVertices = model.vertices;

    let vertices = new Float32Array(3 * 3 * model.faces.length);
    let normals = new Float32Array(3 * 3 * model.faces.length);

    let index = 0;
    for(let face of model.faces) {
        copy(srcVertices[face.a.v], vertices, index);
        copy(srcVertices[face.b.v], vertices, index + 3);
        copy(srcVertices[face.c.v], vertices, index + 6);
        index += 9;
    }

    let max = -1;
    for(let i = 0; i < vertices.length/3;i++) {
        let x = vertices[i*3+0];
        let y = vertices[i*3+1];
        let z = vertices[i*3+2];
        let len = Math.sqrt(x * x + y * y + z * z)
        if(len > max)
            max = len;
    }

    let geom = new THREE.BufferGeometry();
    geom.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

    //console.log(geom)
    // Center / Scale / Normals
    geom.center();
    //geom.normalize();
    geom.computeVertexNormals();

    // Double sided and red
    let mat = new THREE.MeshLambertMaterial({ color : 0xEEEEEE });
    mat.side = THREE.DoubleSide

    let mesh = new THREE.Mesh(geom, mat);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1 / max;

    return mesh
}

//http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element);
    return true;
}

let downloadModel = (filename, modelname, model) => {
    var text = "var LoadedOBJFiles = LoadedOBJFiles || {};\n";
    text += "LoadedOBJFiles[\"" + modelname + "\"] =" + JSON.stringify(model) + ";\n";
    return downloadFile(filename, text);
}

let downloadImages = (filename, images) => {
    if(!filename || !images)
        return false;

    var text = "var LoadedImageFiles = LoadedImageFiles || {};\n"
    for(let image in images) {
        text+="LoadedImageFiles[\"" + image + "\"] = new Image();\n" 
        text+="LoadedImageFiles[\"" + image + "\"].src=\"" + images[image] + "\";\n"; 
    }

    return downloadFile(filename, text);
}

let loadImage = (image) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = (e) => { resolve(e.target.result); }
        reader.onerror = (e) => { reject(e); }
        reader.readAsDataURL(file);
    })
}

let fileExtension = (filename) => {
    let ext = filename.split(".").pop();
    if(!ext)
        return null;
    
    return ext.toLowerCase();
}

let readFile = (file) => {
    return new Promise((resolve, reject) => {
        let ext = fileExtension(file.name);

        let type = null;
        if(["png", "jpg", ".bmp"].includes(ext)) 
            type = "image";

        if(ext == "obj")
            type = "obj";

        if(type == null)
            reject(new Error("Unknown File Type"));

        let reader = new FileReader();
        reader.onload = (e) => { resolve( { type, name : file.name, data : e.target.result }); }
        reader.onerror = (e) => { reject({message : "Failed to read file"});}

        if(type == "image")
            reader.readAsDataURL(file);
        else 
            reader.readAsText(file);
    });
}


let processFile = (file) => {
    return new Promise((resolve, reject) => {
       if(file.type == "image") {
           file.processedData = file.data;
           file.displayData = new Image();
           file.displayData.src = file.data;
           resolve(file);
       }else {
           file.processedData = null;
           file.displayData = null;
           try {
                let model  = Objs.parseObj(file.data);
                let threeModel = createThreeMesh(model);
                file.processedData = model;
                file.displayData = threeModel;
                resolve(file);
           }catch(e) {
                reject({message : "Failed to process file"});
           }
       }
            
    });
}

let createAssetText = (file) => {
    let str = "var PreLoadedAssets = PreLoadedAssets || {};\n";
    if(file.type == "image") {
        str += "PreLoadedAssets[\"" + file.name + "\"] = new Image();\n"
        str += "PreLoadedAssets[\"" + file.name + "\"].src = \"" + file.processedData.src + "\""
    }else {
        str += "PreLoadedAssets[\"" + file.name + "\"] = " + JSON.stringify(file.processedData)
    }
    return str;
}

export { createThreeMesh, fileExtension, readFile, processFile, createAssetText }