const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tj = require('@mapbox/togeojson');
const geojsonMerge = require('@mapbox/geojson-merge');
const DOMParser = require('xmldom').DOMParser;
const pug = require('pug');

const getKmls = () => {
  const files = fs.readdirSync('./kmls')
  return files.filter(f => f.endsWith('.kml'))
}

const main = () => {
  const kmls = getKmls();
  let count = kmls.length;
  const geojsonObjs = [];

  kmls.forEach((kmlName) => {
    fs.readFile(path.resolve(__dirname, `kmls/${kmlName}`), 'utf8', (err, result) => {
      count--;
      if (err) {
        console.error(err);
        return;
      }

      const kml = new DOMParser().parseFromString(result);

      const converted = tj.kml(kml);

      const j = {
        type: converted.type,
        features: converted.features.map(f => {
          return {
            geometry: f.geometry,
            properties: {
              name: f.properties.name,
              styleHash: f.properties.styleHash,
              styleUrl: f.properties.styleUrl,
              stroke: f.properties.stroke,
              'stroke-width': f.properties['stroke-width'],
              'stroke-opacity': f.properties['stroke-opacity'],
            },
          }
        }),
      }

      geojsonObjs.push(j);

      if (count === 0) {
        const mergedGeoJSON = geojsonMerge.merge(geojsonObjs);

        const jsonStr = JSON.stringify(mergedGeoJSON);

        const hash = crypto.createHash('md5').update(jsonStr).digest('hex').substr(0, 8);

        const filename = `${hash}.json`;

        fs.writeFile(path.resolve(__dirname, `geojson/${filename}`), jsonStr, (err) => {
          if (err) {
            console.err(err);
          }

          const html = pug.renderFile('index.pug', {
            geojsonFile: filename,
            pretty: true,
          })

          fs.writeFile(
            path.resolve(__dirname, '../src/index.html'),
            html,
            (err) => {
              if (err) {
                console.error(err);
              }
            },
          );
        });
      }
    })
  })
}

if (require.main === module) {
  main()
}
