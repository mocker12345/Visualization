/**
 * Created by rancongjie on 15/11/20.
 */
var api = new APISDK([
  // An API definition list here
  'POST /articles',
  'GET /articles/:id',
  'PUT /articles/:id',
  'DELETE /articles/:id'
], {
  'host': '/api',
  // 'promise' and 'http' MUST be provided
  'promise': Promise,
  'http': function(params) { console.log(params); }
});


var id = 123;
// { "method": "get", "url": "/api/articles/123", "data": { "token": 789 } }
api.articles(id).get({ token: 789 });

// Dynamic parameter is supported
var inc = 0;
var nextArticle = api.articles(function() { return inc++; });
// { method: "GET", url: "/api/articles/0", data: undefined }
nextArticle.get();
// { method: "GET", url: "/api/articles/1", data: undefined }
nextArticle.get();

// Asynchronous parameter is supportd
var asyncParam = new Promise(function(resolve){ setTimeout(resolve, 1000, 123); });

// The request will be launched after the promise resolved
api.articles(asyncParam).get();
