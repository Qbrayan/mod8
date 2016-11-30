
(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'menuList.html',
    scope: {
      foundMenu: '<',
      onRemove: '&',
      message:'<'
    },
    // controller: FoundItemsDirectiveController,
    // controllerAs: 'list',
    // bindToController: true
  };

  return ddo;
}


// function FoundItemsDirectiveController() {
//   var list = this;

//   list.foodInList = function () {
//       if ( list.found == '') {
//         return true;
//       }

//     return false;
//   };
// }


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.search ="";
  menu.message ="";
  menu.found =[];

  menu.searchItem = function () {
    var promise = MenuSearchService.getMatchedMenuItems(menu.search)
    .then(function(response){
          menu.found=response;
          if(menu.found.length < 1){
            menu.message= "Nothing found";}
          else {menu.message= "";}
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
      if (searchTerm != "" ){
      for (var i = 0; i < items.length; i++) {

        if (items[i].description.indexOf(searchTerm) !== -1) {
          foundItems.push(items[i]);

        }
      }
     }
     //console.log(foundItems.length);
     //console.log(searchTerm);
      return foundItems;
    })
    .catch(function (error) {
      console.log(error);
    })

  };

 
}

})();
