#!/usr/bin/env node
 
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const loadDir = async (tmplDir) => {
    let result = []
    const files = fs.readdirSync(tmplDir)
    for(const file of files){            
        const src = path.join(tmplDir, file)
        const statInfo = fs.statSync(src)
        if(statInfo.isFile()){
            result.push(src)
        }else if(statInfo.isDirectory()){
            result = [...result, ...await loadDir(src)]
        }
    }
    return result
}

const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

 
inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Your project name?'
    }
]).then(async answers => {
    // 模板目录
    const tmplDir = path.join(__dirname, 'templates')
    // 目标目录
    const destDir = process.cwd()
 
    // 读取模板文件，并输出
    const files = await loadDir(tmplDir)
    // console.log("result", files)
    files.forEach(file => {
        // console.log(file)
        ejs.renderFile(file, answers, (err, result) => {
            if (err) throw err
            const destSrc = file.replace(path.join(__dirname, 'templates'), destDir)
            // console.log("destSrc", destSrc)
            // console.log(destSrc)
            // console.log(path.dirname(destSrc))
            mkdirsSync(path.dirname(destSrc))
            // console.log(file.replace(path.join(__dirname, 'templates'), destDir))
            fs.writeFileSync(destSrc, result)
        })
    })

    // fs.readdir(tmplDir, (err, files) => {
    //     if (err) throw err
    //     files.forEach(file => {
    //         console.log(file)
    //         // ejs.renderFile(path.join(tmplDir, file), answers, (err, result) => {
    //         //     if (err) throw err
    //         //     fs.writeFileSync(path.join(destDir, file), result)
    //         // })
    //     })
    // })
})