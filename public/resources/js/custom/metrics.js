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
CHART = undefined;

$(document).ready(function () {
    firebaseInit();
    $(SEARCH_ID).click(searchStudents);
    $(LOGOUT_ID).click(confirmLogout);
    $(STUDENT_SELECT).change(toggleStudentDisplay);
    buildBarChart();
    updateBarChart();
    buildTimeline([
        {label: "Accident", times: [
            {"starting_time": 1517461110000, "ending_time": 1517461110000} ]},
        {label: "Behavior", 
         times: [{"starting_time": 1517461110000, "ending_time": 1517461110000} ]},
        {label: "Incident", 
         times: [{"starting_time": 1517461110000, "ending_time": 1517461110000} ]},
      ]);
    updateTimeline();
});
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

// Search for a student's records by UID and location
function searchStudents() {
    var uid = $(STUDENT_ID_VIEW).val();
    if (uid === "" || uid === null || uid === undefined) { // throw error if no ID number was entered
        showErr("Please enter a student ID number");
        return;
    }
    
    var location = $(LOCATION_VIEW_ID).val();
    if (location === "" || location === null || location === undefined) { // throw error if no location selected
        showErr("Please select a location");
        return;
    }
    
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
                return 'General Incident';
            } else {
                return '';
            }
        });

        // Do all the checks asyncronously and continue execution when they return the results
        Promise.all([behavior_check, accident_check, general_check]).then(function(results) {
            var form_types = '';
            for (var i = 0; i < 3; i++) {
                if (form_types != '') {
                    form_types += ' and ';
                }
                form_types += results[i];
            }
            window.location.href = 'view_forms.html' + '?' + 'location=' + $(LOCATION_VIEW_ID).val() + '&uid=' + $(STUDENT_ID_VIEW).val() + '&forms_found=' + form_types;
        });
    });
}




/*
############# BAR CHART ###################
-------------------------------------------
*/

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

function buildBarChart() {
	var basics = barChartBasics();
	var bar_heights = [5, 10, 2];
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
function updateBarChart() {
		var bar_heights = [15, 2, 7];
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

function buildTimeline(labelTestData) {
    
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
    CHART = chart
                
    var svg = d3.select(TIMELINE_ID)
                .append("svg")
                .attr("width", 400)
                .datum(labelTestData)
                .call(chart);
}

//Update timeline (This is really just deleting the entire thing and rebuilding it)
function updateTimeline() {
    $(TIMELINE_ID).empty();
    buildTimeline([
        {label: "Accident", times: [
            {"starting_time": 1517461110000 - 1000000000, "ending_time": 1517461110000 - 1000000000} ]},
        {label: "Behavior", 
         times: [{"starting_time": 1517461110000, "ending_time": 1517461110000} ]},
        {label: "Incident", 
         times: [{"starting_time": 1517461110000, "ending_time": 1517461110000} ]},
      ]);
}