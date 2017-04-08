# tfwgf
A web tool for downloading images (.png, .jpeg) and 3d models (.obj) as javascript files that can be used immediately on a page. 

## Usage
### Uploading
First head over to [here](https://squeakrats.github.io/TFWGF/) to upload your files (large files might take awhile). 
If the previewer on the right fails to load your model properly, your model is not supported by our loader. Click the download
button to grab your file, or optionally for images you can copy the Base64 string to your clipboard. You can use that string [directly](http://stackoverflow.com/questions/16449445/how-can-i-set-image-source-with-base64) on your page as well. 

### Loading
Add the downloaded files to the scripts section of your html file.
```html
 <script src="assets/Wolf.obj.js"></script> 
 <script src="assets/AddAsManyAsYouWant.obj.js"></script>
```

### Using Images
Images will be loaded as [Images](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image). 
```
let image = PreLoadedAssets["CrazyImage.png.js"];
document.appendChild(image);
```
### Using Models (.obj only)
Models will be loaded as [Models](https://github.com/Squeakrats/objs). 
```
let model = PreLoadedAssets["Wolf.obj.js"];
console.log(model)
```

## Contributing

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
