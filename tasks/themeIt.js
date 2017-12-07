var cheerio = require('cheerio');

module.exports = function(grunt) {

	var stringReplacements = [{
			pattern: /(=["'])((js|img|css)\/)/gi,
			replacement: '$1{TEMPLATE_PATH}/$2'
		}];

	grunt.registerMultiTask('themeIt', 'Compiles html files.', function() {

		this.files.forEach(function(file) {

			var contents = grunt.file.read(file.src),
				$ = cheerio.load(contents);

			grunt.log.write(file.src + ': ');

			// replaces all 'data-tao-tag' with a tao tag
			// $('[data-tao-tag]').each(function() {

			// 	var $this = $(this),
			// 		insert = $this.attr('data-tao-insert'),
			// 		data = $this.attr('data-tao-tag').replace(/\{|\}/g, '');

			// 	if (typeof insert != 'undefined' && insert != 'false') {
			// 		$this.html('{' + data + '}');
			// 	} else {
			// 		$this.replaceWith('{' + data + '}');
			// 	}

			// 	$this.removeAttr('data-tao-tag').removeAttr('data-tao-insert');

			// });

			// replaces all 'data-tao-script' with a script and a source of the value
			// $('[data-tao-script]').each(function() {

			// 	var $this = $(this),
			// 		insert = $this.attr('data-tao-insert'),
			// 		data = $this.attr('data-tao-script');

			// 	if (typeof insert != 'undefined' && insert != 'false') {
			// 		$this.html('<script src="' + data + '"></script>');
			// 	} else {
			// 		$this.replaceWith('<script src="' + data + '"></script>');
			// 	}

			// 	$this.removeAttr('data-tao-script').removeAttr('data-tao-insert');

			// });

			// completely removes anything with an 'data-tao-remove' attribute
			$('[data-tao-remove]').remove();

			contents = $.html();

			stringReplacements.forEach(function(element) {
				contents = contents.replace(element.pattern, element.replacement);
			});

			grunt.file.write(file.dest, contents);

			grunt.log.writeln('compiled.');

		});
	});
};
