const express = require('express');
let app = express();
const chokidar = require('chokidar');
//var ftpSync = require('ftpsync');

// var options = {
//   host: 'ext-afdb.onebase.fr',
//   user: 'afdb_9a7_export_images',
//   pass: '56041bdf',
//   local: 'afdb-bdd.onebase.fr/ADMIN/index.php',
//   remote: 'directoryname'
// };

//ftpSync.settings = options;
//ftpSync.run(function(err, result) {
const URLPath= 'ftp://afdb_9a7_export_images:56041bdf@ext-afdb.onebase.fr:21/images_prod/HD.AFD_9995___.jpg';
const filepath = '/Users/danlellouche/Desktop/dossiertest/';
let watcher = chokidar.watch(URLPath, {
  ignored: /[\/\\]\./, persistent: true
});

let log = console.log.bind(console);
let scanComplete = false;
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'ddof7glgl',
  api_key: '247128397389269',
  api_secret: 'HmVstQYajG3pzd1cDCzX0BrgS84'
});
watcher
  .on('add', function (path="ftp://afdb_9a7_export_images:56041bdf@ext-afdb.onebase.fr:21/images_prod/HD.AFD_9995___.jpg") {
    if (scanComplete) {
      let pathArray = path.split('/');
      if (!pathArray[pathArray.length - 1].includes("crdownload")) {
        log('File', path, 'has been added');
        // console.log(pathArray.length, pathArray[pathArray.length - 2]);
        let destfolder = pathArray[pathArray.length - 2];
        let destfileName = pathArray[pathArray.length - 1];
        cloudinary.v2.uploader.upload(path, {
          folder: destfolder,
          use_filename:true,
          tags:[destfolder]
        }, function (error, result) {
          if (error) {
            console.log("error ocurred", error);
          }
          else {
            console.log("result of upload \n", result.secure_url,"\n insecure url: \n",result.url);
          }
        });
      }
    }
  })
  .on('addDir', function (path) {
    // log('Directory', path, 'has been added'); 
  })
  .on('error', function (error) { log('Error happened', error); })
  .on('ready', function () {
    log('Initial scan complete. Ready for changes.');
    scanComplete = true;
  })
  .on('raw', function (event, path, details) {
    // log('Raw event info:', event, path, details);
  })
//})

let port = process.env.PORT || 5000;
app.listen(port);
console.log("serve listening on port", port);