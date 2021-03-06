/* jshint multistr:true */
/* jshint -W040 */

'use strict';

var envify = require('envify/custom');
var es3ify = require('es3ify');
var grunt = require('grunt');
var UglifyJS = require('uglify-js');
var uglifyify = require('uglifyify');
var _ = require('lodash');

var SIMPLE_TEMPLATE =
'/**\n\
 * @PACKAGE@ v@VERSION@\n\
 */';

var LICENSE_TEMPLATE =
'/**\n\
 * @PACKAGE@ v@VERSION@\n\
 *\n\
 * Copyright 2013-2014, Facebook, Inc.\n\
 * All rights reserved.\n\
 *\n\
 * This source code is licensed under the BSD-style license found in the\n\
 * LICENSE file in the root directory of this source tree. An additional grant\n\
 * of patent rights can be found in the PATENTS file in the same directory.\n\
 *\n\
 */';

function minify(src) {
  return UglifyJS.minify(src, { fromString: true }).code;
}

// TODO: move this out to another build step maybe.
function bannerify(src) {
  var version = grunt.config.data.pkg.version;
  var packageName = this.data.packageName || this.data.standalone;
  return LICENSE_TEMPLATE.replace('@PACKAGE@', packageName)
                         .replace('@VERSION@', version) +
         '\n' + src;
}

function simpleBannerify(src) {
  var version = grunt.config.data.pkg.version;
  var packageName = this.data.packageName || this.data.standalone;
  return SIMPLE_TEMPLATE.replace('@PACKAGE@', packageName)
                        .replace('@VERSION@', version) +
         '\n' + src;
}

// Our basic config which we'll add to to make our other builds
var basic = {
  entries: [
    './build/modules/React.js'
  ],
  outfile: './build/react.js',
  debug: false,
  standalone: 'React',
  transforms: [envify({NODE_ENV: 'development'})],
  after: [es3ify.transform, simpleBannerify]
};

var min = _.merge({}, basic, {
  outfile: './build/react.min.js',
  debug: false,
  transforms: [envify({NODE_ENV: 'production'}), uglifyify],
  after: [minify, bannerify]
});

var transformer = {
  entries:[
    './vendor/browser-transforms.js'
  ],
  outfile: './build/JSXTransformer.js',
  debug: false,
  standalone: 'JSXTransformer',
  after: [es3ify.transform, simpleBannerify]
};

var addons = {
  entries: [
    './build/modules/ReactWithAddons.js'
  ],
  outfile: './build/react-with-addons.js',
  debug: false,
  standalone: 'React',
  transforms: [envify({NODE_ENV: 'development'})],
  packageName: 'React (with addons)',
  after: [es3ify.transform, simpleBannerify]
};

var addonsMin = _.merge({}, addons, {
  outfile: './build/react-with-addons.min.js',
  debug: false,
  transforms: [envify({NODE_ENV: 'production'}), uglifyify],
  after: [minify, bannerify]
});

var withCodeCoverageLogging = {
  entries: [
    './build/modules/React.js'
  ],
  outfile: './build/react.js',
  debug: true,
  standalone: 'React',
  transforms: [
    envify({NODE_ENV: 'development'}),
    require('coverify')
  ]
};

module.exports = {
  basic: basic,
  min: min,
  transformer: transformer,
  addons: addons,
  addonsMin: addonsMin,
  withCodeCoverageLogging: withCodeCoverageLogging
};
