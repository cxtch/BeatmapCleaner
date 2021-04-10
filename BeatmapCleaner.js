const fs = require('fs');
let farmList = fs.readFileSync('defaults.txt', 'utf-8').split('\n');
let farmString = ''
let farmsFound = []
if (process.argv[2]) {
  try {
    var songPath = process.argv[2]
    var songDir = fs.readdirSync(songPath);
  } catch (err) {
    console.log('incorrect custom path? ' + err.message)
    process.exit()
  }
} else {
  try {
    var songPath = `${process.env.USERPROFILE}/AppData/Local/osu!/Songs`
    var songDir = fs.readdirSync(songPath);
  } catch (err) {
    console.log('uh oh! doesn\'t look like the songs folder was found. If you are using a different song directory, please include in the command line arguments')
    console.log('example: node BeatmapCleaner.js "C:/path/to/your/songs"')
  }
}
for (x of farmList) {
  farmString += `${x.trim()}|`
}
let farmRegExp = new RegExp(farmString.substr(0, farmString.length - 1), 'gi')
for (x of songDir) {
  if (x.match(farmRegExp) && fs.statSync(`${songPath}/${x}`).isDirectory()) {
    farmsFound.push(x)
  }
}
process.stdout.write(`Found ${farmsFound.length} total farm maps. Delete[0] or cancel [any] ? `)
process.stdin.on('data', input => {
  let data = input.toString();
  if (data == 0) {
    console.log('well done')
    cleanse()
  }
})

function cleanse() {
  for (let i = 0; i < farmsFound.length; i++) {
    try {
      fs.rmSync(`${songPath}/${farmsFound[i]}`, {
        recursive: true,
        force: true
      })
      console.log(`deleted ${farmsFound[i]}`)
    } catch (err) {
      console.log(`Something went wrong: ${err.message}`)
    }
  }
}