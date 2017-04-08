/**
 * @author Yusef Sohail
 */

// TODO add security warning. 

let scene, camera, renderer;
let model = null;

let main = () => {
    console.log("Running");

    let display = new ModelDisplay(800, 600);
    document.body.appendChild(display.renderer.domElement);

    var url = location.search.split('model=')[1]

    Objs.load(url).then((model)=> {
        model = model;
        display.setModel(createThreeMesh(model));
    })
    
    display.startRendering();
}

let test = () => {
    console.log("TEST");
    downloadModel("test.js", "test", model);
}