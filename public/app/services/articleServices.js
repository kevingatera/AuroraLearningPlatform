// This module will be used to submit articles to the server

angular.module('articleServices', [])
.factory('Article', function(){
  // create an article object
  var articleFactory = {};

  // Submit the article via API 
  articleFactory.submit = function(articleData){
    return $http.post('/api/article', articleData).then(function(data){
      console.log(data)
    })
  };

})
