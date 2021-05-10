
const Generator = require('yeoman-generator')
const path = require("path")
const fs = require("fs")
 
module.exports = class extends Generator {
    prompting () {
        return this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname
            }
        ]).then(answers => {
            this.answers = answers
        })
    }
    writing() {
        const tmplDir = path.join(__dirname, 'templates')
        const destDir = process.cwd()
    
        fs.readdir(tmplDir, (err, files) => {
            if (err) throw err
            files.forEach(file => {
                ejs.renderFile(path.join(tmplDir, file), answers, (err, result) => {
                    if (err) throw err
                    fs.writeFileSync(path.join(destDir, file), result)
                })
            })
        })
    }
}