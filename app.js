(function() {
    'use strict';
    
    angular.module("Application2", [])
    .controller("ToBuyController", ToBuyController)
    .controller("BoughtController", BoughtController)
    .service("ShoppingService", ShoppingService);

    ToBuyController.$inject = ['$scope', 'ShoppingService'];
    BoughtController.$inject = ['$scope', 'ShoppingService'];

    function ToBuyController($scope, ShoppingService) {
        $scope.shoppingList = ShoppingService.getShoppingList();
        $scope.boughtList = ShoppingService.getBoughtList();
        
        $scope.moveToBought = function(item) {
            ShoppingService.moveToBought(item);
        };
    }

    function BoughtController($scope, ShoppingService) {
        $scope.boughtList = ShoppingService.getBoughtList();
    }

    function ShoppingService() {
        var service = this;
        var shoppingList = [
            { name: "cookies", quantity: 1000 },
            { name: "berries", quantity: 12 },
            { name: "carrots", quantity: 7 },
            { name: "onions", quantity: 2 },
            { name: "potatoes", quantity: 5 },
            { name: "tomatoes", quantity: 4 },
            { name: "apples", quantity: 100 }
        ];
        var boughtList = [];

        service.getShoppingList = function() {
            return shoppingList;
        };

        service.getBoughtList = function() {
            return boughtList;
        };

        service.moveToBought = function(item) {
            var index = shoppingList.indexOf(item);
            if (index !== -1) {
                shoppingList.splice(index, 1);
                boughtList.push(item);
            }
        };
    }
})();
