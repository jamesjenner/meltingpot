/*jshint node: true*/

module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-mocha-test');
  
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
//          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // optionally clear the require cache before running tests
        },
        src: ['test/**/*.js']
      }
    }
  });
    
  grunt.registerTask('default', 'mochaTest');
};