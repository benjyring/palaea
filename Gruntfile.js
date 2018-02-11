module.exports = function(grunt){
	'use strict';
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
	grunt.loadTasks('tasks');

	grunt.initConfig({
		// Metadata
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> v<%= pkg.version %> by Benjamin Jyring <%= grunt.template.today("yyyy-mm-dd") %> */\n',

		includes: {
			files: {
				cwd: 'parts/',
				src: '*',
				dest: 'docs/'
			}
		},

		// Source Files we are working with
		src: {
			theme: [
				'img/**',
				'css/app.min.css',
				'js/**',
				'fonts/**',
				'*.html',
				'theme.json'
			]
		},

		// Task configuration
		jshint: {
			files: ['js/components/app.js']/*,
			options: {
				globals: {
					jQuery: true
				}
			}*/
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> by Benjamin Jyring <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				files: {
					'js/app.min.js': [
						'js/components/jquery-3.2.1.min.js',
						'js/components/bootstrap.min.js',
						'js/components/scripts-ck.js',
						'js/components/modernizr.js',
						'js/components/waypoints.min.js',
						'js/components/app.js'
					]
				}
			}
		},

		imagemin: {
			png: {
				options: {
					optimizationLevel: 7,
					progressive: false
				},
				files: [{
					expand: true,
					cwd: 'img/',
					src: '**/*.{png,jpg,jpeg,gif}',
					dest: 'img/tmp/',
				}]
			}
		},

		copy: {
			images: {
				files: [{
					expand: true,
					cwd: 'img/tmp/',
					src: '**',
					dest: 'img/'
				}]
			},
			theme: {
				files: [{
					expand: true,
					src: ['<%= src.theme %>', '!*.html'],
					dest: 'docs/'
				}]
			}
		},

		less: {
			compile_minify: {
				options: {
					strictMath: true,
					// cleancss: true,
					// compress: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: 'app.css.map',
					sourceMapFilename: 'css/app.css.map',
				},
				files: {
					'css/app.min.css': 'less/app.less'
				}
			},

			compile: {
				options: {
					strictMath: true,
				},
				files: {
					'css/app.css': 'less/app.less'
				}
			},

			minify: {
				options: {
					cleancss: true,
					compress: true,
				},
				files: {
					'css/app.min.css': 'css/app.css'
				}
			}

		},

		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
			},
			css: {
				src: 'css/app.css'
			}
		},

		usebanner: {
			options: {
				position: 'top',
				banner: '<%= banner %>'
			},
			files: {
				src: 'css/app.css'
			}
		},

		watch: {
			html: {
				options: {
					livereload: true
				},
				files: 'templates/*.html',
				tasks: 'includes'
			},
			less: {
				options: {
					livereload: true
				},
				files: 'less/**',
				tasks: 'source-map'
			},
			js: {
				options: {
					livereload: true
				},
				files: 'js/**',
				tasks: 'prepare-js'
			},
			files: {
				options: {
					livereload: true
				},
				files: ['templates/*.php', 'js/**'],
			},
		},
	});

	grunt.registerTask('watch-less', ['watch:less']);
	grunt.registerTask('watch-files', ['watch:files']);
	grunt.registerTask('watch-local', ['watch']);

	grunt.registerTask('prepare-js', ['jshint', 'uglify']);
	// grunt.registerTask('prepare-images', ['clean:images', 'imagemin', 'copy:images', 'clean:images']);
	grunt.registerTask('prepare-css', ['less:compile', 'autoprefixer', 'usebanner', 'less:minify']);

	grunt.registerTask('source-map', ['less:compile_minify']);
	grunt.registerTask('theme', ['prepare-js', 'prepare-css', 'copy:theme', 'includes']);

	grunt.registerTask('default', [
		'theme'
	]);
};
