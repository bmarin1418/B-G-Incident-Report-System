// Here is a code example for scripting the creation of firebase database fields. The code below creates a MONTH_count and MONTH_times variable in the metadata branch for each location-form type pair
// You can see we just set the value to zero for all these fields. You can either overwrite the data later or call firebase.database().ref(....).append() to delete whatever the field was set to and add nodes
// below it. 

/*
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var locations = ["battell", 'carmichael', 'harrison', 'lasalle', 'wilson'];
    var form_types = ['general', 'accident', 'behavior']
    firebase.auth().onAuthStateChanged(function (user) {
        for (var location_i = 0; location_i < locations.length; location_i++) {
            for (var form_type_i = 0; form_type_i < form_types.length; form_type_i++) {
                for (var month_i = 0; month_i < monthNames.length; month_i++) {
                    firebase.database().ref('locations/' + locations[location_i] + '/metadata/' + form_types[form_type_i] + '/' + monthNames[month_i] + '_count').set(0);
                    firebase.database().ref('locations/' + locations[location_i] + '/metadata/' + form_types[form_type_i] + '/' + monthNames[month_i] + '_times').set(0);
                }
                firebase.database().ref('locations/' + locations[location_i] + '/metadata/' + form_types[form_type_i] + '/last_month_reset').set('March');
            }
        }
    });
*/