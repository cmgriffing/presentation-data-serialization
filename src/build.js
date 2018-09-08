const glob = require('glob');
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const uglify = require('uglify-es');
const concat = require('concat');

const browserifiedFiles = {};

glob(`${__dirname}/static/lib/*.base`, (error, files) => {
  if(error) {
    console.log('glob Error: ', error);
  }

  let browserified = 0;

  files.map(file => {

    const pathParts = path.parse(file);

    browserify(file).bundle(((err, buf) => {
      if(err) {
        console.log('Error running browserify', pathParts.name, err);
      }
      fs.writeFileSync(`${pathParts.dir}/${pathParts.name}.js`, buf);
      browserifiedFiles[`${pathParts.name}.js`] = buf.toString();
      browserified += 1;

      if(browserified === files.length) {
        bundle(files);
      }

    }));

  });

});

function bundle(files) {

  const _files = files.map(file => {
    const pathParts = path.parse(file);
    return browserifiedFiles[`${pathParts.name}.js`]
  });

  fs.writeFileSync(`${__dirname}/static/lib/bundle.js`, _files.join(' '));

}
