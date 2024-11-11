(function() {
    'use strict';

    // Dichiaro qui sia un service per definire delle funzionalità, sia una direttiva custom per gestire il contesto http
    angular.module('MenuApp', [])
    .controller('MenuController', MenuController)
    .service('MenuService', MenuService)
    .directive('foundItems2', FoundItemsDirective);
  
    MenuController.$inject = ['MenuService'];
    function MenuController(MenuService) {
      var menuCtrl = this;
      menuCtrl.searchTerm = ''; // Variabile che contiene la stringa della search box
      menuCtrl.found = []; // Variabile che contiene il risultato http trovato
      menuCtrl.nothingFound = false; // Boolean per sapere se sono stati trovati risultati (usato nella view)
  
      menuCtrl.narrowDown = function() {
        // Quando si preme cerca (narrowDown)
        if (menuCtrl.searchTerm.trim() === '') { // Pulisci l'output
            // Se è vuoto, ritorna
          menuCtrl.nothingFound = true;
          menuCtrl.found = [];
          return;
        }
        // Se non è vuoto, cerca la stringa nella lista in modo asincrono (.then)
        // getMatchedMenuItems è quindi una funzione che verrà chiamata asincronamente
        // In caso trova dei risultati, chiama la funzione function(foundItems) dove founditems sono i risultati
        // Altrimenti passa per il catch con error, il contenuto dell'errore.
        // Nelle deferred funziona cosi: si passa sia il .then che il .catch per gestire i due casi
        MenuService.getMatchedMenuItems(menuCtrl.searchTerm)
          .then(function(foundItems) {
            menuCtrl.found = foundItems; // Imposta il risultato
            menuCtrl.nothingFound = foundItems.length === 0; // Imposta il booleano
          })
          .catch(function(error) {
            console.error('Error fetching data:', error);
          });
      };
  
      // Funzione per il bottone "Don't want this one"
      menuCtrl.removeItem = function(index) {
        menuCtrl.found.splice(index, 1);
        if (menuCtrl.found.length === 0) {
          menuCtrl.nothingFound = true;
        }
      };
    }
  
    // E' necessario l'inject http qui, perche dovremo fare delle richieste per avere la lista di oggetti
    MenuService.$inject = ['$http'];
    function MenuService($http) {
      var service = this;
  
      service.getMatchedMenuItems = function(searchTerm) {
        // Invoca il servizio $http per fare una richiesta di tipo GET a quel link
        return $http({
          method: "GET",
          url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
        }).then(function(response) {
            // Ottieni e prepara la rispota in una variabile da filtrare dopo
          var allItems = [];
          angular.forEach(response.data, function(category) {
            allItems = allItems.concat(category.menu_items);
          });
          // Ritorna, tra tutta la risposta, solo gli elementi filtrati rispetto a cosa era stato cercato
          var foundItems = allItems.filter(function(item) {
            return item.description.toLowerCase().includes(searchTerm.toLowerCase());
          });
          return foundItems;
        });
      };
    }
  
    // Dichiaro la direttiva custom, descritta in quel file .html
    function FoundItemsDirective() {
      var ddo = {
        templateUrl: 'foundItems2.html',
        scope: {
            // Binding unidirezionale che fa si che la direttiva 
            //riceve valori dal controller che cambiano quando cambiano nel controller
            // se cambiano nella direttiva, non influenza il genitore, viceversa si
          foundItems: '<',
          onRemove: '&' //la direttiva può chiamare una funzione nel controller genitore menuCtrl.removeItem per rimuovere
          // un elemento dalla lista 
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'dirCtrl',
        bindToController: true
      };
      // Il ddo è il directive definition object. Per regola si chiama cosi.
      return ddo;
    }
  
    function FoundItemsDirectiveController() {
      var dirCtrl = this;
    }
  })();
  