const fs = require("fs");
const http = require("http");

const server = http.createServer(function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, DELETE, PUT, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  switch (req.url.toLowerCase()) {
    case "/":
      return res.end("200");
    case "/getcars":
      return getCars(req, res);
    case "/savecar":
      return saveCar(req, res);
    case "/sellcar":
      return sellCar(req, res);
    default:
      return getCustomPage(req, res);
  }
});
server.listen(8001);

const getCars = (req, res) => {
  let jsonString = fs.readFileSync("carlist.json", "utf-8");

  res.end(
    JSON.stringify(JSON.parse(jsonString)) ||
      JSON.stringify({ error: "error 1" })
  );
};
const saveCar = (req, res) => {
  let body = "";

  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    try {
      body = JSON.parse(body);
    } catch (error) {
      console.log(error);
    }
    let fields = [
      "categories",
      "brand",
      "series",
      "year",
      "color",
      "km",
      "engineCapacity",
      "plate",
    ];

    for (let field of fields) {
      if (
        !body.hasOwnProperty(field) ||
        body[field] == null ||
        body[field] == ""
      ) {
        res.end(JSON.stringify({ error: field + " does not exist" }));
        return;
      }
    }

    let fileContent = fs.readFileSync("carList.json", "utf-8");
    let carList = JSON.parse(fileContent);
    carList.push({
      categories: body.categories,
      brand: body.brand,
      series: body.series,
      year: body.year,
      color: body.color,
      km: body.km,
      engineCapacity: body.engineCapacity,
      plate: body.plate,
    });

    fs.writeFileSync("carList.json", JSON.stringify(carList), "utf-8");

    res.end(JSON.stringify({ status: "success" }));
  });
};

const sellCar = (req, res) => {
  var body = "";
  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    try {
      body = JSON.parse(body);
    } catch (error) {
      console.log(error);
    }

    if (
      !body.hasOwnProperty("plate") ||
      body.plate == null ||
      body.plate == ""
    ) {
      res.end(JSON.stringify({ error: "plate does  not exist" }));
      return;
    }

    let content = fs.readFileSync("carList.json", "utf-8");
    content = JSON.parse(content);
    let newList = [];

    for (let item of content) {
      if (item.plate != body.plate) newList.push(item);
    }

    fs.writeFileSync("carList.json", JSON.stringify(newList), "utf-8");

    res.end(JSON.stringify({ status: "success" }));
  });
};

const getCustomPage = (req, res) => {
  try {
    var content = fs.readFileSync(req.url.substring(1), "utf-8");
    res.end(content);
  } catch (e) {
    res.writeHead(404);
    res.end();
  }
};
