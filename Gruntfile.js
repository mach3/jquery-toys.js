
module.exports = function(grunt){

    var banner = grunt.template.process(
        grunt.file.read("src/banner.js"),
        {data: grunt.file.readJSON("package.json")}
    );

    grunt.initConfig({
        uglify: {
            dist: {
                options: {banner: banner},
                files: {
                    "dist/toys.min.js": ["src/toys.js"]
                }
            }
        },
        concat: {
            dist: {
                options: {banner: banner},
                files: {
                    "dist/toys.js": ["src/toys.js"]
                }
            }
        }
    });

    grunt.registerTask("default", []);
    grunt.registerTask("build", ["concat", "uglify"]);

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

};
