
(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'menuList.html',
    scope: {
      foundMenu: '<',
      onRemove: '&',
    },
  };

  return ddo;
}



NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.search ="";
  
  menu.searchItem = function () {
    menu.found =[];
    var promise = MenuSearchService.getMatchedMenuItems(menu.search)
    .then(function(response){
        menu.found = response;
    });  
  };

  menu.removeItem = function (itemIndex) {
    menu.found.splice(itemIndex, 1);
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  
  service.getMatchedMenuItems = function (searchTerm) {
    var foundItems =[];
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")

    }).then(function (response) {
        var items =response.data.menu_items;
        if (searchTerm !== "" ){
          for (var i = 0; i < items.length; i++) {

            if (items[i].description.indexOf(searchTerm) !== -1) {
              foundItems.push(items[i]);
            }
          }
        }
      return foundItems;
    })
      .catch(function (error) {
      console.log(error);
    })
  };

}

})();
