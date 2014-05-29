//global variable
var app={
	searchResult:null,
	testmode:true
}





$(function(){
	
	
	$("body>[data-role='panel']").panel().find("[data-role='listview']").listview();
	
	
	//search event
	searchEvent();
});














/***
 * searchEvent 
 * @param {String location
 */
function searchEvent(location){
	var url=(app.testmode)?"db/searchEvent.json":"ws/searchEvent.py?location="+location+"&time=&category=";
	
	//search event
	$.getJSON(url, function(json){
		if(json){
			app.searchResult=json;
			
			//generate search list
			showSearchResult(json);
		}	
	});
}




/**
 * showSearchResult 
 * @param {Object} json
 */
function showSearchResult(json){
	var html='',
		length=json.length,
		$target=$("#slider"),
		venue,
		star="<img src='images/1399611719_star.png' alt='Social Rank'/>&nbsp; &nbsp; ";
	

	//read json
	$.each(json, function(i, evt){
		evt.thumbnail=evt.thumbnail || "images/1394974803_plan.png";
		var description=String(evt.description).substr(0, 300) + '.....';
		venue=evt.venue;
		reviews=evt.reviews; 

		//html
		html+="<li>"+
			 	"<img src='"+evt.thumbnail+"'>"+
			 	"<div class='flex-caption'>"+
			 		"<h1>"+evt.name+"</h1>"+
			 		"<p>"+evt.date+", "+evt.time+" @ <a href='"+ ((venue.url&&venue.url!='')?venue.url:"#")+"' target='_blank'>"+venue.name+"</a><br>"+venue.address+"</p>"+
			 		"<div class='socialRank'>"+ (function(count){
			 			//repeat star
			 			if(count>0){
			 				return new Array(count+1).join(star);
			 			}
			 		})(reviews.rank) +"</div>"+
			 	"</div>"+
			 "</li>";
	});
	
	$target.find("ul.slides").html(html);
	$target.flexslider({
		animation: "fade"
	});
}





/**
 * showPopup 
 * @param {Object} obj Event obj
 */
function showPopup(obj){
	var $popup=$("#eventDetail");
	
	//popup title
	$popup.find('.modal-title').html(obj.name);
	
	//popup body
	var html=obj.description;
	$popup.find('.modal-body').html(html)
	
	//show popup
	$('.popup').modal('show');
}


