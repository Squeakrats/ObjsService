/**
 * @author Yusef Sohail
 */

let DISPLAY_WIDTH = 800;
let DISPLAY_HEIGHT = 600;
let cameraInitialPosition = new THREE.Vector3(0.0, 0.0, 1.7);

export default class Display {
    constructor() {
        this.root = null;
        this.container = document.createElement("div");
        this.image = null;
        this.model = null;
        this.interval = null;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialiasing: true, alpha : true });
        this.initScene(DISPLAY_WIDTH, DISPLAY_HEIGHT);
        this.renderer.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);
        this.initListeners();
    }

    setRoot(root) {
        this.root = root;
        this.root.appendChild(this.container);
    }

    initScene(width, height) {
        this.renderer.setClearColor( 0xffffff, 0);
        this.camera = new THREE.PerspectiveCamera(75, width / height, .01, 100);
        this.scene.add(this.camera);

        var ambientLight = new THREE.AmbientLight(0x8F8F8F);
        this.scene.add(ambientLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, 10, 0);
        this.scene.add(spotLight);

        let segs = 4;
        let gridSize = 3;
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry( gridSize, gridSize, segs, segs ),
            new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true } )
        );
        this.plane.rotation.x = Math.PI/2;
        this.plane.position.y = -1;
        this.scene.add(this.plane);
    }

    initListeners() {
        let canvas = this.renderer.domElement;

        let getLocalSpaceMouse = (elem, e) => {
            var rect = elem.getBoundingClientRect();
            return [
                e.clientX - rect.left,
                e.clientY - rect.top
            ]
        }
        
        let mouseDown = false;
        let lastPosition = null;

        //http://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js
        function rotateAroundWorldAxis( object, axis, radians ) {
            var rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationAxis( axis.normalize(), radians );
            rotationMatrix.multiply( object.matrix );
            object.matrix = rotationMatrix;
            object.rotation.setFromRotationMatrix( object.matrix );
        }

        canvas.addEventListener("mousemove", (e) => {
            
            if(this.model && lastPosition) {
                let mouse = getLocalSpaceMouse(this.renderer.domElement, e);
                this.model.rotation.y += (mouse[0] - lastPosition[0]) / 100
                this.model.rotation.x += (mouse[1] - lastPosition[1]) / 100
                lastPosition = mouse;
            }
        })

        canvas.addEventListener("mousedown", (e) => {
            mouseDown = true;
            lastPosition = getLocalSpaceMouse(this.renderer.domElement, e);
        });

        canvas.addEventListener("mouseup", () => { 
            mouseDown = false;
            lastPosition = null;
        })

        let handleWheel = (e) => {
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            this.camera.position.z -= delta;
        }

        canvas.addEventListener("mousewheel", handleWheel);
        canvas.addEventListener("DOMMouseScroll", handleWheel);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    startRendering() {
        if(this.interval != null)
            return;

        this.interval = setInterval(()=> {
            this.render();
        }, 17)
    }

    stopRendering() {
        clearInterval(this.interval)
        this.interval = null;
    }

    resize(width, height) {
       this.aspect = width / height;
       this.camera.updateProjectionMatrix();
       this.renderer.setSize(width, height);
    }

    setViewing(elem) {
        this.camera.position.copy(cameraInitialPosition);
        if(this.model) {
            this.scene.remove(this.model);
            this.stopRendering();
            this.container.removeChild(this.renderer.domElement);
            this.model = null;
        }

        if(this.image) {
            this.container.style.background = ""; 
            this.image = null;
        }
            
        if(elem instanceof Image) {
            this.image = elem;
            this.container.style.backgroundImage = "url(" + elem.src + ")";
            this.container.className = "imageBox";
        }else {
            if(elem) {
                this.scene.add(elem);
                this.model = elem;
                this.startRendering();
                this.container.appendChild(this.renderer.domElement);
            }
        }
    }
}