var fs = require('fs');

var render = {

  indexpath: './client/index.html', //html file prerender
  renderpath: './client/indexrender.html', //html file postrender (what we send)

  prerender: function(){
    //first, write out the file to its rendering dest
    var indexcode = fs.readFileSync(this.indexpath, "utf8");
    fs.writeFileSync(this.renderpath, indexcode);
  },

  getAllDependencies: function(dependencies, directory){

    var assets = { //strings to keep track of the js and css files, will be rendered verbatum to html
      js: '',
      css: ''
    };

    var dependpath = './node_modules/codemirror/'  + directory; //path for all directories for type of dependencies (essentially folder for all assets)
    var dependdirs;

    try { //might get error if invalid directory is entered here
      if(dependencies.ALL){ //if user passes ALL, then just include all addons
        dependdirs = fs.readdirSync(dependpath);
      } else {
        dependdirs = render.getSubdirectoriesFromOptions(dependencies);
      }
    } catch(err){
      console.log('ERR, NO SUCH ASSET EXISTS: ' + directory);
      return assets;
    }

    var i, j;
    for(i = 0; i < dependdirs.length; i++){ //loop through folders for dependencies user requests

      var subpath = dependpath + '/' + dependdirs[i];
      var subdirs;

      try { //err if dependency doesnt exist
        if(fs.lstatSync(subpath).isDirectory()){ //first, see if subpath is a directory or just a file
          subdirs = fs.readdirSync(subpath); //if directory, then scan all files
        }
      } catch(err){
        console.log('ERR, NO SUCH ' + i + ' EXISTS: ' + dependdirs[i]);
        return assets;
      }

      if(typeof subdirs == 'undefined'){ //if subdirs is undefined, that means subpath is just a single file (the readdirSync line didnt return an array)
        render.appendScriptToAssets(assets, subpath);
      } else {

        for(j = 0; j < subdirs.length; j++){ //loop through all files in addon folders (e.g. scripts needed for each addon)
          var filepath = subpath + '/' + subdirs[j];
          render.appendScriptToAssets(assets, filepath);
        }

      }

    }

    return assets;

  },

  appendScriptToAssets: function(assets, filepath){

    var fileExten = filepath.split('.'),
        type = fileExten[fileExten.length - 1];  //extension (e.g. js or css)

    if(type == 'js'){
      assets.js += '<script src=".' + filepath + '"></script>\n'; //append js tag for current script
    } else if(type == 'css'){
      assets.css += '<link rel="stylesheet" href=".' + filepath + '"></script>\n'; //append css tag for current
    }

  },

  //essentially just turn input param object of folder/file names into an array of subdirectory names
  getSubdirectoriesFromOptions: function(dependencies){

    var i, dependdirs = [];
    for(i in dependencies){
      if(dependencies[i]){
        dependdirs.push(i);
      }
    }

    return dependdirs;

  },

  //append js and css properties of new object to the total object that will be rendered to html
  appendScriptsToObject: function(newscripts, totalscripts){

    var i;
    for(i in totalscripts){
      if(newscripts[i]){ //if new scripts have same properties
        totalscripts[i] += newscripts[i]; //append to totalscripts property
      }
    }

  },

  renderAssets: function(assets){

    var allassets = { //all js and css assets to be rendered in html file
      js: '',
      css: ''
    };

    var i;
    for(i in assets){
      var dependencies = render.getAllDependencies(assets[i], i);
      render.appendScriptsToObject(dependencies, allassets);
    }

    console.log(allassets.js);
    console.log(allassets.css);

    this.renderToFile('css', allassets.css);
    this.renderToFile('js', allassets.js);

  },

  renderThemeOptions: function(themeoptions){

    var themes = render.getOptionNames('theme', themeoptions);//themes to be used
    var options = ''; //options to render to html

    var i;
    for(i = 0; i < themes.length; i++){
      if(themes[i] == 'material-palenight'){ //default value
        options += '<option selected>' + themes[i] + '</option>\n';
      } else {
        options += '<option>' + themes[i] + '</option>\n';
      }
    }

    this.renderToFile('theme', options);

  },

  renderModeOptions: function(modeoptions){

    var modes = render.getOptionNames('mode', modeoptions); //modes to be used
    var options = ''; //options to render to html

    var i;
    for(i = 0; i < modes.length; i++){
      if(modes[i] == 'clike'){ //first, fix clike to C (only case where we need to fix this, every other language is accurate)
        modes[i] = 'C';
      }
      options += '<option>' + modes[i] + '</option>\n';
    }

    this.renderToFile('mode', options);

  },

  getOptionNames: function(asset, options){

    var path = './node_modules/codemirror/' + asset;
    var all = fs.readdirSync(path); //all assets available
    var using = []; //all assets we'll actually use

    var i;
    for(i = 0; i < all.length; i++){
      var curr = all[i].split('.')[0]; //get just the asset name, strip off the file extension (usually theme.css or something)

      if(options.ALL){ //use all available assets
        using.push(curr);
      } else {
        if(options[curr]){ //if user sepecified this asset, add it
          using.push(curr);
        }
      }
    }

    return using;

  },

  renderToFile: function(tag, content){

    var indexcode = fs.readFileSync(render.renderpath, "utf8"); //current rendering
    indexcode = indexcode.replace('[' + tag + ']', content); //replace [css] tag with all css scripts
    console.log(indexcode);
    fs.writeFileSync(render.renderpath, indexcode); //write out to rendering

  }

};

module.exports = render;
