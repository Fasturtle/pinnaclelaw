module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      dev: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2
        },
        files: {
          'deploy/css/main.css': 'source/css/*.less'
        }
      },
      dist: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'deploy/css/main.min.css': 'source/css/*.less'
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
       dist: {
         src: ['source/js/*.js'],
         dest: 'deploy/js/main.js'
       }
    },

    uglify: {
      my_target: {
      options: {
          sourceMap: false
        },
        files: {
          'deploy/js/main.min.js': ['deploy/js/main.js']
        }
      }
    },

    clean: {
      assets: ['deploy/css','deploy/js','deploy/fonts','deploy/images'],
      pages: ['deploy/*.php'],
      full: ['deploy/*']
    },

    copy: {
      assets: {
        files: [
          {expand:true, flatten: true, src:['source/fonts/*'], dest:'deploy/fonts/', filter:'isFile'}
        ]
      },
      images: {
        files: [
          {expand:true, flatten: true, src:['source/images/*'], dest:'deploy/images/', filter:'isFile'}
        ]
      },
      videos: {
        files: [
          {expand:true, flatten: true, src:['source/videos/*'], dest:'deploy/videos/', filter:'isFile'}
        ]
      },
      pages: {
        files: [
          /*{expand:true, flatten: true, src:['source/data/*'], dest:'deploy/data/'},*/
          {expand:true, flatten: true, src:['source/pages/**'], dest:'deploy/'},
          {expand:true, flatten: true, src:'source/pages/.htaccess', dest:'deploy/', filter:'isFile'}
        ]
      }
    },

    minjson: {
      compile: {
        files: {'deploy/data/data.min.json': 'deploy/data/data.json'}
      }
    },

    'merge-json': {
        'json-data': {
            src: ['source/data/*.json'],
            dest: 'deploy/data/data.json'
        }
    },

    watch: {
      scripts: {
        files: ['source/js/*.js','source/css/*.less','source/data/*.json','source/fonts/*','source/pages/*.php','source/pages/.htaccess'],
        tasks: ['local'],
        options: {
          event: 'all'
        }
      }
    }
  });
  
  // load packets for use
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-minjson');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-merge-json');

  // tasks/commands
  grunt.registerTask('assets', ['clean:assets','concat','less','uglify','copy:assets']);
  grunt.registerTask('pages', ['clean:pages','copy:pages']);
  grunt.registerTask('build', ['clean:full','concat','less','uglify','copy:assets','copy:pages','merge-json','minjson']);
  grunt.registerTask('local', ['clean:full','concat','less','uglify','copy:assets','copy:images','copy:videos','copy:pages','merge-json','minjson']);
};