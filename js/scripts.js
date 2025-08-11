/********************************************************************************************************/
/* function to test if inside of an iframe */
/********************************************************************************************************/

function is_iframe() {
	//not in an iframe
	if (self == top) {
		//$("body").empty();
		//$("body").append('<div class="content">Uh-oh! You should be viewing this page in Canvas!</div>');
		return false;
	//in an iframe
	} else {
		//hide unnecessary elements
		$("#branding-bar").hide();
		$("nav").hide();
		$("header").hide();
		$(".nav_footer").hide();
		$("footer").hide();
		$(".content_wrapper").width("100%"); //content should take up full width
		$(".content").css("margin-bottom", "0px"); //take out bubbles on bottom
		$(".content").css("box-shadow", "none");
		$("body").css("background-image", "none");
		return true;
	}
}

/********************************************************************************************************/
/* function to turn index table for unit into an array of objects for use on other pages */
/********************************************************************************************************/
function make_index_array(response, unit_class) {
	  //get all page numbers
	  var page_numbers_code = $(unit_class + ' tr td:nth-child(1)', response); //gets all page numbers for unit
	  var page_numbers_array = [];
	  $.each(page_numbers_code, function() {
		  page_numbers_array.push($(this).text()); //puts page numbers in array
	  });
	  
	  //get all page titles
	  var page_titles_code = $(unit_class + ' tr td:nth-child(2)', response); //gets all page titles for unit
	  var page_titles_array = [];
	  $.each(page_titles_code, function() {
			page_titles_array.push($(this).text()); 
	  })
	  
	  //get all due dates
	  var due_dates_code = $(unit_class + ' tr td:nth-child(3)', response); //gets all due dates for unit
	  var due_dates_array = [];
	  $.each(due_dates_code, function() {
		  due_dates_array.push($(this).text()); //puts due dates in array
	  });
	  
	  var index_array = [];
	  for (i = 0; i < page_numbers_array.length; i++) {
		  //creates array of objects out of due dates, page titles, and page numbers
		  index_array[i] = {page: page_numbers_array[i], title: page_titles_array[i], date: due_dates_array[i]}; 
	  }
	 
	  return index_array;
}

/********************************************************************************************************/
/* function to put due dates up on reading pages */
/********************************************************************************************************/
function put_dates (index_array, formatted_page) {
	  for (i = 0; i < index_array.length; i++) {
		  if (index_array[i].page == formatted_page) { //adds due date to page if this page matches the one in the index
			  $('.due_date').html("Read by: " + index_array[i].date);
			  if (is_late(index_array[i].date)) {
				$('.due_date').css("color", "red"); 
			  }
			  return index_array[i].date;
		  }
	 }
}

/***************************************************************************************************************/
/* taking text input in the form of "August 22", determines if this date has passed (relative to this year) */
/***************************************************************************************************************/
function is_late (date_string) {
	var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
	var raw_date = new Date();
	raw_date.setDate(raw_date.getDate());
	var current_month = monthNames[raw_date.getMonth()];
	var current_day = raw_date.getDate();
	
	var split_dates = date_string.split(' ');
	for (j = 0; j < monthNames.length; j++) {
		if (monthNames[j] == split_dates[0]) {
			var due_date_month = j;
		}
		if (monthNames[j] == current_month) {
			var this_month = j;
		}
	}
	var due_date_day = split_dates[1];	
	//if the due date month has passed OR we're in the same month, but due date day has passed, return true
	if ((this_month > due_date_month) || (this_month == due_date_month && current_day > due_date_day)) {
		return true;
	}
	else {
		return false;
	}
}

/********************************************************************************************************/
/* function to put page title in header and return the current title */
/********************************************************************************************************/
function put_titles(index_array, formatted_page){
	for (i = 0; i < index_array.length; i++) {
		if (index_array[i].page == formatted_page) {
			$('.title_header').html(index_array[i].title);
			return index_array[i].title;
		}
	}
}

/********************************************************************************************************/
/* function to get current page name */
/********************************************************************************************************/
function get_html_pagename() {
	var pathArray=window.location.pathname.split('/'); //split along html
	var page_name = pathArray[pathArray.length-1]; //gets html page name at end
	return page_name;
}

/********************************************************************************************************/
/* function to wrap index page numbers and titles in links to their respective pages */
/********************************************************************************************************/
function wrap_index_links() {
	var unit_numbers = $('.unit_number'); //grab unit number headers from accordion
	$.each(unit_numbers, function() {
		var units = $(this).text().split(' ');
		var unit_number = units[1]; //so we start with Unit 1, which turns to [Unit, 1], then we grab the 1
		var unit_number_int = parseInt(units[1], 10);
		var unit_class = ".unit_" + unit_number + "_info";

		var page_numbers_code = $(unit_class + ' tr td:nth-child(1)'); //gets all page numbers for unit
		$.each(page_numbers_code, function () {
			var page_number = $(this).text();
			var page_number_int = parseInt(page_number, 10);
			var parent = $(this).parent(); //parent (the table row) used later to fetch the title as well
			if (unit_number_int < 10 && page_number_int < 10) { //i.e. u01p01
				$(this).click(function() { //turns the page number into a link -- NOT wrapping with a tags because it screws up the table layout
					window.location = "../unit" + unit_number + "/u0" + unit_number + "p0" + page_number + ".html";
				});
				$(':nth-child(2)', parent).click(function () { //page title is also a link
					window.location = "../unit" + unit_number + "/u0" + unit_number + "p0" + page_number + ".html";;
				});
			}
			else if (unit_number_int < 10 && page_number_int >= 10) { //i.e. u01p10
				$(this).click(function() {
					window.location = "../unit" + unit_number + "/u0" + unit_number + "p" + page_number + ".html";
				});
				$(':nth-child(2)', parent).click(function () { 
					window.location = "../unit" + unit_number + "/u0" + unit_number + "p" + page_number + ".html";
				});
			}
			else if (unit_number_int >= 10 && page_number_int < 10) { //i.e. u10p01
				$(this).click(function() {
					window.location = "../unit" + unit_number + "/u" + unit_number + "p0" + page_number + ".html";
				});
				$(':nth-child(2)', parent).click(function () { 
					window.location = "../unit" + unit_number + "/u" + unit_number + "p0" + page_number + ".html";
				});
			}
			else if (unit_number_int >= 10 && page_number_int >= 10) { //i.e. u10p10
				$(this).click(function() {
					window.location = "../unit" + unit_number + "/u" + unit_number + "p" + page_number + ".html";
				});
				$(':nth-child(2)', parent).click(function () { 
					window.location = "../unit" + unit_number + "/u" + unit_number + "p" + page_number + ".html";
				});
			} 
			else {
				/* do nothing for other links
				//for assessments, add an empty link for now, until we get these figured out
				$(this).click(function() {
					window.location = "#";
				});
				$(':nth-child(2)', parent).click(function () { 
					window.location = "#";
				}); */
			}
			if ($(this).html() == "Unit 1 Game 3 Directions") {
				$(this).click(function() {
					window.location="../unit1/game3_directions.html";	
				})
			}
			if ($(this).html() == "Unit 2 Game 2 Directions") {
				$(this).click(function() {
					window.location="../unit2/game2_directions.html";	
				})
			}
		});
	});
}

/********************************************************************************************************/
/* add captions to images*/
/********************************************************************************************************/
function caption_images(formatted_page)
{
	var images = $('.content img');
	var figure_number = 1; //starting value
	
	//loops over all images in the content area
	$.each(images, function() {
		//do nothing for aside images or images that should not be captioned
		if ($(this).parents(".aside_LeftWrap").length == 1 || $(this).parents(".aside_RightWrap").length == 1 || $(this).parents(".no_caption").length == 1) {
			//do nothing
		}
		//for animations with play/pause button, captions have to be manually added to prevent formatting issues.
		else if ($(this).parents(".current_display") == 1) {
			figure_number++;
		}
		else if ($(this).parent("a").length == 1) { //for images that can be expanded in a new tab
			$(this).after("<div class='caption'>Figure " + formatted_page + "-" + figure_number + "<br>Click on the image for a larger version</div>");
			figure_number++; 
		}
		//for all other images, add a caption div with the proper figure name, i.e. 3-11
		else {
			$(this).after("<div class='caption'>Figure " + formatted_page + "-" + figure_number + "</div>");
			figure_number++; 
		}
	});		
}

/********************************************************************************************************/
/* smooth scrolling for same page ID links, such as glossary letters */
/* credit goes to Chris Coyier for the jquery: http://css-tricks.com/snippets/jquery/smooth-scrolling/ */
/********************************************************************************************************/
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) { 
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
	  //this part I wrote -- if the page has been emptied from search terms, then clicking
	  //on the letter link should refill the page and take you to the letter section
	  else {
		var letter_id = "#" + $(this).text().toLowerCase();
		var letter_section =($(letter_id), reset_terms);
		$('.terms').empty();
		$('.terms').append(letter_section);
	  }
    }
  });
});

//smooth scrolling for image maps
$(function() {
  $('area').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) { 
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

/********************************************************************************************************/
/* make searches case-insensitive. source: http://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/ */
/********************************************************************************************************/
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

/********************************************************************************************************/
/******** to generate page headers and next and previous links */
/********************************************************************************************************/
//this works for pages formatted as u00p00, but not for others, such as index or glossary, so try/catch is needed for errors
try {
	is_iframe();
	var page_name = get_html_pagename();
	var without_html = page_name.split('.'); //takes out .html at end
	var page_split = without_html[0].split('p'); //takes out p, ex: u01p01 = u01, 01
	var page_number = page_split[1]; 
	var unit_number = page_split[0];
	var int_page = parseInt(page_number, 10);
	
	/* generates unit and page numbers */
	var unit_without_u = unit_number.split('u'); //ex: u01 becomes u and 01
	var unit_without_0 = unit_without_u[1].split('0'); //ex: 01 becomes 0 and 1
	var formatted_unit = unit_without_0[1]; //finalized unit number
	
	if (int_page < 10) { //strip out leading zero
		var page_without_0 = page_number.split('0');
		var formatted_page = page_without_0[1];
	} else {
		var formatted_page = page_number; //do nothing if there's no leading 0
	}
	
	/* to scrape reading due dates, page titles, total page counts, then to set the next page link */
	$.get("../main/index.html", function(response) {
		//set total units code -- same for all pages, regardless of which unit it is
		var total_units_code = $(".total_units", response);  //span with total_units class is in index.html
		var total_units = total_units_code.html(); //convert from DOM object to html
		$('.total_units').html(total_units); //insert html into total_units span
		
		//puts due dates for pages
		var unit_class = ".unit_" + formatted_unit + "_info";
		var index_array = make_index_array(response, unit_class);
		var date = put_dates(index_array, formatted_page);
		
		//put page title
		var title = put_titles(index_array, formatted_page);
		
		//put document title
		if (formatted_unit) {
			document.title = "Unit " + formatted_unit + " Page " + formatted_page + ": " + title;
		}
		
		//put total number of pages -- i.e. "17" in 1 of 17
		var unit_page_selector = ".unit_" + formatted_unit + "_pages";
		var unit_pages_code = $(unit_page_selector, response); //span with unit unit_one_pages is in index.html
		var unit_pages = unit_pages_code.html(); //convert from DOM object to html
		$('.last_number').html(unit_pages); //insert html into the last number span
		var last_number = unit_pages_code.text();
		
		/* this sets the next page link */
		var int_next_page = int_page + 1; //add one to page number for the next page
		var string_next_page = int_next_page.toString(); //convert back to string
		if (formatted_page == last_number) { //for the last page
			$('.next_arrow').hide();
			$('.next_page').html('DONE');
		} else { // for all other pages
			if (int_next_page < 10) {
				var page_front_zero = "0" + string_next_page; //adds 0 to front if a single digit
				var new_next_page_name = unit_number + "p" + page_front_zero + ".html"; //completed new page name
			} else {
				var new_next_page_name = unit_number + "p" + string_next_page + ".html"; //completed new page name
			}
			//set next page links
			$('.next_arrow').wrap('<a href=' + new_next_page_name + '></a>');
			$('.next_page').wrap('<a href=' + new_next_page_name + '></a>');
			
			//allow keypress for page navigation
			/* DISABLED
			$(document).keydown(function(e) {
				if (e.which == 39) {
					e.preventDefault();
					window.location = new_next_page_name;
				}
			});	
			*/
	   }
	   
	   //for group result pages, display results after due date, or hide before due date
		if ($(".before_group_duedate").length > 0) {
			if (is_late(date)) {
				$(".before_group_duedate").hide();
			} else {
				$(".after_group_duedate").hide();
				$(".insert_group_duedate").append(date);
			}
		}	   	
	});
	
	//for previous page
	if (int_page > 1) { //for all but the first page
		var int_prev_page = int_page - 1;
		var string_prev_page = int_prev_page.toString(); //convert back to string
		if (int_prev_page < 10) { 
			var prev_front_zero = "0" + string_prev_page; //if less than 10, add a leading zero
			var new_prev_page_name = unit_number + "p" + prev_front_zero + ".html";
		} else {
			var new_prev_page_name = unit_number + "p" + string_prev_page + ".html"; //if no leading zero
		}
	} else { //if the first page, link goes back to index
		var new_prev_page_name = "../main/index.html";
	}
	
	//set previous page links
	$('.previous_arrow').wrap('<a href=' + new_prev_page_name + '></a>');
	$('.previous').wrap('<a href=' + new_prev_page_name + '></a>');
	
	$('.page_number').html(formatted_page);
	$('.unit_number').html(formatted_unit);
	
	//allow keypress for page navigation
	/* DISABLED
	$(document).keydown(function(e) {
		if (e.which == 37) {
			e.preventDefault();
			window.location = new_prev_page_name;
		}
	});
	*/
	
	//add captions to all images in content area
	caption_images(formatted_page);

} catch (e) {
	//if not in the u01p01 format, nothing is required
	//although there's nothing to catch, I didn't want errors on non-u00p00 pages
	//errors would prevent code later in the file from working
}
/********************************************************************************************************/
/* makes side nav bar buttons and next/prev arrows change color when hovered over */
/********************************************************************************************************/
$('nav ul li').mouseenter(function() {
	$(this).addClass('hover');
});

$('nav ul li').mouseleave(function () {
	$(this).removeClass('hover');
});

/* when a user clicks on a nav link and then goes back, the background was staying highlighted */
/* removing the class when clicked (going to a different page) solves the issue */
$('nav ul li').click(function() {
	$(this).toggleClass('hover');
});

$('main .next_arrow, main .previous_arrow').hover(function() {
	$(this).toggleClass('hover');	
});
/********************************************************************************************************/
/* to zoom an image */
/********************************************************************************************************/
/*credit goes to the developer: http://jaukia.github.io/zoomooz/ */
if ($(".zoomable").length > 0) {
	$.getScript("../js/jquery.zoomooz.min.js", function() {
		$(document).ready(function(){
			$(".zoomable").zoomTarget();	
		});
	});
}

/********************************************************************************************************/
/* to play and pause animations*/
/********************************************************************************************************/
if ($('.animation_button').length > 0) {
	var parents = $('.animation_button').parent();
	//for each set of animations, load the page initially with the image
	$.each(parents, function() {
		var parent = $(this);
		var image = $('.hidden_image', parent).html();
		$('.current_display', parent).html(image);
	});

     $('.animation_button').click(function() {
		 var parent = $(this).parent();
		 var image_html = $('.hidden_image', parent).html();
		 var animation_html = $('.hidden_animation', parent).html();
		 var current_display = $('.current_display', parent);
		 if ($('.image', current_display).length > 0) { //if currently an image, change to animation
			current_display.html("");
			current_display.html(animation_html);
			$(this).text("Stop Animation");
		 }
		 else if ($('.animation', current_display).length > 0) { //if currently an animation, change to image
			current_display.html("");
			current_display.html(image_html);
			$(this).text("Start Animation");
		 }
	 }); 
}
/********************************************************************************************************/
/* term to glossary links */
/********************************************************************************************************/
if ($('.term').length > 0) {
	var terms = $('.term');
	$.each(terms, function() {
		var term_text = $(this).text().toLowerCase();
		//if white space, take it out to create a valid ID
		if (term_text.indexOf(' ') >= 0) {
			var words = term_text.split(' ');
			term_text = "";
			for (k = 0; k < words.length; k++) {
				term_text = term_text + words[k];
			}
		}
		//for apostrophes like Ohm's law...
		if (term_text.indexOf('\'') >= 0) {
			var words = term_text.split('\'');
			term_text = "";
			for (k = 0; k < words.length; k++) {
				term_text = term_text + words[k];
			}
		}
		$(this).wrap("<a href='../main/glossary.html#" + term_text + " '></a>");
		$(".term").parent("a").css("text-decoration", "none");
	});
}
/********************************************************************************************************/
/* for question and answer buttons */
/********************************************************************************************************/
if ($('.question_button').length > 0) {
	var allPanels = $('.revealed_answer').hide(); //hide the answer

	$('.question_button').hover(function() { //border changes color on hover
		$(this).css('border', 'solid #C9B6DE 2px');
	}, function() {
		$(this).css('border', 'solid #4B306A 2px');
	});
	
	$('.question_button').click(function() {
		var $next = $(this).next();
		if ($next.is(':visible')) { //slide up answer by clicking on question a second time
			$next.slideUp();
			$(this).css('margin-bottom', '10px');
			$(this).css('border-radius', '10px');
			$(this).css('border', 'none');
		} else { //slides down the answer
			$next.slideDown(); 
			$(this).css('margin-bottom', '0px');
			$(this).css('border-radius', '0px');
			$(this).css('border', 'solid #4B306A 2px');
		}
	});
}

/********************************************************************************************************/
/* these only apply for glossary: searches and resets page */
/********************************************************************************************************/
if (get_html_pagename() == "glossary.html") { 
	//autocomplete
	var available_terms = [
		"Alternating Current",
		"AC Riding on DC",
		"AC+DC",
		"Ampere",
		"Amplified",
		"Anode",
		"Band Cut Filter",
		"Band Pass Filter",
		"Biased",
		"Branch",
		"Capacitance",
		"Capacitive Reactance",
		"Capacitor",
		"Capacitors and DC",
		"Cathode",
		"Cathode Follower",
		"Center-Tapped Transformer",
		"Circuit Wizard",
		"Class A Amplifier",
		"Closed Circuit",
		"Closed Switch",
		"Common Anode Amplifier",
		"Common Cathode Amplifier",
		"Conductor",
		"Connection",
		"Control Grid",
		"Conventional Current",
		"Current",
		"Current Divider",
		"Current in a Series Circuit",
		"Current in a Parallel Circuit",
		"Current Flow",
		"Current Meter",
		"Cutoff",
		"Decibel",
		"Dielectric",
		"Diode",
		"Direct Current",
		"DC Voltage Sources",
		"Drop",
		"DPDT: Double Pole Double Throw",
		"DPST: Double Pole Single Throw",
		"Electrical Isolation",
		"Electron",
		"Electron Flow",
		"Equivalent Circuits",
		"Farad",
		"Frequency",
		"Full Wave Rectifier",
		"Half Wave Rectifier",
		"Hertz",
		"High Pass Filter",
		"Impedance Conversion",
		"Inductance",
		"Inductive Reactance",
		"Insulator",
		"Inductor",
		"Inductor Filters",
		"Inductors in Parallel",
		"Inductors in Series",
		"Load",
		"Low Pass Filter",
		"mA or Milliampere",
		"MicroFarad",
		"Nanofarad",
		"Octave",
		"Ohms",
		"Ohm's Law",
		"Open Circuit",
		"Open Switch",
		"Oscilloscope",
		"Parallel Circuits",
		"Peak Voltage",
		"Peak to Peak Voltage",
		"Period",
		"Phase",
		"Picofarad",
		"Potentiometers",
		"Power",
		"Reactance",
		"Rectification",
		"Resistance",
		"Resistor",
		"Resistor Color Code",
		"Resistor Tolerance",
		"Resistors in Series",
		"Resistors in Parallel",
		"Saturation",
		"Schematic",
		"Series",
		"Series Circuits",
		"Sine Wave",
		"SPST: Single Pole Single Throw",
		"SPDT: Single Pole Double Throw",
		"Square Wave",
		"Switch",
		"Test Points",
		"Tolerance",
		"Triangle Wave",
		"Transformer",
		"Triode",
		"Turns Ratio",
		"Vpk",
		"Vpk-pk",
		"Vrms",
		"Vacuum Tube",
		"Valence Electrons",
		"Voltage",
		"Voltage Across",
		"Voltage At",
		"Voltage Conversion",
		"Voltage Divider",
		"Voltage Drop",
		"Voltage in Series Circuits",
		"Voltage in Parallel Circuits",
		"Watts",
		"Waveform",
		"Wavelength",
	];
	$('.search_text').autocomplete({
		source: available_terms,
		selectFirst: true,
		minLength: 3
	});
	
	/* to search on glossary page*/
	var reset_terms = $('.terms').clone().html(); //save the original terms list to restore it later
	$('.search_submit').click(function(e) {
		e.preventDefault(); //prevent the form from going anywhere
		var search_text = $('.search_text').val(); //get value in search box
		var elements = $("tr:contains('" + search_text + "')", reset_terms); //search for all rows that include the search text
		$('.terms').empty(); //empty out terms list
		if (elements.length) { //element found
			//special caveat -- for tables inside tables, so they don't float on their own, they must be removed as rows and added back in to original table
			$.each(elements, function() {
				if ($(this).parents('.inner_table').length == 1) {
					var saved_row = $(this).clone();
					$(this).empty();
					var parent = $(this).closest('table');
					parent.append(saved_row);
				}
			});
			$('.terms').append(elements); //append found elements	
		} 
		else  {
			$('.terms').append("<p>Sorry, no terms found. Please try again.</p>");
		}
	});
	
	/* resets glossary */
	$('reset_submit').click(function(e) {
		e.preventDefault(); //prevents the form from going anywhere
		$('.terms').empty(); //empty out terms that were searched for
		$('.terms').append(reset_terms);
	});
}

/********************************************************************************************************/
/* Accordion scripts (the style of the index page) */
/********************************************************************************************************/
// credit to Chris Coyier for the accordion: http://css-tricks.com/snippets/jquery/simple-jquery-accordion/ 
if ($(".accordion").length > 0) {
	var allPanels = $('.accordion > .accordion_body').hide(); //hide everything but accordion headers
	$('.accordion > .accordion_body:first').show().prev().addClass('active_accordion'); //first in accordion is open on page load, to hint users on how to use it
	
	$('.accordion > .accordion_header').click(function() {
		allPanels.slideUp(); //no accordion bodies visible
		$('.accordion > .accordion_header').removeClass('active_accordion'); //all headers no longer active (dark purple)
		var $next = $(this).next();
		if ($next.is(':visible')) { //makes it possible for current accordion body to slide up, so none are visible
			$next.slideUp();
		} else { //slides down body of clicked accordion and turns header the active color (dark purple)
			$next.slideDown(); 
			$next.prev().addClass('active_accordion');
		}
	});
}

	
/********************************************************************************************************/
/* these only apply for index: sets index links, and turns late dates red */
/********************************************************************************************************/
if (get_html_pagename() == "index.html") {
	//wrap index links
	wrap_index_links();
	//put late due dates in red
	var all_dates = $('tr td:nth-child(3)');
	$.each(all_dates, function() {
		var this_date = $(this).text();
		if (is_late(this_date)) {
			$(this).css("color", "red");
		}
	});
}

/********************************************************************************************************/
/* Interactive Frequency Responce Curves (FRC) */
/********************************************************************************************************/
if (($(".interactive_FRC").length > 0) || ($(".interactive_FRC_left").length > 0) || ($(".interactive_FRC_right").length > 0)) {
	$(".audio_button").click(function() {
	  var button_id = $(this).attr('id');
	  swap_out_FRC(button_id);
	  //$("audio").trigger('play');
  });			
  
  function swap_out_FRC(button_id) {
	  //finds image/audio holders in the same unit -- otherwise, it would select ones that belong to other units on the same page
	  var image_schematic_holder = $("#" + button_id).parent().children(".media_holder").find(".image_schematic_holder");
	  var image_holder = $("#" + button_id).parent().children(".media_holder").find(".image_holder");
	  var audio_holder = $("#" + button_id).parent().children(".media_holder").find(".audio_holder");
	  //for combined image and schematic
	  if (image_schematic_holder.length > 0) {
		  image_schematic_holder.empty();
	  	  image_schematic_holder.append("<img src='../media/unit" + formatted_unit + "/interactive_audio/" + button_id + ".png' width='313' height='300'>");
	  } 
	  //for image of curve by itself, no schematic
	  else if (image_holder.length > 0) {
	   		image_holder.empty();
	  		image_holder.append("<img src='../media/unit" + formatted_unit + "/interactive_audio/" + button_id + ".png' width='313' height='150'>");
	  } 
	  audio_holder.empty();
	  audio_holder.append("<audio controls loop> <source src='../media/unit" + formatted_unit + "/interactive_audio/" + button_id + ".mp3' type='audio/mp3'> </audio>");
	  $("audio").trigger('pause');
	  $("audio", audio_holder).trigger('play');
	  //keeps the caption system in place -- otherwise, captions disappear when the image is swapped
	  $(".caption").remove();
	  caption_images(formatted_page);
  }

}

/********************************************************************************************************/
/* Image Swaps */
/********************************************************************************************************/
if ($(".image_swap").length > 0) {
	
	$(".swap_button").click(function() {
		var image_button_id = $(this).attr('id');
		swap_out_image(image_button_id);
	});
	
	function swap_out_image(image_button_id) {
		var unit_selector = unit_without_u[1]; //referenced from the big try/catch block to generate links and headers
		var image_holder = $("#" + image_button_id).parent().children(".image_holder");
		image_holder.empty();
		image_holder.append("<img src='../img/unit" + unit_selector + "/image_swap/" + image_button_id + ".gif' class='image_border'>");
	}
	
}

/********************************************************************************************************/
/* Splash Screens */
/********************************************************************************************************/
if ($(".splash").length > 0) {
	$(".splash_exit").click(function() {
		$(".splash").empty();
		//$(".splash").parent().css("min-height", "0");
		$(".splash").css("display", "none");
	});
}

/********************************************************************************************************/
/* Labs */
/********************************************************************************************************/
if ($(".lab_question").length > 0) {
	var feedback, question_id;
	$(".lab_question_button").addClass("unanswered");

	//multiple choice options
	$(".lab_question_button").click(function() {
		var question_option = $(this).parent();
		var question_set = $(this).parent().parent();
		$(".lab_question_button", question_set).removeClass("answered");
		$(".lab_question_button", question_set).addClass("unanswered");
		$(this).removeClass("unanswered");
		$(this).addClass("answered");
		feedback = $(".lab_question_feedback", question_option).html();
		question_id = $(".lab_question_feedback", question_option).attr('id');
	});
	
	//select options
	$(".lab_question_dropdown").on("change", function() {
		feedback = $(':selected', $(this)).attr("data-feedback");
		question_id = $(this).attr('id');
	});
	
	$(".lab_submit_button").click(function() {
		//updated so answer is only retrived on submit, relative to question, not on any input change
		//(otherwise, answering questions out of order makes feedback appear in wrong location)
		//var $feedback_area = $(".lab_answer_feedback #" + question_id);
		var $question_area = $(this).parent(),
			$feedback_area = $(".lab_answer_feedback", $question_area);
		if ($question_area.has('select').length) {
			feedback = $('select', $question_area).find(':selected').attr('data-feedback');
		}
		else {
			var selected = $('.lab_question_button.answered', $question_area),
				question = selected.parent();
			feedback = $(".lab_question_feedback", question).html();
		}
		$feedback_area.removeClass("lab_tada");
		// repaint to get the animation to restart: http://css-tricks.com/restart-css-animation/
		$feedback_area[0].offsetWidth = $feedback_area[0].offsetWidth;
		$feedback_area.addClass("lab_tada");
		$feedback_area.html(feedback);
	});
	
	
	if ($(".lab_submit_button_numeric").length > 0) {
		//updated so numeric answer is only retrieved on submit, relative to question, not on any input change
		/*var num_answer, num_feedback, $feedback_box, q_id, num_question_set;
		//student enters their numeric answer, then we check against the values included as options
		num_answer = $(".lab_numeric_input").val(); //initialize, in case of a page refresh
		$(".lab_numeric_input").bind('input', function() {
			num_answer = +($(this).val());
		});*/
		
		//if their answer falls within one of the ranges specified, then we output the appropriate feedback
		$(".lab_submit_button_numeric").click(function() {
			num_question_set = $(this).parent();
			$(".lab_question_option_numeric", num_question_set).each(function(index, object) {
				num_answer = $(".lab_numeric_input", num_question_set).val(); //new
				q_id = $(".lab_question_feedback", $(this)).attr("id");
				$feedback_box = $(".lab_answer_feedback #" + q_id);
				if (num_answer >= +($(this).attr("data-low")) && num_answer <= +($(this).attr("data-high"))) {
					num_feedback = $(".lab_question_feedback", this).html();
					$feedback_box.html(num_feedback);
					return false; //break from loop
				}
				else if (index == $(".lab_question_option_numeric").length - 1) {
					$feedback_box.html("Answer not in range. Please try again.");
				}
			});
		});
	}
    
    //testing for multiple dropdowns
    function submitLabQuestion() {
        var $feedback_area = $(".lab_answer_feedback #" + question_id);
		$feedback_area.removeClass("lab_tada");
		// repaint to get the animation to restart: http://css-tricks.com/restart-css-animation/
		$feedback_area[0].offsetWidth = $feedback_area[0].offsetWidth;
		$feedback_area.addClass("lab_tada");
		$feedback_area.html(feedback);
    }
    
    $(".lab_single_submit_button").click(function() {
        var includedSubmitButtons = $(".lab_question .lab_question_dropdown", $(this).parent());
        $.each(includedSubmitButtons, function(index, submitBtn) {
            feedback = $(':selected', $(this)).attr("data-feedback");
            question_id = $(this).attr('id');
            console.log($(this).html());
            console.log('feedback: ' + feedback + ', question_id: ' + question_id);
            submitLabQuestion();
        });
    });
}

/********************************************************************************************************/
/* iFrame Autoheight */
/********************************************************************************************************/

//listen for an iframe post message from custom eDS Canvas javascript to get the course and user id
//then, send that to the mouseover iframe in the page, so that it can get group information for a student
function windowEventListener() {
	//var iframe = document.getElementById('mouseover');
	$(window).on("message", function(e) {
		e = e.originalEvent;
		if ((e.origin !== "https://www.iu.instructure.com") && (e.origin !== "https://iu.instructure.com") &&
            (e.origin !== "https://www.iu.test.instructure.com") && (e.origin !== "https://iu.test.instructure.com") &&
            (e.origin !== "https://www.iu.beta.instructure.com") && (e.origin !== "https://iu.beta.instructure.com")){
			console.log("Wrong domain: " + e.origin);
			return;
		}
		
		var eventName = e.data[0];
		var data = e.data[1];
		
		switch(eventName) {
			case 'iu-eds-heightConfirm':
				heightConfirm = 1;
			  	break;
			case 'iu-eds-initConfirm':
				initConfirm = 1;
				break;
		}
	});
}

function inIframe() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

//Post a message to the parent with this page's height:
//https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage		
function setIframeHeight() {
	//send height of page to parent iframe
	var height = $('html').height();
	if (height > 0) {
		window.parent.postMessage({'subject': 'iu.frameResize', 'url': window.location.href, 'height': height}, "*");
	}
}

//show the page and set the iframe height after the table of contents has loaded
function hasLoaded() {
	//only send the size of the iframe once everything has loaded
	if (window.loaded === true) {
		setIframeHeight(); //set height of iframe in parent
	}
	else { //if everything hasn't loaded, try again in 100ms
		window.setTimeout(function() {
			hasLoaded();
		}, 100);
	}
}

//iframe autoheight
if (inIframe()) {
	//see if window has fully loaded before sending iframe height
	$(window).load(function() { 
		window.loaded = true;
		hasLoaded();
	});	
	
}