SEARCH_ID = "#search_button";
LOGOUT_ID = "#logout";
LOCATION_STATS_ID = "#location_stats";
LOCATION_VIEW_ID = "#location_view";
STUDENT_ID_STATS = "#userID_stats";
STUDENT_ID_VIEW = "#userID_search";
STUDENT_SELECT = "#all_or_single";
STUDENT_SELECT_TITLE = "#userID_title_stats";
BAR_CHART_ID = "#barchart";
TIMELINE_ID = "#timeline";
MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
NUM_MONTHS_DISPLAYED = 3

$(document).ready(function () {
    firebaseInit();
    $(SEARCH_ID).click(searchStudents);
    $(LOGOUT_ID).click(confirmLogout);
    $(STUDENT_SELECT).change(toggleStudentDisplay);
    $(STUDENT_SELECT).change(updateCharts);
    $(STUDENT_ID_STATS).change(updateCharts);
    $(LOCATION_STATS_ID).change(updateCharts);
    buildBarChart(); //Initial building, call update functions after this
    buildTimeline(); //Initial building, call update functions after this
    updateCharts();  //Call this once to initialize to whatever the selections are at
});


// Dispatches to a more specific chart update function based on what the user has currently selected
function updateCharts() {
    firebase.auth().onAuthStateChanged(function (user) { // This assures the firebaseInit is done and we can query the database
        if (user) {
            if ($(STUDENT_SELECT).val() == "single_student") {
                updateChartsSingleStudent();
            } else {
                updateChartsAllStudents();
            }
        } else {
            window.location.href = "index.html";
        }
    });   
}

// Create an array of functions containing all the queries we want to do to get metadata. as well as some accompanying info about what the query is
function createMetadataQueries() {
    var location = $(LOCATION_STATS_ID).val();
    var form_types = ['accident', 'behavior', 'general'];
    var returnSnapshotVal = function (snapshot) { return snapshot.val(); }
    var query_funcs = [];
    var function_manifest = []; //We'll store what each query function is for
    //We need to loop over all form types and the last three months for each form type, creating a query for the count of forms submitted and the times the forms were submitted
    for (var form_i = 0; form_i < form_types.length; form_i++) {
        for (var date_i = 0; date_i < NUM_MONTHS_DISPLAYED; date_i ++) {
            var date = new Date();
            date.setMonth(date.getMonth() - date_i);
            var month = MONTH_NAMES[date.getMonth()];
            // Create the count query for a given form_type and month pair
            var query_path_count = '/locations/' + location + '/metadata/' + form_types[form_i] + '/' + month + '_count';
            var query_func_count = firebase.database().ref(query_path_count).once('value').then(returnSnapshotVal);
            query_funcs.push(query_func_count);
            function_manifest.push({'type': 'count', 'month': month, 'form_type': form_types[form_i]});
            
            // Create the times query for a given form_type and month pair
            var query_path_times = '/locations/' + location + '/metadata/' + form_types[form_i] + '/' + month + '_times';
            var query_func_times = firebase.database().ref(query_path_times).once('value').then(returnSnapshotVal);
            query_funcs.push(query_func_times);
            function_manifest.push({'type': 'times', 'month': month, 'form_type': form_types[form_i]});
        }
    }
    return {'funcs': query_funcs, 'manifest': function_manifest};
}

// Given the query info, query index, and results, update the bar_chart_data for all locations. This formats the data correctly for input
// into updateBarchart()
function updateBarData(bar_chart_data, manifest_i, results, query_info) {
    var form_type = query_info['manifest'][manifest_i]['form_type']; //Unpack from the manifest JSON for readability
    var form_type_count = results[manifest_i]
    if (form_type == 'accident') {
        bar_chart_data[0] += form_type_count;
    } else if (form_type == 'behavior') {
        bar_chart_data[1] += form_type_count;
    } else if (form_type == 'general') {
        bar_chart_data[2] += form_type_count;
    } else {
        console.log('unknown form type included in query manifest');
    }
}

// Update the timeline data for a given result, given the index for the manifest of the query matching the results as well as the manfiest. This formats the data correctly for input
// into updateBarchart()
function updateTimelineData(timeline_data, manifest_i, results, query_info) {
    var form_type = query_info['manifest'][manifest_i]['form_type']; //Unpack from the manifest JSON for readability
    for (timestamp_hash in results[manifest_i]) {
        var form_submit_time = new Date(results[manifest_i][timestamp_hash])
        var epoch_submit_time = form_submit_time.getTime();
        if (form_type == 'accident') {
            timeline_data[0]['times'].push({"starting_time": epoch_submit_time, "ending_time": epoch_submit_time});
        } else if (form_type == 'behavior') {
            timeline_data[1]['times'].push({"starting_time": epoch_submit_time, "ending_time": epoch_submit_time});
        } else if (form_type == 'general') {
            timeline_data[2]['times'].push({"starting_time": epoch_submit_time, "ending_time": epoch_submit_time});
        } else {
            console.log('unknown form type included in query manifest');
        }
    }
}

// When the user wants to view stats for a all students at a location this updates the d3 charts
function updateChartsAllStudents() {
    // We're going to make database queries asyncronously for metadata, then wait until they complete and continue the code execution syncronously. Google javascript promises if this code is confusing
    
    var query_info = createMetadataQueries();
    Promise.all(query_info['funcs']).then(function(results) {
        bar_chart_data = [0, 0, 0];
        timeline_data = [{label: "Accident", times: []},
                                {label: "Behavior", times: []},
                                {label: "Incident", times: []}];
        
        for (var result_i = 0; result_i < results.length; result_i++) {
            if (query_info['manifest'][result_i]['type'] == 'count') {
                updateBarData(bar_chart_data, result_i, results, query_info);
            } else if (query_info['manifest'][result_i]['type'] == 'times') {
                updateTimelineData(timeline_data, result_i, results, query_info);
            } else {
                console.log('Unknown query type included in query manifest');
            }
        }
        updateBarChart(bar_chart_data);
        updateTimeline(timeline_data);
    });
}

// When the user wants to view stats for a single student this updates the d3 charts
function updateChartsSingleStudent() {
    var form_counts = {'accident': 0, 'behavior': 0, 'general': 0};
    var timeline = {'accident': [], 'behavior': [], 'general': []};
    var location = $(LOCATION_STATS_ID).val();
    var uid = $(STUDENT_ID_STATS).val();
    if (uid == "") { return; } //Don't do updating if no student id present
    var database_query = '/locations/' + location + '/students/' + uid;
    
    // We're going to query the database for all the submitted forms for a given student. Then we loop over the JSON to count
    // each form type for the barchart as well as find when the forms were submitted for the timeline
    firebase.database().ref(database_query).once('value').then(function (snapshot) {
        var form_json = snapshot.val(); //form_json is indexed by the form type then random hash for the each submitted form
        if (form_json == null) {
            showErr("We can't find that student ID to show stats for");
            return;
        }
        for (form_type in form_json) {  
            form_counts[form_type] += 1; // Count form types for the bar chart
            for (hash_id in form_json[form_type]) { // Get the time of every report for the timeline
                var timestamp = new Date(form_json[form_type][hash_id]['date']).getTime();
                timeline[form_type].push({"starting_time": timestamp, "ending_time": timestamp});
            }
        }
        
        //d3-timeline and the custom d3 code for the bar chart expect data in a certain format. Convert to that and update.
        bar_update_data = [form_counts['accident'], form_counts['behavior'], form_counts['general']]
        updateBarChart(bar_update_data);
        
        timeline_update_data = [{
                label: "Accident",
                times: timeline['accident']
            },
            {
                label: "Behavior",
                times: timeline['behavior']
                                   },
            {
                label: "Incident",
                times: timeline['general']
        }];
        updateTimeline(timeline_update_data); 
    });
}


// Prompt errors w/ searching by uid
function showErr(message) {
    swal({
            title: "Error",
            text: message,
            type: "warning",
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "Close",
            closeOnCancel: true
        });
}

//Move between a none and inline display based on whether all students or a single student is populating the charts
function toggleStudentDisplay() {
    if ($(STUDENT_SELECT).val() == "single_student") {
        $(STUDENT_ID_STATS).css('visibility', 'visible');
        $(STUDENT_SELECT_TITLE).css('visibility', 'visible');
    } else {
        $(STUDENT_ID_STATS).css('visibility', 'hidden');
        $(STUDENT_SELECT_TITLE).css('visibility', 'hidden');
    }
}

// Check the student ID field is filled out for the view forms functionality
function checkStudentIdPresent() {
    var uid = $(STUDENT_ID_VIEW).val();
    if (uid === "" || uid === null || uid === undefined) { // throw error if no ID number was entered
        showErr("Please enter a student ID number");
        return false;
    }
    return true;
}

// Check the location field is selected for the view forms functionality
function checkLocationPresent() {
    var location = $(LOCATION_VIEW_ID).val();
    if (location === "" || location === null || location === undefined) { // throw error if no location selected
        showErr("Please select a location");
        return false;
    }
    return true;
}
    
// Search for a student's records by UID and location
function searchStudents() {
    if (!checkStudentIdPresent()) { return };
    if (!checkLocationPresent())  { return };
    var uid = $(STUDENT_ID_VIEW).val();
    var location = $(LOCATION_VIEW_ID).val();
    var student_path = '/locations/' + location + '/students/' + uid;
    firebase.database().ref(student_path).once('value').then(function (snapshot) {
        if (snapshot.val() == null) {
            showErr("You have either entered an incorrect student ID number, or that student has no incident reports in the database. Please try again")
            return;
        }
        
        // We're going to make three database queries asyncronously to determine what forms are present for the student. When they all complete, we create a url query parameter with the info and redirect to the view_forms page. Google promises if this code is confusing
        var behavior = student_path + '/behavior';
        var accident = student_path + '/accident';
        var general = student_path + '/general';

        // check for behavior forms
        var behavior_check = firebase.database().ref(behavior).once('value').then(function (snapshot) {
            if (snapshot.val() != null) {
                return 'Behavior';
            } else {
                return '';
            }
        });

        // check for accident forms
        var accident_check = firebase.database().ref(accident).once('value').then(function (snapshot) {
            if (snapshot.val() != null) {
                return 'Accident';
            } else {
                return '';
            }
        });

        // check for general incident forms
        var general_check = firebase.database().ref(general).once('value').then(function (snapshot) {
            if (snapshot.val() != null) {
                return 'General';
            } else {
                return '';
            }
        });

        // Do all the checks asyncronously and continue execution when they return the results
        Promise.all([behavior_check, accident_check, general_check]).then(function(results) {
            var form_types = '';
            for (var i = 0; i < 3; i++) {
                if (form_types != '' && results[i] != '') {
                    form_types += ' and ';
                }
                form_types += results[i];
            }
            window.location.href = 'view_forms.html' + '?' + 'location=' + $(LOCATION_VIEW_ID).val() + '&uid=' + $(STUDENT_ID_VIEW).val() + '&forms_found=' + form_types;
        });
    });
}

///////////////////////////////////////////
/* ----     Begin Bar Chart Code     --- */
///////////////////////////////////////////
    
// Function returning a JSON object that defines the sizing, axix labels, and color of the bar chart
function barChartBasics() {
    var margin = {
        top: 40,
        right: 0,
        bottom: 20,
        left: 0
    };
    var width = 300 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
    var colorBar = d3.scale.category20();
    var barPadding = 1;

    return {
        margin: margin,
        width: width,
        height: height,
        colorBar: colorBar,
        barPadding: barPadding,
        labels: ['Accident', 'Behavior', 'Incident']
    };
}

    
// Initial one time setup of the d3 bar chart
function buildBarChart() {
	var basics = barChartBasics();
	var bar_heights = [1, 1, 1]; //Placeholder data until upadteBarChart is called
	var xScale = d3.scale.linear()
                   .domain([0, bar_heights.length])
                   .range([0, basics.width]);

	// Create linear y scale explanation
	// Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
	// get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.
    // use the max funtion to derive end point of the domain (max value of the dataset)
    // As coordinates are always defined from the top left corner, the y position of the bar
    // is the svg height minus the data value. So you basically draw the bar starting from the top.
    // To have the y position calculated by the range function
	var yScale = d3.scale.linear()
                         .domain([0, d3.max(bar_heights, function(d) { return d; })])
                         .range([basics.height, 0]);

	//Create SVG element for bar chart
	var svg = d3.select(BAR_CHART_ID)
			    .append("svg")
		        .attr("width", basics.width + basics.margin.left + basics.margin.right)
		        .attr("height", basics.height + basics.margin.top + basics.margin.bottom)
		        .attr("id","barChartPlot");

	var plot = svg.append("g")
		          .attr("transform", "translate(" + basics.margin.left + "," + basics.margin.top + ")");

	plot.selectAll("rect")
        .data(bar_heights)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
                        return xScale(i);
        })
        .attr("width", basics.width / bar_heights.length - basics.barPadding)
        .attr("y", function(d) {
			    return yScale(d);
        })
        .attr("height", function(d) {
			    return basics.height-yScale(d);
        })
        .attr("fill", "lightgrey");


	// Add y labels to plot
    var formatAsInteger = d3.format(",")
	plot.selectAll("text")
        .data(bar_heights)
        .enter()
        .append("text")
        .text(function(d) {
			return formatAsInteger(d3.round(d));
        })
        .attr("text-anchor", "middle")
        // Set x position to the left edge of each bar plus half the bar width
        .attr("x", function(d, i) {
			return (i * (basics.width / bar_heights.length)) + ((basics.width / bar_heights.length - basics.barPadding) / 2);
        })
        .attr("y", function(d) {
			return yScale(d) + 14;
        })
        .attr("class", "yAxis");

	// Add x labels to chart
	var xLabels = svg.append("g")
		             .attr("transform", "translate(" + basics.margin.left + "," + (basics.margin.top + basics.height)  + ")");

	xLabels.selectAll("text.xAxis")
		   .data(basics.labels)
		   .enter()
		   .append("text")
		   .text(function(d){return d; })
		   .attr("text-anchor", "middle")
           .attr("x", function(d, i) {
                return (i * (basics.width / bar_heights.length)) + ((basics.width / bar_heights.length - basics.barPadding) / 2);
           })
           .attr("y", 15)
           .attr("class", "xAxis");

    svg.append("text")
       .attr("x", (basics.width + basics.margin.left + basics.margin.right)/2)
       .attr("y", 15)
       .attr("class","title")
       .attr("text-anchor", "middle")
       .text("3 Month Report Totals")
       .style("font-size", "15px");
}

// Function to update the bar chart when the requested data to display changes
function updateBarChart(bar_heights) {
		var basics = barChartBasics();
		var xScale = d3.scale.linear()
                       .domain([0, bar_heights.length])
                       .range([0, basics.width]);
		var yScale = d3.scale.linear()
                       .domain([0, d3.max(bar_heights, function(d) { return d; })])
                       .range([basics.height , 0]);
    
	   var svg = d3.select(BAR_CHART_ID + " svg");
	   var plot = d3.select("#barChartPlot").datum(bar_heights);
    
	  	/* Note that here we only have to select the elements - no more appending! */
	  	plot.selectAll("rect")
            .data(bar_heights)
            .transition()
			.duration(750)
			.attr("x", function(d, i) {
			    return xScale(i);
			})
            .attr("width", basics.width / bar_heights.length - basics.barPadding)
            .attr("y", function(d) {
			    return yScale(d);
			})
			.attr("height", function(d) {
			    return basics.height-yScale(d);
			})
			.attr("fill", "lightblue");
    
        var formatAsInteger = d3.format(",")
		plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
			.data(bar_heights)
			.transition()
			.duration(750)
		    .attr("text-anchor", "middle")
		    .attr("x", function(d, i) {
		        return (i * (basics.width / bar_heights.length)) + ((basics.width / bar_heights.length - basics.barPadding) / 2);
		    })
		    .attr("y", function(d) {
		   		return yScale(d) + 14;
		    })
		    .text(function(d) {
				return formatAsInteger(d3.round(d));
		    })
		    .attr("class", "yAxis");
}

///////////////////////////////////////////
/* ----      Begin Timeline Code     --- */
///////////////////////////////////////////    

// Create the timeline in the stats panel using the d3-timeline library. We wrap the actual building code for the sake of consistency with
// barchart creation function interface mimicry
function buildTimeline() {
    //Empty timeline until updateTimeline is called
    var tmp_data = [{
            label: "Accident",
            times: []
        },
        {
            label: "Behavior",
            times: []
                               },
        {
            label: "Incident",
            times: []
    }];
    
    buildTimelineWrapped(tmp_data)
}

//Function that take the data and creates a timeline based on it
function buildTimelineWrapped(timeline_data) {
    var date = new Date();
    var begin_date = new Date(date.getFullYear(), date.getMonth() - 2, 1)
    var end_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var chart = d3.timeline()
          .beginning(begin_date.getTime()) // we can optionally add beginning and ending times to speed up rendering a little
          .ending(end_date.getTime())
          .showTimeAxisTick() // toggles tick marks
          .stack() // toggles graph stacking
          .margin({left:70, right:30, top:0, bottom:0})
          .tickFormat({
            format: function(d) { return d3.time.format("%b")(d) },
            tickTime: d3.time.months,
            tickInterval: 1,
            tickSize: 15,
          })
          .display("circle"); // toggle between rectangles and circles
                
    var svg = d3.select(TIMELINE_ID)
                .append("svg")
                .attr("width", 400)
                .datum(timeline_data)
                .call(chart);
    
}

//Update timeline (This is really just deleting the entire thing and rebuilding it, but it works)
function updateTimeline(timeline_data) {
    $(TIMELINE_ID).empty();
    buildTimelineWrapped(timeline_data);
}