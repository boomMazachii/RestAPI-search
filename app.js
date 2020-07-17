var express = require("express");
var app = express();
var fs = require("fs");
var cors = require('cors')

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Application Run At http://localhost", host, port);
});
app.use(cors());

app.get("/api/trips", function (req, res) {
  fs.readFile(__dirname + "/" + "db.json", "utf-8", function (err, data) {
    var obj = JSON.parse(data).trips;
    var results = [];
    var toSearch = req.query.keyword;
  
    function trimString(s) {
      var l=0, r=s.length -1;
      while(l < s.length && s[l] == ' ') l++;
      while(r > l && s[r] == ' ') r-=1;
      return s.substring(l, r+1);
    }
    
    function compareObjects(o1, o2) {
      var k = '';
      for(k in o1) if(o1[k] != o2[k]) return false;
      for(k in o2) if(o1[k] != o2[k]) return false;
      return true;
    }
    
    function itemExists(haystack, needle) {
      for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
      return false;
    }
    toSearch = trimString(toSearch);
    if(toSearch == ''){
      results = []
    }
    else{
      for (var i = 0; i < obj.length; i++) {
        for (key in { title : null , description : null, tags : null}) {
          if (obj[i][key].indexOf(toSearch) != -1) {
            if(!itemExists(results, obj[i])) results.push(obj[i]);
          }
        }
      }
    }
    res.end(JSON.stringify(results));
  });
});

app.get("/trips", function (req, res) {
  fs.readFile(__dirname + "/" + "db.json", "utf-8", function (err, data) {
    res.end(data);
  });
});