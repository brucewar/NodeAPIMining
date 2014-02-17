var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var options = {
  host: 'nodejs.org',
  port: 80,
  path: '/api/',
  method: 'GET'
};
http.request(options, function(res){
  var html = "";
  res.on('data', function(data){
    html += data;
  });
  res.on('end', function(){
    var $ = cheerio.load(html);
    parseDocument($);
  });
}).on('error', function(err){
  console.log("Get error: " + err.message);
}).end();

function parseDocument($){
  var apis = [];
  $('#apicontent li').each(function(i, elem){
    var url = $(this).children('a').attr('href');
    var title = $(this).text();
    var api = {'url': url, 'title': title};
    apis.push(api);
  });
  //console.log(JSON.stringify(apis));

  apis.forEach(function(api, index, array){
    var apiOptions = options;
    apiOptions['path'] = "/api/" + api['url'];
    getAPI(apiOptions, api['title']);
  });
}

function getAPI(options, title){
  http.get(options, function(res){
    var apiHtml = "";
    res.on('data', function(data){
      apiHtml += data;
    }).on('end', function(){
      saveFile(apiHtml, title);
    })
  });
}

function saveFile(doc, fileName){
  console.log(doc);
  //file name can not contain character '/'
  var fileName = __dirname + "\\api\\" + fileName.replace(/\/|\s/g, '_') + ".html";
  fs.writeFile(fileName, doc, function(err){
    if(err) throw new Error("Save " + fileName + " failed!");
    console.log("Save " + fileName + " successfully!");
  });
}
