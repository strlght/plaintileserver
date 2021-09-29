import express from "express"
import MBTiles from "@mapbox/mbtiles"
import cors from "cors"
import { watchFile } from "fs"

const app = express()
const port = process.env.PORT || 3000
const mbtilesPath = process.env.MBTILES_PATH
let mbtiles

function loadMbtilesFile() {
  mbtiles = new MBTiles(`${mbtilesPath}?mode=ro`, function (err, _mbtiles) {
    if (err) {
      console.log("Check mbtiles file. Exiting...")
      console.error(err)
      process.exit(1)
    }
  })
}

watchFile(mbtilesPath, (_curr, _prev) => {
  loadMbtilesFile()
})

loadMbtilesFile()

app.use(cors())

app.get("/:z/:x/:y.vector.pbf", (req, res) => {
  const { x, y, z } = req.params
  mbtiles.getTile(z, x, y, function (err, data, headers) {
    if (err) {
      console.error(err)
      res.status(500).send()
      return
    }
    Object.keys(headers || {}).forEach((k) => res.setHeader(k, headers[k]))
    res.send(data)
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

process.on('SIGTERM', () => {
  app.close()
})
